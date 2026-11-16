"""
Indian ML Inference Router — real-time endpoints for all 7 Indian-data trained models.
Base: /ml/india
"""

from typing import Dict, Any, Optional, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.india_ml_bridge import india_ml_bridge

router = APIRouter(prefix="/ml/india", tags=["🇮🇳 Indian ML Models — Real Data"])


# ── Schemas ────────────────────────────────────────────────────────────────────

class IndiaIntentRequest(BaseModel):
    text: str = Field(..., example="paisa bhej diya, ATM se nikaal le abhi", 
                      description="Hinglish / Hindi / English chat message")

class IndiaIntentResponse(BaseModel):
    text: str
    intent: str
    confidence: float
    allProbabilities: Dict[str, float]
    modelVersion: str
    trainingData: str
    source: str
    latencyMs: float


class IndiaMuleRequest(BaseModel):
    volume_mn: float = Field(..., example=14439.73,
                             description="UPI transaction volume in millions for the month")
    value_cr: float = Field(..., example=20637.0,
                            description="UPI transaction value in ₹ Crore for the month")
    month_num: int = Field(default=7, ge=1, le=12,
                           description="Month number (1=Jan, 7=Jul)")
    year: int = Field(default=2024, ge=2019, le=2026)

class IndiaMuleResponse(BaseModel):
    isMuleRisk: bool
    muleProbability: float
    riskTier: str
    flags: List[str]
    upiContext: Dict[str, Any]
    modelVersion: str
    trainingData: str
    latencyMs: float


class IndiaAnomalyRequest(BaseModel):
    features: Dict[str, float] = Field(
        ...,
        example={"debit_amount": 85000.0, "credit_amount": 1000.0,
                 "balance": 2000.0, "txn_count_30d": 45.0},
        description="Bank statement numeric features (any available columns)"
    )

class IndiaAnomalyResponse(BaseModel):
    isAnomaly: bool
    anomalyProbability: float
    severity: str
    featuresEvaluated: int
    modelVersion: str
    trainingData: str
    latencyMs: float


class IndiaNetworkRequest(BaseModel):
    length: float = Field(..., example=1480.0, description="Packet length in bytes")
    ttl: float = Field(default=64.0, example=56.0, description="Time to Live value")
    protocol_code: int = Field(default=6, example=6, description="IP protocol (6=TCP, 17=UDP)")
    src_port: float = Field(default=0.0, example=54321.0)
    dst_port: float = Field(default=80.0, example=22.0)
    pkt_time: float = Field(default=0.0, example=1.234, description="Packet timestamp (relative)")

class IndiaNetworkResponse(BaseModel):
    isAnomaly: bool
    anomalyProbability: float
    attackType: str
    flags: List[str]
    packetFeatures: Dict[str, Any]
    modelVersion: str
    trainingData: str
    latencyMs: float


class IndiaIoTRequest(BaseModel):
    features: Dict[str, float] = Field(
        ...,
        example={
            "flow_duration": 1500000.0, "total_fwd_packets": 10.0,
            "total_bwd_packets": 5.0, "fwd_packet_length_max": 1480.0,
            "bwd_packet_length_max": 60.0, "flow_bytes_per_sec": 9876.5,
            "flow_packets_per_sec": 10.0, "flow_iat_mean": 150000.0,
        },
        description="IoT flow features (any subset of MU-IoT 121 features)"
    )
    protocol_hint: Optional[str] = Field(
        default=None,
        example="MQTT",
        description="IoT protocol hint: MQTT, CoAP, AMQP, STOMP, HTTP"
    )

class IndiaIoTResponse(BaseModel):
    isIntrusion: bool
    attackType: str
    confidence: float
    severity: str
    iotProtocol: str
    featuresProvided: int
    modelVersion: str
    trainingData: str
    latencyMs: float


class IndiaCCTVRequest(BaseModel):
    image_path: str = Field(..., example="/tmp/frame_001.jpg",
                            description="Absolute path to image file on server")

class IndiaCCTVResponse(BaseModel):
    detections: List[Dict[str, Any]]
    objectCount: int
    personsDetected: int
    vehiclesDetected: int
    modelVersion: str
    trainingData: str
    note: Optional[str] = None
    latencyMs: float


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.get("/status")
def india_model_status():
    """Returns load status and SHA-256 info for all 7 Indian models."""
    return india_ml_bridge.model_status()


@router.post("/predict/intent", response_model=IndiaIntentResponse)
def predict_intent_india(req: IndiaIntentRequest):
    """
    Classifies Hinglish/Hindi chat message intent using PoliWAM-trained TF-IDF v2 + LR.
    Training: 3,848 real WhatsApp messages from IIT Gandhinagar (2019 Indian elections).
    """
    result = india_ml_bridge.predict_intent_india(req.text)
    return IndiaIntentResponse(**result)


