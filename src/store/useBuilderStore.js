import { create } from "zustand";

export const useBuilderStore = create((set, get) => ({
  /* =========================
     GLOBAL STATE
  ========================= */
  sections: [],
  pages: [],
  pageId: null,
  selectedSection: null,
  siteSettings: {},

  /* =========================
     PAGE MANAGEMENT
  ========================= */
  setPages: (pages) => set({ pages }),

  setPage: (pageId) => set({ pageId }),

  /* =========================
     SECTIONS
  ========================= */
  setSections: (sections) => set({ sections }),

  setSelectedSection: (section) =>
    set({ selectedSection: section }),

  /* =========================
     INLINE EDITING (CORE)
  ========================= */
  updateSection: (id, newData) =>
    set((state) => {
      const updatedSections = state.sections.map((sec) =>
        sec.id === id
          ? {
              ...sec,
              content: {
                ...sec.content,
                ...newData,
              },
            }
          : sec
      );

      const updated = updatedSections.find((s) => s.id === id);

      /* 🔥 AUTO SAVE TO SUPABASE */
      import("../utils/saveSections").then(({ saveSection }) => {
        if (updated) saveSection(updated);
      });

      return {
        sections: updatedSections,
        selectedSection: updated,
      };
    }),

  /* =========================
     ADD / DELETE / REORDER
  ========================= */
  addSection: (section) =>
    set((state) => ({
      sections: [...state.sections, section],
    })),

  deleteSection: (id) =>
    set((state) => ({
      sections: state.sections.filter((s) => s.id !== id),
    })),

  reorderSections: (newOrder) =>
    set({ sections: newOrder }),

  /* =========================
     SITE SETTINGS
  ========================= */
  setSiteSettings: (data) =>
    set((state) => {
      const updated = {
        ...state.siteSettings,
        ...data,
      };

      /* 🔥 SAVE SETTINGS */
      import("../utils/saveSiteSettings").then(
        ({ saveSiteSettings }) => {
          saveSiteSettings(updated);
        }
      );

      return { siteSettings: updated };
    }),

  /* =========================
     LOADERS (FROM SUPABASE)
  ========================= */
  loadSections: (sections) =>
    set({ sections }),

  loadPages: (pages) =>
    set({ pages }),

  loadSiteSettings: (settings) =>
    set({ siteSettings: settings }),

  /* =========================
     HELPERS
  ========================= */
  getSectionById: (id) => {
    return get().sections.find((s) => s.id === id);
  },
}));