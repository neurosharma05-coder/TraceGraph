/**
 * TraceGraph Live Backend API Client
 * Team: def build() · SUTRAM 2026 · Problem Statement 03
 * Connects Next.js Frontend with the FastAPI Forensic ML Backend (Port 8001)
 */

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8001';

export interface BackendHealthResponse {
  status: string;
  service: string;
  version: string;
  subsystems: {
    evidenceStore: string;
    mlBridge: string;
    auditEngine: string;
    graphService: string;
  };
  legalCompliance: string;
}

export interface IntentPrediction {
  text: string;
  intent: string;
  confidence: number;
  allProbabilities: Record<string, number>;
  latencyMs: number;
}

export interface MulePrediction {
  isMuleRisk: boolean;
  muleProbability: number;
  riskTier: 'NORMAL' | 'SUSPICIOUS' | 'CRITICAL';
  flags: string[];
  latencyMs: number;
}

export interface LinkPrediction {
  linkConfidence: number;
  verdict: 'CONFIRMED_RECONSTRUCTION' | 'HYPOTHESIS_QUEUE' | 'REJECTED';
  latencyMs: number;
}

export interface AuditBlock {
  timestamp: string;
  action: string;
  module: string;
  actor: string;
  actorLabel: string;
  inputHash: string;
  outputHash: string;
  parentHash: string;
  blockHash: string;
  legalCompliance: string;
}

export interface AuditLedgerResponse {
  caseId: string;
  totalBlocks: number;
  hashChainValid: boolean;
  statutoryStandard: string;
  entries: AuditBlock[];
}

export interface CourtCertificateResponse {
  caseNumber: string;
  investigatorName: string;
  investigatorBadge: string;
  agency: string;
  jurisdiction: string;
  statutoryStandard: string;
  certificateHash: string;
  digitalSignature: string;
  unbrokenHashChain: boolean;
  generatedAt: string;
  evidenceItemsCount: number;
}

/**
 * Pings FastAPI backend health endpoint
 */
export async function checkBackendHealth(): Promise<BackendHealthResponse | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetches Case Metadata from Backend
 */
export async function fetchCaseMeta(caseId: string = 'case-001') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/cases/${caseId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Ingests a raw evidence file into the backend hash chain
 */
export async function uploadEvidenceFile(
  caseId: string = 'case-001',
  file: File,
  sourceCategory: string = 'mobile'
) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source_category', sourceCategory);

    const res = await fetch(`${BACKEND_BASE_URL}/cases/${caseId}/evidence/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      console.warn(`Upload failed with HTTP ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[backendClient] uploadEvidenceFile connection error:`, err);
    return null;
  }
}

/**
 * Fetches all ingested evidence files
 */
export async function fetchEvidenceList(caseId: string = 'case-001') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/cases/${caseId}/evidence`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Cryptographically verifies parent-hash chain on server
 */
export async function verifyServerHashChain(caseId: string = 'case-001') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/cases/${caseId}/evidence/verify-chain`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Runs full automated case reconstruction and ML inference
 */
export async function runCasePipeline(caseId: string = 'case-001') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/cases/${caseId}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      console.warn(`Backend run failed with HTTP ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[backendClient] runCasePipeline connection error:`, err);
    return null;
  }
}

/**
 * Fetches Knowledge Graph nodes & edges
 */
export async function fetchKnowledgeGraph(caseId: string = 'case-001') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/cases/${caseId}/analysis/graph`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetches Unified Timeline events
 */
export async function fetchTimeline(caseId: string = 'case-001') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/cases/${caseId}/analysis/timeline`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetches Geospatial Waypoints
 */
export async function fetchWaypoints(caseId: string = 'case-001') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/cases/${caseId}/analysis/waypoints`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetches Spatio-Temporal Feasibility Conflicts
 */
export async function fetchConflicts(caseId: string = 'case-001') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/cases/${caseId}/analysis/feasibility`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetches Competing Hypotheses (Theory Alpha vs Beta)
 */
export async function fetchHypotheses(caseId: string = 'case-001') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/cases/${caseId}/analysis/hypotheses`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetches Multi-Modal Entity Clusters
 */
export async function fetchEntityClusters(caseId: string = 'case-001') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/cases/${caseId}/analysis/entities`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetches Cross-Case Intelligence Hits
 */
export async function fetchCrossCaseRecords(caseId: string = 'case-001') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/cases/${caseId}/analysis/cross-case`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetches Hinglish NLP NER Chat Mentions
 */
export async function fetchChatRecords(caseId: string = 'case-001') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/cases/${caseId}/analysis/chats`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetches ANPR Computer Vision Biometric Matches
 */
export async function fetchCctvRecords(caseId: string = 'case-001') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/cases/${caseId}/analysis/cctv`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetches Section 63(4) BSA Court Certificate
 */
export async function fetchCourtCertificate(caseId: string = 'case-001'): Promise<CourtCertificateResponse | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/audit/${caseId}/court-certificate`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetches Immutable Audit Ledger
 */
export async function fetchAuditLedger(caseId: string = 'case-001'): Promise<AuditLedgerResponse | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/audit/${caseId}/ledger`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Live Hinglish communication intent prediction
 */
export async function predictHinglishIntent(text: string): Promise<IntentPrediction | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/ml/predict/intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Live Financial Mule Risk scoring
 */
export async function predictMuleRisk(params: {
  amount: number;
  oldbalanceOrg: number;
  newbalanceOrig: number;
  oldbalanceDest: number;
  newbalanceDest: number;
}): Promise<MulePrediction | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/ml/predict/mule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Live Link Confidence scoring via Calibrated Random Forest
 */
export async function predictLinkConfidence(params: {
  temporal_overlap: number;
  geo_dist_km: number;
  phone_jaccard?: number;
  ip_overlap?: number;
  financial_flow_match?: number;
  clock_drift_abs?: number;
  entity_sim?: number;
  source_count?: number;
}): Promise<LinkPrediction | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/ml/predict/link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetches System Measured Metrics across all datasets
 */
export async function fetchSystemMetrics() {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/ml/metrics`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Exports Neo4j Cypher queries for the case
 */
export async function exportNeo4jCypher(caseId: string = 'case-001') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/export/${caseId}/neo4j-cypher`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
