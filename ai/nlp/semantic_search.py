from sentence_transformers import SentenceTransformer, util

# Load the embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Our small document collection
documents = [
    "The witness saw a blue car near the warehouse.",
    "The forensic team recovered fingerprints from the weapon.",
    "The accused was questioned at the police station.",
    "A witness reported seeing a blue automobile beside the warehouse."
]

# User's search query
query = "Find information about a blue vehicle near the warehouse."

# Convert documents and query into embeddings
document_embeddings = model.encode(documents)
query_embedding = model.encode(query)

# Calculate similarity between query and every document
similarities = util.cos_sim(query_embedding, document_embeddings)[0]

# Create (document, similarity) pairs
results = list(zip(documents, similarities))

# Sort from most similar to least similar
results.sort(key=lambda x: x[1], reverse=True)

# Display results
print("\nSearch results:\n")

for document, score in results:
    print(f"Score: {score:.4f}")
    print(f"Document: {document}")
    print()