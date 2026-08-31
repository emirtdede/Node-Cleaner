import React, { useState, useMemo, useEffect } from "react";
import {
  Moon,
  Sun,
  Info,
  Trash2,
  Check,
  Search,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  ShieldAlert,
  Scale,
} from "lucide-react";
import { Dialog } from "@/components/primitives/Dialog";
import { Button } from "@/components/primitives/Button";
import { IconButton } from "@/components/primitives/IconButton";
import { VelliumLogo } from "@/components/brand/VelliumLogo";
import { useUiStore } from "@/stores/ui-store";
import { usePreferencesStore } from "@/stores/preferences-store";
import { scannerApi } from "@/lib/tauri/scanner-api";
import { ThemeMode, SupportedLanguage } from "@/types";
import { useI18n } from "@/lib/i18n";
import { LANGUAGES_LIST } from "@/locales/languages";
import {
  VelliumView,
  PrivacyView,
  TermsView,
  SecurityView,
  LicensesView,
} from "./legal";
import "./settings.css";

interface ThemeMeta {
  id: ThemeMode;
  bgPreview: string;
  accentPreview: string;
  borderPreview: string;
}

type SettingsView = "main" | "vellium" | "privacy" | "terms" | "security" | "licenses";

const darkThemesMeta: ThemeMeta[] = [
  {
    id: "dark-black",
    bgPreview: "#0C0C0E",
    accentPreview: "#3B82F6",
    borderPreview: "rgba(255, 255, 255, 0.18)",
  },
  {
    id: "dark-gray",
    bgPreview: "#16171B",
    accentPreview: "#60A5FA",
    borderPreview: "rgba(255, 255, 255, 0.18)",
  },
  {
    id: "dark-blue",
    bgPreview: "#0A1120",
    accentPreview: "#38BDF8",
    borderPreview: "rgba(96, 165, 250, 0.3)",
  },
  {
    id: "dark-purple",
    bgPreview: "#120A1E",
    accentPreview: "#C084FC",
    borderPreview: "rgba(192, 132, 252, 0.3)",
  },
  {
    id: "dark-green",
    bgPreview: "#081611",
    accentPreview: "#34D399",
    borderPreview: "rgba(52, 211, 153, 0.3)",
  },
  {
    id: "dark-red",
    bgPreview: "#18090B",
    accentPreview: "#F87171",
    borderPreview: "rgba(248, 113, 113, 0.3)",
  },
  {
    id: "dark-orange",
    bgPreview: "#180E07",
    accentPreview: "#FB923C",
    borderPreview: "rgba(251, 146, 60, 0.3)",
  },
  {
    id: "dark-yellow",
    bgPreview: "#161307",
    accentPreview: "#FACC15",
    borderPreview: "rgba(250, 204, 21, 0.3)",
  },
];

const lightThemesMeta: ThemeMeta[] = [
  {
    id: "light-white",
    bgPreview: "#F8FAFC",
    accentPreview: "#2563EB",
    borderPreview: "rgba(0, 0, 0, 0.14)",
  },
  {
    id: "light-gray",
    bgPreview: "#EAECEF",
    accentPreview: "#475569",
    borderPreview: "rgba(0, 0, 0, 0.14)",
  },
  {
    id: "light-blue",
    bgPreview: "#EFF6FF",
    accentPreview: "#0284C7",
    borderPreview: "rgba(2, 132, 199, 0.25)",
  },
  {
    id: "light-purple",
    bgPreview: "#FAF5FF",
    accentPreview: "#7C3AED",
    borderPreview: "rgba(147, 51, 234, 0.25)",
  },
  {
    id: "light-green",
    bgPreview: "#F0FDF4",
    accentPreview: "#059669",
    borderPreview: "rgba(5, 150, 105, 0.25)",
  },
  {
    id: "light-red",
    bgPreview: "#FFF1F2",
    accentPreview: "#E11D48",
    borderPreview: "rgba(225, 29, 72, 0.25)",
  },
  {
    id: "light-orange",
    bgPreview: "#FFF7ED",
    accentPreview: "#EA580C",
    borderPreview: "rgba(234, 88, 12, 0.25)",
  },
  {
    id: "light-yellow",
    bgPreview: "#FEFCE8",
    accentPreview: "#D97706",
    borderPreview: "rgba(202, 138, 4, 0.25)",
  },
];

