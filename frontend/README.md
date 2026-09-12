# KavachDMS Frontend

Secure Digital Evidence & Investigation Document Management System web interface built with React, Vite, and Tailwind CSS. Fully integrated with the Spring Boot core backend and FastAPI AI Intelligence service.

---

## 🚀 Running Workarounds & Deployment

### Option A: Local Development (Workaround for Laptop Without Docker)

You can run each service natively on your machine without Docker:

#### 1. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will launch at `http://localhost:5173`.
- **Vite Proxy**: Automatically proxies `/api` and `/auth` to `http://localhost:8080` and `/ai-api` to `http://localhost:8000`.
- **Offline / Demo Mode**: If backend or AI servers are not yet started, the UI automatically offers interactive demo mode and displays clear connection badges in the top header.

#### 2. Start Core Backend (Optional / when ready)
```bash
cd backend
./mvnw spring-boot:run
```
Runs on `http://localhost:8080`.

#### 3. Start AI Service (Optional / when ready)
```bash
cd ai
pip install -r requirements.txt
uvicorn main:app --port 8000 --reload
```
Runs on `http://localhost:8000`.

---

### Option B: Docker Compose (For Laptop with Docker)

To run the entire unified stack (MinIO + Core Backend + AI Service + Frontend) in one command:

```bash
docker compose up --build
```

- **Frontend Application**: `http://localhost:3000`
- **Core Backend REST API**: `http://localhost:8080`
- **Unified AI Engine (OCR + Semantic Search)**: `http://localhost:8000`
- **MinIO Object Storage Console**: `http://localhost:9001` (Credentials: `minioadmin` / `minioadmin`)

---

## 🛡️ Connected Features

| Feature Area | Backend / AI Endpoint | Frontend UI Access |
|---|---|---|
| **Officer Authentication** | `POST /auth/login` | `/login` (with 1-click test presets) |
| **Investigation Cases** | `GET /api/cases`, `POST /api/cases` | `/cases`, Dashboard "New Investigation Case" modal |
| **Case Team (ABAC)** | `GET/POST /api/case-members` | `/cases/:id` -> "Assigned Team" tab |
| **Documents & Upload** | `GET /api/documents`, `POST /api/documents/{id}/upload` | `/documents`, "Upload Case Document" modal |
| **Document Versions** | `GET /api/document-versions` | `/documents` -> Expanded Document Row |
| **Physical Evidence** | `GET /api/evidence`, `POST /api/evidence` | `/evidence`, "Register Physical Evidence" modal |
| **Chain of Custody** | `GET/POST /api/custody-events` | `/evidence` -> "Log Transfer" modal & Custody Timeline |
| **AI Semantic Search** | `GET /search?query=...` | `/search` -> "AI Semantic Search" tab |
| **AI OCR & Classification**| `POST /ai/process` | Header "AI Scanner" button & Document upload flow |
| **Tamper Verification** | `POST /verify` | Header "Tamper Verifier" & `/search` -> "Verifier" tab |
| **Security Audit Logs** | `GET /api/audit-events` | `/audit` Activity log |
