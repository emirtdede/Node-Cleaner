import React from "react";
import { Scale, ExternalLink, Code2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { scannerApi } from "@/lib/tauri/scanner-api";

export const LicensesView: React.FC = () => {
  const { t } = useI18n();

  const handleOpenUrl = (url: string) => {
    scannerApi.openUrl(url);
  };

  return (
    <div className="legal-view-container">
      {/* Header Banner */}
      <div className="legal-header-banner">
        <div className="legal-header-icon-wrap">
          <Scale size={26} />
        </div>
        <div>
          <h2 className="legal-header-title">{t.legal.licensesItemTitle}</h2>
          <p className="legal-header-subtitle">{t.legal.licensesIntro}</p>
        </div>
      </div>

      {/* Licenses Catalog Grid */}
      <div className="licenses-grid">
        {t.legal.licensesList.map((lib, idx) => (
          <div key={idx} className="license-card">
            <div className="license-card-top">
              <div className="license-card-title-wrap">
                <Code2 size={15} className="license-card-icon" />
                <span className="license-card-name">{lib.name}</span>
                <span className="license-card-version">v{lib.version}</span>
              </div>
              <span className="license-card-badge">{lib.license}</span>
            </div>

            <p className="license-card-desc">{lib.description}</p>

            <div className="license-card-bottom">
              <button
                type="button"
                className="license-card-link"
                onClick={() => handleOpenUrl(lib.url)}
                title={lib.url}
              >
                <span>{lib.url.replace(/^https?:\/\//, "")}</span>
                <ExternalLink size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="legal-footer-meta">
        <span>{t.legal.allRightsReserved}</span>
        <span>Node Cleaner • Vellium</span>
      </div>
    </div>
  );
};
