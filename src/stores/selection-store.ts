import { create } from "zustand";

interface SelectionState {
  selectedIds: Set<string>;

  // Actions
  toggleSelection: (id: string) => void;
  selectId: (id: string) => void;
  deselectId: (id: string) => void;
  selectAll: (allVisibleIds: string[]) => void;
  selectMany: (ids: string[]) => void;
  deselectMany: (ids: string[]) => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selectedIds: new Set<string>(),

  toggleSelection: (id: string) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedIds: next };
    }),

  selectId: (id: string) =>
    set((state) => {
      if (state.selectedIds.has(id)) return state;
      const next = new Set(state.selectedIds);
      next.add(id);
      return { selectedIds: next };
    }),

  deselectId: (id: string) =>
    set((state) => {
      if (!state.selectedIds.has(id)) return state;
      const next = new Set(state.selectedIds);
      next.delete(id);
      return { selectedIds: next };
    }),

  selectAll: (allVisibleIds: string[]) =>
    set((state) => {
      const allSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => state.selectedIds.has(id));
      if (allSelected) {
        // Deselect all visible
        const next = new Set(state.selectedIds);
        for (const id of allVisibleIds) {
          next.delete(id);
        }
        return { selectedIds: next };
      } else {
        // Select all visible
        const next = new Set(state.selectedIds);
        for (const id of allVisibleIds) {
          next.add(id);
        }
        return { selectedIds: next };
      }
    }),

  selectMany: (ids: string[]) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      for (const id of ids) {
        next.add(id);
      }
      return { selectedIds: next };
    }),

  deselectMany: (ids: string[]) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      for (const id of ids) {
        next.delete(id);
      }
      return { selectedIds: next };
    }),

  clearSelection: () => set({ selectedIds: new Set<string>() }),

  isSelected: (id: string) => get().selectedIds.has(id),
}));
