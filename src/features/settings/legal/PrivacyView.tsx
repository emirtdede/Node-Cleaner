import React from "react";
import { ShieldCheck, HardDrive, WifiOff, Lock, EyeOff } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const PrivacyView: React.FC = () => {
  const { t } = useI18n();

  const sectionIcons = [
    <WifiOff key="wifi" size={16} className="legal-section-icon" />,
    <HardDrive key="disk" size={16} className="legal-section-icon" />,
    <Lock key="lock" size={16} className="legal-section-icon" />,
    <EyeOff key="eye" size={16} className="legal-section-icon" />,
  ];

  return (
    <div className="legal-view-container">
      {/* Header Banner */}
      <div className="legal-header-banner">
        <div className="legal-header-icon-wrap">
          <ShieldCheck size={26} />
        </div>
        <div>
          <h2 className="legal-header-title">{t.legal.privacyItemTitle}</h2>
          <p className="legal-header-subtitle">{t.legal.privacyIntro}</p>
        </div>
      </div>

      {/* Feature Guarantee Badges */}
      <div className="legal-badge-row">
        <span className="legal-pill-badge">
          <WifiOff size={12} />
          <span>%100 Offline</span>
        </span>
        <span className="legal-pill-badge">
          <EyeOff size={12} />
          <span>Zero Telemetry</span>
        </span>
        <span className="legal-pill-badge">
          <HardDrive size={12} />
          <span>Local Storage Only</span>
        </span>
      </div>

      {/* Structured Sections */}
      <div className="legal-sections-list">
        {t.legal.privacySections.map((sec, idx) => (
          <div key={idx} className="legal-section-card">
            <div className="legal-section-header">
              {sectionIcons[idx % sectionIcons.length]}
              <h3 className="legal-section-title">{sec.title}</h3>
            </div>
            <p className="legal-paragraph">{sec.content}</p>
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
