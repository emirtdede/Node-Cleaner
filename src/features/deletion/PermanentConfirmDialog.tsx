import React, { useState } from "react";
import { AlertTriangle, Trash } from "lucide-react";
import { Dialog } from "@/components/primitives/Dialog";
import { Button } from "@/components/primitives/Button";
import { useUiStore } from "@/stores/ui-store";
import { useScanStore } from "@/stores/scan-store";
import { useSelectionStore } from "@/stores/selection-store";
import { scannerApi } from "@/lib/tauri/scanner-api";
import { formatBytes } from "@/lib/formatters";
import { useI18n } from "@/lib/i18n";

export const PermanentConfirmDialog: React.FC = () => {
  const { t } = useI18n();
  const activeModal = useUiStore((s) => s.activeModal);
  const closeModal = useUiStore((s) => s.closeModal);
  const pendingDeletionIds = useUiStore((s) => s.pendingDeletionIds);
  const setPartialErrorReport = useUiStore((s) => s.setPartialErrorReport);
  const showToast = useUiStore((s) => s.showToast);

  const entriesById = useScanStore((s) => s.entriesById);
  const markEntryDeleted = useScanStore((s) => s.markEntryDeleted);
  const removeEntries = useScanStore((s) => s.removeEntries);
  const deselectMany = useSelectionStore((s) => s.deselectMany);

  const [isDeleting, setIsDeleting] = useState(false);
  const timersRef = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  React.useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const isOpen = activeModal === "permanent-confirm";

  const targetEntries = pendingDeletionIds
    .map((id) => entriesById[id])
    .filter(Boolean);

  const totalBytes = targetEntries.reduce((acc, e) => acc + (e.sizeBytes || 0), 0);

  const handleConfirm = async () => {
    if (targetEntries.length === 0 || isDeleting) return;

    setIsDeleting(true);
    const paths = targetEntries.map((e) => e.nodeModulesPath);

    try {
      const report = await scannerApi.deleteNodeModules(paths, "permanent");

      if (report.errorCount > 0) {
        const successfulIds = targetEntries
          .filter((e) => report.results.find((r) => r.path === e.nodeModulesPath && r.success))
          .map((e) => e.id);

        if (successfulIds.length > 0) {
          markEntryDeleted(successfulIds);
          deselectMany(successfulIds);
          const tm = setTimeout(() => removeEntries(successfulIds), 650);
          timersRef.current.push(tm);
        }

        setPartialErrorReport(report);
      } else {
        const ids = targetEntries.map((e) => e.id);
        markEntryDeleted(ids);
        deselectMany(ids);
        const tm = setTimeout(() => removeEntries(ids), 650);
        timersRef.current.push(tm);

        closeModal();
        showToast(t.dialog.permanentSuccess(report.successCount), "success");
      }
    } catch (err: unknown) {
      console.error(err);
      showToast(t.errors.permanentDeleteFailed, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={isDeleting ? () => {} : closeModal}
      title={t.dialog.permanentTitle}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={closeModal}
            disabled={isDeleting}
            autoFocus
          >
            {t.dialog.cancel}
          </Button>
          <Button
            variant="danger"
            icon={<Trash size={15} />}
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? t.dialog.deletingInProgress : t.dialog.permanentConfirmButton}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Warning Banner */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            padding: "10px 12px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--danger-subtle)",
            border: "1px solid rgba(229, 72, 77, 0.3)",
            color: "var(--danger)",
            fontSize: "var(--text-xs)",
            lineHeight: "var(--leading-normal)",
          }}
        >
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{t.dialog.permanentWarning}</span>
        </div>

        <p style={{ color: "var(--text-primary)", fontWeight: 500 }}>
          {t.dialog.permanentDescription(targetEntries.length, formatBytes(totalBytes))}
        </p>

        <div
          style={{
            maxHeight: 140,
            overflowY: "auto",
            backgroundColor: "var(--surface)",
            borderRadius: "var(--radius-md)",
            padding: "8px 12px",
            border: "1px solid var(--border)",
            fontSize: "var(--text-xs)",
            fontFamily: "var(--font-mono)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {targetEntries.map((entry) => (
            <div
              key={entry.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "var(--text-secondary)",
              }}
            >
              <span>{entry.projectName}</span>
              <span>{formatBytes(entry.sizeBytes)}</span>
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
};
