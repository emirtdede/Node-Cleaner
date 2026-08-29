/**
 * Format bytes into human-readable representation (MB, GB, TB) formatted according to the locale.
 */
export function formatBytes(bytes: number | null | undefined, locale = "tr"): string {
  if (bytes === null || bytes === undefined || isNaN(bytes)) {
    return "-";
  }
  if (bytes === 0) {
    return "0 B";
  }

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const safeIndex = Math.min(i, sizes.length - 1);

  if (safeIndex === 0) {
    return `${bytes} B`;
  }

  const value = bytes / Math.pow(k, safeIndex);
  try {
    const formattedValue = new Intl.NumberFormat(locale, {
      minimumFractionDigits: value >= 10 ? 1 : 2,
      maximumFractionDigits: value >= 10 ? 1 : 2,
    }).format(value);
    return `${formattedValue} ${sizes[safeIndex]}`;
  } catch {
    const formattedValue = value >= 10 ? value.toFixed(1) : value.toFixed(2);
    return `${formattedValue} ${sizes[safeIndex]}`;
  }
}

/**
 * Format date string into relative localized string and exact localized date for tooltips.
 */
export function formatDate(
  isoString: string | null | undefined,
  locale = "tr"
): {
  relative: string;
  exact: string;
} {
  if (!isoString) {
    return { relative: "-", exact: "-" };
  }

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return { relative: "-", exact: "-" };
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    let relative = "";
    if (diffDays < 1) {
      if (diffHours < 1) {
        if (diffMin < 1) {
          if (locale.startsWith("tr")) {
            relative = "Az önce";
          } else {
            try {
              const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
              relative = rtf.format(-Math.max(1, diffSec), "second");
            } catch {
              relative = "Just now";
            }
          }
        } else {
          try {
            const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
            relative = rtf.format(-diffMin, "minute");
          } catch {
            relative = `${diffMin}m ago`;
          }
        }
      } else {
        try {
          const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
          relative = rtf.format(-diffHours, "hour");
        } catch {
          relative = `${diffHours}h ago`;
        }
      }
    } else if (diffDays < 30) {
      try {
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
        relative = rtf.format(-diffDays, "day");
      } catch {
        relative = `${diffDays}d ago`;
      }
    } else if (diffMonths < 12) {
      try {
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
        relative = rtf.format(-diffMonths, "month");
      } catch {
        relative = `${diffMonths}mo ago`;
      }
    } else {
      try {
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
        relative = rtf.format(-diffYears, "year");
      } catch {
        relative = `${diffYears}y ago`;
      }
    }

    const exact = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

    return { relative, exact };
  } catch {
    return { relative: "-", exact: "-" };
  }
}

/**
 * Truncate long file path with ellipsis in the middle or end
 */
export function truncatePath(fullPath: string, maxLength = 48): string {
  if (!fullPath || fullPath.length <= maxLength) return fullPath;
  const parts = fullPath.split(/[/\\]/);
  if (parts.length <= 2) return fullPath;

  const first = parts[0] + "\\" + parts[1];
  const last = parts[parts.length - 1];
  return `${first}\\...\\${last}`;
}
