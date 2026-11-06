import { create } from 'zustand';

interface TraceState {
  traceMode: boolean;
  tiltX: number;
  tiltY: number;
  setTraceMode: (mode: boolean) => void;
  toggleTraceMode: () => void;
  setTilt: (x: number, y: number) => void;
}

export const useTraceStore = create<TraceState>((set) => ({
  traceMode: false,
  tiltX: 0,
  tiltY: 0,
  setTraceMode: (mode) => set({ traceMode: mode }),
  toggleTraceMode: () => set((state) => ({ traceMode: !state.traceMode })),
  setTilt: (x, y) => set({ tiltX: x, tiltY: y }),
}));
