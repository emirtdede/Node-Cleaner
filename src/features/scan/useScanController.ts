import { useCallback } from "react";
import { useScanStore } from "@/stores/scan-store";
import { usePreferencesStore } from "@/stores/preferences-store";
import { useUiStore } from "@/stores/ui-store";
import { scannerApi } from "@/lib/tauri/scanner-api";
import { useI18n } from "@/lib/i18n";

export function useScanController() {
  const { t } = useI18n();
  const status = useScanStore((s) => s.status);
  const startScanState = useScanStore((s) => s.startScanState);
  const updateProgress = useScanStore((s) => s.updateProgress);
  const addCandidateEntry = useScanStore((s) => s.addCandidateEntry);
  const updateEntryMeasurement = useScanStore((s) => s.updateEntryMeasurement);
  const completeScan = useScanStore((s) => s.completeScan);
  const cancelScanState = useScanStore((s) => s.cancelScanState);
  const failScan = useScanStore((s) => s.failScan);
  const addRecentLocation = usePreferencesStore((s) => s.addRecentLocation);
  const showToast = useUiStore((s) => s.showToast);

  const isScanning = status === "scanning" || status === "measuring";

  const startScan = useCallback(
    async (pathOverride?: string) => {
      // Concurrency guard: Prevent starting duplicate scan if already scanning
      const activeStatus = useScanStore.getState().status;
      if (activeStatus === "scanning" || activeStatus === "measuring") {
        return;
      }

      let targetPath = pathOverride || useScanStore.getState().currentRootPath;
      if (!targetPath) {
        targetPath = await scannerApi.selectFolderDialog();
        if (!targetPath) return;
        useScanStore.setState({ currentRootPath: targetPath });
        addRecentLocation(targetPath);
      }

      const scanId = "scan-" + Date.now();
      startScanState(scanId, targetPath);

      try {
        await scannerApi.startScan({ rootPath: targetPath }, (event) => {
          switch (event.type) {
            case "candidate":
              addCandidateEntry(event.entry);
              break;
            case "measured": {
              const raw = event as unknown as Record<string, unknown>;
              const bytes = typeof event.sizeBytes === "number" ? event.sizeBytes : Number(raw.size_bytes || 0);
              updateEntryMeasurement(event.id, bytes);
              break;
            }
            case "progress":
              updateProgress(event.progress);
              break;
            case "completed":
              completeScan(event.summary);
              break;
            case "cancelled":
              cancelScanState(event.summary);
              break;
            case "failed":
              failScan(event.error);
              break;
          }
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        failScan({ code: "ScanFailed", message: msg });
        showToast(t.errors.scanFailed, "error");
      }
    },
    [
      addCandidateEntry,
      addRecentLocation,
      cancelScanState,
      completeScan,
      failScan,
      showToast,
      startScanState,
      t.errors.scanFailed,
      updateEntryMeasurement,
      updateProgress,
    ]
  );

  const cancelScan = useCallback(async () => {
    try {
      await scannerApi.cancelScan();
      cancelScanState();
      showToast(t.scan.cancelled, "info");
    } catch (err) {
      console.error("Failed to cancel scan:", err);
    }
  }, [cancelScanState, showToast, t.scan.cancelled]);

  return {
    isScanning,
    startScan,
    cancelScan,
  };
}
