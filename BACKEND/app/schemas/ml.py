from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class IntentPredictRequest(BaseModel):
    text: str = Field(..., example="paisa bhej diya ATM se nikaal le abhi")

class IntentPredictResponse(BaseModel):
    text: str
    intent: str
    confidence: float
    allProbabilities: Dict[str, float]
    latencyMs: float

class MulePredictRequest(BaseModel):
    amount: float = Field(..., example=847000.0)
    oldbalanceOrg: float = Field(..., example=30000.0)
    newbalanceOrig: float = Field(..., example=5000.0)
    oldbalanceDest: float = Field(..., example=20000.0)
    newbalanceDest: float = Field(..., example=60000.0)
    step: int = Field(default=48, example=48)
    type_code: int = Field(default=3, example=3)

class MulePredictResponse(BaseModel):
    isMuleRisk: bool
    muleProbability: float
    riskTier: str
    flags: List[str]
    latencyMs: float

class LinkPredictRequest(BaseModel):
    temporal_overlap: float = Field(..., example=0.88)
    geo_dist_km: float = Field(..., example=12.4)
    phone_jaccard: float = Field(default=0.92, example=0.92)
    ip_overlap: float = Field(default=0.75, example=0.75)
    financial_flow_match: float = Field(default=0.85, example=0.85)
    clock_drift_abs: float = Field(default=0.05, example=0.05)
    entity_sim: float = Field(default=0.90, example=0.90)
    source_count: int = Field(default=3, example=3)

class LinkPredictResponse(BaseModel):
    linkConfidence: float
    verdict: str
    latencyMs: float

class ModelMetricItem(BaseModel):
    name: str
    architecture: str
    dataset: str
    metricType: str
    measuredValue: Optional[float] = None
    targetValue: Optional[float] = None
    status: str = "measured"
    explanation: str

class SystemMetricsResponse(BaseModel):
    framework: str
    version: str
    compliance: str
    totalModels: int
    metrics: List[ModelMetricItem]

