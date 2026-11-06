import { create } from 'zustand';

export type LanguageCode = 'en' | 'hi';

interface LanguageState {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  toggleLanguage: () =>
    set((state) => ({ language: state.language === 'en' ? 'hi' : 'en' })),
}));
