import { describe, it, expect, beforeEach } from "vitest";
import { useScanStore } from "../stores/scan-store";
import { useSelectionStore } from "../stores/selection-store";
import { usePreferencesStore } from "../stores/preferences-store";
import { useUiStore } from "../stores/ui-store";
import { NodeModuleEntry } from "../types";

describe("WP-3, WP-4, WP-5, WP-6: Full Feature & Workflow Unit Tests", () => {
  beforeEach(() => {
    useScanStore.getState().resetScan();
    useSelectionStore.getState().clearSelection();
    useUiStore.getState().closeModal();
    useUiStore.getState().setSearchQuery("");
  });

  it("adds candidate entries and updates measurements in batch", () => {
    const scanStore = useScanStore.getState();
    scanStore.startScanState("scan-123", "C:\\Users\\emir\\Projects");

    const dummyEntries: NodeModuleEntry[] = [
      {
        id: "nm-1",
        nodeModulesPath: "C:\\Users\\emir\\Projects\\app1\\node_modules",
        projectPath: "C:\\Users\\emir\\Projects\\app1",
        projectName: "app1",
        packageManager: "pnpm",
        sizeBytes: null,
        modifiedAt: "2026-08-28T10:00:00Z",
        packageJsonFound: true,
        status: "measuring",
      },
      {
        id: "nm-2",
        nodeModulesPath: "C:\\Users\\emir\\Projects\\app2\\node_modules",
        projectPath: "C:\\Users\\emir\\Projects\\app2",
        projectName: "app2",
        packageManager: "npm",
        sizeBytes: null,
        modifiedAt: "2026-08-27T10:00:00Z",
        packageJsonFound: true,
        status: "measuring",
      },
      {
        id: "nm-3",
        nodeModulesPath: "C:\\Users\\emir\\Projects\\sub\\app3\\node_modules",
        projectPath: "C:\\Users\\emir\\Projects\\sub\\app3",
        projectName: "app3",
        packageManager: "yarn",
        sizeBytes: null,
        modifiedAt: "2026-08-20T10:00:00Z",
        packageJsonFound: false,
        status: "measuring",
      },
    ];

    scanStore.addCandidateEntriesBatch(dummyEntries);
    expect(useScanStore.getState().entryIds).toHaveLength(3);

    // Update measurements
    scanStore.updateEntryMeasurementBatch([
      { id: "nm-1", sizeBytes: 104857600 }, // 100 MB
      { id: "nm-2", sizeBytes: 524288000 }, // 500 MB
      { id: "nm-3", sizeBytes: 1073741824 }, // 1 GB
    ]);

    expect(useScanStore.getState().entriesById["nm-1"].sizeBytes).toBe(104857600);
    expect(useScanStore.getState().entriesById["nm-2"].sizeBytes).toBe(524288000);
    expect(useScanStore.getState().entriesById["nm-3"].sizeBytes).toBe(1073741824);
  });

  it("handles multi-selection and calculation accurately", () => {
    const selStore = useSelectionStore.getState();
    selStore.selectMany(["nm-1", "nm-2"]);

    expect(useSelectionStore.getState().selectedIds.size).toBe(2);
    expect(useSelectionStore.getState().isSelected("nm-1")).toBe(true);
    expect(useSelectionStore.getState().isSelected("nm-2")).toBe(true);
    expect(useSelectionStore.getState().isSelected("nm-3")).toBe(false);

    selStore.deselectId("nm-1");
    expect(useSelectionStore.getState().selectedIds.size).toBe(1);
  });

  it("handles deletion transitions and store cleanup", () => {
    const scanStore = useScanStore.getState();
    scanStore.startScanState("scan-del", "C:\\Projects");
    scanStore.addCandidateEntry({
      id: "del-1",
      nodeModulesPath: "C:\\Projects\\p1\\node_modules",
      projectPath: "C:\\Projects\\p1",
      projectName: "p1",
      packageManager: "pnpm",
      sizeBytes: 1000,
      modifiedAt: "2026-08-29T00:00:00Z",
      packageJsonFound: true,
      status: "ready",
    });

    expect(useScanStore.getState().entryIds).toContain("del-1");

    // Mark deleted
    scanStore.markEntryDeleted(["del-1"]);
    expect(useScanStore.getState().entriesById["del-1"].status).toBe("deleted");

    // Remove after transition
    scanStore.removeEntries(["del-1"]);
    expect(useScanStore.getState().entryIds).not.toContain("del-1");
    expect(useScanStore.getState().entriesById["del-1"]).toBeUndefined();
  });

  it("supports adding and removing favorites with custom labels", () => {
    const prefStore = usePreferencesStore.getState();
    const fav = prefStore.addFavorite("C:\\Work\\MyProject", "My Custom Project");

    expect(fav.label).toBe("My Custom Project");
    expect(usePreferencesStore.getState().favorites.some((f) => f.id === fav.id)).toBe(true);

    prefStore.renameFavorite(fav.id, "Renamed Project");
    expect(usePreferencesStore.getState().favorites.find((f) => f.id === fav.id)?.label).toBe("Renamed Project");

    prefStore.removeFavorite(fav.id);
    expect(usePreferencesStore.getState().favorites.some((f) => f.id === fav.id)).toBe(false);
  });

  it("supports switching all 16 dark and light flat color themes seamlessly", () => {
    const prefStore = usePreferencesStore.getState();
    const allThemes = [
      "dark-black", "dark-gray", "dark-blue", "dark-purple",
      "dark-green", "dark-red", "dark-orange", "dark-yellow",
      "light-white", "light-gray", "light-blue", "light-purple",
      "light-green", "light-red", "light-orange", "light-yellow"
    ] as const;

    for (const t of allThemes) {
      prefStore.setTheme(t);
      expect(usePreferencesStore.getState().theme).toBe(t);
    }
  });

  it("normalizes legacy theme names correctly", () => {
    const prefStore = usePreferencesStore.getState();
    
    prefStore.loadPreferences({ theme: "black" });
    expect(usePreferencesStore.getState().theme).toBe("dark-black");

    prefStore.loadPreferences({ theme: "white" });
    expect(usePreferencesStore.getState().theme).toBe("light-white");

    prefStore.loadPreferences({ theme: "dark-transparent" });
    expect(usePreferencesStore.getState().theme).toBe("dark-black");
  });

  it("WP-1: buffers out-of-order measurements and applies them when candidate arrives", () => {
    const scanStore = useScanStore.getState();
    scanStore.startScanState("scan-ooo", "C:\\Projects");

    // 1. Measurement arrives BEFORE candidate
    scanStore.updateEntryMeasurement("nm-ooo", 734003200); // 700 MB
    expect(useScanStore.getState().pendingMeasurements["nm-ooo"]).toBe(734003200);
    expect(useScanStore.getState().entriesById["nm-ooo"]).toBeUndefined();

    // 2. Candidate arrives later
    scanStore.addCandidateEntry({
      id: "nm-ooo",
      nodeModulesPath: "C:\\Projects\\app\\node_modules",
      projectPath: "C:\\Projects\\app",
      projectName: "app",
      packageManager: "npm",
      sizeBytes: null,
      modifiedAt: "2026-08-29T10:00:00Z",
      packageJsonFound: true,
      status: "measuring",
    });

    // 3. Candidate should automatically have buffered size and ready status
    expect(useScanStore.getState().entriesById["nm-ooo"].sizeBytes).toBe(734003200);
    expect(useScanStore.getState().entriesById["nm-ooo"].status).toBe("ready");
    expect(useScanStore.getState().pendingMeasurements["nm-ooo"]).toBeUndefined();
  });
});

