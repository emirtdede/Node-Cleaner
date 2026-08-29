import { create } from "zustand";
import { ThemeMode, FavoriteLocation, SortOption, UserPreferences, SupportedLanguage } from "@/types";
import { scannerApi } from "@/lib/tauri/scanner-api";
import { detectSystemLanguage, isRtlLanguage } from "@/locales/languages";

interface PreferencesState extends UserPreferences {
  isLoaded: boolean;

  // Actions
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: SupportedLanguage) => void;
  setReduceMotion: (reduce: boolean) => void;
  setSort: (sort: SortOption) => void;
  addFavorite: (path: string, label?: string) => FavoriteLocation;
  removeFavorite: (id: string) => void;
  renameFavorite: (id: string, newLabel: string) => void;
  addRecentLocation: (path: string) => void;
  removeRecentLocation: (path: string) => void;
  clearRecentLocations: () => void;
  setLastScanPath: (path: string | null) => void;
  loadPreferences: (prefs: Partial<UserPreferences>) => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  schemaVersion: 1,
  theme: "dark-black",
  language: detectSystemLanguage(),
  reduceMotion: false,
  favorites: [],
  recentLocations: [],
  lastScanPath: null,
  sort: {
    field: "size",
    direction: "desc",
  },
};

function normalizeTheme(theme: ThemeMode): ThemeMode {
  switch (theme) {
    case "black":
    case "dark-transparent":
    case "transparent":
      return "dark-black";
    case "white":
    case "white-transparent":
      return "light-white";
    default:
      return theme;
  }
}

function applyThemeToDom(theme: ThemeMode) {
  if (typeof document !== "undefined") {
    const normalized = normalizeTheme(theme);
    document.documentElement.setAttribute("data-theme", normalized);
  }
}

function applyLanguageToDom(language: SupportedLanguage) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtlLanguage(language) ? "rtl" : "ltr";
  }
}

function applyReduceMotionToDom(reduceMotion: boolean) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-reduce-motion", String(reduceMotion));
  }
}

function syncPreferences(state: PreferencesState) {
  if (!state.isLoaded) return;
  const prefsToSave: UserPreferences = {
    schemaVersion: state.schemaVersion,
    theme: state.theme,
    language: state.language,
    reduceMotion: state.reduceMotion,
    favorites: state.favorites,
    recentLocations: state.recentLocations,
    lastScanPath: state.lastScanPath,
    sort: state.sort,
  };
  scannerApi.saveAppSettings(prefsToSave).catch((err) => {
    console.error("Failed to auto-persist preferences:", err);
  });
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  ...DEFAULT_PREFERENCES,
  isLoaded: false,

  setTheme: (theme: ThemeMode) => {
    const normalized = normalizeTheme(theme);
    applyThemeToDom(normalized);
    set({ theme: normalized });
    syncPreferences(get());
  },

  setLanguage: (language: SupportedLanguage) => {
    applyLanguageToDom(language);
    set({ language });
    syncPreferences(get());
  },

  setReduceMotion: (reduceMotion: boolean) => {
    applyReduceMotionToDom(reduceMotion);
    set({ reduceMotion });
    syncPreferences(get());
  },

  setSort: (sort: SortOption) => {
    set({ sort });
    syncPreferences(get());
  },

  addFavorite: (path: string, label?: string) => {
    const existing = get().favorites.find((f) => f.path.toLowerCase() === path.toLowerCase());
    if (existing) return existing;

    const parts = path.split(/[/\\]/);
    const computedLabel = label || parts[parts.length - 1] || path;
    const newFav: FavoriteLocation = {
      id: "fav-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      path,
      label: computedLabel,
      createdAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString(),
    };

    set((state) => ({
      favorites: [...state.favorites, newFav],
    }));

    syncPreferences(get());
    return newFav;
  },

  removeFavorite: (id: string) => {
    set((state) => ({
      favorites: state.favorites.filter((f) => f.id !== id),
    }));
    syncPreferences(get());
  },

  renameFavorite: (id: string, newLabel: string) => {
    set((state) => ({
      favorites: state.favorites.map((f) =>
        f.id === id ? { ...f, label: newLabel } : f
      ),
    }));
    syncPreferences(get());
  },

  addRecentLocation: (path: string) => {
    set((state) => {
      const filtered = state.recentLocations.filter(
        (p) => p.toLowerCase() !== path.toLowerCase()
      );
      // Max 5 items
      const nextRecent = [path, ...filtered].slice(0, 5);
      return { recentLocations: nextRecent, lastScanPath: path };
    });
    syncPreferences(get());
  },

  removeRecentLocation: (path: string) => {
    set((state) => {
      const nextRecent = state.recentLocations.filter(
        (p) => p.toLowerCase() !== path.toLowerCase()
      );
      const nextLastScan =
        state.lastScanPath?.toLowerCase() === path.toLowerCase()
          ? (nextRecent[0] ?? null)
          : state.lastScanPath;
      return { recentLocations: nextRecent, lastScanPath: nextLastScan };
    });
    syncPreferences(get());
  },

  clearRecentLocations: () => {
    set({ recentLocations: [] });
    syncPreferences(get());
  },

  setLastScanPath: (path: string | null) => {
    set({ lastScanPath: path });
    syncPreferences(get());
  },

  loadPreferences: (prefs) => {
    const rawTheme = prefs.theme || DEFAULT_PREFERENCES.theme;
    const normalizedTheme = normalizeTheme(rawTheme);
    const resolvedLanguage = prefs.language || detectSystemLanguage();
    const merged: UserPreferences = {
      ...DEFAULT_PREFERENCES,
      ...prefs,
      theme: normalizedTheme,
      language: resolvedLanguage,
    };
    applyThemeToDom(normalizedTheme);
    applyLanguageToDom(resolvedLanguage);
    applyReduceMotionToDom(merged.reduceMotion);
    set({
      ...merged,
      isLoaded: true,
    });
  },
}));