@router.post("/predict/mule", response_model=IndiaMuleResponse)
def predict_mule_india(req: IndiaMuleRequest):
    """
    Scores UPI mule risk using NPCI official statistics-trained LightGBM.
    Training: 69 months real NPCI data (Apr 2019 – Dec 2024).
    Flags structuring, velocity spikes, fiscal year patterns.
    """
    result = india_ml_bridge.predict_mule_india(
        volume_mn=req.volume_mn,
        value_cr=req.value_cr,
        month_num=req.month_num,
        year=req.year,
    )
    return IndiaMuleResponse(**result)


@router.post("/predict/anomaly", response_model=IndiaAnomalyResponse)
def predict_financial_anomaly(req: IndiaAnomalyRequest):
    """
    Detects anomalous bank statement transactions using IsolationForest.
    Training: AgamiAI/Indian-Bank-Statements (HuggingFace), Indian current accounts.
    """
    result = india_ml_bridge.predict_financial_anomaly(req.features)
    return IndiaAnomalyResponse(**result)


@router.post("/predict/network", response_model=IndiaNetworkResponse)
def predict_network_anomaly(req: IndiaNetworkRequest):
    """
    Classifies network packet as normal or attack using VIT Bhopal-trained Random Forest.
    Training: 600K real Wireshark PCAP packets, 7 attack types (VIT Bhopal Mendeley).
    """
    result = india_ml_bridge.predict_network_anomaly(
        length=req.length,
        ttl=req.ttl,
        protocol_code=req.protocol_code,
        src_port=req.src_port,
        dst_port=req.dst_port,
        pkt_time=req.pkt_time,
    )
    return IndiaNetworkResponse(**result)


@router.post("/predict/iot", response_model=IndiaIoTResponse)
def predict_iot_intrusion(req: IndiaIoTRequest):
    """
    Multi-class IoT intrusion detection using MU-IoT-trained LightGBM.
    Training: Manipur University, 393K samples, 16 attack types (MQTT/CoAP/AMQP/STOMP).
    """
    result = india_ml_bridge.predict_iot_intrusion(req.features)
    return IndiaIoTResponse(**result)


@router.post("/predict/cctv", response_model=IndiaCCTVResponse)
def predict_cctv(req: IndiaCCTVRequest):
    """
    Object detection on CCTV frame using YOLOv8n COCO pretrained weights.
    Detects: person, car, motorcycle, truck, bus + 75 COCO classes.
    Fine-tuning on Snatch 1.0 pending (Zenodo blocked from Colab IP).
    """
    result = india_ml_bridge.predict_cctv(req.image_path)
    if "error" in result and "detections" not in result:
        raise HTTPException(status_code=422, detail=result["error"])
    return IndiaCCTVResponse(**result)


# ── §7 GNN Link Scoring ───────────────────────────────────────────────────────

class IndiaGNNLinkRequest(BaseModel):
    features_u: List[float] = Field(
        ..., min_items=1, max_items=16,
        example=[0.85, 1.0, 0.72, 0.6, 0.0, 1.0, 0.0, 0.5, 0.3, 0.9, 0.1, 0.0, 1.0, 0.0, 0.5, 0.8],
        description="16 forensic features for node U (evidence entity A)"
    )
    features_v: List[float] = Field(
        ..., min_items=1, max_items=16,
        example=[0.80, 1.0, 0.68, 0.5, 0.0, 1.0, 0.0, 0.4, 0.3, 0.9, 0.1, 0.0, 1.0, 0.0, 0.4, 0.75],
        description="16 forensic features for node V (evidence entity B)"
    )

class IndiaGNNLinkResponse(BaseModel):
    linkProbability: float
    isLinked: bool
    riskLevel: str
    nodeUFeatures: List[float]
    nodeVFeatures: List[float]
    modelVersion: str
    trainingData: str
    source: str
    latencyMs: float


@router.post("/predict/link-india", response_model=IndiaGNNLinkResponse)
def predict_gnn_link(req: IndiaGNNLinkRequest):
    """
    Scores the probability that two evidence nodes are forensically linked.
    Uses GraphSAGE (16-feature, 2-layer, hidden=64) trained on Indian case graph topology.
    Falls back to cosine similarity when torch_geometric is unavailable.

    Feature order (16 dims):
      temporal_overlap, geo_distance_norm, phone_jaccard, upi_jaccard,
      shared_account, shared_device, shared_ip, call_freq_norm,
      msg_freq_norm, payment_freq_norm, same_district, same_state,
      bank_match, operator_match, crime_type_match, prior_case_link
    """
    result = india_ml_bridge.predict_gnn_link(req.features_u, req.features_v)
    return IndiaGNNLinkResponse(**result)
