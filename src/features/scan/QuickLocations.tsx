import React, { useEffect, useState } from "react";
import { Folder, Star, Plus } from "lucide-react";
import { useScanStore } from "@/stores/scan-store";
import { usePreferencesStore } from "@/stores/preferences-store";
import { scannerApi } from "@/lib/tauri/scanner-api";
import { KnownLocation } from "@/types";
import { useI18n } from "@/lib/i18n";
import { getKnownLocationLabel } from "./scan-helpers";
import "./scan.css";

export const QuickLocations: React.FC = () => {
  const { t } = useI18n();
  const [knownLocations, setKnownLocations] = useState<KnownLocation[]>([]);
  const currentRootPath = useScanStore((s) => s.currentRootPath);
  const status = useScanStore((s) => s.status);
  const favorites = usePreferencesStore((s) => s.favorites);
  const addRecentLocation = usePreferencesStore((s) => s.addRecentLocation);

  const isScanning = status === "scanning" || status === "measuring";

  useEffect(() => {
    scannerApi
      .getKnownLocations()
      .then((locs) => setKnownLocations(locs))
      .catch((err) => console.error("Known locations error:", err));
  }, []);

  const handleSelect = (path: string) => {
    if (isScanning) return;
    useScanStore.getState().resetScan();
    useScanStore.setState({ currentRootPath: path });
    addRecentLocation(path);
  };

  const handleAddCustom = async () => {
    if (isScanning) return;
    const selected = await scannerApi.selectFolderDialog();
    if (selected) {
      handleSelect(selected);
    }
  };

  return (
    <div className="quick-locations-container" role="navigation" aria-label={t.quickLocations.title}>
      <span className="quick-locations-title">{t.quickLocations.title}:</span>

      {knownLocations.slice(0, 5).map((loc) => {
        const isActive = currentRootPath?.toLowerCase() === loc.path.toLowerCase();
        const label = getKnownLocationLabel(loc, t);
        return (
          <button
            key={loc.id}
            type="button"
            className={`quick-chip ${isActive ? "active" : ""}`}
            onClick={() => handleSelect(loc.path)}
            disabled={isScanning}
            title={loc.path}
          >
            <Folder size={12} />
            <span>{label}</span>
          </button>
        );
      })}

      {favorites.map((fav) => {
        const isActive = currentRootPath?.toLowerCase() === fav.path.toLowerCase();
        return (
          <button
            key={fav.id}
            type="button"
            className={`quick-chip ${isActive ? "active" : ""}`}
            onClick={() => handleSelect(fav.path)}
            disabled={isScanning}
            title={fav.path}
          >
            <Star size={12} fill="currentColor" color="var(--warning)" />
            <span>{fav.label}</span>
          </button>
        );
      })}

      <button
        type="button"
        className="quick-chip"
        onClick={handleAddCustom}
        disabled={isScanning}
        title={t.header.chooseFolder}
      >
        <Plus size={12} />
        <span>{t.header.chooseFolder}</span>
      </button>
    </div>
  );
};
