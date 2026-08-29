import React from "react";
import { Layers, HardDrive } from "lucide-react";
import { SearchField } from "@/components/primitives/SearchField";
import { useUiStore } from "@/stores/ui-store";
import { usePreferencesStore } from "@/stores/preferences-store";
import { SortField, SortDirection } from "@/types";
import { formatBytes } from "@/lib/formatters";
import { useI18n } from "@/lib/i18n";
import "./results.css";

interface ResultsToolbarProps {
  totalCount: number;
  totalBytes: number;
}

export const ResultsToolbar: React.FC<ResultsToolbarProps> = ({
  totalCount,
  totalBytes,
}) => {
  const { t } = useI18n();
  const sort = usePreferencesStore((s) => s.sort);
  const setSort = usePreferencesStore((s) => s.setSort);

  const searchQuery = useUiStore((s) => s.searchQuery);
  const setSearchQuery = useUiStore((s) => s.setSearchQuery);

  const currentSortKey = `${sort.field}-${sort.direction}`;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, direction] = e.target.value.split("-") as [SortField, SortDirection];
    setSort({ field, direction });
  };

  return (
    <div className="results-sub-toolbar">
      {/* 1. Left: Search Filter */}
      <div className="results-search-wrapper">
        <SearchField
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t.table.searchPlaceholder}
        />
      </div>

      {/* 2. Right: Summary Metrics & Sort */}
      <div className="results-toolbar-right">
        <div className="results-metrics-group">
          <span className="results-metric-tag">
            <Layers size={12} color="var(--accent)" />
            <span>{t.scan.statsProjects(totalCount)}</span>
          </span>
          <span className="results-metric-tag highlight">
            <HardDrive size={12} />
            <span>{formatBytes(totalBytes)}</span>
          </span>
        </div>

        {/* Sort Select with High Contrast Option Styling */}
        <div className="results-sort-wrapper">
          <select
            className="results-sort-select"
            value={currentSortKey}
            onChange={handleSortChange}
            aria-label={t.table.sortBy}
          >
            <option value="size-desc">{t.table.sortSizeDesc}</option>
            <option value="size-asc">{t.table.sortSizeAsc}</option>
            <option value="modified-desc">{t.table.sortDateDesc}</option>
            <option value="modified-asc">{t.table.sortDateAsc}</option>
            <option value="name-asc">{t.table.sortNameAsc}</option>
            <option value="name-desc">{t.table.sortNameDesc}</option>
          </select>
        </div>
      </div>
    </div>
  );
};
