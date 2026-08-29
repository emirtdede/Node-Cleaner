import React from "react";
import { FolderSearch, Play, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { useScanStore } from "@/stores/scan-store";
import { useI18n } from "@/lib/i18n";
import "./scan.css";

interface ScanHeroProps {
  onStartScan: () => void;
}

export const ScanHero: React.FC<ScanHeroProps> = ({ onStartScan }) => {
  const { t } = useI18n();
  const status = useScanStore((s) => s.status);
  const currentRootPath = useScanStore((s) => s.currentRootPath);
  const summary = useScanStore((s) => s.summary);
  const error = useScanStore((s) => s.error);
  const entryCount = useScanStore((s) => s.entryIds.length);

  // If there are results in the table, hide the hero
  if (entryCount > 0) {
    return null;
  }

  // 1. Error State
  if (status === "failed" && error) {
    return (
      <div className="scan-hero-viewport">
        <div
          className="hero-icon-container"
          style={{
            borderColor: "rgba(229, 72, 77, 0.3)",
            color: "var(--danger)",
          }}
        >
          <AlertCircle size={28} />
        </div>
        <h2 className="hero-main-title">{t.scan.failed}</h2>
        <p className="hero-main-subtitle">{error.message}</p>
        <Button variant="primary" size="md" className="hero-cta-btn" onClick={onStartScan}>
          {t.header.rescan}
        </Button>
      </div>
    );
  }

  // 2. Completed with 0 results
  if (status === "completed" && summary) {
    return (
      <div className="scan-hero-viewport">
        <div
          className="hero-icon-container"
          style={{
            borderColor: "rgba(46, 155, 99, 0.3)",
            color: "var(--success)",
          }}
        >
          <CheckCircle2 size={28} />
        </div>
        <h2 className="hero-main-title">{t.scan.completed}</h2>
        <p className="hero-main-subtitle">{t.scan.noResultsFound}</p>
        <Button variant="secondary" size="md" className="hero-cta-btn" onClick={onStartScan}>
          {t.header.rescan}
        </Button>
      </div>
    );
  }

  // 3. Clean Idle / Welcome State
  return (
    <div className="scan-hero-viewport">
      <div className="hero-icon-container">
        <FolderSearch size={28} />
      </div>
      <h1 className="hero-main-title">{t.scan.idleTitle}</h1>
      <p className="hero-main-subtitle">{t.scan.idleSubtitle}</p>

      {/* Main Action CTA */}
      <Button
        variant="primary"
        size="lg"
        className="hero-cta-btn"
        icon={<Play size={14} fill="currentColor" />}
        onClick={onStartScan}
      >
        {currentRootPath ? t.header.startScan : t.header.chooseFolder}
      </Button>
    </div>
  );
};