export const SettingsPanel: React.FC = () => {
  const { t } = useI18n();
  const activeModal = useUiStore((s) => s.activeModal);
  const closeModal = useUiStore((s) => s.closeModal);
  const showToast = useUiStore((s) => s.showToast);

  const theme = usePreferencesStore((s) => s.theme);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  const language = usePreferencesStore((s) => s.language) || "en";
  const setLanguage = usePreferencesStore((s) => s.setLanguage);
  const reduceMotion = usePreferencesStore((s) => s.reduceMotion);
  const setReduceMotion = usePreferencesStore((s) => s.setReduceMotion);
  const favorites = usePreferencesStore((s) => s.favorites);
  const removeFavorite = usePreferencesStore((s) => s.removeFavorite);

  const [activeView, setActiveView] = useState<SettingsView>("main");
  const [langSearch, setLangSearch] = useState("");

  const isOpen = activeModal === "settings";

  // Reset to main view whenever modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setActiveView("main");
    }
  }, [isOpen]);

  const persistSettings = () => {
    const state = usePreferencesStore.getState();
    scannerApi
      .saveAppSettings({
        schemaVersion: state.schemaVersion,
        theme: state.theme,
        language: state.language,
        reduceMotion: state.reduceMotion,
        favorites: state.favorites,
        recentLocations: state.recentLocations,
        lastScanPath: state.lastScanPath,
        sort: state.sort,
      })
      .catch((err) => console.error("Save settings error:", err));
  };

  const handleThemeSelect = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    setTimeout(persistSettings, 50);
  };

  const handleLanguageSelect = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    setTimeout(persistSettings, 50);
  };

  const handleReduceMotionToggle = (checked: boolean) => {
    setReduceMotion(checked);
    setTimeout(persistSettings, 50);
  };

  const handleRemoveFav = (id: string) => {
    removeFavorite(id);
    showToast(t.settings.favoriteRemoved, "info");
    setTimeout(persistSettings, 50);
  };

  const filteredLanguages = useMemo(() => {
    if (!langSearch.trim()) return LANGUAGES_LIST;
    const q = langSearch.toLowerCase().trim();
    return LANGUAGES_LIST.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q)
    );
  }, [langSearch]);

  const activeLangMeta = useMemo(() => {
    return LANGUAGES_LIST.find((l) => l.id === language) || LANGUAGES_LIST[0];
  }, [language]);

  // Normalization helper for active selection match
  const isThemeSelected = (id: ThemeMode) => {
    if (theme === id) return true;
    if (id === "dark-black" && (theme === "black" || theme === "dark-transparent" || theme === "transparent")) return true;
    if (id === "light-white" && (theme === "white" || theme === "white-transparent")) return true;
    return false;
  };

  const getThemeLabel = (themeId: ThemeMode) => {
    const localized = t.settings.themes?.[themeId as keyof typeof t.settings.themes];
    if (localized) return localized;
    return themeId;
  };

  const renderThemeCard = (themeMeta: ThemeMeta) => {
    const isSelected = isThemeSelected(themeMeta.id);
    const label = getThemeLabel(themeMeta.id);
    return (
      <button
        key={themeMeta.id}
        type="button"
        className={`theme-card-btn ${isSelected ? "is-selected" : ""}`}
        onClick={() => handleThemeSelect(themeMeta.id)}
        title={label}
      >
        <div
          className="theme-card-swatch"
          style={{
            backgroundColor: themeMeta.bgPreview,
            border: `1px solid ${themeMeta.borderPreview}`,
          }}
        >
          <div
            className="theme-card-dot"
            style={{ backgroundColor: themeMeta.accentPreview }}
          />
        </div>

        <span className="theme-card-label">{label}</span>

        {isSelected && <Check size={13} className="theme-card-check" />}
      </button>
    );
  };

  // Dynamic Dialog Title supporting Back Navigation
  const renderDialogTitle = () => {
    if (activeView === "main") {
      return <span>{t.settings.title}</span>;
    }

    let subTitle = "";
    if (activeView === "vellium") subTitle = t.legal.velliumItemTitle;
    else if (activeView === "privacy") subTitle = t.legal.privacyItemTitle;
    else if (activeView === "terms") subTitle = t.legal.termsItemTitle;
    else if (activeView === "security") subTitle = t.legal.securityItemTitle;
    else if (activeView === "licenses") subTitle = t.legal.licensesItemTitle;

    return (
      <div className="settings-subview-header">
        <button
          type="button"
          className="settings-header-back-btn"
          onClick={() => setActiveView("main")}
          title={t.legal.back}
        >
          <ArrowLeft size={16} />
          <span>{t.legal.back}</span>
        </button>
        <span className="settings-header-separator">/</span>
        <span className="settings-header-subview-title">{subTitle}</span>
      </div>
    );
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={closeModal}
      title={renderDialogTitle()}
      maxWidth="660px"
      footer={
        activeView === "main" ? (
          <Button variant="primary" onClick={closeModal}>
            {t.settings.close}
          </Button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <Button variant="secondary" onClick={() => setActiveView("main")}>
              <ArrowLeft size={14} style={{ marginRight: 6 }} />
              {t.legal.back}
            </Button>
            <Button variant="primary" onClick={closeModal}>
              {t.settings.close}
            </Button>
          </div>
        )
      }
    >
      {activeView === "vellium" && <VelliumView />}
      {activeView === "privacy" && <PrivacyView />}
      {activeView === "terms" && <TermsView />}
      {activeView === "security" && <SecurityView />}
      {activeView === "licenses" && <LicensesView />}

      {activeView === "main" && (
        <div className="settings-body">
          {/* 1. Language Selection (73 Languages) */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <h3 className="settings-section-title" style={{ margin: 0 }}>
                {t.settings.language}
              </h3>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--accent)", fontWeight: 600 }}>
                {activeLangMeta.nativeName} ({activeLangMeta.name})
              </span>
            </div>

            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {/* Search input */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: "var(--surface-sunken, rgba(0,0,0,0.15))",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "4px 10px",
                }}
              >
                <Search size={14} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder={t.settings.searchLanguage}
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "var(--text-primary)",
                    fontSize: "var(--text-xs)",
                    width: "100%",
                  }}
                />
              </div>

              {/* Language grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                  gap: 6,
                  maxHeight: 150,
                  overflowY: "auto",
                  paddingRight: 4,
                }}
              >
                {filteredLanguages.map((l) => {
                  const isSelected = language === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => handleLanguageSelect(l.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "6px 8px",
                        borderRadius: "var(--radius-sm)",
                        border: isSelected
                          ? "1px solid var(--accent)"
                          : "1px solid var(--border)",
                        backgroundColor: isSelected
                          ? "rgba(10, 132, 255, 0.12)"
                          : "transparent",
                        color: isSelected ? "var(--accent)" : "var(--text-primary)",
                        cursor: "pointer",
                        fontSize: "11px",
                        textAlign: "left",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                        <span style={{ fontWeight: isSelected ? 700 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {l.nativeName}
                        </span>
                        <span style={{ fontSize: "9.5px", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {l.name}
                        </span>
                      </div>
                      {isSelected && <Check size={12} color="var(--accent)" style={{ flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Theme Selection */}
          <div>
            <h3 className="settings-section-title">
              {t.settings.appearance} — {t.settings.theme}
            </h3>

            {/* Group A: Dark Themes */}
            <div className="theme-group">
              <div className="theme-group-header">
                <Moon size={13} />
                <span>{t.settings.darkThemes}</span>
              </div>
              <div className="theme-grid">
                {darkThemesMeta.map(renderThemeCard)}
              </div>
            </div>

            {/* Group B: Light Themes */}
            <div className="theme-group">
              <div className="theme-group-header">
                <Sun size={13} />
                <span>{t.settings.lightThemes}</span>
              </div>
              <div className="theme-grid">
                {lightThemesMeta.map(renderThemeCard)}
              </div>
            </div>
          </div>

          {/* 3. Performance & Reduce Motion */}
          <div>
            <h3 className="settings-section-title">
              {t.settings.performance}
            </h3>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {t.settings.reduceMotion}
                </div>
                <div
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-secondary)",
                    marginTop: 2,
                  }}
                >
                  {t.settings.reduceMotionDesc}
                </div>
              </div>

              <input
                type="checkbox"
                checked={reduceMotion}
                onChange={(e) => handleReduceMotionToggle(e.target.checked)}
                style={{
                  width: 18,
                  height: 18,
                  accentColor: "var(--accent)",
                  cursor: "pointer",
                }}
              />
            </label>
          </div>

          {/* 4. Favorites Management */}
          <div>
            <h3 className="settings-section-title">
              {t.settings.favoritesManagement}
            </h3>

            {favorites.length === 0 ? (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  fontSize: "var(--text-xs)",
                  color: "var(--text-muted)",
                }}
              >
                {t.settings.noFavorites}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  maxHeight: 140,
                  overflowY: "auto",
                }}
              >
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      fontSize: "var(--text-xs)",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        {fav.label}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {fav.path}
                      </span>
                    </div>

                    <IconButton
                      size="sm"
                      aria-label={t.favorites.remove}
                      tooltip={t.favorites.remove}
                      onClick={() => handleRemoveFav(fav.id)}
                    >
                      <Trash2 size={14} color="var(--danger)" />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. About & Platform */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent)" }}>
              <Info size={16} />
              <span style={{ fontWeight: 600, fontSize: "var(--text-xs)" }}>
                {t.settings.about}
              </span>
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-primary)", fontWeight: 600 }}>
              {t.settings.platform} • {t.settings.version} 1.0.0
            </p>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
              {t.settings.publisher}
            </p>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: 1.5 }}>
              {t.settings.privacyNote}
            </p>
          </div>

          {/* 6. Legal & Corporate Sub-Pages Navigation */}
          <div>
            <h3 className="settings-section-title">
              {t.legal.sectionTitle}
            </h3>

            <div className="legal-nav-grid">
              {/* 6.1 Vellium Corporate Page */}
              <button
                type="button"
                className="legal-nav-btn vellium-highlight-btn"
                onClick={() => setActiveView("vellium")}
              >
                <div className="legal-nav-btn-left">
                  <div className="legal-nav-icon-wrap vellium-icon-wrap">
                    <VelliumLogo size={18} />
                  </div>
                  <div className="legal-nav-text-wrap">
                    <span className="legal-nav-title">{t.legal.velliumItemTitle}</span>
                    <span className="legal-nav-desc">{t.legal.velliumItemDesc}</span>
                  </div>
                </div>
                <ChevronRight size={15} className="legal-nav-chevron" />
              </button>

              {/* 6.2 Privacy Policy */}
              <button
                type="button"
                className="legal-nav-btn"
                onClick={() => setActiveView("privacy")}
              >
                <div className="legal-nav-btn-left">
                  <div className="legal-nav-icon-wrap">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="legal-nav-text-wrap">
                    <span className="legal-nav-title">{t.legal.privacyItemTitle}</span>
                    <span className="legal-nav-desc">{t.legal.privacyItemDesc}</span>
                  </div>
                </div>
                <ChevronRight size={15} className="legal-nav-chevron" />
              </button>

              {/* 6.3 Terms of Service & EULA */}
              <button
                type="button"
                className="legal-nav-btn"
                onClick={() => setActiveView("terms")}
              >
                <div className="legal-nav-btn-left">
                  <div className="legal-nav-icon-wrap">
                    <FileText size={18} />
                  </div>
                  <div className="legal-nav-text-wrap">
                    <span className="legal-nav-title">{t.legal.termsItemTitle}</span>
                    <span className="legal-nav-desc">{t.legal.termsItemDesc}</span>
                  </div>
                </div>
                <ChevronRight size={15} className="legal-nav-chevron" />
              </button>

              {/* 6.4 Security & Data Safety */}
              <button
                type="button"
                className="legal-nav-btn"
                onClick={() => setActiveView("security")}
              >
                <div className="legal-nav-btn-left">
                  <div className="legal-nav-icon-wrap">
                    <ShieldAlert size={18} />
                  </div>
                  <div className="legal-nav-text-wrap">
                    <span className="legal-nav-title">{t.legal.securityItemTitle}</span>
                    <span className="legal-nav-desc">{t.legal.securityItemDesc}</span>
                  </div>
                </div>
                <ChevronRight size={15} className="legal-nav-chevron" />
              </button>

              {/* 6.5 Third-Party Licenses */}
              <button
                type="button"
                className="legal-nav-btn"
                onClick={() => setActiveView("licenses")}
              >
                <div className="legal-nav-btn-left">
                  <div className="legal-nav-icon-wrap">
                    <Scale size={18} />
                  </div>
                  <div className="legal-nav-text-wrap">
                    <span className="legal-nav-title">{t.legal.licensesItemTitle}</span>
                    <span className="legal-nav-desc">{t.legal.licensesItemDesc}</span>
                  </div>
                </div>
                <ChevronRight size={15} className="legal-nav-chevron" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
};

