import React, { useMemo } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { IconButton } from "@/components/primitives/IconButton";
import { useScanStore } from "@/stores/scan-store";
import { useSelectionStore } from "@/stores/selection-store";
import { useUiStore } from "@/stores/ui-store";
import { formatBytes } from "@/lib/formatters";
import { useI18n } from "@/lib/i18n";
import "./results.css";

export const SelectionActionBar: React.FC = () => {
  const { t } = useI18n();
  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const clearSelection = useSelectionStore((s) => s.clearSelection);
  const entriesById = useScanStore((s) => s.entriesById);

  const openModal = useUiStore((s) => s.openModal);
  const setPendingDeletion = useUiStore((s) => s.setPendingDeletion);

  const selectedEntries = useMemo(() => {
    return Array.from(selectedIds)
      .map((id) => entriesById[id])
      .filter(Boolean);
  }, [selectedIds, entriesById]);

  const totalSelectedBytes = useMemo(() => {
    return selectedEntries.reduce((acc, e) => acc + (e.sizeBytes || 0), 0);
  }, [selectedEntries]);

  if (selectedIds.size === 0) {
    return null;
  }

  const handleRecycle = () => {
    setPendingDeletion(Array.from(selectedIds));
    openModal("recycle-confirm");
  };

  const handlePermanent = () => {
    setPendingDeletion(Array.from(selectedIds));
    openModal("permanent-confirm");
  };

  return (
    <div className="selection-action-bar">
      <div className="selection-info">
        <span>{t.actionBar.selectedCount(selectedIds.size)}</span>
        <span style={{ color: "var(--text-muted)" }}>•</span>
        <span style={{ color: "#5AC8FA" }}>
          {t.actionBar.totalSize(formatBytes(totalSelectedBytes))}
        </span>
      </div>

      <div className="selection-divider" />

      <div className="selection-actions">
        <Button
          variant="primary"
          size="sm"
          icon={<Trash2 size={13} />}
          onClick={handleRecycle}
        >
          {t.actionBar.recycleBinButton}
        </Button>

        <Button
          variant="danger-outline"
          size="sm"
          icon={<AlertTriangle size={13} />}
          onClick={handlePermanent}
        >
          {t.actionBar.permanentDeleteButton}
        </Button>

        <IconButton
          size="sm"
          aria-label={t.actionBar.clearSelection}
          tooltip={t.actionBar.clearSelection}
          onClick={clearSelection}
        >
          <X size={13} />
        </IconButton>
      </div>
    </div>
  );
};

