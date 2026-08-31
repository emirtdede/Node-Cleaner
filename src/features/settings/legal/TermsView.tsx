import React from "react";
import { FileText, Award, UserCheck, Copyright, AlertCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const TermsView: React.FC = () => {
  const { t } = useI18n();

  const sectionIcons = [
    <Award key="grant" size={16} className="legal-section-icon" />,
    <UserCheck key="resp" size={16} className="legal-section-icon" />,
    <Copyright key="ip" size={16} className="legal-section-icon" />,
    <AlertCircle key="as-is" size={16} className="legal-section-icon" />,
  ];

  return (
    <div className="legal-view-container">
      {/* Header Banner */}
      <div className="legal-header-banner">
        <div className="legal-header-icon-wrap">
          <FileText size={26} />
        </div>
        <div>
          <h2 className="legal-header-title">{t.legal.termsItemTitle}</h2>
          <p className="legal-header-subtitle">{t.legal.termsIntro}</p>
        </div>
      </div>

      {/* Structured Sections */}
      <div className="legal-sections-list">
        {t.legal.termsSections.map((sec, idx) => (
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
