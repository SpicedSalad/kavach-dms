FROM python:3.12-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

COPY ai/ocr/requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

RUN python -m spacy download en_core_web_sm

COPY ai/ocr ./ai/ocr

RUN touch ./ai/__init__.py

EXPOSE 8000

CMD ["uvicorn", "ai.ocr.main:app", "--host", "0.0.0.0", "--port", "8000"]