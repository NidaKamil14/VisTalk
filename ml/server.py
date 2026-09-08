"""
VisTalk Real-Time ISL Alphabet Inference Server
Loads the trained MobileNetV3-Small model and serves predictions via HTTP.
"""

import os
import io
import json
import base64
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'ml', 'models', 'vistalk_isl_mobilenetv3.pth')
CONFIG_PATH = os.path.join(BASE_DIR, 'ml', 'artifacts', 'preprocessor_config.json')

# Device
device = torch.device('mps' if torch.backends.mps.is_available() else 'cpu')
print(f"[VisTalk Server] Inference device: {device}")

# Load Configuration
with open(CONFIG_PATH, 'r') as f:
    config = json.load(f)

classes = config.get('classes', [chr(ord('A') + i) for i in range(26)])
num_classes = len(classes)
image_size = tuple(config.get('input_size', [128, 128]))
norm_mean = config['normalization']['mean']
norm_std = config['normalization']['std']

# Load Model
def load_model():
    model = models.mobilenet_v3_small(weights=None)
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, num_classes)
    state_dict = torch.load(MODEL_PATH, map_location=device, weights_only=True)
    model.load_state_dict(state_dict)
    model = model.to(device)
    model.eval()
    return model

print(f"[VisTalk Server] Loading model weights from: {MODEL_PATH}")
model = load_model()
print(f"[VisTalk Server] Model loaded successfully! (26 ISL classes: A–Z)")

# Transform Pipeline
transform = transforms.Compose([
    transforms.Resize(image_size),
    transforms.ToTensor(),
    transforms.Normalize(mean=norm_mean, std=norm_std)
])

def predict_from_pil(image, top_k=5):
    img_rgb = image.convert('RGB')
    tensor = transform(img_rgb).unsqueeze(0).to(device)
    
    with torch.no_grad():
        logits = model(tensor)
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
                'service': 'VisTalk ISL Alphabet Inference API',
                'model': 'MobileNetV3-Small',
                'num_classes': num_classes,
                'classes': classes,
                'device': str(device)
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
                
                # Check for base64 prefix
                if ',' in image_data:
                    image_data = image_data.split(',', 1)[1]
                    
                image_bytes = base64.b64decode(image_data)
                pil_img = Image.open(io.BytesIO(image_bytes))
                
                result = predict_from_pil(pil_img)
                
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
    print(f"[VisTalk Server] 🚀 Inference server running on http://localhost:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[VisTalk Server] Server shutting down...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
