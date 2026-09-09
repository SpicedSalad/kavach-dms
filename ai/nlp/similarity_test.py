from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

sentence1 = "The witness saw a blue vehicle near the warehouse."
sentence2 = "A witness observed a blue car close to the warehouse."

embedding1 = model.encode(sentence1)
embedding2 = model.encode(sentence2)

similarity = util.cos_sim(embedding1, embedding2)

print("Similarity:", similarity.item())