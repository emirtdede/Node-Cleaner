import React, { useMemo, useRef, useEffect, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Checkbox } from "@/components/primitives/Checkbox";
import { NodeModulesRow } from "./NodeModulesRow";
import { ProjectGroupRow, ProjectGroupData } from "./ProjectGroupRow";
import { ResultsToolbar } from "./ResultsToolbar";
import { useScanStore } from "@/stores/scan-store";
import { useSelectionStore } from "@/stores/selection-store";
import { usePreferencesStore } from "@/stores/preferences-store";
import { useUiStore } from "@/stores/ui-store";
import { NodeModuleEntry } from "@/types";
import { useI18n } from "@/lib/i18n";
import "./results.css";

type FlatTableItem =
  | { type: "single"; entry: NodeModuleEntry }
  | { type: "group-header"; group: ProjectGroupData }
  | { type: "sub-entry"; entry: NodeModuleEntry; group: ProjectGroupData };

export const NodeModulesTable: React.FC = () => {
  const { t, language } = useI18n();
  const entriesById = useScanStore((s) => s.entriesById);
  const entryIds = useScanStore((s) => s.entryIds);

  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const toggleSelection = useSelectionStore((s) => s.toggleSelection);
  const selectAll = useSelectionStore((s) => s.selectAll);

  const searchQuery = useUiStore((s) => s.searchQuery);
  const openModal = useUiStore((s) => s.openModal);
  const setPendingDeletion = useUiStore((s) => s.setPendingDeletion);

  const sort = usePreferencesStore((s) => s.sort);

  const parentRef = useRef<HTMLDivElement>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // 1. Filter entries based on search query
  const filteredEntries = useMemo(() => {
    const all = entryIds.map((id) => entriesById[id]).filter(Boolean);
    if (!searchQuery.trim()) return all;

    const query = searchQuery.toLowerCase().trim();
    return all.filter(
      (entry) =>
        entry.projectName.toLowerCase().includes(query) ||
        (entry.rootProjectName && entry.rootProjectName.toLowerCase().includes(query)) ||
        entry.nodeModulesPath.toLowerCase().includes(query)
    );
  }, [entriesById, entryIds, searchQuery]);

  // 2. Group entries by root project path
  const projectGroups = useMemo(() => {
    const map = new Map<string, NodeModuleEntry[]>();

    for (const entry of filteredEntries) {
      const groupKey = entry.rootProjectPath || entry.projectPath;
      const list = map.get(groupKey) || [];
      list.push(entry);
      map.set(groupKey, list);
    }

    const groups: ProjectGroupData[] = [];

    for (const [key, entries] of map.entries()) {
      const first = entries[0];
      const projectName = first.rootProjectName || first.projectName;
      const rootPath = first.rootProjectPath || first.projectPath;
      const packageManager = first.packageManager;

      let totalSizeBytes = 0;
      let isMeasuring = false;
      let latestModifiedAt: string | null = null;

      for (const e of entries) {
        if (e.sizeBytes === null) {
          isMeasuring = true;
        } else {
          totalSizeBytes += e.sizeBytes;
        }
        if (e.modifiedAt) {
          if (!latestModifiedAt || new Date(e.modifiedAt) > new Date(latestModifiedAt)) {
            latestModifiedAt = e.modifiedAt;
          }
        }
      }

      groups.push({
        key,
        rootPath,
        projectName,
        packageManager,
        entries,
        totalSizeBytes,
        isMeasuring,
        latestModifiedAt,
      });
    }

    // Sort groups based on user sort option
    const { field, direction } = sort;
    const mult = direction === "asc" ? 1 : -1;

    groups.sort((a, b) => {
      if (field === "size") {
        return (a.totalSizeBytes - b.totalSizeBytes) * mult;
      } else if (field === "modified") {
        const dateA = a.latestModifiedAt ? new Date(a.latestModifiedAt).getTime() : 0;
        const dateB = b.latestModifiedAt ? new Date(b.latestModifiedAt).getTime() : 0;
        return (dateA - dateB) * mult;
      } else if (field === "name") {
        return a.projectName.localeCompare(b.projectName, language) * mult;
      }
      return 0;
    });

    return groups;
  }, [filteredEntries, sort, language]);

  // 3. Build Flattened Visible Table Items (with Accordion Expand/Collapse)
  const flatItems = useMemo(() => {
    const items: FlatTableItem[] = [];

    for (const group of projectGroups) {
      if (group.entries.length === 1) {
        items.push({ type: "single", entry: group.entries[0] });
      } else {
        items.push({ type: "group-header", group });
        if (expandedGroups.has(group.key)) {
          for (const subEntry of group.entries) {
            items.push({ type: "sub-entry", entry: subEntry, group });
          }
        }
      }
    }

    return items;
  }, [projectGroups, expandedGroups]);

  const allVisibleEntryIds = useMemo(() => {
    const ids: string[] = [];
    for (const g of projectGroups) {
      for (const e of g.entries) {
        ids.push(e.id);
      }
    }
    return ids;
  }, [projectGroups]);

  // 4. Select all checkbox state
  const isAllSelected =
    allVisibleEntryIds.length > 0 && allVisibleEntryIds.every((id) => selectedIds.has(id));
  const isIndeterminate =
    !isAllSelected && allVisibleEntryIds.some((id) => selectedIds.has(id));

  const toggleGroupExpand = (groupKey: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  };

  const handleToggleGroupSelection = (group: ProjectGroupData) => {
    const groupIds = group.entries.map((e) => e.id);
    const allSelected = groupIds.every((id) => selectedIds.has(id));

    const nextSelected = new Set(selectedIds);
    if (allSelected) {
      for (const id of groupIds) nextSelected.delete(id);
    } else {
      for (const id of groupIds) nextSelected.add(id);
    }
    useSelectionStore.setState({ selectedIds: nextSelected });
  };

  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // 5. TanStack Virtualizer
  const rowVirtualizer = useVirtualizer({
    count: flatItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const item = flatItems[index];
      if (item?.type === "group-header") return 58;
      if (item?.type === "sub-entry") return 48;
      return 56;
    },
    overscan: 10,
  });

  // Keyboard Shortcuts: Ctrl + A, Escape, Arrow Up/Down & Space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();
        selectAll(allVisibleEntryIds);
      } else if (e.key === "Escape") {
        useSelectionStore.getState().clearSelection();
        setFocusedIndex(-1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = Math.min(flatItems.length - 1, prev + 1);
          if (next >= 0 && next < flatItems.length) {
            rowVirtualizer.scrollToIndex(next, { align: "auto" });
          }
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = Math.max(0, prev - 1);
          if (next >= 0 && next < flatItems.length) {
            rowVirtualizer.scrollToIndex(next, { align: "auto" });
          }
          return next;
        });
      } else if (e.key === " " && focusedIndex >= 0 && focusedIndex < flatItems.length) {
        e.preventDefault();
        const item = flatItems[focusedIndex];
        if (item) {
          if (item.type === "single" || item.type === "sub-entry") {
            toggleSelection(item.entry.id);
          } else if (item.type === "group-header") {
            handleToggleGroupSelection(item.group);
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allVisibleEntryIds, flatItems, focusedIndex, selectAll, toggleSelection, rowVirtualizer]);

  // Calculate total metrics for toolbar
  const totalCleanableBytes = useMemo(() => {
    return projectGroups.reduce((acc, g) => acc + g.totalSizeBytes, 0);
  }, [projectGroups]);

  const handleSingleRecycle = (id: string) => {
    setPendingDeletion([id]);
    openModal("recycle-confirm");
  };

  const handleSinglePermanent = (id: string) => {
    setPendingDeletion([id]);
    openModal("permanent-confirm");
  };

  const handleGroupRecycle = (group: ProjectGroupData) => {
    const ids = group.entries.map((e) => e.id);
    setPendingDeletion(ids);
    openModal("recycle-confirm");
  };

  const handleGroupPermanent = (group: ProjectGroupData) => {
    const ids = group.entries.map((e) => e.id);
    setPendingDeletion(ids);
    openModal("permanent-confirm");
  };

  if (entryIds.length === 0) {
    return null;
  }

  return (
    <div className="results-container">
      <ResultsToolbar
        totalCount={allVisibleEntryIds.length}
        totalBytes={totalCleanableBytes}
      />

      {/* Table Header */}
      <div className="table-header" role="row">
        <div className="table-header-col">
          <Checkbox
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onChange={() => selectAll(allVisibleEntryIds)}
            aria-label={t.table.selectAll}
          />
        </div>
        <div className="table-header-col">{t.table.project}</div>
        <div className="table-header-col">{t.table.packageManager}</div>
        <div className="table-header-col">{t.table.size}</div>
        <div className="table-header-col">{t.table.modified}</div>
        <div className="table-header-col" style={{ justifyContent: "flex-end" }}>
          {t.table.actions}
        </div>
      </div>

      {/* Virtual Table Rows Viewport */}
      <div className="table-viewport" ref={parentRef} tabIndex={0} role="grid">
        {flatItems.length === 0 ? (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
              color: "var(--text-secondary)",
              fontSize: "var(--text-sm)",
            }}
          >
            {t.table.noSearchResults}
          </div>
        ) : (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const item = flatItems[virtualRow.index];
              if (!item) return null;

              if (item.type === "single") {
                const entry = item.entry;
                const isSelected = selectedIds.has(entry.id);
                return (
                  <NodeModulesRow
                    key={entry.id}
                    entry={entry}
                    isSelected={isSelected}
                    onToggle={toggleSelection}
                    onSingleRecycle={handleSingleRecycle}
                    onSinglePermanent={handleSinglePermanent}
                    measureRef={rowVirtualizer.measureElement}
                    dataIndex={virtualRow.index}
                    style={{
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  />
                );
              }

              if (item.type === "group-header") {
                const group = item.group;
                const isExpanded = expandedGroups.has(group.key);
                return (
                  <ProjectGroupRow
                    key={`group-${group.key}`}
                    group={group}
                    isExpanded={isExpanded}
                    onToggleExpand={toggleGroupExpand}
                    selectedIds={selectedIds}
                    onToggleGroupSelection={handleToggleGroupSelection}
                    onGroupRecycle={handleGroupRecycle}
                    onGroupPermanent={handleGroupPermanent}
                    measureRef={rowVirtualizer.measureElement}
                    dataIndex={virtualRow.index}
                    style={{
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  />
                );
              }

              if (item.type === "sub-entry") {
                const entry = item.entry;
                const isSelected = selectedIds.has(entry.id);
                return (
                  <NodeModulesRow
                    key={`sub-${entry.id}`}
                    entry={entry}
                    isSelected={isSelected}
                    isSubItem={true}
                    onToggle={toggleSelection}
                    onSingleRecycle={handleSingleRecycle}
                    onSinglePermanent={handleSinglePermanent}
                    measureRef={rowVirtualizer.measureElement}
                    dataIndex={virtualRow.index}
                    style={{
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  />
                );
              }

              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

