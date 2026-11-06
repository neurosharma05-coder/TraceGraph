"""
Neo4j Knowledge Graph Exporter & Cypher Generator (Anubhav Sharma).
Converts CaseOutputs (Entities, Events, Scored Links) into idempotent Cypher queries
for Neo4j Graph Database ingestion.
"""

from typing import List
from tracegraph_ml.schemas import CaseOutputs

def generate_cypher_statements(outputs: CaseOutputs) -> List[str]:
    """Generate Cypher commands to build the Case Knowledge Graph in Neo4j."""
    queries = []
    
    # 1. Unique Constraints & Indices
    queries.append("CREATE CONSTRAINT IF NOT EXISTS FOR (c:Case) REQUIRE c.id IS UNIQUE;")
    queries.append("CREATE CONSTRAINT IF NOT EXISTS FOR (e:Entity) REQUIRE e.id IS UNIQUE;")
    queries.append("CREATE CONSTRAINT IF NOT EXISTS FOR (ev:Event) REQUIRE ev.id IS UNIQUE;")
    
    # 2. Case Node
    queries.append(f"MERGE (c:Case {{id: '{outputs.caseId}', title: 'Operation Mule Trail', status: 'ACTIVE'}});")
    
    # 3. Entity Nodes
    for ent in outputs.entities:
        aliases_str = str(ent.aliases).replace("'", '"')
        queries.append(
            f"MERGE (e:Entity {{id: '{ent.id}'}}) "
            f"SET e.name = '{ent.name}', e.category = '{ent.category}', "
            f"e.caseCount = {ent.caseCount}, e.riskScore = {ent.riskScore or 0.0}, "
            f"e.aliases = {aliases_str};"
        )
        queries.append(f"MATCH (c:Case {{id: '{outputs.caseId}'}}), (e:Entity {{id: '{ent.id}'}}) MERGE (c)-[:CONTAINS_ENTITY]->(e);")
        
    # 4. Scored Knowledge Graph Links
    for lk in outputs.links:
        queries.append(
            f"MATCH (a:Entity {{id: '{lk.source}'}}), (b:Entity {{id: '{lk.target}'}}) "
            f"MERGE (a)-[r:ASSOCIATED_WITH {{id: '{lk.id}'}}]->(b) "
            f"SET r.relation = '{lk.relation}', r.confidence = {lk.confidence}, "
            f"r.scoreMethod = '{lk.scoreMethod}', r.state = '{lk.state}', r.reason = '{lk.reason}';"
        )
        
    # 5. Timeline Events
    for ev in outputs.events:
        queries.append(
            f"MERGE (ev:Event {{id: '{ev.id}'}}) "
            f"SET ev.timestampUtc = '{ev.timestampUtc}', ev.title = '{ev.eventTitle}', "
            f"ev.sourceCategory = '{ev.sourceCategory}', ev.driftSeconds = {ev.driftSeconds}, "
            f"ev.timeTrust = {ev.timeTrust};"
        )
        queries.append(f"MATCH (c:Case {{id: '{outputs.caseId}'}}), (ev:Event {{id: '{ev.id}'}}) MERGE (c)-[:HAS_EVENT]->(ev);")
        
    return queries

