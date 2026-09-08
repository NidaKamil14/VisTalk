"""
VisTalk ISL Alphabet Classification - Comprehensive Model Evaluation Script
Evaluates the trained MobileNetV3 model on the held-out Test set (3,195 images).
Computes Accuracy, Precision, Recall, F1-Score, Confusion Matrix, and Per-Class Metrics.
"""

import os
import json
import ssl
import certifi

os.environ['SSL_CERT_FILE'] = certifi.where()
try:
    ssl._create_default_https_context = ssl._create_unverified_context
except AttributeError:
    pass

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    classification_report, confusion_matrix
)
from PIL import Image

def main():
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DATA_DIR = os.path.join(BASE_DIR, 'data', 'splits')
    MODELS_DIR = os.path.join(BASE_DIR, 'models')
    ARTIFACTS_DIR = os.path.join(BASE_DIR, 'artifacts')

    # Device
    device = torch.device('mps' if torch.backends.mps.is_available() else 'cpu')
    print(f"Evaluation running on device: {device}")

    # Preprocessing
    IMAGE_SIZE = (128, 128)
    test_transforms = transforms.Compose([
        transforms.Resize(IMAGE_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    # Load Test Dataset
    test_dataset = datasets.ImageFolder(os.path.join(DATA_DIR, 'test'), transform=test_transforms)
    test_loader = DataLoader(test_dataset, batch_size=64, shuffle=False, num_workers=0)

    class_names = test_dataset.classes
    num_classes = len(class_names)
    print(f"Evaluating on {len(test_dataset)} test samples across {num_classes} classes ({class_names[0]}–{class_names[-1]})...")

    # Load Model
    def load_trained_model(model_path):
        model = models.mobilenet_v3_small(weights=None)
        in_features = model.classifier[3].in_features
        model.classifier[3] = nn.Linear(in_features, num_classes)
        model.load_state_dict(torch.load(model_path, map_location=device, weights_only=True))
        model = model.to(device)
        model.eval()
        return model

    model_path = os.path.join(MODELS_DIR, 'vistalk_isl_mobilenetv3.pth')
    model = load_trained_model(model_path)
    print(f"[OK] Loaded model from: {model_path}")

    # Run Inference
    all_preds = []
    all_targets = []
    all_probs = []

    with torch.no_grad():
        for images, targets in test_loader:
            images = images.to(device)
            outputs = model(images)
            probs = torch.softmax(outputs, dim=1)
            _, preds = outputs.max(1)
            
            all_preds.extend(preds.cpu().numpy())
            all_targets.extend(targets.numpy())
            all_probs.extend(probs.cpu().numpy())

    all_preds = np.array(all_preds)
    all_targets = np.array(all_targets)
    all_probs = np.array(all_probs)

    # Compute Global Metrics
    acc = accuracy_score(all_targets, all_preds) * 100.0
    prec_macro = precision_score(all_targets, all_preds, average='macro', zero_division=0) * 100.0
    rec_macro = recall_score(all_targets, all_preds, average='macro', zero_division=0) * 100.0
    f1_macro = f1_score(all_targets, all_preds, average='macro', zero_division=0) * 100.0

    prec_weighted = precision_score(all_targets, all_preds, average='weighted', zero_division=0) * 100.0
    rec_weighted = recall_score(all_targets, all_preds, average='weighted', zero_division=0) * 100.0
    f1_weighted = f1_score(all_targets, all_preds, average='weighted', zero_division=0) * 100.0

    print("\n" + "="*60)
    print("TEST EVALUATION RESULTS (HELD-OUT TEST SET)")
    print("="*60)
    print(f"Total Test Samples:   {len(test_dataset)}")
    print(f"Overall Accuracy:     {acc:6.2f}%")
    print(f"Macro Precision:      {prec_macro:6.2f}%")
    print(f"Macro Recall:         {rec_macro:6.2f}%")
    print(f"Macro F1-Score:       {f1_macro:6.2f}%")
    print(f"Weighted Precision:   {prec_weighted:6.2f}%")
    print(f"Weighted Recall:      {rec_weighted:6.2f}%")
    print(f"Weighted F1-Score:    {f1_weighted:6.2f}%")
    print("="*60)

    # Per-Class Classification Report
    clf_report_dict = classification_report(all_targets, all_preds, target_names=class_names, output_dict=True, zero_division=0)
    clf_report_text = classification_report(all_targets, all_preds, target_names=class_names, zero_division=0)
    print("\nPER-CLASS PERFORMANCE REPORT:")
    print(clf_report_text)

    # Save Metrics JSON
    eval_results = {
        'model': 'MobileNetV3-Small',
        'dataset': 'Hemg/Indian_sign_language_dataset (A–Z alphabet subset)',
        'total_test_samples': int(len(test_dataset)),
        'num_classes': num_classes,
        'accuracy': round(float(acc), 2),
        'macro_precision': round(float(prec_macro), 2),
        'macro_recall': round(float(rec_macro), 2),
        'macro_f1_score': round(float(f1_macro), 2),
        'weighted_precision': round(float(prec_weighted), 2),
        'weighted_recall': round(float(rec_weighted), 2),
        'weighted_f1_score': round(float(f1_weighted), 2),
        'per_class_metrics': {
            cls: {
                'precision': round(float(clf_report_dict[cls]['precision'] * 100), 2),
                'recall': round(float(clf_report_dict[cls]['recall'] * 100), 2),
                'f1_score': round(float(clf_report_dict[cls]['f1-score'] * 100), 2),
                'support': int(clf_report_dict[cls]['support'])
            }
            for cls in class_names
        }
    }

    metrics_json_path = os.path.join(ARTIFACTS_DIR, 'evaluation_metrics.json')
    with open(metrics_json_path, 'w') as f:
        json.dump(eval_results, f, indent=2)
    print(f"[OK] Saved evaluation metrics to: {metrics_json_path}")

    # Confusion Matrix Plots
    cm = confusion_matrix(all_targets, all_preds)
    cm_normalized = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]

    # 1. Raw Confusion Matrix
    plt.figure(figsize=(14, 12))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=class_names, yticklabels=class_names)
    plt.title(f'ISL Alphabet Classification - Confusion Matrix (Accuracy: {acc:.2f}%)', fontsize=14, fontweight='bold', pad=15)
    plt.xlabel('Predicted Label', fontsize=12, fontweight='bold')
    plt.ylabel('True Label', fontsize=12, fontweight='bold')
    plt.tight_layout()
    cm_path = os.path.join(ARTIFACTS_DIR, 'confusion_matrix.png')
    plt.savefig(cm_path, dpi=200)
    plt.close()
    print(f"[OK] Saved confusion matrix to: {cm_path}")

    # 2. Normalized Confusion Matrix
    plt.figure(figsize=(14, 12))
    sns.heatmap(cm_normalized, annot=True, fmt='.2f', cmap='Blues', xticklabels=class_names, yticklabels=class_names)
    plt.title('ISL Alphabet Classification - Normalized Confusion Matrix', fontsize=14, fontweight='bold', pad=15)
    plt.xlabel('Predicted Label', fontsize=12, fontweight='bold')
    plt.ylabel('True Label', fontsize=12, fontweight='bold')
    plt.tight_layout()
    cm_norm_path = os.path.join(ARTIFACTS_DIR, 'confusion_matrix_normalized.png')
    plt.savefig(cm_norm_path, dpi=200)
    plt.close()
    print(f"[OK] Saved normalized confusion matrix to: {cm_norm_path}")

    # 3. Sample Predictions Grid (Visual Inspection)
    unnorm_transform = transforms.Compose([
        transforms.Normalize(mean=[-0.485/0.229, -0.456/0.224, -0.406/0.225], std=[1/0.229, 1/0.224, 1/0.225])
    ])

    plt.figure(figsize=(16, 10))
    sample_indices = np.random.RandomState(42).choice(len(test_dataset), 18, replace=False)

    for i, sample_idx in enumerate(sample_indices):
        img_tensor, true_label = test_dataset[sample_idx]
        pred_label = all_preds[sample_idx]
        confidence = all_probs[sample_idx][pred_label] * 100.0
        
        vis_img = unnorm_transform(img_tensor).permute(1, 2, 0).numpy()
        vis_img = np.clip(vis_img, 0, 1)
        
        plt.subplot(3, 6, i + 1)
        plt.imshow(vis_img)
        plt.axis('off')
        
        true_char = class_names[true_label]
        pred_char = class_names[pred_label]
        is_correct = (true_label == pred_label)
        
        title_color = 'green' if is_correct else 'red'
        plt.title(f"True: {true_char} | Pred: {pred_char}\nConf: {confidence:.1f}%", fontsize=10, fontweight='bold', color=title_color)

    plt.suptitle('ISL Alphabet Recognition - Sample Test Predictions', fontsize=15, fontweight='bold', y=0.98)
    plt.tight_layout()
    sample_preds_path = os.path.join(ARTIFACTS_DIR, 'sample_predictions.png')
    plt.savefig(sample_preds_path, dpi=200)
    plt.close()
    print(f"[OK] Saved sample predictions visualization to: {sample_preds_path}")

if __name__ == '__main__':
    main()
