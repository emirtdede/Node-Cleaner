import React from "react";
import { ExternalLink, Globe, Sparkles } from "lucide-react";
import { VelliumLogo } from "@/components/brand/VelliumLogo";
import { useI18n } from "@/lib/i18n";
import { scannerApi } from "@/lib/tauri/scanner-api";

export const VelliumView: React.FC = () => {
  const { t } = useI18n();

  const handleOpenWebsite = () => {
    scannerApi.openUrl("https://vellium.dev");
  };

  return (
    <div className="legal-view-container">
      {/* Brand Hero Banner */}
      <div className="vellium-hero-card">
        <div className="vellium-hero-logo-wrap">
          <VelliumLogo size={54} color="var(--text-primary)" />
        </div>
        <div className="vellium-hero-content">
          <h2 className="vellium-hero-title">VELLIUM</h2>
          <p className="vellium-hero-tagline">{t.legal.velliumTagline}</p>
        </div>
      </div>

      {/* Website Action Badge */}
      <div className="vellium-site-link-bar">
        <button
          type="button"
          className="vellium-site-btn"
          onClick={handleOpenWebsite}
          title="https://vellium.dev"
        >
          <Globe size={15} className="vellium-site-icon" />
          <span className="vellium-site-text">Vellium.dev</span>
          <ExternalLink size={13} className="vellium-site-ext" />
        </button>
        <span className="vellium-status-badge">
          <Sparkles size={12} />
          <span>Local-First &amp; Engineered Comfort</span>
        </span>
      </div>

      {/* Corporate Manifesto Body */}
      <div className="legal-content-card">
        {t.legal.velliumManifesto.map((paragraph, index) => (
          <p key={index} className="legal-paragraph vellium-manifesto-para">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Footer Meta */}
      <div className="legal-footer-meta">
        <span>{t.legal.allRightsReserved}</span>
        <span>v1.0.0</span>
      </div>
    </div>
  );
};
