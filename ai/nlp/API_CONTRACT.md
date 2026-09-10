AI-DMS PYTHON AI SERVICE
API CONTRACT

Base URL:
http://127.0.0.1:8000


1. HEALTH CHECK

GET /health

Purpose:
Check whether the Python AI service is running.

Response:

{
    "status": "healthy",
    "service": "AI Semantic Search",
    "documents_loaded": 2,
    "chunks_loaded": 2058
}


2. UPLOAD DOCUMENT

POST /upload

Content-Type:
multipart/form-data

Parameter:
file

Example:
sample.pdf

Response:

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

Java backend should store:
- document_id
- filename
- sha256
- pages


3. LIST DOCUMENTS

GET /documents

Response:

{
    "documents": [
        {
            "document_id": "DOC-2032D348",
            "filename": "sample.pdf",
            "sha256": "a77d4f99...",
            "pages": 752,
            "chunks": 1555
        }
    ]
}


4. SEARCH DOCUMENTS

GET /search?query=<query>

Example:

GET /search?query=What%20is%20chain%20of%20custody?

Response:

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
            "text": "Relevant extracted text..."
        }
    ]
}

Search result fields:

rank
Position of result.

score
Final hybrid relevance score.

semantic_score
Semantic similarity score.

keyword_score
Keyword matching score.

document_id
Unique document identifier.

document
Filename.

page
Page containing the relevant text.

text
Relevant extracted text.


5. VERIFY DOCUMENT

POST /verify

Content-Type:
multipart/form-data

Parameter:
file

Purpose:
Verify whether the uploaded file matches the original document using SHA-256.

Verified response:

{
    "document_id": "DOC-2032D348",
    "filename": "sample.pdf",
    "status": "VERIFIED",
    "message": "Document integrity verified.",
    "original_hash": "a77d4f99...",
    "current_hash": "a77d4f99..."
}

Tampered response:

{
    "document_id": "DOC-2032D348",
    "filename": "tampered.pdf",
    "status": "TAMPERED",
    "message": "TAMPER DETECTED!",
    "original_hash": "a77d4f99...",
    "current_hash": "adf77c72..."
}


6. INTEGRATION FLOW

DOCUMENT UPLOAD:

Java Backend
    ↓
POST /upload
    ↓
Python AI Service
    ↓
Process document
    ↓
Return document_id + SHA-256 + metadata
    ↓
Java Backend stores metadata


SEARCH:

User
    ↓
Java Backend
    ↓
Authorization check
    ↓
GET /search?query=<query>
    ↓
Python AI Service
    ↓
Return ranked results
    ↓
Java Backend
    ↓
Return only authorized results to user


INTEGRITY VERIFICATION:

Java Backend
    ↓
POST /verify
    ↓
Python AI Service
    ↓
SHA-256 comparison
    ↓
VERIFIED / TAMPERED
    ↓
Java Backend records result in audit trail


7. RESPONSIBILITY BOUNDARY

PYTHON AI SERVICE:

- PDF processing
- Text extraction
- Chunking
- Embeddings
- Semantic search
- Keyword search
- Hybrid ranking
- SHA-256 verification


JAVA BACKEND:

- Authentication
- JWT
- RBAC
- Case-level authorization
- User management
- Access control
- Audit trail
- Final document access decision


IMPORTANT:

Python determines relevance.

Java determines authority.

The Python service must NOT decide whether a user is authorized to access a document.


8. CURRENT ENDPOINT SUMMARY

GET  /
GET  /health
POST /upload
GET  /documents
GET  /search?query=<query>
POST /verify