-- TraceGraph PostgreSQL Metadata Store Schema
-- Section 63(4) BSA Compliant Read-Only Evidence Tables

CREATE TABLE IF NOT EXISTS evidence_artifacts (
    id UUID PRIMARY KEY,
    case_id VARCHAR(64) NOT NULL,
    source_type VARCHAR(32) NOT NULL,
    original_uri TEXT NOT NULL,
    sha256_hash CHAR(64) NOT NULL,
    ingested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    parent_hash CHAR(64),
    is_sealed BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS correlated_links (
    id UUID PRIMARY KEY,
    source_entity_id VARCHAR(64) NOT NULL,
    target_entity_id VARCHAR(64) NOT NULL,
    link_type VARCHAR(32) NOT NULL,
    confidence_score NUMERIC(5, 4) NOT NULL,
    time_trust_score NUMERIC(5, 4) NOT NULL,
    is_confirmed_by_investigator BOOLEAN DEFAULT FALSE,
    treeshap_explanation JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_evidence_sha ON evidence_artifacts(sha256_hash);
CREATE INDEX IF NOT EXISTS idx_links_confidence ON correlated_links(confidence_score);
