import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import "./primitives.css";

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChange,
  placeholder,
  className = "",
}) => {
  const { t } = useI18n();
  const resolvedPlaceholder = placeholder || t.table.searchPlaceholder;
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Ctrl + F focuses the search field (UX-009)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={`search-field-container ${className}`}>
      <Search size={16} className="search-field-icon" strokeWidth={2} />
      <input
        ref={inputRef}
        type="text"
        className="search-field-input"
        placeholder={resolvedPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={resolvedPlaceholder}
      />
      {value.length > 0 && (
        <button
          type="button"
          className="search-field-clear icon-btn icon-btn-sm"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          aria-label={t.actionBar.clearSelection}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
