"""
VisTalk ISL Numbers Recognition Model Training Pipeline
Trains MobileNetV3-Small on ISL digits (0-9).
"""

import os
import json
import time
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SPLITS_DIR = os.path.join(BASE_DIR, 'ml', 'data', 'numbers_splits')
MODELS_DIR = os.path.join(BASE_DIR, 'ml', 'models')
ARTIFACTS_DIR = os.path.join(BASE_DIR, 'ml', 'artifacts')

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

# Hyperparameters & Config
NUM_CLASSES = 10
CLASSES = [str(i) for i in range(10)]
INPUT_SIZE = (128, 128)
BATCH_SIZE = 32
NUM_EPOCHS = 15
LEARNING_RATE = 1e-3
WEIGHT_DECAY = 1e-4

# Hardware Device Selection (Apple Silicon MPS / CUDA / CPU)
device = torch.device('mps' if torch.backends.mps.is_available() else 'cuda' if torch.cuda.is_available() else 'cpu')
print(f"[VisTalk Numbers Trainer] Using device: {device}")

def get_transforms():
    norm_mean = [0.485, 0.456, 0.406]
    norm_std = [0.229, 0.224, 0.225]

    train_transform = transforms.Compose([
        transforms.Resize(INPUT_SIZE),
        transforms.RandomRotation(12),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.RandomAffine(degrees=0, translate=(0.06, 0.06), scale=(0.95, 1.05)),
        transforms.ToTensor(),
        transforms.Normalize(mean=norm_mean, std=norm_std)
    ])

    eval_transform = transforms.Compose([
        transforms.Resize(INPUT_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(mean=norm_mean, std=norm_std)
    ])

    return train_transform, eval_transform, norm_mean, norm_std

def train_model():
    train_transform, eval_transform, norm_mean, norm_std = get_transforms()

    train_dir = os.path.join(SPLITS_DIR, 'train')
    val_dir = os.path.join(SPLITS_DIR, 'val')

    train_dataset = datasets.ImageFolder(train_dir, transform=train_transform)
    val_dataset = datasets.ImageFolder(val_dir, transform=eval_transform)

    print(f"Loaded {len(train_dataset)} training samples, {len(val_dataset)} validation samples across {len(train_dataset.classes)} classes: {train_dataset.classes}")

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)

    # Initialize Pretrained MobileNetV3-Small
    print("[VisTalk Numbers Trainer] Initializing MobileNetV3-Small with pretrained ImageNet weights...")
    weights = models.MobileNet_V3_Small_Weights.DEFAULT
    model = models.mobilenet_v3_small(weights=weights)

    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, NUM_CLASSES)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=LEARNING_RATE, weight_decay=WEIGHT_DECAY)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=NUM_EPOCHS, eta_min=1e-5)

    best_val_acc = 0.0
    best_model_path = os.path.join(MODELS_DIR, 'vistalk_isl_numbers_mobilenetv3.pth')
    history = {'train_loss': [], 'train_acc': [], 'val_loss': [], 'val_acc': []}

    print("\n--- Starting Model Training ---")
    start_time = time.time()

    for epoch in range(1, NUM_EPOCHS + 1):
        # Training Phase
        model.train()
        running_loss = 0.0
        correct_train = 0
        total_train = 0

        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            correct_train += torch.sum(preds == labels.data).item()
            total_train += labels.size(0)

        scheduler.step()
        epoch_train_loss = running_loss / total_train
        epoch_train_acc = (correct_train / total_train) * 100.0

        # Validation Phase
        model.eval()
        val_loss = 0.0
        correct_val = 0
        total_val = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)

                val_loss += loss.item() * images.size(0)
                _, preds = torch.max(outputs, 1)
                correct_val += torch.sum(preds == labels.data).item()
                total_val += labels.size(0)

        epoch_val_loss = val_loss / total_val
        epoch_val_acc = (correct_val / total_val) * 100.0

        history['train_loss'].append(round(epoch_train_loss, 4))
        history['train_acc'].append(round(epoch_train_acc, 2))
        history['val_loss'].append(round(epoch_val_loss, 4))
        history['val_acc'].append(round(epoch_val_acc, 2))

        print(f"Epoch [{epoch:02d}/{NUM_EPOCHS:02d}] - Train Loss: {epoch_train_loss:.4f}, Train Acc: {epoch_train_acc:.2f}% | Val Loss: {epoch_val_loss:.4f}, Val Acc: {epoch_val_acc:.2f}%")

        if epoch_val_acc > best_val_acc:
            best_val_acc = epoch_val_acc
            torch.save(model.state_dict(), best_model_path)
            print(f"  --> Saved new best checkpoint with {best_val_acc:.2f}% Val Accuracy to {best_model_path}")

    elapsed = time.time() - start_time
    print(f"\nTraining completed in {elapsed:.1f}s. Best Val Accuracy: {best_val_acc:.2f}%")

    # Save Preprocessor Config
    config = {
        'model_name': 'MobileNetV3-Small-ISL-Numbers',
        'classes': CLASSES,
        'num_classes': NUM_CLASSES,
        'input_size': list(INPUT_SIZE),
        'normalization': {
            'mean': norm_mean,
            'std': norm_std
        },
        'best_val_accuracy': round(best_val_acc, 2),
        'epochs_trained': NUM_EPOCHS,
        'saved_model_path': 'ml/models/vistalk_isl_numbers_mobilenetv3.pth'
    }

    config_path = os.path.join(ARTIFACTS_DIR, 'numbers_preprocessor_config.json')
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)

    history_path = os.path.join(ARTIFACTS_DIR, 'numbers_training_history.json')
    with open(history_path, 'w') as f:
        json.dump(history, f, indent=2)

    print(f"Saved artifacts:")
    print(f"  Model weights: {best_model_path}")
    print(f"  Config:        {config_path}")
    print(f"  History:       {history_path}")

if __name__ == '__main__':
    train_model()
