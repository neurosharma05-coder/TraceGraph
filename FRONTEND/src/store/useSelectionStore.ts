import { create } from 'zustand';
import { GraphNode, GraphLink, GeoWaypoint, ConflictItem, TheoryModel } from '../types/forensics';

export interface ReplayState {
  playing: boolean;
  speed: 1 | 4 | 16;
  currentEventId: string | null;
  currentTimeUtc: string;
}

interface SelectionState {
  selectedNode: GraphNode | null;
  selectedLink: GraphLink | null;
  selectedWaypoint: GeoWaypoint | null;
  selectedConflictId: string | null;
  selectedTheoryId: string | null;
  traceMode: boolean;
  replay: ReplayState;
  graphSnapshotUrl: string | null;
  setSelectedNode: (node: GraphNode | null) => void;
  setSelectedLink: (link: GraphLink | null) => void;
  setSelectedWaypoint: (wp: GeoWaypoint | null) => void;
  setSelectedConflictId: (id: string | null) => void;
  setSelectedTheoryId: (id: string | null) => void;
  setTraceMode: (enabled: boolean) => void;
  toggleTraceMode: () => void;
  setReplay: (partial: Partial<ReplayState>) => void;
  setGraphSnapshotUrl: (url: string | null) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedNode: null,
  selectedLink: null,
  selectedWaypoint: null,
  selectedConflictId: null,
  selectedTheoryId: null,
  traceMode: false,
  replay: {
    playing: false,
    speed: 1,
    currentEventId: null,
    currentTimeUtc: '',
  },
  graphSnapshotUrl: null,
  setSelectedNode: (node) =>
    set((s) => (s.selectedNode?.id === node?.id ? s : { selectedNode: node })),
  setSelectedLink: (link) =>
    set((s) =>
      s.selectedLink?.source === link?.source && s.selectedLink?.target === link?.target
        ? s
        : { selectedLink: link }
    ),
  setSelectedWaypoint: (wp) =>
    set((s) => (s.selectedWaypoint?.id === wp?.id ? s : { selectedWaypoint: wp })),
  setSelectedConflictId: (id) => set({ selectedConflictId: id }),
  setSelectedTheoryId: (id) => set({ selectedTheoryId: id }),
  setTraceMode: (enabled) => set({ traceMode: enabled }),
  toggleTraceMode: () => set((s) => ({ traceMode: !s.traceMode })),
  setReplay: (partial) =>
    set((s) => {
      let changed = false;
      for (const k in partial) {
        if (s.replay[k as keyof ReplayState] !== partial[k as keyof ReplayState]) {
          changed = true;
          break;
        }
      }
      return changed ? { replay: { ...s.replay, ...partial } } : s;
    }),
  setGraphSnapshotUrl: (url) =>
    set((s) => (s.graphSnapshotUrl === url ? s : { graphSnapshotUrl: url })),
}));
