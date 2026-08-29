import React, { useEffect, useState, useRef } from "react";
import {
  FolderOpen,
  Folder,
  FolderPlus,
  Play,
  Square,
  Settings,
  Star,
  ChevronDown,
  Check,
  X,
  History,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { IconButton } from "@/components/primitives/IconButton";
import { Logo } from "@/components/brand/Logo";
import { WindowControls } from "@/components/layout/WindowControls";
import { useScanStore } from "@/stores/scan-store";
import { usePreferencesStore } from "@/stores/preferences-store";
import { useUiStore } from "@/stores/ui-store";
import { scannerApi } from "@/lib/tauri/scanner-api";
import { KnownLocation } from "@/types";
import { useI18n } from "@/lib/i18n";
import { truncatePath } from "@/lib/formatters";
import { getKnownLocationLabel } from "./scan-helpers";
import { useScanController } from "./useScanController";
import "./scan.css";

export const ScanHeader: React.FC = () => {
  const { t } = useI18n();
  const currentRootPath = useScanStore((s) => s.currentRootPath);
  const { isScanning, startScan, cancelScan } = useScanController();

  const favorites = usePreferencesStore((s) => s.favorites);
  const recentLocations = usePreferencesStore((s) => s.recentLocations);
  const addFavorite = usePreferencesStore((s) => s.addFavorite);
  const removeFavorite = usePreferencesStore((s) => s.removeFavorite);
  const addRecentLocation = usePreferencesStore((s) => s.addRecentLocation);
  const removeRecentLocation = usePreferencesStore((s) => s.removeRecentLocation);
  const clearRecentLocations = usePreferencesStore((s) => s.clearRecentLocations);

  const openModal = useUiStore((s) => s.openModal);
  const showToast = useUiStore((s) => s.showToast);

  const [knownLocations, setKnownLocations] = useState<KnownLocation[]>([]);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const isSelectingFolderRef = useRef(false);

  useEffect(() => {
    scannerApi
      .getKnownLocations()
      .then((locs) => setKnownLocations(locs))
      .catch((err) => console.error("Known locations error:", err));
  }, []);

  // Click outside and escape key handler
  useEffect(() => {
    if (!isLocationMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setIsLocationMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLocationMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLocationMenuOpen]);

  const currentFavorite = currentRootPath
    ? favorites.find((f) => f.path.toLowerCase() === currentRootPath.toLowerCase())
    : null;
  const isFavorite = Boolean(currentFavorite);

  const handleSelectFolder = async () => {
    if (isScanning || isSelectingFolderRef.current) return;
    isSelectingFolderRef.current = true;
    setIsLocationMenuOpen(false);
    try {
      const selected = await scannerApi.selectFolderDialog();
      if (selected) {
        useScanStore.getState().resetScan();
        useScanStore.setState({ currentRootPath: selected });
        addRecentLocation(selected);
      }
    } catch (err) {
      console.error(err);
      showToast(t.errors.invalidPath, "error");
    } finally {
      isSelectingFolderRef.current = false;
    }
  };

  const handleSelectLocation = (path: string) => {
    if (isScanning) return;
    setIsLocationMenuOpen(false);
    useScanStore.getState().resetScan();
    useScanStore.setState({ currentRootPath: path });
    addRecentLocation(path);
  };

  const toggleFavorite = () => {
    if (!currentRootPath) return;
    if (currentFavorite) {
      removeFavorite(currentFavorite.id);
      showToast(t.settings.favoriteRemoved, "info");
    } else {
      addFavorite(currentRootPath);
      showToast(t.settings.favoriteAdded, "success");
    }
  };

  const handleStartScan = (pathOverride?: string) => {
    startScan(pathOverride);
  };

  const handleCancelScan = () => {
    cancelScan();
  };

  return (
    <header className="top-command-bar" data-tauri-drag-region>
      {/* 1. Left: Single Brand Title */}
      <div
        className="command-brand"
        onClick={() => useScanStore.getState().resetScan()}
        title="Node Cleaner"
        data-tauri-drag-region="false"
      >
        <Logo size={18} showWordmark={false} />
        <span className="command-brand-title">Node Cleaner</span>
      </div>

      {/* 2. Center: Single Location Dropdown Trigger & Popover Menu */}
      <div className="command-center" data-tauri-drag-region>
        <div className="location-dropdown-container" ref={menuContainerRef} data-tauri-drag-region="false">
          <button
            type="button"
            className={`command-location-pill ${isScanning ? "is-scanning" : ""} ${isLocationMenuOpen ? "menu-open" : ""}`}
            onClick={() => {
              if (!isScanning) setIsLocationMenuOpen((prev) => !prev);
            }}
            title={currentRootPath || t.header.folderNotSelected}
          >
            <FolderOpen size={14} className="command-folder-icon" />
            <span className="command-path-text">
              {currentRootPath ? truncatePath(currentRootPath, 34) : t.header.folderNotSelected}
            </span>

            {currentRootPath && !isScanning && (
              <span
                role="button"
                tabIndex={0}
                className={`command-star-btn ${isFavorite ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    toggleFavorite();
                  }
                }}
                title={isFavorite ? t.favorites.remove : t.favorites.addCurrent}
              >
                <Star
                  size={12}
                  fill={isFavorite ? "#FFB800" : "none"}
                  color={isFavorite ? "#FFB800" : "var(--text-muted)"}
                />
              </span>
            )}

            {!isScanning && (
              <ChevronDown
                size={13}
                className={`command-chevron-icon ${isLocationMenuOpen ? "open" : ""}`}
              />
            )}
          </button>

          {/* Location Dropdown Menu */}
          {isLocationMenuOpen && !isScanning && (
            <div className="location-dropdown-menu" data-tauri-drag-region="false">
              {/* 1. En Başta: Farklı Bir Konum Seç */}
              <div className="location-menu-section">
                <button
                  type="button"
                  className="location-menu-item location-menu-action"
                  onClick={handleSelectFolder}
                >
                  <div className="location-menu-item-icon action-icon">
                    <FolderPlus size={16} />
                  </div>
                  <div className="location-menu-item-info">
                    <span className="location-menu-item-title">{t.header.chooseFolder}</span>
                    <span className="location-menu-item-path">{t.header.chooseFolderSub}</span>
                  </div>
                </button>
              </div>

              <div className="location-menu-divider" />

              {/* 2. Varsayılan Konumlar */}
              <div className="location-menu-section">
                <div className="location-menu-section-header">
                  <span>{t.header.defaultLocations}</span>
                </div>
                {knownLocations.map((loc) => {
                  const isSelected = currentRootPath?.toLowerCase() === loc.path.toLowerCase();
                  const label = getKnownLocationLabel(loc, t);
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      className={`location-menu-item ${isSelected ? "is-selected" : ""}`}
                      onClick={() => handleSelectLocation(loc.path)}
                      title={loc.path}
                    >
                      <div className="location-menu-item-icon">
                        <Folder size={15} />
                      </div>
                      <div className="location-menu-item-info">
                        <span className="location-menu-item-title">{label}</span>
                        <span className="location-menu-item-path">{truncatePath(loc.path, 34)}</span>
                      </div>
                      {isSelected && (
                        <div className="location-menu-item-check">
                          <Check size={14} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 3. Favoriler (Varsa veya Bilgi) */}
              <div className="location-menu-divider" />
              <div className="location-menu-section">
                <div className="location-menu-section-header">
                  <span>{t.header.favorites}</span>
                  {favorites.length > 0 && (
                    <span className="location-menu-badge">{favorites.length}</span>
                  )}
                </div>

                {favorites.length > 0 ? (
                  favorites.map((fav) => {
                    const isSelected = currentRootPath?.toLowerCase() === fav.path.toLowerCase();
                    return (
                      <div
                        key={fav.id}
                        className={`location-menu-item-row ${isSelected ? "is-selected" : ""}`}
                        onClick={() => handleSelectLocation(fav.path)}
                      >
                        <div className="location-menu-item-icon fav-icon">
                          <Star size={15} fill="#FFB800" color="#FFB800" />
                        </div>
                        <div className="location-menu-item-info">
                          <span className="location-menu-item-title">{fav.label}</span>
                          <span className="location-menu-item-path">{truncatePath(fav.path, 30)}</span>
                        </div>
                        {isSelected && (
                          <div className="location-menu-item-check">
                            <Check size={14} />
                          </div>
                        )}
                        <button
                          type="button"
                          className="location-menu-item-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFavorite(fav.id);
                            showToast(t.settings.favoriteRemoved, "info");
                          }}
                          title={t.favorites.remove}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="location-menu-empty">
                    <span>{t.header.noFavorites}</span>
                  </div>
                )}
              </div>

              {/* 4. Son Tarananlar (Varsa) */}
              {recentLocations.length > 0 && (
                <>
                  <div className="location-menu-divider" />
                  <div className="location-menu-section">
                    <div className="location-menu-section-header">
                      <span>{t.header.recent}</span>
                      <button
                        type="button"
                        className="location-menu-clear-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearRecentLocations();
                        }}
                        title={t.favorites.remove}
                      >
                        <Trash2 size={11} />
                        <span>{t.table.actions ? (t.actionBar.clearSelection.includes(" ") ? t.actionBar.clearSelection.split(" ").pop() : t.actionBar.clearSelection) : "Temizle"}</span>
                      </button>
                    </div>
                    {recentLocations.slice(0, 5).map((path, idx) => {
                      const isSelected = currentRootPath?.toLowerCase() === path.toLowerCase();
                      const name = path.split(/[/\\]/).filter(Boolean).pop() || path;
                      return (
                        <div
                          key={idx}
                          className={`location-menu-item-row ${isSelected ? "is-selected" : ""}`}
                          onClick={() => handleSelectLocation(path)}
                        >
                          <div className="location-menu-item-icon recent-icon">
                            <History size={14} />
                          </div>
                          <div className="location-menu-item-info">
                            <span className="location-menu-item-title">{name}</span>
                            <span className="location-menu-item-path">{truncatePath(path, 30)}</span>
                          </div>
                          {isSelected && (
                            <div className="location-menu-item-check">
                              <Check size={14} />
                            </div>
                          )}
                          <button
                            type="button"
                            className="location-menu-item-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRecentLocation(path);
                            }}
                            title={t.favorites.remove}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Right: Actions + Window Controls */}
      <div className="command-actions" data-tauri-drag-region="false">
        {isScanning ? (
          <Button
            variant="danger-outline"
            size="sm"
            className="command-scan-btn is-cancelling"
            icon={<Square size={11} fill="currentColor" />}
            onClick={handleCancelScan}
          >
            {t.header.stopScan}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            className="command-scan-btn"
            icon={<Play size={11} fill="currentColor" />}
            onClick={() => handleStartScan()}
          >
            {t.header.scan}
          </Button>
        )}

        <IconButton
          size="sm"
          aria-label={t.header.settings}
          tooltip={t.header.settings}
          onClick={() => openModal("settings")}
        >
          <Settings size={15} />
        </IconButton>

        <WindowControls />
      </div>
    </header>
  );
};
