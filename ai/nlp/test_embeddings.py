from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

text = "The witness saw a blue vehicle near the warehouse."

embedding = model.encode(text)

print("Embedding generated successfully!")
print("Number of dimensions:", len(embedding))
print("First 5 values:", embedding[:5])