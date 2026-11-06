from typing import Optional, List, Dict, Any, Literal
from pydantic import BaseModel

class GeoWaypoint(BaseModel):
    id: str
    name: str
    time: str
    type: Literal['cctv', 'cell_tower', 'bank_atm', 'meeting']
    lat: float
    lng: float
    uncertaintyRadius: str
    source: str
    description: str

class ConflictEventSide(BaseModel):
    label: str
    location: str
    time: str
    source: str

class CompetingHypothesisSummary(BaseModel):
    id: str
    title: str
    probability: float
    explanation: str

class ConflictItem(BaseModel):
    id: str
    title: str
    eventA: ConflictEventSide
    eventB: ConflictEventSide
    distanceKm: float
    timeDiffMinutes: float
    requiredVelocityKmh: float
    status: Literal['flagged', 'resolved', 'investigating']
    resolutionNote: Optional[str] = None
    competingHypotheses: List[CompetingHypothesisSummary]

class EntityIdentifier(BaseModel):
    type: Literal['phone', 'imei', 'bank_kyc', 'alias', 'face']
    label: str
    value: str
    source: str

class EntityCluster(BaseModel):
    id: str
    canonicalName: str
    role: str
    matchScore: float
    status: Literal['merged', 'candidate']
    identifiers: List[EntityIdentifier]

class CrossCaseRecord(BaseModel):
    id: str
    matchedIdentifier: str
    identifierType: str
    firNumber: str
    agency: str
    offenseType: str
    dateLogged: str
    syndicateName: str
    matchConfidence: float

class EvidencePoint(BaseModel):
    point: str
    source: str
    weight: str

class ScoreBreakdown(BaseModel):
    linkId: str
    label: str
    delta: float
    reason: str

class EventSequenceItem(BaseModel):
    id: str
    time: str
    title: str
    lane: str

class ConflictsBlockItem(BaseModel):
    id: str
    title: str
    details: str
    type: Literal['feasibility', 'contradiction']

class TheoryModel(BaseModel):
    id: str
    name: str
    tag: str
    probability: float
    corePremise: str
    corroboratingEvidence: List[EvidencePoint]
    refutingEvidence: List[EvidencePoint]
    falsificationCondition: str
    scoreBreakdown: Optional[List[ScoreBreakdown]] = None
    eventSequence: Optional[List[EventSequenceItem]] = None
    conflictsBlock: Optional[List[ConflictsBlockItem]] = None
    differingLinks: Optional[List[str]] = None

