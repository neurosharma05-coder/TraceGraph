"""
TraceGraph Dedicated Forensic Backend API
Team: def build() · SUTRAM 2026 · Problem Statement 03

Orchestrates communication between:
- FRONTEND (Next.js / React at localhost:3000)
- ML SERVICES (PyTorch GNN, LightGBM, Random Forest, spaCy at TRACE/ML)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS
from app.routers import (
    cases_router,
    evidence_router,
    analysis_router,
    ml_router,
    audit_router,
    export_router,
    neo4j_router,
    india_ml_router
)

app = FastAPI(
    title="TraceGraph Forensic Intelligence Backend",
    version="3.5.0",
    description="Dedicated Backend Orchestrator connecting Next.js UI with PyTorch GNN, LightGBM, and Section 63(4) BSA Audit Engine. v3.5: Indian real-data models integrated.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Subsystems
app.include_router(cases_router)
app.include_router(evidence_router)
app.include_router(analysis_router)
app.include_router(ml_router)
app.include_router(audit_router)
app.include_router(export_router)
app.include_router(neo4j_router)
app.include_router(india_ml_router)

@app.get("/")
def root():
    return {
        "service": "TraceGraph Forensic Backend API",
        "version": "v3.5.0",
        "docsUrl": "/docs",
        "redocUrl": "/redoc",
        "healthUrl": "/health",
        "status": "online"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "TraceGraph Backend Orchestrator",
        "version": "v3.5.0",
        "subsystems": {
            "evidenceStore": "active",
            "mlBridge": "active",
            "indiaMLBridge": "active",
            "auditEngine": "active",
            "graphService": "active"
        },
        "legalCompliance": "Section 63(4) Bharatiya Sakshya Adhiniyam 2023",
        "indianModels": "v3.5.0 — 7 real-data models (PoliWAM, NPCI, AgamiAI, VIT Bhopal, MU-IoT, YOLOv8n, GNN-India)"
    }

