FROM python:3.12-slim

WORKDIR /app

COPY ai/nlp/requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY ai/nlp ./ai/nlp

RUN touch ./ai/__init__.py

EXPOSE 8000

CMD ["uvicorn", "ai.nlp.api:app", "--host", "0.0.0.0", "--port", "8000"]
