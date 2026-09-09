"""
VisTalk ISL Numbers Recognition Model Evaluation Pipeline
Evaluates the trained MobileNetV3-Small numbers model on held-out test split.
Generates confusion matrix, precision/recall/F1 metrics, and metric charts.
"""

import os
import json
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
import matplotlib.pyplot as plt
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEST_DIR = os.path.join(BASE_DIR, 'ml', 'data', 'numbers_splits', 'test')
MODEL_PATH = os.path.join(BASE_DIR, 'ml', 'models', 'vistalk_isl_numbers_mobilenetv3.pth')
CONFIG_PATH = os.path.join(BASE_DIR, 'ml', 'artifacts', 'numbers_preprocessor_config.json')
ARTIFACTS_DIR = os.path.join(BASE_DIR, 'ml', 'artifacts')

device = torch.device('mps' if torch.backends.mps.is_available() else 'cuda' if torch.cuda.is_available() else 'cpu')
print(f"[VisTalk Numbers Evaluator] Using device: {device}")

def evaluate():
    with open(CONFIG_PATH, 'r') as f:
        config = json.load(f)

    classes = config['classes']
    num_classes = len(classes)
    input_size = tuple(config['input_size'])
    norm_mean = config['normalization']['mean']
    norm_std = config['normalization']['std']

    eval_transform = transforms.Compose([
        transforms.Resize(input_size),
        transforms.ToTensor(),
        transforms.Normalize(mean=norm_mean, std=norm_std)
    ])

    test_dataset = datasets.ImageFolder(TEST_DIR, transform=eval_transform)
    test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False, num_workers=0)
    print(f"Loaded {len(test_dataset)} test samples across {num_classes} classes: {classes}")

    # Load Model
    model = models.mobilenet_v3_small(weights=None)
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, num_classes)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=device, weights_only=True))
    model = model.to(device)
    model.eval()

    all_preds = []
    all_targets = []

    print("\nEvaluating on test dataset...")
    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            outputs = model(images)
            _, preds = torch.max(outputs, 1)
            all_preds.extend(preds.cpu().numpy())
            all_targets.extend(labels.numpy())

    all_preds = np.array(all_preds)
    all_targets = np.array(all_targets)

    # Compute Confusion Matrix
    cm = np.zeros((num_classes, num_classes), dtype=int)
    for t, p in zip(all_targets, all_preds):
        cm[t, p] += 1

    # Per-Class Metrics
    metrics_per_class = {}
    precisions, recalls, f1s = [], [], []

    for i, class_name in enumerate(classes):
        tp = cm[i, i]
        fp = cm[:, i].sum() - tp
        fn = cm[i, :].sum() - tp
        support = cm[i, :].sum()

        precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

        precisions.append(precision)
        recalls.append(recall)
        f1s.append(f1)

        metrics_per_class[class_name] = {
            'precision': round(float(precision) * 100.0, 2),
            'recall': round(float(recall) * 100.0, 2),
            'f1_score': round(float(f1) * 100.0, 2),
            'support': int(support)
        }

    overall_accuracy = round(float((all_preds == all_targets).mean()) * 100.0, 2)
    macro_precision = round(float(np.mean(precisions)) * 100.0, 2)
    macro_recall = round(float(np.mean(recalls)) * 100.0, 2)
    macro_f1 = round(float(np.mean(f1s)) * 100.0, 2)

    print(f"\n================ TEST EVALUATION RESULTS ================")
    print(f"Overall Accuracy:  {overall_accuracy}%")
    print(f"Macro Precision:   {macro_precision}%")
    print(f"Macro Recall:      {macro_recall}%")
    print(f"Macro F1-Score:    {macro_f1}%")
    print(f"=========================================================\n")

    print(f"{'Digit':<8}{'Precision (%)':<15}{'Recall (%)':<15}{'F1-Score (%)':<15}{'Support':<10}")
    print("-" * 65)
    for c in classes:
        m = metrics_per_class[c]
        print(f"{c:<8}{m['precision']:<15.2f}{m['recall']:<15.2f}{m['f1_score']:<15.2f}{m['support']:<10}")

    # Plot Confusion Matrix and Evaluation Metrics
    plt.style.use('default')
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

    # 1. Confusion Matrix Heatmap
    im = ax1.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
    ax1.set_title(f'ISL Numbers (0–9) Confusion Matrix\nAccuracy: {overall_accuracy}%', fontsize=12, fontweight='bold', pad=12)
    fig.colorbar(im, ax=ax1, fraction=0.046, pad=0.04)
    tick_marks = np.arange(num_classes)
    ax1.set_xticks(tick_marks)
    ax1.set_xticklabels(classes)
    ax1.set_yticks(tick_marks)
    ax1.set_yticklabels(classes)
    ax1.set_xlabel('Predicted Digit', fontweight='bold', labelpad=8)
    ax1.set_ylabel('True Digit', fontweight='bold', labelpad=8)

    # Annotate numbers in heatmap
    thresh = cm.max() / 2.
    for i in range(num_classes):
        for j in range(num_classes):
            ax1.text(j, i, format(cm[i, j], 'd'),
                     ha="center", va="center",
                     color="white" if cm[i, j] > thresh else "black",
                     fontsize=9)

    # 2. Per-Class F1 Score Bar Chart
    x = np.arange(num_classes)
    ax2.bar(x, [metrics_per_class[c]['f1_score'] for c in classes], color='#167c78', width=0.6)
    ax2.set_title(f'Per-Class F1 Score (Macro F1: {macro_f1}%)', fontsize=12, fontweight='bold', pad=12)
    ax2.set_xticks(x)
    ax2.set_xticklabels(classes)
    ax2.set_ylim(0, 105)
    ax2.set_ylabel('F1 Score (%)', fontweight='bold')
    ax2.set_xlabel('Digit', fontweight='bold', labelpad=8)
    ax2.grid(axis='y', linestyle='--', alpha=0.5)

    for i, v in enumerate([metrics_per_class[c]['f1_score'] for c in classes]):
        ax2.text(i, v + 1.5, f"{v:.1f}%", ha='center', fontsize=8, fontweight='bold')

    plt.tight_layout()
    plot_path = os.path.join(ARTIFACTS_DIR, 'numbers_evaluation_metrics.png')
    plt.savefig(plot_path, dpi=150)
    plt.close()

    summary_results = {
        'overall_accuracy': overall_accuracy,
        'macro_precision': macro_precision,
        'macro_recall': macro_recall,
        'macro_f1': macro_f1,
        'metrics_per_class': metrics_per_class,
        'confusion_matrix': cm.tolist(),
        'total_test_samples': int(len(test_dataset))
    }

    metrics_json_path = os.path.join(ARTIFACTS_DIR, 'numbers_test_metrics.json')
    with open(metrics_json_path, 'w') as f:
        json.dump(summary_results, f, indent=2)

    print(f"\nSaved evaluation artifacts:")
    print(f"  Metrics JSON: {metrics_json_path}")
    print(f"  Plot:         {plot_path}")

if __name__ == '__main__':
    evaluate()
