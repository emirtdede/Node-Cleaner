import { create } from "zustand";
import { NodeModuleEntry, ScanProgress, ScanSummary, AppErrorDto } from "@/types";

export type ScanStatus =
  | "idle"
  | "scanning"
  | "measuring"
  | "cancelling"
  | "completed"
  | "cancelled"
  | "failed";

interface ScanState {
  scanId: string | null;
  status: ScanStatus;
  currentRootPath: string | null;
  entriesById: Record<string, NodeModuleEntry>;
  entryIds: string[];
  pendingMeasurements: Record<string, number>;
  progress: ScanProgress | null;
  summary: ScanSummary | null;
  error: AppErrorDto | null;
  warnings: Array<{ code: string; path?: string }>;

  // Actions
  startScanState: (scanId: string, rootPath: string) => void;
  updateProgress: (progress: ScanProgress) => void;
  addCandidateEntry: (entry: NodeModuleEntry) => void;
  addCandidateEntriesBatch: (entries: NodeModuleEntry[]) => void;
  updateEntryMeasurement: (id: string, sizeBytes: number) => void;
  updateEntryMeasurementBatch: (updates: Array<{ id: string; sizeBytes: number }>) => void;
  markEntryDeleted: (ids: string[]) => void;
  removeEntries: (ids: string[]) => void;
  addWarning: (warning: { code: string; path?: string }) => void;
  completeScan: (summary: ScanSummary) => void;
  cancelScanState: (summary?: ScanSummary) => void;
  failScan: (error: AppErrorDto) => void;
  resetScan: () => void;
}

export const useScanStore = create<ScanState>((set) => ({
  scanId: null,
  status: "idle",
  currentRootPath: null,
  entriesById: {},
  entryIds: [],
  pendingMeasurements: {},
  progress: null,
  summary: null,
  error: null,
  warnings: [],

  startScanState: (scanId, rootPath) =>
    set({
      scanId,
      status: "scanning",
      currentRootPath: rootPath,
      entriesById: {},
      entryIds: [],
      pendingMeasurements: {},
      progress: {
        phase: "discovering",
        directoriesVisited: 0,
        entriesFound: 0,
        entriesMeasured: 0,
        bytesMeasured: 0,
      },
      summary: null,
      error: null,
      warnings: [],
    }),

  updateProgress: (progress) =>
    set((state) => ({
      progress,
      status: progress.phase === "measuring" && state.status === "scanning"
        ? "measuring"
        : state.status,
    })),

  addCandidateEntry: (entry) =>
    set((state) => {
      if (state.entriesById[entry.id]) return state;

      const bufferedSize = state.pendingMeasurements[entry.id];
      const nextEntry: NodeModuleEntry = bufferedSize !== undefined
        ? { ...entry, sizeBytes: bufferedSize, status: "ready" }
        : entry;

      let nextPending = state.pendingMeasurements;
      if (bufferedSize !== undefined) {
        nextPending = { ...state.pendingMeasurements };
        delete nextPending[entry.id];
      }

      return {
        entriesById: { ...state.entriesById, [entry.id]: nextEntry },
        entryIds: [...state.entryIds, entry.id],
        pendingMeasurements: nextPending,
      };
    }),

  addCandidateEntriesBatch: (entries) =>
    set((state) => {
      const nextMap = { ...state.entriesById };
      const nextIds = [...state.entryIds];
      const nextPending = { ...state.pendingMeasurements };

      for (const entry of entries) {
        if (!nextMap[entry.id]) {
          const bufferedSize = nextPending[entry.id];
          if (bufferedSize !== undefined) {
            nextMap[entry.id] = { ...entry, sizeBytes: bufferedSize, status: "ready" };
            delete nextPending[entry.id];
          } else {
            nextMap[entry.id] = entry;
          }
          nextIds.push(entry.id);
        }
      }
      return {
        entriesById: nextMap,
        entryIds: nextIds,
        pendingMeasurements: nextPending,
      };
    }),

  updateEntryMeasurement: (id, sizeBytes) =>
    set((state) => {
      const existing = state.entriesById[id];
      if (!existing) {
        // Buffer measurement for out-of-order candidate arrival
        return {
          pendingMeasurements: {
            ...state.pendingMeasurements,
            [id]: sizeBytes,
          },
        };
      }
      return {
        entriesById: {
          ...state.entriesById,
          [id]: {
            ...existing,
            sizeBytes,
            status: "ready",
          },
        },
      };
    }),

  updateEntryMeasurementBatch: (updates) =>
    set((state) => {
      let changed = false;
      const nextMap = { ...state.entriesById };
      const nextPending = { ...state.pendingMeasurements };

      for (const { id, sizeBytes } of updates) {
        const existing = nextMap[id];
        if (existing) {
          nextMap[id] = { ...existing, sizeBytes, status: "ready" };
          changed = true;
        } else {
          nextPending[id] = sizeBytes;
          changed = true;
        }
      }
      return changed
        ? { entriesById: nextMap, pendingMeasurements: nextPending }
        : state;
    }),

  markEntryDeleted: (ids) =>
    set((state) => {
      const nextMap = { ...state.entriesById };
      for (const id of ids) {
        if (nextMap[id]) {
          nextMap[id] = { ...nextMap[id], status: "deleted" };
        }
      }
      return { entriesById: nextMap };
    }),

  removeEntries: (ids) =>
    set((state) => {
      const removeSet = new Set(ids);
      const nextMap = { ...state.entriesById };
      for (const id of ids) {
        delete nextMap[id];
      }
      const nextIds = state.entryIds.filter((id) => !removeSet.has(id));
      return { entriesById: nextMap, entryIds: nextIds };
    }),

  addWarning: (warning) =>
    set((state) => ({
      warnings: [...state.warnings, warning],
    })),

  completeScan: (summary) =>
    set({
      status: "completed",
      summary,
    }),

  cancelScanState: (summary) =>
    set({
      status: "cancelled",
      summary: summary || null,
    }),

  failScan: (error) =>
    set({
      status: "failed",
      error,
    }),

  resetScan: () =>
    set({
      scanId: null,
      status: "idle",
      currentRootPath: null,
      entriesById: {},
      entryIds: [],
      pendingMeasurements: {},
      progress: null,
      summary: null,
      error: null,
      warnings: [],
    }),
}));
