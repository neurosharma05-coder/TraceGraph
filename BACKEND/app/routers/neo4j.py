from fastapi import APIRouter
from app.services.neo4j_service import neo4j_service

router = APIRouter(prefix="/neo4j", tags=["Neo4j"])


@router.get("/status")
def get_neo4j_status():
    """Returns Neo4j connection status and URI."""
    return neo4j_service.get_status()


@router.post("/sync/{case_id}")
def manual_sync(case_id: str):
    """Manually trigger a full graph sync to Neo4j for a given case."""
    from app.services.case_service import case_service
    result = neo4j_service.bulk_sync_graph(
        case_id=case_id,
        nodes=case_service.graph_nodes,
        links=case_service.graph_links,
        events=case_service.timeline_events,
    )
    return result

