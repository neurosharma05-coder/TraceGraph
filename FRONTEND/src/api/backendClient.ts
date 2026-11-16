/**
 * TraceGraph Live Backend API Client
 * Digital Forensic Crime Reconstruction Framework
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

// ─────────────────────────────────────────────────────────────────
// 🇮🇳  INDIA ML BRIDGE — v2 Real Indian Data Endpoints
//     All endpoints: /ml/india/predict/*
//     Training data: PoliWAM, NPCI, MU-IoT, VIT Bhopal, AgamiAI
// ─────────────────────────────────────────────────────────────────

export interface IndiaIntentResponse {
  text: string;
  intent: string;
  confidence: number;
  allProbabilities: Record<string, number>;
  modelVersion: string;
  source: string;
  latencyMs: number;
}

export interface IndiaMuleResponse {
  isMuleRisk: boolean;
  muleProbability: number;
  riskTier: 'NORMAL' | 'SUSPICIOUS' | 'CRITICAL';
  flags: string[];
  upiContext: {
    volumeMn: number;
    valueCr: number;
    avgTicketRs: number;
    npciBenchmarkMonth: string;
  };
  modelVersion: string;
  trainingData: string;
  latencyMs: number;
}

export interface IndiaAnomalyResponse {
  isAnomaly: boolean;
  anomalyProbability: number;
  severity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  featuresEvaluated: number;
  modelVersion: string;
  trainingData: string;
  latencyMs: number;
}

export interface IndiaNetworkResponse {
  isAnomaly: boolean;
  anomalyProbability: number;
  attackType: string;
  flags: string[];
  packetFeatures: Record<string, number>;
  modelVersion: string;
  trainingData: string;
  latencyMs: number;
}

export interface IndiaIoTResponse {
  isIntrusion: boolean;
  attackType: string;
  confidence: number;
  severity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  iotProtocol: string;
  featuresProvided: number;
  modelVersion: string;
  trainingData: string;
  latencyMs: number;
}

export interface IndiaGNNLinkResponse {
  linkProbability: number;
  isLinked: boolean;
  riskLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  nodeUFeatures: number[];
  nodeVFeatures: number[];
  modelVersion: string;
  trainingData: string;
  source: string;
  latencyMs: number;
}

export interface IndiaMLStatusResponse {
  india_models_dir: string;
  loaded: Record<string, boolean>;
  total_loaded: number;
  total_expected: number;
  version: string;
  compliance: string;
  gnn_inference: boolean;
}

/**
 * §0 — Get status of all 7 Indian ML models
 */
export async function fetchIndiaMLStatus(): Promise<IndiaMLStatusResponse | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/ml/india/status`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * §1 — PoliWAM Hinglish Political Intent Classifier
 * Classifies Indian political party affiliation from Hinglish text
 * Training: PoliWAM dataset (LingoIITGN/HuggingFace), 9 party classes
 */
export async function predictIndiaIntent(text: string): Promise<IndiaIntentResponse | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/ml/india/predict/intent`, {
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
 * §2 — NPCI UPI Mule Account Risk Scorer
 * Detects hawala/mule account patterns from UPI monthly transaction stats
 * Training: NPCI UPI Statistics (Apr 2019–Dec 2024), 69 monthly data points
 */
export async function predictIndiaMule(params: {
  volume_mn: number;
  value_cr: number;
  month_num?: number;
  year?: number;
  flags?: string[];
}): Promise<IndiaMuleResponse | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/ml/india/predict/mule`, {
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
 * §3 — Indian Bank Statement Financial Anomaly Detector
 * Detects structuring / wash trades via IsolationForest
 * Training: AgamiAI/Indian-Bank-Statements (HuggingFace)
 */
export async function predictIndiaAnomaly(params: {
  features: Record<string, number>;
  account_id?: string;
}): Promise<IndiaAnomalyResponse | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/ml/india/predict/anomaly`, {
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
 * §4 — VIT Bhopal Network Packet Attack Classifier
 * Classifies 7 attack types from Wireshark PCAP features
 * Training: VIT Bhopal Cyberattack Dataset (600K packets)
 */
export async function predictIndiaNetwork(params: {
  length: number;
  ttl?: number;
  protocol_code?: number;
  src_port?: number;
  dst_port?: number;
  pkt_time?: number;
}): Promise<IndiaNetworkResponse | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/ml/india/predict/network`, {
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
 * §5 — MU-IoT Intrusion Detection (Manipur University)
 * Classifies 16 IoT attack types from MQTT/CoAP flow features
 * Training: MU-IoT Dataset (393K samples)
 */
export async function predictIndiaIoT(params: {
  features: Record<string, number>;
  device_id?: string;
  protocol_hint?: string;
}): Promise<IndiaIoTResponse | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/ml/india/predict/iot`, {
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
 * §7 — GraphSAGE Indian Forensic Link Scorer
 * Scores entity link probability using 16-feature Indian forensic graph
 * Training: Indian forensic case graph (GraphSAGE 16-feature)
 */
export async function predictIndiaGNNLink(params: {
  features_u: number[];
  features_v: number[];
  edge_type?: string;
}): Promise<IndiaGNNLinkResponse | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/ml/india/predict/link-india`, {
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
