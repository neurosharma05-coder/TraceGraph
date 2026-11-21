import { create } from 'zustand';
import { CaseMetadata, ForensicFile } from '../types/forensics';
import {
  fetchEvidenceList,
  uploadEvidenceFile,
  fetchCaseMeta,
  runCasePipeline,
  verifyServerHashChain,
} from '../api/backendClient';

const BLANK_CASE: CaseMetadata = {
  id: '',
  caseNumber: '',
  title: '',
  description: '',
  investigatorName: '',
  investigatorBadge: '',
  agency: '',
  jurisdiction: '',
  dateOpened: new Date().toISOString().slice(0, 10),
  status: 'ingesting',
  sealedAt: undefined,
  sealedHash: undefined,
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
  createCase?: (meta: Partial<CaseMetadata>) => Promise<string>;
  loadDemoPack: () => void;
  sealCase: () => void;
  syncFromBackend: (caseId?: string) => Promise<void>;
  uploadLiveFile: (file: File, category?: string) => Promise<ForensicFile | null>;
  runBackendPipeline: () => Promise<any>;
}

export const useCaseStore = create<CaseState>((set, get) => ({
  caseMeta: BLANK_CASE,
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

  createCase: async (meta: Partial<CaseMetadata>) => {
    const newId = `case-${Date.now()}`;
    const fullMeta: CaseMetadata = {
      id: newId,
      caseNumber: `CR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: meta.title || 'Digital Evidence Correlation Case',
      description: meta.description || 'Cross-channel forensic correlation',
      investigatorName: meta.investigatorName || 'Investigator',
      investigatorBadge: meta.investigatorBadge || 'TRACE-AUTO',
      agency: meta.agency || 'Digital Forensics Unit',
      jurisdiction: meta.jurisdiction || 'National Jurisdiction',
      dateOpened: new Date().toISOString().slice(0, 10),
      status: 'ingesting',
      sealedAt: undefined,
      sealedHash: undefined,
      ...meta,
    };
    try {
      await fetchCaseMeta(newId);
    } catch (e) {
      console.warn('Case init note:', e);
    }
    set({ caseMeta: fullMeta, isLiveConnected: true });
    return newId;
  },

  loadDemoPack: () => {
    get().syncFromBackend(get().caseMeta.id || 'case-001');
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
