def chunk_text(text, chunk_size=1000, overlap=200):
    chunks = []

    start = 0

    while start < len(text):
        end = start + chunk_size

        chunk = text[start:end]
        chunks.append(chunk)

        start += chunk_size - overlap

    return chunks


# Read extracted text
with open("extracted_text.txt", "r", encoding="utf-8") as file:
    text = file.read()

# Create chunks
chunks = chunk_text(text)

print("Total characters:", len(text))
print("Total chunks:", len(chunks))

print("\n--- FIRST CHUNK ---")
print(chunks[0])

print("\n--- SECOND CHUNK ---")
print(chunks[1])