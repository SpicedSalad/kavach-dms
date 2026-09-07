# KavachDMS

## Secure Digital Document Management System for Legal and Investigation Documents

KavachDMS is a centralized, access-controlled digital platform for managing
sensitive legal and investigation documents and evidence.

The system combines:

- Role-Based Access Control (RBAC)
- Attribute-Based Access Control (ABAC)
- SHA-256 document integrity verification
- Digital signatures
- Blockchain-backed integrity records
- Tamper-evident audit trails
- OCR and intelligent document processing
- NLP-based metadata and classification
- Semantic + keyword search
- Digital identity for evidence assets

## Technology Stack

### Frontend
- React.js / Next.js
- Tailwind CSS

### Backend
- Java Spring Boot
- REST APIs
- Spring Security

### Database & Storage
- PostgreSQL
- MinIO

### AI/ML
- OCR
- NLP
- Metadata extraction
- Semantic + keyword search

### Blockchain
- Hyperledger Fabric
- Java Chaincode
- Fabric Gateway

### Infrastructure
- Docker
- Message Queue
- Load Balancing
- GitHub Actions CI/CD

## Project Structure

```text
kavach-dms/
├── frontend/
├── backend/
├── ai/
│   ├── ocr/
│   └── nlp/
├── blockchain/
├── infrastructure/
├── docs/
└── .github/
    └── workflows/