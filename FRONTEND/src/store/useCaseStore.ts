import { create } from 'zustand';
import { CaseMetadata, ForensicFile } from '../types/forensics';
import {
  fetchEvidenceList,
  uploadEvidenceFile,
  fetchCaseMeta,
  runCasePipeline,
  verifyServerHashChain,
} from '../api/backendClient';

const INITIAL_CASE_METADATA: CaseMetadata = {
  id: 'case-001',
  caseNumber: 'CR-2026-0942',
  title: 'Operation Mule Trail — NCR Extortion Syndicate',
  description:
    'Cross-channel cyber-forensic correlation across CCTV, CDR, Banking and Encrypted Messaging',
  investigatorName: 'ACP Vikramaditya Singh',
  investigatorBadge: 'DL-CYB-042',
  agency: 'Delhi Police Cyber Cell, IFSO',
  jurisdiction: 'National Capital Region',
  dateOpened: '2026-02-14',
  status: 'sealed',
  sealedAt: '2026-02-14T12:00:00Z',
  sealedHash: '3b29c40fd3a647d7c6b9076dc5a6b47e2b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e',
};

interface CaseState {
  caseMeta: CaseMetadata;
  files: ForensicFile[];
  isLiveConnected: boolean;
  isSyncing: boolean;
  setCaseMeta: (meta: Partial<CaseMetadata>) => void;
  setFiles: (files: ForensicFile[] | ((prev: ForensicFile[]) => ForensicFile[])) => void;
  addFile: (file: ForensicFile) => void;
  removeFile: (id: string) => void;
  loadDemoPack: () => void;
  sealCase: () => void;
  syncFromBackend: (caseId?: string) => Promise<void>;
  uploadLiveFile: (file: File, category?: string) => Promise<ForensicFile | null>;
  runBackendPipeline: () => Promise<any>;
}

export const useCaseStore = create<CaseState>((set, get) => ({
  caseMeta: INITIAL_CASE_METADATA,
  files: [],
  isLiveConnected: false,
  isSyncing: false,

  setCaseMeta: (meta) =>
    set((state) => ({ caseMeta: { ...state.caseMeta, ...meta } })),

  setFiles: (files) =>
    set((state) => ({
      files: typeof files === 'function' ? files(state.files) : files,
    })),

  addFile: (file) => set((state) => ({ files: [...state.files, file] })),

  removeFile: (id) =>
    set((state) => ({ files: state.files.filter((f) => f.id !== id) })),

  loadDemoPack: () => {
    get().syncFromBackend('case-001');
  },

  sealCase: () =>
    set((state) => ({
      caseMeta: {
        ...state.caseMeta,
        status: 'sealed',
        sealedAt: new Date().toISOString(),
        sealedHash:
          state.files[state.files.length - 1]?.sha256 || 'genesis_sealed_root',
      },
    })),

  syncFromBackend: async (caseId: string = 'case-001') => {
    set({ isSyncing: true });
    try {
      const [meta, evidenceFiles] = await Promise.all([
        fetchCaseMeta(caseId),
        fetchEvidenceList(caseId),
      ]);

      if (meta) {
        set({ caseMeta: meta });
      }

      if (evidenceFiles && Array.isArray(evidenceFiles) && evidenceFiles.length > 0) {
        const transformed: ForensicFile[] = evidenceFiles.map((f: any) => ({
          id: f.id,
          name: f.name,
          size: f.size,
          bytes: f.bytes,
          sha256: f.sha256,
          parentHash: f.parentHash,
          sourceCategory: f.sourceCategory,
          categoryLabel: f.categoryLabel,
          language: f.language || 'English',
          clockOffset: f.clockOffset || '0.0s (NTP)',
          cctvCounts: f.cctvCounts,
          crossCaseChip: f.crossCaseChip,
          parseStatus: f.parseStatus || 'parsed',
          parseProgress: f.parseProgress || 100,
          uploadTimestamp: f.uploadTimestamp,
          summary: f.summary,
        }));
        set({ files: transformed, isLiveConnected: true });
      } else {
        set({ isLiveConnected: true });
      }
    } catch (err) {
      console.warn('[useCaseStore] Could not sync from live backend, keeping current state:', err);
      set({ isLiveConnected: false });
    } finally {
      set({ isSyncing: false });
    }
  },

  uploadLiveFile: async (file: File, category: string = 'mobile') => {
    try {
      const resp = await uploadEvidenceFile(get().caseMeta.id || 'case-001', file, category);
      if (resp) {
        const newFile: ForensicFile = {
          id: resp.fileId,
          name: resp.fileName,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          bytes: file.size,
          sha256: resp.sha256,
          parentHash: resp.parentHash,
          sourceCategory: resp.sourceCategory,
          categoryLabel: resp.categoryLabel,
          language: 'English',
          clockOffset: '0.0s (Server Time-Trust)',
          parseStatus: 'parsed',
          parseProgress: 100,
          uploadTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          summary: `Evidence file uploaded to live FastAPI backend and cryptographically chained at Block #${resp.blockIndex}.`,
        };
        set((state) => ({ files: [...state.files, newFile], isLiveConnected: true }));
        return newFile;
      }
    } catch (err) {
      console.error('[useCaseStore] Upload failed:', err);
    }
    return null;
  },

  runBackendPipeline: async () => {
    try {
      const res = await runCasePipeline(get().caseMeta.id || 'case-001');
      return res;
    } catch (err) {
      console.error('[useCaseStore] Pipeline execution error:', err);
      return null;
    }
  },
}));
