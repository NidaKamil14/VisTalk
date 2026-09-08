# 🤟 VisTalk Machine Learning: Indian Sign Language (ISL) Alphabet Classification

This directory contains the complete, reproducible machine learning pipeline for **VisTalk's static Indian Sign Language (ISL) alphabet recognition system**.

---

## 1. Problem Statement & Scope

Sign language accessibility remains a significant technological barrier for the deaf and hard-of-hearing community in India. Indian Sign Language (ISL) possesses distinct grammatical structures, phonology, and hand configurations compared to American Sign Language (ASL). In particular, ISL employs **extensive two-handed sign configurations** (e.g., for letters like `B`, `D`, `H`, `M`, `N`, `P`, `X`) in addition to single-handed postures.

### Current ML Scope
To ensure robust, high-precision performance suitable for web integration and college project viva defense, the current machine learning implementation is strictly bounded:
* **Task:** Multi-class static image classification.
* **Classes:** 26 classes representing the English alphabet in ISL (**A–Z**).
* **Input:** Static RGB images ($128 \times 128$).
* **Output:** Predicted ISL alphabet label (`A`–`Z`) and associated confidence score.
* **Out of Scope (Future Scope):** Digits (0–9), word-level signs, continuous sentence signing, dynamic video sequences, and temporal tracking are intentionally preserved on the broader VisTalk roadmap and excluded from this initial model.

---

## 2. Dataset & Preprocessing

### Dataset Source & Ingestion
* **Source:** `Hemg/Indian_sign_language_dataset` on Hugging Face (Apache-2.0 License).
* **Original Corpus:** 42,745 total images across 35 classes (Digits `1–9` and Alphabets `A–Z`).
* **Filtering & Re-Indexing:** The original dataset was filtered to remove digits (`labels 0–8`) and isolate the 26 alphabet classes (`labels 9–34`). These 26 classes were cleanly re-indexed to `0–25` corresponding directly to `A` through `Z`.

### Dataset Partitions (Stratified 80 / 10 / 10 Split)
The filtered dataset comprises **31,945 authentic ISL images** (approximately ~1,220 images per alphabet class):

| Split | Percentage | Number of Images | Storage Location |
| :--- | :---: | :---: | :--- |
| **Train Set** | 80% | 25,556 | `ml/data/splits/train/` |
| **Validation Set** | 10% | 3,194 | `ml/data/splits/val/` |
| **Held-Out Test Set** | 10% | 3,195 | `ml/data/splits/test/` |
| **Total** | **100%** | **31,945** | Across 26 balanced classes |

### Preprocessing & Normalization
As defined in `ml/artifacts/preprocessor_config.json`:
* **Input Resolution:** Resized to $128 \times 128$ pixels.
* **Color Format:** 3-channel RGB.
* **Normalization:** Scaled to $[0, 1]$ and normalized using standard ImageNet distribution:
  $$\text{Mean} = [0.485, 0.456, 0.406], \quad \text{Std} = [0.229, 0.224, 0.225]$$

### Data Augmentation (Training Phase)
To improve model resilience against real-world signing variations, the training pipeline employs stochastic augmentations:
* **Random Rotation:** $\pm 10^\circ$ (simulates natural hand tilting).
* **Random Affine:** $\pm 4\%$ translation and $\pm 4\%$ scaling (simulates distance from webcam).
* **Color Jitter:** $\pm 15\%$ brightness and contrast variation (simulates indoor lighting changes).

---

## 3. Model Architecture & Transfer Learning

### Why MobileNetV3-Small?
Rather than training an unoptimized monolithic convolutional network from scratch, we employ **MobileNetV3-Small** initialized with ImageNet-1K pretrained weights:
1. **Ultra-Lightweight Footprint:** ~1.52 million parameters ($6.3\text{ MB}$ uncompressed weights), enabling instant loading on mobile devices and web browsers.
2. **Inverted Residuals & Squeeze-and-Excitation:** Incorporates depthwise separable convolutions and channel attention blocks with Hard-Swish activations, maximizing representative capacity while minimizing FLOPs.
3. **High Throughput:** Delivers over 150+ FPS on Apple Silicon MPS and 60+ FPS on consumer laptop CPUs.

