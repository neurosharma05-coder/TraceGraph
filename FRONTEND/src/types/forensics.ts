export type SourceCategory =
  | 'mobile'
  | 'social'
  | 'cctv'
  | 'cloud'
  | 'financial'
  | 'email'
  | 'network';

export interface ForensicFile {
  id: string;
  name: string;
  size: string;
  bytes: number;
  sha256: string;
  parentHash: string;
  sourceCategory: SourceCategory;
  categoryLabel: string;
  language: 'English' | 'Hindi' | 'Hinglish';
  clockOffset: string;
  cctvCounts?: string;
  crossCaseChip?: string;
  parseStatus: 'parsed' | 'processing' | 'flagged';
  parseProgress: number;
  uploadTimestamp: string;
  summary: string;
}

export interface CaseMetadata {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  investigatorName: string;
  investigatorBadge: string;
  agency: string;
  jurisdiction: string;
  dateOpened: string;
  status: 'draft' | 'ingesting' | 'sealed' | 'admitted';
  sealedAt?: string;
  sealedHash?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  category: 'suspect' | 'phone' | 'bank' | 'cctv' | 'ip' | 'location';
  details: string;
  confidence: number;
  sourceFile: string;
  x: number;
  y: number;
  caseCount?: number;
  riskScore?: number;
  cluster?: string;
  clusterLabel?: string;
  mergedFrom?: string[];
  otherCases?: string[];
}

export interface GraphLink {
  source: string;
  target: string;
  relation: string;
  confidence: number;
  reason: string;
  verified: boolean;
  state?: 'confirmed' | 'scored' | 'proposed' | 'hypothesis_only' | 'rejected';
  scoreMethod?: string;
  modelVersion?: string;
  conflicts?: { relation: string; reason: string }[];
  sourceEvents?: { id: string; title: string; time: string }[];
  nerSnippet?: { text: string; span: string };
  cctvThumbnail?: { frameId: string; camera: string; time: string; matchScore: number };
}

export interface TimelineEvent {
  id: string;
  timestampUtc: string;
  rawTimestamp: string;
  sourceCategory: string;
  eventTitle: string;
  details: string;
  location: string;
  driftCorrected: string;
  uncertaintyWindow: string;
  flagged?: boolean;
  gapFollows?: boolean;
  gapDuration?: string;
  timeTrust?: number;
  correctionMethod?: string;
  correctionNotes?: string;
  entities?: string[];
  sourceFile?: string;
  sourceHash?: string;
  conflictEventId?: string;
  conflictReason?: string;
  orderUncertainWith?: string;
}

export interface GeoWaypoint {
  id: string;
  name: string;
  time: string;
  type: 'cctv' | 'cell_tower' | 'bank_atm' | 'meeting';
  lat: number;
  lng: number;
  uncertaintyRadius: string;
  source: string;
  description: string;
}

export interface ConflictItem {
  id: string;
  title: string;
  eventA: {
    label: string;
    location: string;
    time: string;
    source: string;
  };
  eventB: {
    label: string;
    location: string;
    time: string;
    source: string;
  };
  distanceKm: number;
  timeDiffMinutes: number;
  requiredVelocityKmh: number;
  status: 'flagged' | 'resolved' | 'investigating';
  resolutionNote?: string;
  competingHypotheses: {
    id: string;
    title: string;
    probability: number;
    explanation: string;
  }[];
}

export interface EntityCluster {
  id: string;
  canonicalName: string;
  role: string;
  matchScore: number;
  status: 'merged' | 'candidate';
  identifiers: {
    type: 'phone' | 'imei' | 'bank_kyc' | 'alias' | 'face';
    label: string;
    value: string;
    source: string;
  }[];
}

export interface CrossCaseRecord {
  id: string;
  matchedIdentifier: string;
  identifierType: string;
  firNumber: string;
  agency: string;
  offenseType: string;
  dateLogged: string;
  syndicateName: string;
  matchConfidence: number;
}

export interface TheoryModel {
  id: string;
  name: string;
  tag: string;
  probability: number;
  corePremise: string;
  corroboratingEvidence: {
    point: string;
    source: string;
    weight: string;
  }[];
  refutingEvidence: {
    point: string;
    source: string;
    weight: string;
  }[];
  falsificationCondition: string;
  scoreBreakdown?: {
    linkId: string;
    label: string;
    delta: number;
    reason: string;
  }[];
  eventSequence?: {
    id: string;
    time: string;
    title: string;
    lane: string;
  }[];
  conflictsBlock?: {
    id: string;
    title: string;
    details: string;
    type: 'feasibility' | 'contradiction';
  }[];
  differingLinks?: string[];
}
