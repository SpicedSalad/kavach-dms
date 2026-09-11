import sys
import types
from pathlib import Path

# Ensure 'ai' module resolves whether run from inside the folder or as a package
current_dir = Path(__file__).resolve().parent
if "ai" not in sys.modules:
    ai_pkg = types.ModuleType("ai")
    ai_pkg.__path__ = [str(current_dir)]
    sys.modules["ai"] = ai_pkg

if str(current_dir.parent) not in sys.path:
    sys.path.insert(0, str(current_dir.parent))
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from fastapi import FastAPI
from ai.nlp.api import app as nlp_app
from ai.ocr.main import app as ocr_app

app = FastAPI(
    title="Unified AI Service",
    description="Combined OCR, Document Intelligence, and Semantic Search Service",
    version="1.0.0",
)


@app.get("/")
def home():
    return {
        "service": "Unified AI Service",
        "status": "running",
        "endpoints": [
            "GET  /health",
            "POST /upload",
            "GET  /documents",
            "GET  /search?query=<query>",
            "POST /verify",
            "POST /ai/process",
        ],
    }


@app.get("/health")
def health():
    from ai.nlp.api import documents, chunks

    return {
        "status": "healthy",
        "service": "Unified AI Service (OCR + Semantic Search)",
        "documents_loaded": len(documents),
        "chunks_loaded": len(chunks),
    }


# Include all endpoints from nlp and ocr, skipping duplicate / and /health
for route in nlp_app.router.routes:
    if route.path not in ["/", "/health"]:
        app.router.routes.append(route)

for route in ocr_app.router.routes:
    if route.path not in ["/", "/health"]:
        app.router.routes.append(route)