### Architectural Customization
The 1,000-class ImageNet classification head was replaced:
```python
# classifier[3]: Linear(in_features=1024, out_features=26, bias=True)
model.classifier[3] = nn.Linear(model.classifier[3].in_features, 26)
```

---

## 4. Training Configuration & Hyperparameters

* **Optimizer:** AdamW ($\beta_1 = 0.9, \beta_2 = 0.999$, weight decay $= 10^{-4}$).
* **Initial Learning Rate:** $1 \times 10^{-3}$.
* **Learning Rate Scheduler:** CosineAnnealingLR ($T_{\max} = 8, \eta_{\min} = 10^{-5}$).
* **Loss Function:** Categorical Cross-Entropy Loss (`nn.CrossEntropyLoss`).
* **Batch Size:** 64.
* **Epochs:** 8.
* **Compute Hardware:** Apple Silicon M-series GPU (`torch.device('mps')`).
* **Training Time:** 21.84 minutes total (~160 seconds/epoch across 400 training batches).

---

## 5. Evaluation Results

The model was evaluated on the **3,195 held-out test images** (`ml/data/splits/test/`):

### Global Test Set Metrics

| Metric | Score |
| :--- | :---: |
| **Overall Accuracy** | **100.00%** |
| **Macro Precision** | **100.00%** |
| **Macro Recall** | **100.00%** |
| **Macro F1-Score** | **100.00%** |
| **Weighted Precision** | **100.00%** |
| **Weighted Recall** | **100.00%** |
| **Weighted F1-Score** | **100.00%** |

### Per-Class Performance Summary (A–Z)
Every single class achieved precision, recall, and F1-score of 1.00 on the held-out test set:

| Class | Support | Precision | Recall | F1 | Class | Support | Precision | Recall | F1 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **A** | 120 | 100% | 100% | 1.00 | **N** | 120 | 100% | 100% | 1.00 |
| **B** | 120 | 100% | 100% | 1.00 | **O** | 143 | 100% | 100% | 1.00 |
| **C** | 145 | 100% | 100% | 1.00 | **P** | 120 | 100% | 100% | 1.00 |
| **D** | 120 | 100% | 100% | 1.00 | **Q** | 120 | 100% | 100% | 1.00 |
| **E** | 120 | 100% | 100% | 1.00 | **R** | 120 | 100% | 100% | 1.00 |
| **F** | 120 | 100% | 100% | 1.00 | **S** | 120 | 100% | 100% | 1.00 |
| **G** | 120 | 100% | 100% | 1.00 | **T** | 120 | 100% | 100% | 1.00 |
| **H** | 120 | 100% | 100% | 1.00 | **U** | 120 | 100% | 100% | 1.00 |
| **I** | 138 | 100% | 100% | 1.00 | **V** | 129 | 100% | 100% | 1.00 |
| **J** | 120 | 100% | 100% | 1.00 | **W** | 120 | 100% | 100% | 1.00 |
| **K** | 120 | 100% | 100% | 1.00 | **X** | 120 | 100% | 100% | 1.00 |
| **L** | 120 | 100% | 100% | 1.00 | **Y** | 120 | 100% | 100% | 1.00 |
| **M** | 120 | 100% | 100% | 1.00 | **Z** | 120 | 100% | 100% | 1.00 |

Detailed JSON metrics: `ml/artifacts/evaluation_metrics.json`.  
Confusion matrix visualization: `ml/artifacts/confusion_matrix.png`.

---

## 6. Scientific Analysis of Limitations & Signer Independence

> ⚠️ **Key Discussion for College Project Viva Defense**

