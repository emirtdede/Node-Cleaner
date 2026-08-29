import { describe, it, expect, beforeEach } from "vitest";
import { formatBytes, formatDate, truncatePath } from "../lib/formatters";
import { useScanStore } from "../stores/scan-store";
import { useSelectionStore } from "../stores/selection-store";
import { usePreferencesStore } from "../stores/preferences-store";
import { useUiStore } from "../stores/ui-store";

describe("WP-1: Foundation & Formatting Utilities", () => {
  it("formats bytes accurately with Turkish decimal comma", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1024)).toBe("1,00 KB");
    expect(formatBytes(1048576)).toBe("1,00 MB");
    expect(formatBytes(1572864)).toBe("1,50 MB");
    expect(formatBytes(1073741824 * 2.5)).toBe("2,50 GB");
    expect(formatBytes(1073741824 * 24.7)).toBe("24,7 GB");
    expect(formatBytes(null)).toBe("-");
  });

  it("formats dates into relative and exact values", () => {
    const now = new Date().toISOString();
    const result = formatDate(now);
    expect(result.relative).toBe("Az önce");
    expect(result.exact).toBeTruthy();

    expect(formatDate(null).relative).toBe("-");
  });

  it("truncates long file paths cleanly", () => {
    const shortPath = "C:\\Projects\\my-app";
    expect(truncatePath(shortPath)).toBe(shortPath);

    const longPath = "C:\\Users\\developer\\Desktop\\workspaces\\deep\\nested\\projects\\frontend-web-application\\packages\\app";
    const truncated = truncatePath(longPath, 40);
    expect(truncated).toContain("...");
  });
});

describe("WP-1: Domain Stores Isolation", () => {
  beforeEach(() => {
    useScanStore.getState().resetScan();
    useSelectionStore.getState().clearSelection();
  });

  it("scan store manages candidates and measurements correctly", () => {
    const store = useScanStore.getState();
    store.startScanState("scan-1", "C:\\Projects");

    expect(useScanStore.getState().status).toBe("scanning");
    expect(useScanStore.getState().currentRootPath).toBe("C:\\Projects");

    store.addCandidateEntry({
      id: "entry-1",
      nodeModulesPath: "C:\\Projects\\app\\node_modules",
      projectPath: "C:\\Projects\\app",
      projectName: "app",
      packageManager: "pnpm",
      sizeBytes: null,
      modifiedAt: "2026-08-28T10:00:00Z",
      packageJsonFound: true,
      status: "measuring",
    });

    expect(useScanStore.getState().entryIds).toHaveLength(1);
    expect(useScanStore.getState().entriesById["entry-1"].sizeBytes).toBeNull();

    store.updateEntryMeasurement("entry-1", 104857600); // 100 MB
    expect(useScanStore.getState().entriesById["entry-1"].sizeBytes).toBe(104857600);
    expect(useScanStore.getState().entriesById["entry-1"].status).toBe("ready");
  });

  it("selection store accurately toggles and tracks sets of IDs", () => {
    const selStore = useSelectionStore.getState();
    selStore.toggleSelection("item-1");
    expect(useSelectionStore.getState().selectedIds.has("item-1")).toBe(true);

    selStore.toggleSelection("item-2");
    expect(useSelectionStore.getState().selectedIds.size).toBe(2);

    selStore.toggleSelection("item-1");
    expect(useSelectionStore.getState().selectedIds.has("item-1")).toBe(false);
    expect(useSelectionStore.getState().selectedIds.size).toBe(1);

    selStore.selectAll(["item-a", "item-b", "item-c"]);
    expect(useSelectionStore.getState().selectedIds.size).toBe(4);

    selStore.clearSelection();
    expect(useSelectionStore.getState().selectedIds.size).toBe(0);
  });

  it("preferences store changes flat color themes and toggles reduce motion", () => {
    const prefStore = usePreferencesStore.getState();
    prefStore.setTheme("light-white");
    expect(usePreferencesStore.getState().theme).toBe("light-white");

    prefStore.setTheme("dark-black");
    expect(usePreferencesStore.getState().theme).toBe("dark-black");

    prefStore.setTheme("dark-blue");
    expect(usePreferencesStore.getState().theme).toBe("dark-blue");

    prefStore.setTheme("light-green");
    expect(usePreferencesStore.getState().theme).toBe("light-green");

    prefStore.setReduceMotion(true);
    expect(usePreferencesStore.getState().reduceMotion).toBe(true);
  });

  it("ui store manages modals and toasts", () => {
    const uiStore = useUiStore.getState();
    uiStore.openModal("settings");
    expect(useUiStore.getState().activeModal).toBe("settings");

    uiStore.closeModal();
    expect(useUiStore.getState().activeModal).toBeNull();

    uiStore.showToast("Test Toast", "success");
    expect(useUiStore.getState().toast?.message).toBe("Test Toast");
    expect(useUiStore.getState().toast?.type).toBe("success");
  });
});
