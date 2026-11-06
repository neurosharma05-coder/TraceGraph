"""
Pydantic schemas mirroring the frontend TypeScript types in TRACE/FRONTEND/src/types/forensics.ts.
Validated in CI and run_case pipeline.
"""

from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field

class TimeCorrection(BaseModel):
    method: Literal['peer_alignment', 'tz_normalised', 'ntp_offset', 'none']
    offsetSeconds: float
    notes: Optional[str] = None

class TraceEvent(BaseModel):
    id: str
    timestampUtc: str
    rawTimestamp: str
    sourceCategory: Literal['cctv', 'mobile', 'bank', 'cyber', 'travel', 'network', 'forensic']
    eventTitle: str
    details: str
    location: Optional[str] = None
    driftSeconds: float = 0.0
    uncertaintySeconds: float = 0.0
    timeTrust: float = Field(default=1.0, ge=0.0, le=1.0)
    timeCorrection: Optional[TimeCorrection] = None
    entities: List[str] = Field(default_factory=list)
    sourceFile: Optional[str] = None
    sourceHash: Optional[str] = None
    flagged: bool = False
    conflictReason: Optional[str] = None

class FeasibilityFlag(BaseModel):
    id: str
    eventAId: str
    eventBId: str
    distanceKm: float
    timeDiffMinutes: float
    requiredVelocityKmh: float
    verdict: Literal['feasible', 'unlikely', 'impossible']
    explanation: str

class FeatureWeight(BaseModel):
    name: str
    weight: float

class Link(BaseModel):
    id: str
    source: str
    target: str
    relation: str
    confidence: float = Field(ge=0.0, le=1.0)
    scoreMethod: Literal['gnn', 'rf_ensemble', 'rule']
    modelVersion: str
    state: Literal['proposed', 'scored', 'confirmed', 'in_reconstruction', 'hypothesis_only']
    reason: str
    features: List[FeatureWeight] = Field(default_factory=list)

class Entity(BaseModel):
    id: str
    name: str
    category: Literal['suspect', 'phone', 'cctv', 'bank', 'ip', 'vehicle', 'location']
    aliases: List[str] = Field(default_factory=list)
    caseCount: int = 1
    riskScore: Optional[float] = None
    clusterId: Optional[int] = None
    centrality: Optional[float] = None

class ScoreDelta(BaseModel):
    linkId: str
    label: str
    delta: float
    reason: str

class Hypothesis(BaseModel):
    id: str
    name: str
    tag: str
    probability: float
    rank: int
    corePremise: str
    supportingLinkIds: List[str] = Field(default_factory=list)
    contradictingLinkIds: List[str] = Field(default_factory=list)
    scoreBreakdown: List[ScoreDelta] = Field(default_factory=list)
    falsificationCondition: str

class Gap(BaseModel):
    id: str
    hypothesisId: str
    title: str
    expectedSource: str
    suggestedSource: str
    severity: Literal['CRITICAL_GAP', 'EVIDENTIARY_HOLE', 'SECONDARY_CORROBORATION']
    expectedScoreGain: float
    explanation: str
    requisitioned: bool = False

class NerSpan(BaseModel):
    text: str
    category: str
    linkedNodeId: Optional[str] = None

class NerMention(BaseModel):
    id: str
    timestamp: str
    sender: str
    senderRole: str
    text: str
    language: Literal['English', 'Hindi', 'Hinglish']
    intent: Literal['Extortion Demand', 'Mule Instruction', 'Meeting Setup', 'Concealment', 'General']
    entities: List[NerSpan] = Field(default_factory=list)

class CctvDetection(BaseModel):
    id: str
    cameraName: str
    timestamp: str
    detectedPlate: Optional[str] = None
    vehicleType: Optional[str] = None
    facialVectorScore: Optional[float] = None
    confidence: float
    suspectMatchId: Optional[str] = None
    status: Literal['verified', 'unconfirmed', 'rejected']

class FinancialFlow(BaseModel):
    stageId: str
    timestamp: str
    sourceAccount: str
    targetAccount: str
    amountInr: float
    pattern: Literal['rapid_pass_through', 'fan_out', 'fan_in', 'layering', 'cash_out']
    muleRiskScore: float
    description: str

class CrossCaseHit(BaseModel):
    id: str
    entityIdentifier: str
    entityType: str
    matchedCaseFir: str
    policeStation: str
    state: str
    similarityScore: float
    coOccurrenceCount: int

class ModelMetric(BaseModel):
    metricName: str
    category: str
    status: Literal['measured', 'target_only']
    value: Optional[float] = None
    unit: Optional[str] = None
    benchmarkTarget: Optional[str] = None
    dataset: Optional[str] = None

class CaseOutputs(BaseModel):
    caseId: str
    events: List[TraceEvent]
    entities: List[Entity]
    links: List[Link]
    feasibilityFlags: List[FeasibilityFlag]
    hypotheses: List[Hypothesis]
    gaps: List[Gap]
    nerMentions: List[NerMention]
    cctvDetections: List[CctvDetection]
    financialFlows: List[FinancialFlow]
    crossCaseHits: List[CrossCaseHit]
    metrics: List[ModelMetric]

