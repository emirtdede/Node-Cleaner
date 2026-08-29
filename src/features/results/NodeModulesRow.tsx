import React, { useState } from "react";
import {
  FolderOpen,
  Copy,
  Trash2,
  AlertTriangle,
  CornerDownRight,
} from "lucide-react";
import { Checkbox } from "@/components/primitives/Checkbox";
import { Badge } from "@/components/primitives/Badge";
import { IconButton } from "@/components/primitives/IconButton";
import { ContextMenu, ContextMenuItem } from "@/components/primitives/ContextMenu";
import { NodeModuleEntry } from "@/types";
import { formatBytes, formatDate, truncatePath } from "@/lib/formatters";
import { scannerApi } from "@/lib/tauri/scanner-api";
import { useUiStore } from "@/stores/ui-store";
import { useI18n } from "@/lib/i18n";
import "./results.css";

interface NodeModulesRowProps {
  entry: NodeModuleEntry;
  isSelected: boolean;
  isSubItem?: boolean;
  onToggle: (id: string) => void;
  onSingleRecycle: (id: string) => void;
  onSinglePermanent: (id: string) => void;
  style?: React.CSSProperties;
  measureRef?: (node: HTMLElement | null) => void;
  dataIndex?: number;
}

export const NodeModulesRow: React.FC<NodeModulesRowProps> = React.memo(({
  entry,
  isSelected,
  isSubItem = false,
  onToggle,
  onSingleRecycle,
  onSinglePermanent,
  style,
  measureRef,
  dataIndex,
}) => {
  const { t, language } = useI18n();
  const showToast = useUiStore((s) => s.showToast);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const dateInfo = formatDate(entry.modifiedAt, language);
  const isMeasuring = entry.sizeBytes === null;
  const isDeleted = entry.status === "deleted";

  const handleCopyPath = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(entry.nodeModulesPath);
      showToast(t.rowActions.pathCopied, "info");
    } catch {
      showToast(t.errors.copyPathFailed, "error");
    }
  };

  const handleOpenExplorer = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await scannerApi.openPathInExplorer(entry.projectPath);
    } catch (err) {
      console.error(err);
      showToast(t.errors.openInExplorerFailed, "error");
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const menuItems: ContextMenuItem[] = [
    {
      id: "open",
      label: t.rowActions.openInExplorer,
      icon: <FolderOpen size={14} />,
      onClick: () => handleOpenExplorer(),
    },
    {
      id: "copy",
      label: t.rowActions.copyPath,
      icon: <Copy size={14} />,
      onClick: () => handleCopyPath(),
    },
    {
      id: "recycle",
      label: t.rowActions.recycleItem,
      icon: <Trash2 size={14} />,
      onClick: () => onSingleRecycle(entry.id),
    },
    {
      id: "permanent",
      label: t.rowActions.permanentDeleteItem,
      icon: <AlertTriangle size={14} />,
      danger: true,
      onClick: () => onSinglePermanent(entry.id),
    },
  ];

  return (
    <>
      <div
      ref={measureRef}
      data-index={dataIndex}
      className={`table-row ${isSubItem ? "sub-item-row" : ""} ${isSelected ? "selected" : ""} ${isDeleted ? "deleted" : ""}`}
      style={style}
      onClick={() => onToggle(entry.id)}
      onContextMenu={handleContextMenu}
      role="row"
      aria-selected={isSelected}
    >
      {/* 1. Checkbox */}
      <div onClick={(e) => e.stopPropagation()} className={isSubItem ? "sub-item-checkbox-wrapper" : ""}>
        {isSubItem && <CornerDownRight size={14} className="sub-item-tree-icon" />}
        <Checkbox
          checked={isSelected}
          onChange={() => onToggle(entry.id)}
          aria-label={entry.projectName}
        />
      </div>

      {/* 2. Project Name & Path */}
      <div className={`row-project ${isSubItem ? "sub-project" : ""}`}>
        <div className="row-project-title">
          <span className={isSubItem ? "sub-project-name" : ""}>{entry.projectName}</span>
          {!entry.packageJsonFound && (
            <span
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                fontWeight: 400,
                border: "1px dashed var(--border-strong)",
                padding: "1px 4px",
                borderRadius: 4,
              }}
              title={t.table.noPackageJson}
            >
              {t.table.noPackageJson}
            </span>
          )}
        </div>
        <div className="row-project-path" title={entry.nodeModulesPath}>
          {truncatePath(entry.nodeModulesPath, isSubItem ? 62 : 56)}
        </div>
      </div>

      {/* 3. Package Manager Badge */}
      <div>
        <Badge type={entry.packageManager}>
          {entry.packageManager.toUpperCase()}
        </Badge>
      </div>

      {/* 4. Size */}
      <div className="row-size">
        {isMeasuring ? (
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontWeight: 400 }}>
            {t.table.measuring}
          </span>
        ) : (
          formatBytes(entry.sizeBytes, language)
        )}
      </div>

      {/* 5. Modified Date */}
      <div className="row-date" title={`${t.table.modified}: ${dateInfo.exact}`}>
        {dateInfo.relative}
      </div>

      {/* 6. Row Actions */}
      <div className="row-actions" onClick={(e) => e.stopPropagation()}>
        <IconButton
          size="sm"
          aria-label={t.rowActions.copyPath}
          tooltip={t.rowActions.copyPath}
          onClick={handleCopyPath}
        >
          <Copy size={13} />
        </IconButton>

        <IconButton
          size="sm"
          aria-label={t.rowActions.openInExplorer}
          tooltip={t.rowActions.openInExplorer}
          onClick={handleOpenExplorer}
        >
          <FolderOpen size={13} />
        </IconButton>

        <IconButton
          size="sm"
          aria-label={t.rowActions.recycleItem}
          tooltip={t.rowActions.recycleItem}
          onClick={() => onSingleRecycle(entry.id)}
        >
          <Trash2 size={13} color="var(--accent)" />
        </IconButton>

        <IconButton
          size="sm"
          aria-label={t.rowActions.permanentDeleteItem}
          tooltip={t.rowActions.permanentDeleteItem}
          onClick={() => onSinglePermanent(entry.id)}
        >
          <AlertTriangle size={13} color="var(--danger)" />
        </IconButton>
      </div>
    </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={menuItems}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
});

