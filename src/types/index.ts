export type ThemeMode =
  // Koyu Temalar (Dark Themes)
  | "dark-black"
  | "dark-gray"
  | "dark-blue"
  | "dark-purple"
  | "dark-green"
  | "dark-red"
  | "dark-orange"
  | "dark-yellow"
  // Açık Temalar (Light Themes)
  | "light-white"
  | "light-gray"
  | "light-blue"
  | "light-purple"
  | "light-green"
  | "light-red"
  | "light-orange"
  | "light-yellow"
  // Legacy aliases for backward compatibility
  | "dark-transparent"
  | "white-transparent"
  | "transparent"
  | "black"
  | "white";

export type PackageManagerType = "npm" | "pnpm" | "yarn" | "bun" | "unknown";

export type EntryStatus = "ready" | "measuring" | "error" | "deleted";

export interface NodeModuleEntry {
  id: string;
  nodeModulesPath: string;
  projectPath: string;
  projectName: string;
  rootProjectPath?: string;
  rootProjectName?: string;
  packageManager: PackageManagerType;
  sizeBytes: number | null;
  modifiedAt: string | null;
  packageJsonFound: boolean;
  lockfile?: string;
  status: EntryStatus;
  errorCode?: string;
}

export interface ScanRoot {
  id: string;
  path: string;
  label: string;
  source: "manual" | "default" | "favorite" | "recent";
}

export interface ScanRequest {
  rootPath: string;
  exclusions?: string[];
}

export interface ScanProgress {
  phase: "discovering" | "measuring";
  directoriesVisited: number;
  entriesFound: number;
  entriesMeasured: number;
  bytesMeasured: number;
  currentPath?: string;
}

export interface ScanSummary {
  scanId: string;
  rootPath: string;
  totalEntries: number;
  totalBytes: number;
  durationMs: number;
  errorsCount: number;
}

export interface KnownLocation {
  id: string;
  path: string;
  label: string;
  source: string;
}

export interface FavoriteLocation {
  id: string;
  label: string;
  path: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export interface RecentLocation {
  path: string;
  lastUsedAt: string;
}

export type SortField = "size" | "modified" | "name";
export type SortDirection = "asc" | "desc";

export interface SortOption {
  field: SortField;
  direction: SortDirection;
}

export type SupportedLanguage =
  | "tr" // Türkçe
  | "en" // English
  | "de" // Deutsch
  | "es" // Español
  | "fr" // Français
  | "it" // Italiano
  | "pt" // Português
  | "nl" // Nederlands
  | "pl" // Polski
  | "ru" // Русский
  | "ja" // 日本語
  | "ko" // 한국어
  | "zh" // 简体中文
  | "zh-tw" // 繁體中文
  | "sv" // Svenska
  | "ar" // العربية
  | "hi" // हिन्दी
  | "id" // Bahasa Indonesia
  | "vi" // Tiếng Việt
  | "uk" // Українська
  | "el" // Ελληνικά
  | "cs" // Čeština
  | "da" // Dansk
  | "fi" // Suomi
  | "no" // Norsk
  | "hu" // Magyar
  | "ro" // Română
  | "th" // ไทย
  | "ms" // Bahasa Melayu
  | "fil" // Filipino
  | "bn" // বাংলা
  | "he" // עברית
  | "fa" // فارسی
  | "ur" // اردو
  | "az" // Azərbaycan dili
  | "kk" // Қазақша
  | "uz" // Oʻzbekcha
  | "bg" // Български
  | "sk" // Slovenčina
  | "hr" // Hrvatski
  | "et" // Eesti
  | "ta" // தமிழ்
  | "te" // తెలుగు
  | "mr" // मराठी
  | "kn" // ಕನ್ನಡ
  | "gu" // ગુજરાતી
  | "ml" // മലയാളം
  | "pa" // ਪੰਜਾਬੀ
  | "lt" // Lietuvių
  | "lv" // Latviešu
  | "sr" // Srpski
  | "sl" // Slovenščina
  | "bs" // Bosanski
  | "sq" // Shqip
  | "mk" // Македонски
  | "is" // Íslenska
  | "sw" // Kiswahili
  | "am" // አማርኛ
  | "ha" // Hausa
  | "yo" // Yorùbá
  | "af" // Afrikaans
  | "ka" // ქართული
  | "hy" // Հայերեն
  | "ky" // Кыргызча
  | "tk" // Türkmençe
  | "mn" // Монгол
  | "ca" // Català
  | "eu" // Euskara
  | "gl" // Galego
  | "ga" // Gaeilge
  | "my" // မြန်မာစာ
  | "km" // ភាសាខ្មែរ
  | "si"; // සිංහල

export interface UserPreferences {
  schemaVersion: number;
  theme: ThemeMode;
  language: SupportedLanguage;
  reduceMotion: boolean;
  favorites: FavoriteLocation[];
  recentLocations: string[];
  lastScanPath: string | null;
  sort: SortOption;
}

export type DeleteMode = "recycleBin" | "permanent";

export interface DeletionPathResult {
  path: string;
  success: boolean;
  error?: string;
}

export interface DeletionReport {
  mode: DeleteMode;
  totalRequested: number;
  successCount: number;
  errorCount: number;
  reclaimedBytes: number;
  results: DeletionPathResult[];
}

export interface AppErrorDto {
  code:
    | "InvalidPath"
    | "AccessDenied"
    | "PathNotFound"
    | "ScanCancelled"
    | "ScanFailed"
    | "UnsafeDeleteTarget"
    | "RecycleBinFailed"
    | "PermanentDeleteFailed"
    | "SettingsReadFailed"
    | "SettingsWriteFailed"
    | "PlatformUnsupported"
    | "Unknown";
  message: string;
  details?: string;
}

export type ScanEvent =
  | { type: "started"; scanId: string }
  | { type: "candidate"; entry: NodeModuleEntry }
  | { type: "measured"; id: string; sizeBytes: number }
  | { type: "progress"; progress: ScanProgress }
  | { type: "warning"; code: string; path?: string }
  | { type: "completed"; summary: ScanSummary }
  | { type: "cancelled"; summary: ScanSummary }
  | { type: "failed"; error: AppErrorDto };
