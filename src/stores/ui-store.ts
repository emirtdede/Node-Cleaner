import { create } from "zustand";
import { DeletionReport } from "@/types";

export type ModalType =
  | null
  | "settings"
  | "recycle-confirm"
  | "permanent-confirm"
  | "partial-error";

export interface ToastMessage {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  durationMs?: number;
}

interface UiState {
  activeModal: ModalType;
  searchQuery: string;
  toast: ToastMessage | null;
  pendingDeletionIds: string[];
  partialErrorReport: DeletionReport | null;

  // Actions
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  setSearchQuery: (query: string) => void;
  showToast: (message: string, type?: "info" | "success" | "warning" | "error", durationMs?: number) => void;
  clearToast: () => void;
  setPendingDeletion: (ids: string[]) => void;
  setPartialErrorReport: (report: DeletionReport | null) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useUiStore = create<UiState>((set) => ({
  activeModal: null,
  searchQuery: "",
  toast: null,
  pendingDeletionIds: [],
  partialErrorReport: null,

  openModal: (modal) => set({ activeModal: modal }),

  closeModal: () => set({ activeModal: null, pendingDeletionIds: [] }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  showToast: (message, type = "info", durationMs = 3500) => {
    if (toastTimer) clearTimeout(toastTimer);

    const toast: ToastMessage = {
      id: "toast-" + Date.now(),
      message,
      type,
      durationMs,
    };

    set({ toast });

    toastTimer = setTimeout(() => {
      set({ toast: null });
      toastTimer = null;
    }, durationMs);
  },

  clearToast: () => {
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    set({ toast: null });
  },

  setPendingDeletion: (ids) => set({ pendingDeletionIds: ids }),

  setPartialErrorReport: (report) => set({ partialErrorReport: report, activeModal: "partial-error" }),
}));
