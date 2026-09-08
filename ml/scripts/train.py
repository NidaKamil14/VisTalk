"""
VisTalk ISL Alphabet Classification - Model Training Script
Architecture: MobileNetV3-Small (Transfer Learning from ImageNet)
Device: Apple Silicon MPS / CUDA / CPU
"""

import os
import json
import time
import ssl
import certifi

# Fix SSL context for macOS certificate verification when downloading torchvision weights
os.environ['SSL_CERT_FILE'] = certifi.where()
try:
    ssl._create_default_https_context = ssl._create_unverified_context
except AttributeError:
    pass

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
import matplotlib.pyplot as plt
import numpy as np

def main():
    # Set seeds
    torch.manual_seed(42)
    np.random.seed(42)

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DATA_DIR = os.path.join(BASE_DIR, 'data', 'splits')
    MODELS_DIR = os.path.join(BASE_DIR, 'models')
    ARTIFACTS_DIR = os.path.join(BASE_DIR, 'artifacts')

    os.makedirs(MODELS_DIR, exist_ok=True)
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)

    # Device configuration
    if torch.backends.mps.is_available():
        device = torch.device('mps')
        print("Using Apple Silicon GPU Acceleration (MPS)")
    elif torch.cuda.is_available():
        device = torch.device('cuda')
        print("Using NVIDIA CUDA GPU")
    else:
        device = torch.device('cpu')
        print("Using CPU")

    # Hyperparameters
    NUM_CLASSES = 26
    BATCH_SIZE = 64
    NUM_EPOCHS = 8
    LEARNING_RATE = 1e-3
    WEIGHT_DECAY = 1e-4
    IMAGE_SIZE = (128, 128)

    # Preprocessing & Data Augmentations
    train_transforms = transforms.Compose([
        transforms.Resize(IMAGE_SIZE),
        transforms.RandomRotation(degrees=10),
        transforms.RandomAffine(degrees=0, translate=(0.04, 0.04), scale=(0.96, 1.04)),
        transforms.ColorJitter(brightness=0.15, contrast=0.15),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    val_transforms = transforms.Compose([
        transforms.Resize(IMAGE_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    # Save Preprocessor Config for inference
    preprocessor_config = {
        'model_name': 'mobilenet_v3_small',
        'num_classes': NUM_CLASSES,
        'input_shape': [3, IMAGE_SIZE[0], IMAGE_SIZE[1]],
        'input_size': list(IMAGE_SIZE),
        'normalization': {
            'mean': [0.485, 0.456, 0.406],
            'std': [0.229, 0.224, 0.225]
        },
        'color_format': 'RGB',
        'classes': [chr(ord('A') + i) for i in range(NUM_CLASSES)]
    }
    with open(os.path.join(ARTIFACTS_DIR, 'preprocessor_config.json'), 'w') as f:
        json.dump(preprocessor_config, f, indent=2)
    print(f"[OK] Saved preprocessor config to {os.path.join(ARTIFACTS_DIR, 'preprocessor_config.json')}")

    # Load Datasets
    train_dataset = datasets.ImageFolder(os.path.join(DATA_DIR, 'train'), transform=train_transforms)
    val_dataset = datasets.ImageFolder(os.path.join(DATA_DIR, 'val'), transform=val_transforms)

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)

    print(f"Training samples:   {len(train_dataset)} ({len(train_loader)} batches)")
    print(f"Validation samples: {len(val_dataset)} ({len(val_loader)} batches)")

    # Build Model
    def build_model(num_classes=NUM_CLASSES):
        model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
        in_features = model.classifier[3].in_features
        model.classifier[3] = nn.Linear(in_features, num_classes)
        return model

    model = build_model(NUM_CLASSES).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=LEARNING_RATE, weight_decay=WEIGHT_DECAY)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=NUM_EPOCHS, eta_min=1e-5)

    # Training Loop
    history = {
        'train_loss': [],
        'train_acc': [],
        'val_loss': [],
        'val_acc': [],
        'epochs': []
    }

    best_val_acc = 0.0
    best_model_path = os.path.join(MODELS_DIR, 'best_model.pth')
    final_model_path = os.path.join(MODELS_DIR, 'vistalk_isl_mobilenetv3.pth')

    print("\n" + "="*60)
    print("STARTING TRAINING: MobileNetV3 for ISL Alphabet (A–Z)")
    print("="*60)

    start_time = time.time()

    for epoch in range(1, NUM_EPOCHS + 1):
        epoch_start = time.time()
        
        # Training phase
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        for batch_idx, (images, labels) in enumerate(train_loader):
            images, labels = images.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * images.size(0)
            _, preds = outputs.max(1)
            correct += preds.eq(labels).sum().item()
            total += labels.size(0)
            
        scheduler.step()
        
        epoch_train_loss = running_loss / total
        epoch_train_acc = (correct / total) * 100.0
        
        # Validation phase
        model.eval()
        val_running_loss = 0.0
        val_correct = 0
        val_total = 0
        
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)
                
                val_running_loss += loss.item() * images.size(0)
                _, preds = outputs.max(1)
                val_correct += preds.eq(labels).sum().item()
                val_total += labels.size(0)
                
        epoch_val_loss = val_running_loss / val_total
        epoch_val_acc = (val_correct / val_total) * 100.0
        epoch_duration = time.time() - epoch_start
        
        history['epochs'].append(epoch)
        history['train_loss'].append(epoch_train_loss)
        history['train_acc'].append(epoch_train_acc)
        history['val_loss'].append(epoch_val_loss)
        history['val_acc'].append(epoch_val_acc)
        
        print(f"Epoch [{epoch:2d}/{NUM_EPOCHS:2d}] ({epoch_duration:.1f}s) | "
              f"Train Loss: {epoch_train_loss:.4f}, Train Acc: {epoch_train_acc:6.2f}% | "
              f"Val Loss: {epoch_val_loss:.4f}, Val Acc: {epoch_val_acc:6.2f}%")
        
        if epoch_val_acc > best_val_acc:
            best_val_acc = epoch_val_acc
            torch.save(model.state_dict(), best_model_path)
            print(f"  -> Saved new best model (Val Acc: {best_val_acc:.2f}%)")

    total_training_time = time.time() - start_time
    print(f"\n[OK] Training completed in {total_training_time/60:.2f} minutes. Best Validation Accuracy: {best_val_acc:.2f}%")

    # Load best weights and save final artifacts
    model.load_state_dict(torch.load(best_model_path, weights_only=True))
    torch.save(model.state_dict(), final_model_path)
    print(f"[OK] Saved final model weights: {final_model_path}")

    # Export TorchScript Model
    model.eval()
    model_cpu = build_model(NUM_CLASSES)
    model_cpu.load_state_dict(torch.load(final_model_path, map_location='cpu', weights_only=True))
    model_cpu.eval()

    dummy_input = torch.randn(1, 3, IMAGE_SIZE[0], IMAGE_SIZE[1])
    traced_model = torch.jit.trace(model_cpu, dummy_input)
    torchscript_path = os.path.join(MODELS_DIR, 'vistalk_isl_mobilenetv3.pt')
    traced_model.save(torchscript_path)
    print(f"[OK] Exported TorchScript model: {torchscript_path}")

    # Export ONNX Model
    try:
        onnx_path = os.path.join(MODELS_DIR, 'vistalk_isl_mobilenetv3.onnx')
        torch.onnx.export(
            model_cpu,
            dummy_input,
            onnx_path,
            export_params=True,
            opset_version=14,
            do_constant_folding=True,
            input_names=['input'],
            output_names=['output'],
            dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
        )
        print(f"[OK] Exported ONNX model: {onnx_path}")
    except Exception as e:
        print(f"[NOTE] ONNX export note: {e}")

    # Save training history
    with open(os.path.join(ARTIFACTS_DIR, 'training_history.json'), 'w') as f:
        json.dump(history, f, indent=2)

    # Generate and Save Training Curves Plot
    plt.figure(figsize=(12, 5))

    plt.subplot(1, 2, 1)
    plt.plot(history['epochs'], history['train_loss'], 'b-o', label='Train Loss')
    plt.plot(history['epochs'], history['val_loss'], 'r-s', label='Val Loss')
    plt.title('Cross-Entropy Loss vs. Epochs', fontsize=12, fontweight='bold')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    plt.grid(True, alpha=0.3)

    plt.subplot(1, 2, 2)
    plt.plot(history['epochs'], history['train_acc'], 'b-o', label='Train Accuracy')
    plt.plot(history['epochs'], history['val_acc'], 'g-^', label='Val Accuracy')
    plt.title('Classification Accuracy vs. Epochs', fontsize=12, fontweight='bold')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy (%)')
    plt.legend()
    plt.grid(True, alpha=0.3)

    plt.tight_layout()
    curves_path = os.path.join(ARTIFACTS_DIR, 'training_curves.png')
    plt.savefig(curves_path, dpi=200)
    plt.close()
    print(f"[OK] Saved training curves to: {curves_path}")

if __name__ == '__main__':
    main()
