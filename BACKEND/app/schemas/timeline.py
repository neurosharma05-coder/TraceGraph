from typing import Optional, List
from pydantic import BaseModel

class TimelineEvent(BaseModel):
    id: str
    timestampUtc: str
    rawTimestamp: str
    sourceCategory: str
    eventTitle: str
    details: str
    location: str
    driftCorrected: str
    uncertaintyWindow: str
    flagged: Optional[bool] = False
    gapFollows: Optional[bool] = False
    gapDuration: Optional[str] = None
    timeTrust: Optional[float] = 0.95
    correctionMethod: Optional[str] = "Plaso + Robust Median Estimator"
    correctionNotes: Optional[str] = None
    entities: Optional[List[str]] = None
    sourceFile: Optional[str] = None
    sourceHash: Optional[str] = None
    conflictEventId: Optional[str] = None
    conflictReason: Optional[str] = None
    orderUncertainWith: Optional[str] = None

class TimelineResponse(BaseModel):
    caseId: str
    totalEvents: int
    medianClockOffsetSec: float
    timeTrustAvg: float
    events: List[TimelineEvent]

