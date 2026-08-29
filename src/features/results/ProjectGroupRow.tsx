import React, { useState } from "react";
import {
  FolderOpen,
  Copy,
  Trash2,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Layers,
} from "lucide-react";
import { Checkbox } from "@/components/primitives/Checkbox";
import { Badge } from "@/components/primitives/Badge";
import { IconButton } from "@/components/primitives/IconButton";
import { ContextMenu, ContextMenuItem } from "@/components/primitives/ContextMenu";
import { NodeModuleEntry, PackageManagerType } from "@/types";
import { formatBytes, formatDate, truncatePath } from "@/lib/formatters";
import { scannerApi } from "@/lib/tauri/scanner-api";
import { useUiStore } from "@/stores/ui-store";
import { useI18n } from "@/lib/i18n";
import "./results.css";

export interface ProjectGroupData {
  key: string;
  rootPath: string;
  projectName: string;
  packageManager: PackageManagerType;
  entries: NodeModuleEntry[];
  totalSizeBytes: number;
  isMeasuring: boolean;
  latestModifiedAt: string | null;
}

interface ProjectGroupRowProps {
  group: ProjectGroupData;
  isExpanded: boolean;
  onToggleExpand: (groupKey: string) => void;
  selectedIds: Set<string>;
  onToggleGroupSelection: (group: ProjectGroupData) => void;
  onGroupRecycle: (group: ProjectGroupData) => void;
  onGroupPermanent: (group: ProjectGroupData) => void;
  style?: React.CSSProperties;
  measureRef?: (node: HTMLElement | null) => void;
  dataIndex?: number;
}

export const ProjectGroupRow: React.FC<ProjectGroupRowProps> = React.memo(({
  group,
  isExpanded,
  onToggleExpand,
  selectedIds,
  onToggleGroupSelection,
  onGroupRecycle,
  onGroupPermanent,
  style,
  measureRef,
  dataIndex,
}) => {
  const { t, language } = useI18n();
  const showToast = useUiStore((s) => s.showToast);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const groupEntryIds = group.entries.map((e) => e.id);
  const selectedCount = groupEntryIds.filter((id) => selectedIds.has(id)).length;
  const isAllSelected = groupEntryIds.length > 0 && selectedCount === groupEntryIds.length;
  const isIndeterminate = selectedCount > 0 && selectedCount < groupEntryIds.length;

  const dateInfo = formatDate(group.latestModifiedAt, language);

  const handleCopyPath = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(group.rootPath);
      showToast(t.rowActions.pathCopied, "info");
    } catch {
      showToast(t.errors.copyPathFailed, "error");
    }
  };

  const handleOpenExplorer = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await scannerApi.openPathInExplorer(group.rootPath);
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
      label: t.dialog.recycleConfirmButton,
      icon: <Trash2 size={14} />,
      onClick: () => onGroupRecycle(group),
    },
    {
      id: "permanent",
      label: t.dialog.permanentConfirmButton,
      icon: <AlertTriangle size={14} />,
      danger: true,
      onClick: () => onGroupPermanent(group),
    },
  ];

  return (
    <>
      <div
      ref={measureRef}
      data-index={dataIndex}
      className={`table-row group-header-row ${isAllSelected ? "selected" : ""}`}
      style={style}
      onClick={() => onToggleExpand(group.key)}
      onContextMenu={handleContextMenu}
      role="row"
      aria-selected={isAllSelected}
    >
      {/* 1. Group Checkbox */}
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onChange={() => onToggleGroupSelection(group)}
          aria-label={group.projectName}
        />
      </div>

      {/* 2. Project Group Title & Sub-count */}
      <div className="row-project">
        <div className="row-project-title group-title">
          <button
            type="button"
            className="group-expand-trigger"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(group.key);
            }}
            title={isExpanded ? t.rowActions.collapse : t.rowActions.expand}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          <span className="group-project-name">{group.projectName}</span>

          <span className="group-badge-count">
            <Layers size={11} />
            {t.table.folderCount(group.entries.length)}
          </span>
        </div>

        <div className="row-project-path" title={group.rootPath}>
          {truncatePath(group.rootPath, 56)}
        </div>
      </div>

      {/* 3. Package Manager */}
      <div>
        <Badge type={group.packageManager}>
          {group.packageManager.toUpperCase()}
        </Badge>
      </div>

      {/* 4. Total Size */}
      <div className="row-size group-size">
        {group.isMeasuring ? (
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontWeight: 400 }}>
            {t.table.measuring}
          </span>
        ) : (
          formatBytes(group.totalSizeBytes, language)
        )}
      </div>

      {/* 5. Modified Date */}
      <div className="row-date" title={`${t.table.modified}: ${dateInfo.exact}`}>
        {dateInfo.relative}
      </div>

      {/* 6. Group Actions */}
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
          aria-label={t.dialog.recycleConfirmButton}
          tooltip={t.dialog.recycleConfirmButton}
          onClick={() => onGroupRecycle(group)}
        >
          <Trash2 size={13} color="var(--accent)" />
        </IconButton>

        <IconButton
          size="sm"
          aria-label={t.dialog.permanentConfirmButton}
          tooltip={t.dialog.permanentConfirmButton}
          onClick={() => onGroupPermanent(group)}
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
