import React, { useEffect } from "react";
import { ScanHeader } from "@/features/scan/ScanHeader";
import { ScanHero } from "@/features/scan/ScanHero";
import { NodeModulesTable } from "@/features/results/NodeModulesTable";
import { SelectionActionBar } from "@/features/results/SelectionActionBar";
import { RecycleConfirmDialog } from "@/features/deletion/RecycleConfirmDialog";
import { PermanentConfirmDialog } from "@/features/deletion/PermanentConfirmDialog";
import { PartialErrorReportDialog } from "@/features/deletion/PartialErrorReportDialog";
import { SettingsPanel } from "@/features/settings/SettingsPanel";
import { Toast } from "@/components/primitives/Toast";
import { usePreferencesStore } from "@/stores/preferences-store";
import { useScanStore } from "@/stores/scan-store";
import { useScanController } from "@/features/scan/useScanController";
import { scannerApi } from "@/lib/tauri/scanner-api";
import "@/styles/index.css";

export const App: React.FC = () => {
  const loadPreferences = usePreferencesStore((s) => s.loadPreferences);
  const { startScan } = useScanController();

  // Load user settings on startup (Mount only)
  useEffect(() => {
    scannerApi
      .getAppSettings()
      .then((prefs) => {
        loadPreferences(prefs);
        const activePath = useScanStore.getState().currentRootPath;
        if (prefs.lastScanPath && !activePath) {
          useScanStore.setState({ currentRootPath: prefs.lastScanPath });
        }
      })
      .catch((err) => console.error("Could not load initial settings:", err));
  }, [loadPreferences]);

  const handleStartScanFromHero = () => {
    startScan();
  };

  return (
    <div className="app-container">
      {/* 1. Frameless Custom Window Header (Titlebar + Brand + Location + Actions + Window Controls) */}
      <ScanHeader />

      {/* 2. Main Content Canvas */}
      <main className="app-content-canvas">
        <ScanHero onStartScan={handleStartScanFromHero} />
        <NodeModulesTable />
      </main>

      {/* 3. Floating Selection Action Bar */}
      <SelectionActionBar />

      {/* 4. Modals */}
      <RecycleConfirmDialog />
      <PermanentConfirmDialog />
      <PartialErrorReportDialog />
      <SettingsPanel />

      {/* 5. Toast Notifications */}
      <Toast />
    </div>
  );
};
