"""
VisTalk Real-Time Dual ISL Inference Server
Loads both the Alphabet (A–Z) and Number (0–9) MobileNetV3-Small models
and serves real-time predictions via HTTP.
"""

import os
import io
import json
import base64
from http.server import HTTPServer, BaseHTTPRequestHandler
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Model Checkpoint Paths
ALPHABET_MODEL_PATH = os.path.join(BASE_DIR, 'ml', 'models', 'vistalk_isl_mobilenetv3.pth')
ALPHABET_CONFIG_PATH = os.path.join(BASE_DIR, 'ml', 'artifacts', 'preprocessor_config.json')

NUMBERS_MODEL_PATH = os.path.join(BASE_DIR, 'ml', 'models', 'vistalk_isl_numbers_mobilenetv3.pth')
NUMBERS_CONFIG_PATH = os.path.join(BASE_DIR, 'ml', 'artifacts', 'numbers_preprocessor_config.json')

# Device Selection
device = torch.device('mps' if torch.backends.mps.is_available() else 'cuda' if torch.cuda.is_available() else 'cpu')
print(f"[VisTalk Server] Inference device: {device}")

# 1. Load Alphabet Configuration & Model
with open(ALPHABET_CONFIG_PATH, 'r') as f:
    alphabet_config = json.load(f)

alphabet_classes = alphabet_config.get('classes', [chr(ord('A') + i) for i in range(26)])
alphabet_num_classes = len(alphabet_classes)
alphabet_size = tuple(alphabet_config.get('input_size', [128, 128]))
alphabet_mean = alphabet_config['normalization']['mean']
alphabet_std = alphabet_config['normalization']['std']

def load_alphabet_model():
    model = models.mobilenet_v3_small(weights=None)
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, alphabet_num_classes)
    state_dict = torch.load(ALPHABET_MODEL_PATH, map_location=device, weights_only=True)
    model.load_state_dict(state_dict)
    model = model.to(device)
    model.eval()
    return model

print(f"[VisTalk Server] Loading Alphabet model weights from: {ALPHABET_MODEL_PATH}")
alphabet_model = load_alphabet_model()
print(f"[VisTalk Server] Alphabet model loaded successfully! (26 classes: A–Z)")

alphabet_transform = transforms.Compose([
    transforms.Resize(alphabet_size),
    transforms.ToTensor(),
    transforms.Normalize(mean=alphabet_mean, std=alphabet_std)
])

# 2. Load Numbers Configuration & Model
with open(NUMBERS_CONFIG_PATH, 'r') as f:
    numbers_config = json.load(f)

numbers_classes = numbers_config.get('classes', [str(i) for i in range(10)])
numbers_num_classes = len(numbers_classes)
numbers_size = tuple(numbers_config.get('input_size', [128, 128]))
numbers_mean = numbers_config['normalization']['mean']
numbers_std = numbers_config['normalization']['std']

def load_numbers_model():
    model = models.mobilenet_v3_small(weights=None)
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, numbers_num_classes)
    state_dict = torch.load(NUMBERS_MODEL_PATH, map_location=device, weights_only=True)
    model.load_state_dict(state_dict)
    model = model.to(device)
    model.eval()
    return model

print(f"[VisTalk Server] Loading Numbers model weights from: {NUMBERS_MODEL_PATH}")
numbers_model = load_numbers_model()
print(f"[VisTalk Server] Numbers model loaded successfully! (10 classes: 0–9)")

numbers_transform = transforms.Compose([
    transforms.Resize(numbers_size),
    transforms.ToTensor(),
    transforms.Normalize(mean=numbers_mean, std=numbers_std)
])

# Prediction Handler
def predict_from_pil(image, category='alphabets', top_k=5):
    img_rgb = image.convert('RGB')
    
    if category == 'numbers':
        active_model = numbers_model
        active_transform = numbers_transform
        classes = numbers_classes
        num_classes = numbers_num_classes
    else:
        active_model = alphabet_model
        active_transform = alphabet_transform
        classes = alphabet_classes
        num_classes = alphabet_num_classes

    tensor = active_transform(img_rgb).unsqueeze(0).to(device)

    with torch.no_grad():
        logits = active_model(tensor)
        probabilities = torch.softmax(logits, dim=1).squeeze(0)

    top_probs, top_indices = torch.topk(probabilities, k=min(top_k, num_classes))

    top_preds = []
    for prob, idx in zip(top_probs, top_indices):
        top_preds.append({
            'letter': classes[idx.item()],
            'confidence': round(float(prob.item()) * 100.0, 2)
        })

    return {
        'success': True,
        'category': category,
        'prediction': top_preds[0]['letter'],
        'confidence': top_preds[0]['confidence'],
        'top_predictions': top_preds
    }

class InferenceHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path in ['/health', '/api/health', '/']:
            response = {
                'status': 'ok',
                'service': 'VisTalk Dual ISL Inference API',
                'device': str(device),
                'models': {
                    'alphabets': {
                        'model': 'MobileNetV3-Small',
                        'num_classes': alphabet_num_classes,
                        'classes': alphabet_classes,
                        'active': True
                    },
                    'numbers': {
                        'model': 'MobileNetV3-Small',
                        'num_classes': numbers_num_classes,
                        'classes': numbers_classes,
                        'active': True
                    }
                }
            }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(404)
            self._send_cors_headers()
            self.end_headers()

    def do_POST(self):
        if self.path in ['/predict', '/api/predict']:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)

            try:
                data = json.loads(post_data.decode('utf-8'))
                image_data = data.get('image', '')
                category = data.get('category', 'alphabets').lower()

                # Check for base64 prefix
                if ',' in image_data:
                    image_data = image_data.split(',', 1)[1]

                image_bytes = base64.b64decode(image_data)
                pil_img = Image.open(io.BytesIO(image_bytes))

                result = predict_from_pil(pil_img, category=category)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(result).encode('utf-8'))

            except Exception as e:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                error_response = {'success': False, 'error': str(e)}
                self.wfile.write(json.dumps(error_response).encode('utf-8'))
        else:
            self.send_response(404)
            self._send_cors_headers()
            self.end_headers()

    def log_message(self, format, *args):
        # Mute excessive polling logs
        pass

def run_server(port=5001):
    server_address = ('', port)
    httpd = HTTPServer(server_address, InferenceHandler)
    print(f"[VisTalk Server] 🚀 Dual inference server running on http://localhost:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[VisTalk Server] Server shutting down...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
