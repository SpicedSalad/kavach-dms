import hashlib
import uuid

from fastapi import FastAPI, UploadFile, File
from sentence_transformers import SentenceTransformer, util

import fitz
import numpy as np


app = FastAPI()


# ============================================================
# In-memory document store
# ============================================================

documents = {}

# All chunks from all uploaded documents
chunks = []

# Embeddings corresponding to the chunks list
embeddings = None


# ============================================================
# Load embedding model
# ============================================================

model = SentenceTransformer("all-MiniLM-L6-v2")


# ============================================================
# Text chunking
# ============================================================

def chunk_page(
    text,
    page_number,
    document_id,
    filename,
    chunk_size=1000,
    overlap=200
):
    page_chunks = []

    start = 0

    while start < len(text):

        end = start + chunk_size

        page_chunks.append({
            "document_id": document_id,
            "document": filename,
            "page": page_number,
            "text": text[start:end]
        })

        start += chunk_size - overlap

    return page_chunks


# ============================================================
# SHA-256
# ============================================================

def calculate_hash(data):
    return hashlib.sha256(data).hexdigest()


# ============================================================
# Health check
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "service": "AI Semantic Search",
        "documents_loaded": len(documents),
        "chunks_loaded": len(chunks)
    }


# ============================================================
# Home
# ============================================================

@app.get("/")
def home():

    return {
        "message": "AI Semantic Search API is running"
    }


# ============================================================
# Upload document
# ============================================================

@app.post("/upload")
async def upload(file: UploadFile = File(...)):

    global chunks, embeddings

    # Read uploaded file
    contents = await file.read()

    # Generate unique document ID
    document_id = "DOC-" + uuid.uuid4().hex[:8].upper()

    # Calculate SHA-256
    file_hash = calculate_hash(contents)

    # Open PDF
    doc = fitz.open(
        stream=contents,
        filetype="pdf"
    )

    page_count = len(doc)

    # Temporary chunks for this document
    document_chunks = []

    # Extract text page by page
    for page_number, page in enumerate(doc, start=1):

        text = page.get_text()

        page_chunks = chunk_page(
            text,
            page_number,
            document_id,
            file.filename
        )

        document_chunks.extend(page_chunks)

    doc.close()

    # Store document metadata
    documents[document_id] = {
        "document_id": document_id,
        "filename": file.filename,
        "sha256": file_hash,
        "pages": page_count,
        "chunks": len(document_chunks)
    }

    # Add new chunks to global search index
    chunks.extend(document_chunks)

    # Extract text from all chunks
    texts = [
        chunk["text"]
        for chunk in chunks
    ]

    # Rebuild embeddings for all documents
    embeddings = model.encode(
        texts,
        show_progress_bar=True
    )

    return {
        "document_id": document_id,
        "filename": file.filename,
        "sha256": file_hash,
        "pages": page_count,
        "chunks_created": len(document_chunks),
        "total_chunks_indexed": len(chunks),
        "embedding_dimensions": embeddings.shape[1],
        "status": "processed"
    }


# ============================================================
# List uploaded documents
# ============================================================

@app.get("/documents")
def list_documents():

    return {
        "documents": list(documents.values())
    }


# ============================================================
# Verify document integrity
# ============================================================

@app.post("/verify")
async def verify(file: UploadFile = File(...)):

    contents = await file.read()

    current_hash = calculate_hash(contents)

    # Find document by filename
    matching_document = None

    for document in documents.values():

        if document["filename"] == file.filename:

            matching_document = document
            break

    # Original document not found
    if matching_document is None:

        return {
            "filename": file.filename,
            "status": "UNKNOWN",
            "message": "No original document with this filename has been uploaded."
        }

    original_hash = matching_document["sha256"]

    # Hash comparison
    if current_hash == original_hash:

        return {
            "document_id": matching_document["document_id"],
            "filename": file.filename,
            "status": "VERIFIED",
            "message": "Document integrity verified.",
            "original_hash": original_hash,
            "current_hash": current_hash
        }

    return {
        "document_id": matching_document["document_id"],
        "filename": file.filename,
        "status": "TAMPERED",
        "message": "TAMPER DETECTED!",
        "original_hash": original_hash,
        "current_hash": current_hash
    }


# ============================================================
# Hybrid Semantic + Keyword Search
# ============================================================

@app.get("/search")
def search(query: str):

    if embeddings is None or len(chunks) == 0:

        return {
            "error": "No documents have been uploaded yet."
        }

    # --------------------------------------------------------
    # Semantic search
    # --------------------------------------------------------

    query_embedding = model.encode(query)

    similarities = util.cos_sim(
        query_embedding,
        embeddings
    )[0]


    # --------------------------------------------------------
    # Keyword search
    # --------------------------------------------------------

    query_words = set(
        query.lower().split()
    )

    scored_results = []

    for index, chunk in enumerate(chunks):

        text = chunk["text"].lower()

        # Count matching query words
        matching_words = sum(
            1
            for word in query_words
            if word in text
        )

        # Keyword score
        keyword_score = (
            matching_words / len(query_words)
            if query_words
            else 0
        )

        # Semantic score
        semantic_score = float(
            similarities[index]
        )

        # Combined score
        final_score = (
            0.8 * semantic_score
            +
            0.2 * keyword_score
        )

        scored_results.append({
            "index": index,
            "semantic_score": semantic_score,
            "keyword_score": keyword_score,
            "final_score": final_score
        })


    # --------------------------------------------------------
    # Sort by combined score
    # --------------------------------------------------------

    scored_results.sort(
        key=lambda x: x["final_score"],
        reverse=True
    )


    # --------------------------------------------------------
    # Top 5 results
    # --------------------------------------------------------

    top_results = scored_results[:5]

    results = []

    for rank, result in enumerate(
        top_results,
        start=1
    ):

        index = result["index"]

        results.append({
            "rank": rank,
            "score": result["final_score"],
            "semantic_score": result["semantic_score"],
            "keyword_score": result["keyword_score"],
            "document_id": chunks[index]["document_id"],
            "document": chunks[index]["document"],
            "page": chunks[index]["page"],
            "text": chunks[index]["text"]
        })


    return {
        "query": query,
        "documents_searched": len(documents),
        "results": results
    }