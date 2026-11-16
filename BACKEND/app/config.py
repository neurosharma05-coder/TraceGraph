import os
from pathlib import Path

# Root Paths
BACKEND_DIR = Path(__file__).resolve().parent.parent
TRACE_ROOT = BACKEND_DIR.parent
ML_DIR = TRACE_ROOT / "ML"
FRONTEND_DIR = TRACE_ROOT / "FRONTEND"

# Storage & Models
UPLOAD_DIR = BACKEND_DIR / "uploads"
MODELS_DIR = ML_DIR / "models"                        # old models
INDIA_MODELS_DIR = ML_DIR / "models_new" / "models"  # Indian real-data models v2
METRICS_PATH = ML_DIR / "metrics" / "metrics.json"
MODEL_CARD_PATH = MODELS_DIR / "model_card.json"
FIXTURE_PATH = ML_DIR / "fixtures" / "case_001_mule_trail.json"

# Server Settings
HOST = os.getenv("TRACE_BACKEND_HOST", "127.0.0.1")
PORT = int(os.getenv("TRACE_BACKEND_PORT", "8001"))
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "*",
]

# Neo4j Settings (optional — platform works without Neo4j)
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "forensic_password")

# Ensure uploads directory exists
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

