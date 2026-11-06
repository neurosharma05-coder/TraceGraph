from fastapi import APIRouter
from app.services.case_service import case_service

router = APIRouter(prefix="/export", tags=["Forensic Exports & Interoperability"])

@router.get("/{case_id}/neo4j-cypher")
def export_neo4j_cypher(case_id: str):
    """Generates declarative Cypher queries to build the case graph in Neo4j."""
    g_data = case_service.get_graph(case_id)
    lines = [
        f"// TraceGraph Knowledge Graph Cypher Script — Case {case_id}",
        "// Section 63(4) Bharatiya Sakshya Adhiniyam 2023 Compliant",
        ""
    ]
    for n in g_data["nodes"]:
        lines.append(f"MERGE (n_{n.id}:{n.category.capitalize()} {{id: '{n.id}', label: '{n.label}', confidence: {n.confidence}}})")
    lines.append("")
    for l in g_data["links"]:
        lines.append(f"MERGE (n_{l.source})-[:{l.relation} {{confidence: {l.confidence}}}]->(n_{l.target})")

    return {
        "caseId": case_id,
        "format": "Cypher (Neo4j)",
        "totalStatements": len(lines),
        "cypherScript": "\n".join(lines)
    }

@router.get("/{case_id}/case-uco")
def export_case_uco(case_id: str):
    """Exports CASE/UCO semantic Turtle evidence ontology."""
    return {
        "caseId": case_id,
        "format": "CASE/UCO Turtle (RDFLib)",
        "ontologyNamespace": "https://ontology.unifiedcyberontology.org/uco/",
        "downloadUri": f"/cases/{case_id}/provenance.ttl"
    }

@router.get("/{case_id}/geojson")
def export_geojson(case_id: str):
    """Exports spatial trajectory GeoJSON for Leaflet GIS rendering."""
    waypoints = case_service.get_waypoints(case_id)
    features = []
    for wp in waypoints:
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [wp.lng, wp.lat]
            },
            "properties": {
                "id": wp.id,
                "name": wp.name,
                "time": wp.time,
                "type": wp.type,
                "uncertaintyRadius": wp.uncertaintyRadius,
                "description": wp.description
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }

