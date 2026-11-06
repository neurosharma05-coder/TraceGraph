from typing import Optional, List, Dict, Any, Literal
from pydantic import BaseModel

class GraphNode(BaseModel):
    id: str
    label: str
    category: Literal['suspect', 'phone', 'bank', 'cctv', 'ip', 'location']
    details: str
    confidence: float
    sourceFile: str
    x: float = 100.0
    y: float = 100.0
    caseCount: Optional[int] = None
    riskScore: Optional[float] = None
    cluster: Optional[str] = None
    clusterLabel: Optional[str] = None
    mergedFrom: Optional[List[str]] = None
    otherCases: Optional[List[str]] = None

class ConflictDetail(BaseModel):
    relation: str
    reason: str

class SourceEventRef(BaseModel):
    id: str
    title: str
    time: str

class NerSnippet(BaseModel):
    text: str
    span: str

class CctvThumbnail(BaseModel):
    frameId: str
    camera: str
    time: str
    matchScore: float

class GraphLink(BaseModel):
    source: str
    target: str
    relation: str
    confidence: float
    reason: str
    verified: bool = False
    state: Optional[Literal['confirmed', 'scored', 'proposed', 'hypothesis_only', 'rejected']] = 'scored'
    scoreMethod: Optional[str] = "GNN GraphSAGE + Platt Calibrated RF"
    modelVersion: Optional[str] = "v3.4.1"
    conflicts: Optional[List[ConflictDetail]] = None
    sourceEvents: Optional[List[SourceEventRef]] = None
    nerSnippet: Optional[NerSnippet] = None
    cctvThumbnail: Optional[CctvThumbnail] = None

class CytoscapeElement(BaseModel):
    data: Dict[str, Any]

class KnowledgeGraphResponse(BaseModel):
    caseId: str
    nodeCount: int
    edgeCount: int
    nodes: List[GraphNode]
    links: List[GraphLink]
    cytoscapeElements: List[CytoscapeElement]

