FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8002

COPY pyproject.toml .
RUN pip install --no-cache-dir .

COPY . .

EXPOSE 8002

CMD ["uvicorn", "tracegraph_ml.serve.api:app", "--host", "0.0.0.0", "--port", "8002"]

