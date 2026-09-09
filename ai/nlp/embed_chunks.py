from sentence_transformers import SentenceTransformer
import numpy as np
import json

# Load model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Read extracted text
with open("extracted_text.txt", "r", encoding="utf-8") as file:
    text = file.read()


# Chunking function
def chunk_text(text, chunk_size=1000, overlap=200):
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap

    return chunks


# Create chunks
chunks = chunk_text(text)

print("Creating embeddings...")
embeddings = model.encode(chunks, show_progress_bar=True)

# Save chunks
with open("chunks.json", "w", encoding="utf-8") as file:
    json.dump(chunks, file, ensure_ascii=False)

# Save embeddings
np.save("embeddings.npy", embeddings)

print("\nDone!")
print("Number of chunks:", len(chunks))
print("Embedding shape:", embeddings.shape)