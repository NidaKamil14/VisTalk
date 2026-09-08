import nbformat
from nbclient import NotebookClient
import os

notebook_path = os.path.join('/Users/nidakamil/Desktop/VisTalk', 'VisTalk_ISL_Alphabet_Classification.ipynb')
print(f"Reading notebook: {notebook_path}")

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = nbformat.read(f, as_version=4)

client = NotebookClient(nb, timeout=300, kernel_name='python3', resources={'metadata': {'path': '/Users/nidakamil/Desktop/VisTalk'}})

print("Executing all cells in notebook...")
client.execute()

with open(notebook_path, 'w', encoding='utf-8') as f:
    nbformat.write(nb, f)

print(f"✅ Successfully executed and updated notebook with outputs: {notebook_path}")
