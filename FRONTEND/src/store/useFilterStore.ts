import { create } from 'zustand';

interface FilterState {
  categoryFilter: string;
  searchQuery: string;
  minConfidence: number;
  setCategoryFilter: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setMinConfidence: (confidence: number) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  categoryFilter: 'all',
  searchQuery: '',
  minConfidence: 0.5,
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setMinConfidence: (confidence) => set({ minConfidence: confidence }),
  resetFilters: () => set({ categoryFilter: 'all', searchQuery: '', minConfidence: 0.5 }),
}));