### Why Did the Model Reach 100% Accuracy?
In academic machine learning, a 100% accuracy score on both validation and test sets warrants careful scientific interrogation:
1. **Intra-Session Temporal Correlation:** The source dataset was collected from continuous video bursts or sequential photo captures of signers under controlled dark studio backdrops.
2. **Split Leakage:** In a standard random stratified split (`train_test_split`), frames from the *same* continuous signing sequence are distributed across train, validation, and test subsets. As a result, the test set contains frames that are nearly identical in signer identity, hand size, skin tone, and backdrop lighting to frames in the training set.
3. **Absence of Signer IDs:** Because the public dataset metadata lacks individual signer IDs, an absolute, provable **signer-independent split** could not be performed.

### Generalization Reality
* The model **does not claim zero-shot generalization** to arbitrary unseen signers in unconstrained real-world environments.
* When tested under cluttered backgrounds, varying skin tones, or low-light consumer webcams, pure pixel-based models experience distribution shift.
* **Solution for Production:** Pair pixel representations with skeletal landmark extractors (MediaPipe Hand Landmarks) to achieve signer- and background-invariance.

---

## 7. Model Artifacts Directory

| Artifact | Filepath | Size | Description |
| :--- | :--- | :---: | :--- |
| **PyTorch Weights** | `ml/models/vistalk_isl_mobilenetv3.pth` | 6.3 MB | Final trained model state dictionary |
| **Best Checkpoint** | `ml/models/best_model.pth` | 6.3 MB | Best validation accuracy checkpoint |
| **TorchScript Model** | `ml/models/vistalk_isl_mobilenetv3.pt` | 6.6 MB | Traced model for C++/Python backend runtime |
| **Class Mapping** | `ml/artifacts/class_mapping.json` | 1.1 KB | JSON dictionary mapping indices `0..25` $\leftrightarrow$ `A..Z` |
| **Preprocessor Config** | `ml/artifacts/preprocessor_config.json` | 569 B | Input shape ($128\times128$), RGB, normalization values |
| **Evaluation Metrics** | `ml/artifacts/evaluation_metrics.json` | 3.3 KB | Precision, recall, F1, and support for all 26 classes |
| **Confusion Matrix** | `ml/artifacts/confusion_matrix.png` | 158 KB | 26×26 seaborn heatmap |
| **Sample Predictions** | `ml/artifacts/sample_predictions.png` | 652 KB | True vs. Predicted test visualizer with confidence |
| **Training Curves** | `ml/artifacts/training_curves.png` | 89 KB | Dual loss and accuracy plot over epochs |
| **Interactive Notebook**| `VisTalk_ISL_Alphabet_Classification.ipynb` | 2.3 MB | Executable, self-contained demonstration notebook |

---

## 8. Reproducibility Instructions

To verify or reproduce the pipeline locally:

```bash
# 1. Install dependencies
pip install torch torchvision scikit-learn seaborn matplotlib pandas pillow nbformat nbclient ipykernel

# 2. Re-run evaluation on the test set
python3 ml/scripts/evaluate.py

# 3. Launch the Jupyter Notebook
jupyter notebook VisTalk_ISL_Alphabet_Classification.ipynb
```

---

## 9. Future Integration Roadmap for VisTalk

1. **Client-Side / Backend Inference:** Deploy the trained TorchScript/ONNX model via a lightweight FastAPI microservice or directly in-browser using ONNX Runtime Web.
2. **Practice Mode Integration (`src/pages/Practice.jsx`):** Feed user webcam frames through `useSignRecognition.js` to compare user hand gestures against target letters in real time.
3. **MediaPipe Landmark Enhancement:** Augment pixel input with 21 3D hand keypoints to ensure robustness across diverse lighting and skin tones.
4. **Vocabulary & Dynamic Signs:** Introduce numbers (`0–9`) and multi-frame dynamic sign recognition using recurrent sequence models (LSTM / Transformers) in subsequent VisTalk phases.
