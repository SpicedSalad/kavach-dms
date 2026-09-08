# AI-DMS — AI Semantic Search Service

AI service for the Secure Digital Document Management System.

## Features

- PDF document processing
- Text extraction
- Page-aware text chunking
- Sentence embeddings
- Semantic search
- Keyword + semantic hybrid search
- Multi-document search
- SHA-256 document integrity verification
- Tamper detection
- REST API using FastAPI

## Tech Stack

- Python 3.11
- FastAPI
- Uvicorn
- Sentence Transformers
- all-MiniLM-L6-v2
- PyMuPDF
- NumPy

## Project Structure

AI-DMS/
│
├── api.py
├── requirements.txt
│
├── chunk_text.py
├── extract_text.py
├── embed_chunks.py
├── search.py
├── semantic_search.py
├── similarity_test.py
├── test_embeddings.py
├── integrity.py
│
├── sample.pdf
├── tampered.pdf
│
└── venv/

## Setup

Create a virtual environment:

python -m venv venv

Activate the virtual environment on Windows PowerShell:

.\venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

## Run the API

Start the FastAPI server:

uvicorn api:app --reload

The API will run at:

http://127.0.0.1:8000

Swagger API documentation:

http://127.0.0.1:8000/docs

## API Endpoints

### GET /

Checks whether the AI service is running.

Example response:

{
    "message": "AI Semantic Search API is running"
}

### GET /health

Returns the health status of the AI service and the number of loaded documents and chunks.

Example response:

{
    "status": "healthy",
    "service": "AI Semantic Search",
    "documents_loaded": 2,
    "chunks_loaded": 2058
}

### POST /upload

Uploads and processes a PDF document.

The service performs:

PDF
↓
SHA-256 Hash
↓
Text Extraction
↓
Page-aware Chunking
↓
Sentence Embeddings
↓
Search Index

Each uploaded document receives a unique document ID.

Example response:

{
    "document_id": "DOC-2032D348",
    "filename": "sample.pdf",
    "sha256": "a77d4f99...",
    "pages": 752,
    "chunks_created": 1555,
    "total_chunks_indexed": 1555,
    "embedding_dimensions": 384,
    "status": "processed"
}

### GET /documents

Returns all currently uploaded documents.

Example response:

{
    "documents": [
        {
            "document_id": "DOC-2032D348",
            "filename": "sample.pdf",
            "sha256": "a77d4f99...",
            "pages": 752,
            "chunks": 1555
        },
        {
            "document_id": "DOC-66ECAD03",
            "filename": "Crime-Scene-Investigation.pdf",
            "sha256": "020686c0...",
            "pages": 180,
            "chunks": 503
        }
    ]
}

### GET /search

Performs hybrid document search.

The search combines semantic similarity and keyword matching.

Semantic Search
+
Keyword Search
↓
Hybrid Score
↓
Top 5 Results

Current scoring formula:

Final Score = 0.8 × Semantic Score + 0.2 × Keyword Score

Example query:

/search?query=What%20is%20chain%20of%20custody?

Example response:

{
    "query": "What is chain of custody?",
    "documents_searched": 2,
    "results": [
        {
            "rank": 1,
            "score": 0.598,
            "semantic_score": 0.598,
            "keyword_score": 0.6,
            "document_id": "DOC-2032D348",
            "document": "sample.pdf",
            "page": 33,
            "text": "..."
        }
    ]
}

Search results contain:

- Rank
- Combined score
- Semantic score
- Keyword score
- Document ID
- Filename
- Page number
- Relevant text

### POST /verify

Verifies the integrity of an uploaded document using SHA-256.

Original Document
↓
Original SHA-256
↓
Stored Hash

Uploaded Document
↓
Current SHA-256
↓
Compare

Same → VERIFIED
Different → TAMPERED

Example verified response:

{
    "filename": "sample.pdf",
    "status": "VERIFIED",
    "message": "Document integrity verified."
}

Example tampered response:

{
    "filename": "tampered.pdf",
    "status": "TAMPERED",
    "message": "TAMPER DETECTED!"
}

## Semantic Search

The system uses the Sentence Transformers model:

all-MiniLM-L6-v2

Each text chunk is converted into a 384-dimensional vector.

The search query is also converted into a vector.

Cosine similarity is used to find the most relevant document chunks.

## Hybrid Search

Semantic search is useful for finding documents with similar meaning.

Example:

Query:
"What vehicle was seen near the warehouse?"

Document:
"A witness reported seeing a blue automobile beside the warehouse."

Although the words are different, the meanings are similar.

Keyword search is useful for exact identifiers such as:

FIR-2026-0817
MH-04-AB-1234
EXHIBIT-E32

The system therefore combines semantic and keyword search.

## Document Processing Pipeline

PDF
↓
Text Extraction
↓
Page-aware Chunking
↓
Text Chunks
↓
Sentence Embeddings
↓
Search Index
↓
Semantic Search + Keyword Search
↓
Hybrid Ranking
↓
Top 5 Results

## Integrity Pipeline

PDF
↓
SHA-256
↓
Original Hash
↓
Uploaded PDF
↓
Current Hash
↓
Compare
↓
VERIFIED / TAMPERED

## Architecture Principle

The Python AI service is responsible for:

- Document processing
- Text extraction
- Chunking
- Embeddings
- Semantic search
- Keyword search
- Relevance ranking
- Integrity verification

The Java Spring Boot backend is responsible for:

- Authentication
- Authorization
- RBAC
- Case-level permissions
- User management
- Trusted system-of-record operations

Important principle:

Python determines relevance.
Java determines authority.

The AI service should not decide whether a user is authorized to access a document.

## Current Prototype Limitation

The current prototype stores documents, chunks, embeddings and metadata in memory.

Restarting the FastAPI server clears the current document index.

For the final integrated system:

PostgreSQL
↓
Metadata + Embeddings

MinIO / S3
↓
Actual Documents

Java Spring Boot
↓
Authentication + Authorization

Python FastAPI
↓
AI Processing + Search

## Future Integration

The final architecture will look like:

Frontend
↓
Java Spring Boot
↓
PostgreSQL + MinIO + Python AI Service

The Python service will communicate with the Java backend through REST APIs.

## Security Considerations

SHA-256 is used to detect changes to documents.

No custom cryptographic algorithms are used.

Authorization remains outside the AI service and should be enforced by the trusted Java backend.

## Demo Flow

1. Start FastAPI.
2. Upload sample.pdf.
3. Upload Crime-Scene-Investigation.pdf.
4. Check GET /documents.
5. Search for "What is chain of custody?"
6. View relevant document and page.
7. Verify the original document.
8. Verify the tampered document.
9. Show "TAMPER DETECTED!"

## Current Status

[x] PDF upload
[x] SHA-256 hashing
[x] Text extraction
[x] Page-aware chunking
[x] Sentence embeddings
[x] Multi-document indexing
[x] Semantic search
[x] Keyword search
[x] Hybrid search
[x] Document IDs
[x] Page-level search results
[x] Integrity verification
[x] Tamper detection
[x] FastAPI REST API
[x] Swagger documentation

## AI-DMS

Secure Digital Document Management System

AI / NLP / Semantic Search Component