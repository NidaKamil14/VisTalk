"""
VisTalk ISL Alphabet Dataset Ingestion & Preprocessing Script
Dataset: Hemg/Indian_sign_language_dataset (Hugging Face)
Scope: Static ISL Alphabet (A–Z, 26 classes)
"""

import os
import io
import json
import urllib.request
import ssl
import certifi
import numpy as np
from PIL import Image
import pyarrow.parquet as pq
from sklearn.model_selection import train_test_split
from tqdm import tqdm

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
RAW_DIR = os.path.join(DATA_DIR, 'raw')
SPLITS_DIR = os.path.join(DATA_DIR, 'splits')
ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'artifacts')

os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(SPLITS_DIR, exist_ok=True)
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

# 35 original classes: 0-8 -> '1'-'9', 9-34 -> 'A'-'Z'
ORIGINAL_CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
                    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
                    'U', 'V', 'W', 'X', 'Y', 'Z']

ALPHABET_CLASSES = [c for c in ORIGINAL_CLASSES if c.isalpha()]
assert len(ALPHABET_CLASSES) == 26, f"Expected 26 alphabet classes, got {len(ALPHABET_CLASSES)}"

# Mapping dictionaries
CLASS_TO_IDX = {letter: idx for idx, letter in enumerate(ALPHABET_CLASSES)}
IDX_TO_CLASS = {idx: letter for idx, letter in enumerate(ALPHABET_CLASSES)}

PARQUET_URL = "https://huggingface.co/datasets/Hemg/Indian_sign_language_dataset/resolve/main/data/train-00000-of-00001-a1731e778755d263.parquet"
LOCAL_PARQUET = os.path.join(RAW_DIR, "dataset.parquet")

def download_dataset():
    if os.path.exists(LOCAL_PARQUET) and os.path.getsize(LOCAL_PARQUET) > 200 * 1024 * 1024:
        print(f"[OK] Raw parquet file already exists: {LOCAL_PARQUET} ({os.path.getsize(LOCAL_PARQUET) / (1024*1024):.1f} MB)")
        return
    
    print(f"Downloading dataset from Hugging Face: {PARQUET_URL}...")
    ctx = ssl.create_default_context(cafile=certifi.where())
    req = urllib.request.Request(PARQUET_URL, headers={'User-Agent': 'Mozilla/5.0'})
    
    with urllib.request.urlopen(req, context=ctx) as response, open(LOCAL_PARQUET, 'wb') as out_file:
        total_size = int(response.info().get('Content-Length', 0))
        block_size = 1024 * 1024  # 1MB chunks
        downloaded = 0
        
        with tqdm(total=total_size, unit='B', unit_scale=True, desc="Downloading") as pbar:
            while True:
                buffer = response.read(block_size)
                if not buffer:
                    break
                out_file.write(buffer)
                downloaded += len(buffer)
                pbar.update(len(buffer))
                
    print(f"[OK] Download completed: {LOCAL_PARQUET} ({os.path.getsize(LOCAL_PARQUET) / (1024*1024):.1f} MB)")

def extract_and_split():
    print("\nReading parquet file and filtering to A–Z alphabet classes (indices 9..34)...")
    pf = pq.ParquetFile(LOCAL_PARQUET)
    
    records = []
    # Read row groups
    for rg_idx in tqdm(range(pf.num_row_groups), desc="Scanning row groups"):
        rg = pf.read_row_group(rg_idx)
        labels = rg.column('label').to_pylist()
        images = rg.column('image').to_pylist()
        
        for img_dict, original_lbl in zip(images, labels):
            if original_lbl >= 9:  # Filter only Alphabets (9..34 -> 'A'..'Z')
                char = ORIGINAL_CLASSES[original_lbl]
                new_lbl = CLASS_TO_IDX[char]
                img_bytes = img_dict['bytes']
                records.append({
                    'char': char,
                    'label': new_lbl,
                    'bytes': img_bytes
                })
                
    print(f"Total A–Z records extracted: {len(records)} across 26 classes")
    
    # Save class mappings
    mapping_payload = {
        'class_to_idx': CLASS_TO_IDX,
        'idx_to_class': IDX_TO_CLASS,
        'classes': ALPHABET_CLASSES,
        'num_classes': len(ALPHABET_CLASSES),
        'total_images': len(records)
    }
    with open(os.path.join(ARTIFACTS_DIR, 'class_mapping.json'), 'w') as f:
        json.dump(mapping_payload, f, indent=2)
    print(f"[OK] Saved class mapping to {os.path.join(ARTIFACTS_DIR, 'class_mapping.json')}")
    
    # Split into 80% train, 10% val, 10% test with stratified sampling
    indices = np.arange(len(records))
    labels = [r['label'] for r in records]
    
    train_idx, temp_idx = train_test_split(indices, test_size=0.20, random_state=42, stratify=labels)
    temp_labels = [labels[i] for i in temp_idx]
    val_idx, test_idx = train_test_split(temp_idx, test_size=0.50, random_state=42, stratify=temp_labels)
    
    print(f"Splits: Train = {len(train_idx)} (80%), Val = {len(val_idx)} (10%), Test = {len(test_idx)} (10%)")
    
    splits = {
        'train': train_idx,
        'val': val_idx,
        'test': test_idx
    }
    
    for split_name, split_indices in splits.items():
        split_path = os.path.join(SPLITS_DIR, split_name)
        os.makedirs(split_path, exist_ok=True)
        for char in ALPHABET_CLASSES:
            os.makedirs(os.path.join(split_path, char), exist_ok=True)
            
        print(f"Writing {split_name} images to {split_path}...")
        for i, idx in enumerate(tqdm(split_indices, desc=f"Saving {split_name}")):
            rec = records[idx]
            char = rec['char']
            img_filename = f"{char}_{i:05d}.jpg"
            save_file = os.path.join(split_path, char, img_filename)
            with open(save_file, 'wb') as f:
                f.write(rec['bytes'])
                
    print("\n[SUCCESS] Dataset preparation complete!")
    print(f"Train directory: {os.path.join(SPLITS_DIR, 'train')}")
    print(f"Val directory:   {os.path.join(SPLITS_DIR, 'val')}")
    print(f"Test directory:  {os.path.join(SPLITS_DIR, 'test')}")

if __name__ == '__main__':
    download_dataset()
    extract_and_split()
