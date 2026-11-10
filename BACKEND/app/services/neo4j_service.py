import os
import logging
from typing import Optional, List, Any

logger = logging.getLogger("tracegraph.neo4j")

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "forensic_password")


class Neo4jService:
    """
    Thin wrapper around the neo4j Python driver.
    All public methods are no-ops if the driver could not connect.
    """

    def __init__(self):
        self._driver = None
        self._connected = False
        self._try_connect()

    def _try_connect(self):
        try:
            from neo4j import GraphDatabase, exceptions as neo_exc
            driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
            driver.verify_connectivity()
            self._driver = driver
            self._connected = True
            logger.info(f"[Neo4j] Connected → {NEO4J_URI}")
            self._ensure_constraints()
        except Exception as e:
            logger.warning(f"[Neo4j] Not connected (offline mode active): {e}")
            self._connected = False

    @property
    def connected(self) -> bool:
        return self._connected

    def _ensure_constraints(self):
        """Create uniqueness constraints on first connect."""
        queries = [
            "CREATE CONSTRAINT tracegraph_node_id IF NOT EXISTS FOR (n:ForensicNode) REQUIRE n.id IS UNIQUE",
            "CREATE CONSTRAINT tracegraph_case_id IF NOT EXISTS FOR (c:Case) REQUIRE c.id IS UNIQUE",
        ]
        with self._driver.session() as session:
            for q in queries:
                try:
                    session.run(q)
                except Exception:
                    pass

    def merge_case(self, case_id: str, case_number: str, title: str, status: str):
        """MERGE a Case node."""
        if not self._connected:
            return
        try:
            with self._driver.session() as session:
                session.run(
                    """
                    MERGE (c:Case {id: $id})
                    SET c.caseNumber = $caseNumber,
                        c.title = $title,
                        c.status = $status,
                        c.updatedAt = datetime()
                    """,
                    id=case_id,
                    caseNumber=case_number,
                    title=title,
                    status=status,
                )
        except Exception as e:
            logger.warning(f"[Neo4j] merge_case error: {e}")

    def merge_node(self, case_id: str, node_id: str, label: str, category: str, confidence: float, details: str = ""):
        """MERGE a ForensicNode and link it to its Case."""
        if not self._connected:
            return
        try:
            with self._driver.session() as session:
                session.run(
                    """
                    MERGE (n:ForensicNode {id: $id})
                    SET n.label = $label,
                        n.category = $category,
                        n.confidence = $confidence,
                        n.details = $details,
                        n.updatedAt = datetime()
                    WITH n
                    MATCH (c:Case {id: $caseId})
                    MERGE (c)-[:HAS_NODE]->(n)
                    """,
                    id=node_id,
                    label=label,
                    category=category,
                    confidence=confidence,
                    details=details,
                    caseId=case_id,
                )
        except Exception as e:
            logger.warning(f"[Neo4j] merge_node error: {e}")

    def merge_link(self, source_id: str, target_id: str, relation: str, confidence: float, reason: str = ""):
        """MERGE a directed relationship between two ForensicNodes."""
        if not self._connected:
            return
        try:
            with self._driver.session() as session:
                session.run(
                    """
                    MATCH (a:ForensicNode {id: $src})
                    MATCH (b:ForensicNode {id: $dst})
                    MERGE (a)-[r:FORENSIC_LINK {relation: $relation}]->(b)
                    SET r.confidence = $confidence,
                        r.reason = $reason,
                        r.updatedAt = datetime()
                    """,
                    src=source_id,
                    dst=target_id,
                    relation=relation,
                    confidence=confidence,
                    reason=reason,
                )
        except Exception as e:
            logger.warning(f"[Neo4j] merge_link error: {e}")

    def merge_timeline_event(self, case_id: str, event_id: str, title: str, category: str, timestamp: str, location: str = ""):
        """MERGE a TimelineEvent node linked to its Case."""
        if not self._connected:
            return
        try:
            with self._driver.session() as session:
                session.run(
                    """
                    MERGE (e:TimelineEvent {id: $id})
                    SET e.title = $title,
                        e.category = $category,
                        e.timestamp = $timestamp,
                        e.location = $location,
                        e.updatedAt = datetime()
                    WITH e
                    MATCH (c:Case {id: $caseId})
                    MERGE (c)-[:HAS_EVENT]->(e)
                    """,
                    id=event_id,
                    title=title,
                    category=category,
                    timestamp=timestamp,
                    location=location,
                    caseId=case_id,
                )
        except Exception as e:
            logger.warning(f"[Neo4j] merge_timeline_event error: {e}")

    def bulk_sync_graph(self, case_id: str, nodes: List[Any], links: List[Any], events: List[Any]):
        """
        Full graph sync: push all nodes, links, and events for a case into Neo4j.
        Called at the end of run_pipeline().
        """
        if not self._connected:
            logger.info("[Neo4j] Skipping bulk_sync — not connected.")
            return {"synced": False, "reason": "Neo4j offline"}

        node_count = 0
        link_count = 0
        event_count = 0

        for n in nodes:
            self.merge_node(case_id, n.id, n.label, n.category, n.confidence, getattr(n, "details", ""))
            node_count += 1

        for lk in links:
            self.merge_link(lk.source, lk.target, lk.relation, lk.confidence, getattr(lk, "reason", ""))
            link_count += 1

        for ev in events:
            self.merge_timeline_event(case_id, ev.id, ev.eventTitle, ev.sourceCategory, ev.timestampUtc, getattr(ev, "location", "") or "")
            event_count += 1

        logger.info(f"[Neo4j] Synced case {case_id}: {node_count} nodes, {link_count} links, {event_count} events")
        return {
            "synced": True,
            "nodesSynced": node_count,
            "linksSynced": link_count,
            "eventsSynced": event_count,
        }

    def get_status(self) -> dict:
        return {
            "connected": self._connected,
            "uri": NEO4J_URI,
            "user": NEO4J_USER,
        }

    def close(self):
        if self._driver:
            self._driver.close()


# Singleton
neo4j_service = Neo4jService()

