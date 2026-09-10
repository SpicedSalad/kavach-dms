from sentence_transformers import SentenceTransformer, util
import numpy as np
import json

# Load model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Load chunks
with open("chunks.json", "r", encoding="utf-8") as file:
    chunks = json.load(file)

# Load embeddings
embeddings = np.load("embeddings.npy")

# Take user query
query = input("Enter your search query: ")

# Convert query into embedding
query_embedding = model.encode(query)

# Calculate similarity
similarities = util.cos_sim(query_embedding, embeddings)[0]

# Get top 5 results
top_results = np.argsort(-similarities.numpy())[:5]

print("\n===== SEARCH RESULTS =====\n")

for rank, index in enumerate(top_results, start=1):
    print(f"RESULT {rank}")
    print(f"Similarity: {similarities[index]:.4f}")
    print(f"Text:\n{chunks[index]}")
    print("\n" + "=" * 80 + "\n")