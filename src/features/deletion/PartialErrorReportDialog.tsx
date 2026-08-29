import React from "react";
import { AlertCircle } from "lucide-react";
import { Dialog } from "@/components/primitives/Dialog";
import { Button } from "@/components/primitives/Button";
import { useUiStore } from "@/stores/ui-store";
import { useI18n } from "@/lib/i18n";

export const PartialErrorReportDialog: React.FC = () => {
  const { t } = useI18n();
  const activeModal = useUiStore((s) => s.activeModal);
  const closeModal = useUiStore((s) => s.closeModal);
  const partialErrorReport = useUiStore((s) => s.partialErrorReport);

  const isOpen = activeModal === "partial-error" && Boolean(partialErrorReport);

  if (!partialErrorReport) return null;

  const failedItems = partialErrorReport.results.filter((r) => !r.success);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={closeModal}
      title={t.dialog.partialErrorTitle}
      maxWidth="540px"
      footer={
        <Button variant="secondary" onClick={closeModal}>
          {t.settings.close}
        </Button>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p>
          {t.dialog.partialErrorDescription(
            partialErrorReport.successCount,
            partialErrorReport.errorCount
          )}
        </p>

        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
          {t.dialog.lockedOrPermissionNote}
        </p>

        <div
          style={{
            maxHeight: 200,
            overflowY: "auto",
            backgroundColor: "var(--surface)",
            borderRadius: "var(--radius-md)",
            padding: "8px 12px",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {failedItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                fontSize: "var(--text-xs)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--danger)" }}>
                <AlertCircle size={14} />
                <span style={{ fontFamily: "var(--font-mono)", wordBreak: "break-all" }}>
                  {item.path}
                </span>
              </div>
              {item.error && (
                <span style={{ color: "var(--text-secondary)", paddingLeft: 20 }}>
                  {item.error}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
};
