from typing import List, Dict, Any
from fastapi import APIRouter
from app.schemas.timeline import TimelineResponse, TimelineEvent
from app.schemas.graph import KnowledgeGraphResponse
from app.schemas.analysis import GeoWaypoint, ConflictItem, TheoryModel, EntityCluster, CrossCaseRecord
from app.services.case_service import case_service

router = APIRouter(prefix="/cases/{case_id}/analysis", tags=["Forensic Analysis & Correlation"])

@router.get("/timeline", response_model=TimelineResponse)
def get_timeline(case_id: str):
    """Retrieves normalized super-timeline with Time-Trust drift corrections."""
    events = case_service.get_timeline(case_id)
    return TimelineResponse(
        caseId=case_id,
        totalEvents=len(events),
        medianClockOffsetSec=-252.0,
        timeTrustAvg=0.925,
        events=events
    )

@router.get("/graph", response_model=KnowledgeGraphResponse)
def get_knowledge_graph(case_id: str):
    """Retrieves knowledge graph nodes, links, and Cytoscape.js visual schema."""
    g_data = case_service.get_graph(case_id)
    return KnowledgeGraphResponse(**g_data)

@router.get("/feasibility", response_model=List[ConflictItem])
def get_feasibility_conflicts(case_id: str):
    """Retrieves impossible-travel (>300 km/h) and velocity conflict items."""
    return case_service.get_conflicts(case_id)

@router.get("/hypotheses", response_model=List[TheoryModel])
def get_competing_hypotheses(case_id: str):
    """Retrieves beam-search ranked competing hypotheses (Theory Alpha vs Beta)."""
    return case_service.get_theories(case_id)

@router.get("/waypoints", response_model=List[GeoWaypoint])
def get_spatial_waypoints(case_id: str):
    """Retrieves spatial GPS/CCTV/Tower coordinates for Leaflet GIS mapping."""
    return case_service.get_waypoints(case_id)

@router.get("/entities", response_model=List[EntityCluster])
def get_entity_clusters(case_id: str):
    """Retrieves multi-modal entity resolution clusters and linked aliases."""
    return case_service.get_entities(case_id)

@router.get("/cross-case", response_model=List[CrossCaseRecord])
def get_cross_case_records(case_id: str):
    """Retrieves cross-FIR and interstate intelligence hits."""
    return case_service.get_cross_case(case_id)

@router.get("/chats", response_model=List[Dict[str, Any]])
def get_chat_records(case_id: str):
    """Retrieves NLP NER Hinglish chat mentions."""
    return case_service.get_chats(case_id)

@router.get("/cctv", response_model=List[Dict[str, Any]])
def get_cctv_records(case_id: str):
    """Retrieves computer-vision ANPR biometric matches."""
    return case_service.get_cctv(case_id)

