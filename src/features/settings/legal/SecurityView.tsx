import React from "react";
import { ShieldAlert, FolderLock, Trash2, CheckCircle2, Power } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const SecurityView: React.FC = () => {
  const { t } = useI18n();

  const sectionIcons = [
    <FolderLock key="lock" size={16} className="legal-section-icon" />,
    <Trash2 key="trash" size={16} className="legal-section-icon" />,
    <CheckCircle2 key="check" size={16} className="legal-section-icon" />,
    <Power key="power" size={16} className="legal-section-icon" />,
  ];

  return (
    <div className="legal-view-container">
      {/* Header Banner */}
      <div className="legal-header-banner">
        <div className="legal-header-icon-wrap">
          <ShieldAlert size={26} />
        </div>
        <div>
          <h2 className="legal-header-title">{t.legal.securityItemTitle}</h2>
          <p className="legal-header-subtitle">{t.legal.securityIntro}</p>
        </div>
      </div>

      {/* Structured Sections */}
      <div className="legal-sections-list">
        {t.legal.securitySections.map((sec, idx) => (
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
