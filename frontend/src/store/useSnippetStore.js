import { create } from 'zustand';

export const useSnippetStore = create((set) => ({
  activeSnippet: null,
  setActiveSnippet: (snippet) => set({ activeSnippet: snippet }),
  clearActiveSnippet: () => set({ activeSnippet: null }),
}));
