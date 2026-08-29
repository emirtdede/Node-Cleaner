import { invoke, Channel } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import {
  ScanRequest,
  ScanSummary,
  ScanEvent,
  KnownLocation,
  DeleteMode,
  DeletionReport,
  UserPreferences,
} from "@/types";

export function isTauriEnvironment(): boolean {
  return typeof window !== "undefined" && Boolean((window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__);
}

export interface ScannerApi {
  startScan(
    request: ScanRequest,
    onEvent: (event: ScanEvent) => void
  ): Promise<ScanSummary>;
  cancelScan(): Promise<void>;
  getKnownLocations(): Promise<KnownLocation[]>;
  openPathInExplorer(path: string): Promise<void>;
  selectFolderDialog(): Promise<string | null>;
  deleteNodeModules(paths: string[], mode: DeleteMode): Promise<DeletionReport>;
  getAppSettings(): Promise<UserPreferences>;
  saveAppSettings(settings: UserPreferences): Promise<void>;
}

let isFolderDialogOpen = false;

export const scannerApi: ScannerApi = {
  async startScan(request: ScanRequest, onEvent: (event: ScanEvent) => void): Promise<ScanSummary> {
    if (isTauriEnvironment()) {
      const channel = new Channel<ScanEvent>();
      channel.onmessage = (rawEvent: unknown) => {
        const ev = rawEvent as Record<string, unknown>;
        if (ev && typeof ev === "object") {
          // Normalize Measured event size_bytes -> sizeBytes
          if (ev.type === "measured" && typeof ev.size_bytes === "number" && typeof ev.sizeBytes !== "number") {
            ev.sizeBytes = ev.size_bytes;
          }
          // Normalize Candidate entry fields if needed
          if (ev.type === "candidate" && ev.entry && typeof ev.entry === "object") {
            const entry = ev.entry as Record<string, unknown>;
            if (typeof entry.size_bytes === "number" && typeof entry.sizeBytes !== "number") {
              entry.sizeBytes = entry.size_bytes;
            }
          }
        }
        onEvent(ev as unknown as ScanEvent);
      };

      return await invoke<ScanSummary>("start_scan", {
        request,
        onEvent: channel,
      });
    } else if (import.meta.env.DEV) {
      // Browser fallback simulation for local web preview
      return simulateBrowserScan(request, onEvent);
    } else {
      throw new Error("Tauri masaüstü ortamı bulunamadı.");
    }
  },

  async cancelScan(): Promise<void> {
    if (isTauriEnvironment()) {
      await invoke("cancel_scan");
    }
  },

  async getKnownLocations(): Promise<KnownLocation[]> {
    if (isTauriEnvironment()) {
      return await invoke<KnownLocation[]>("get_known_locations");
    }
    return [
      { id: "loc-projects", path: "C:\\Users\\emir\\Desktop\\node_cleaner", label: "Projeler", source: "default" },
      { id: "loc-desktop", path: "C:\\Users\\emir\\Desktop", label: "Masaüstü", source: "default" },
      { id: "loc-documents", path: "C:\\Users\\emir\\Documents", label: "Belgeler", source: "default" },
    ];
  },

  async openPathInExplorer(path: string): Promise<void> {
    if (isTauriEnvironment()) {
      await invoke("open_path_in_explorer", { path });
    } else {
      console.log("[Explorer]", path);
    }
  },

  async selectFolderDialog(): Promise<string | null> {
    if (isFolderDialogOpen) return null;
    isFolderDialogOpen = true;
    try {
      if (isTauriEnvironment()) {
        const selected = await open({
          directory: true,
          multiple: false,
          title: "Taranacak Klasörü Seçin",
        });
        if (typeof selected === "string") return selected;
        return null;
      }
      return prompt("Klasör yolu girin:", "C:\\Projects") || null;
    } finally {
      isFolderDialogOpen = false;
    }
  },

  async deleteNodeModules(paths: string[], mode: DeleteMode): Promise<DeletionReport> {
    if (isTauriEnvironment()) {
      return await invoke<DeletionReport>("delete_node_modules", {
        paths,
        mode,
      });
    }

    return {
      mode,
      totalRequested: paths.length,
      successCount: paths.length,
      errorCount: 0,
      reclaimedBytes: paths.length * 500 * 1024 * 1024,
      results: paths.map((p) => ({ path: p, success: true })),
    };
  },

  async getAppSettings(): Promise<UserPreferences> {
    if (isTauriEnvironment()) {
      return await invoke<UserPreferences>("get_app_settings");
    }
    return {
      schemaVersion: 1,
      theme: "dark-transparent",
      language: "en",
      reduceMotion: false,
      favorites: [],
      recentLocations: [],
      lastScanPath: null,
      sort: { field: "size", direction: "desc" },
    };
  },

  async saveAppSettings(settings: UserPreferences): Promise<void> {
    if (isTauriEnvironment()) {
      await invoke("save_app_settings", { settings });
    }
  },
};

async function simulateBrowserScan(
  request: ScanRequest,
  onEvent: (event: ScanEvent) => void
): Promise<ScanSummary> {
  const scanId = "sim-scan-" + Date.now();
  onEvent({ type: "started", scanId });

  const samplePackages = [
    { name: "web-portal", pm: "pnpm" as const, size: 845000000 },
    { name: "api-backend", pm: "npm" as const, size: 1450000000 },
    { name: "mobile-client", pm: "yarn" as const, size: 2100000000 },
    { name: "analytics-tool", pm: "bun" as const, size: 420000000 },
  ];

  let totalBytes = 0;
  for (let i = 0; i < samplePackages.length; i++) {
    const pkg = samplePackages[i];
    const id = `nm-${i}`;
    const nmPath = `${request.rootPath}\\${pkg.name}\\node_modules`;
    const projPath = `${request.rootPath}\\${pkg.name}`;

    onEvent({
      type: "candidate",
      entry: {
        id,
        nodeModulesPath: nmPath,
        projectPath: projPath,
        projectName: pkg.name,
        packageManager: pkg.pm,
        sizeBytes: null,
        modifiedAt: new Date(Date.now() - (i + 1) * 86400000 * 5).toISOString(),
        packageJsonFound: true,
        status: "measuring",
      },
    });

    onEvent({
      type: "progress",
      progress: {
        phase: "discovering",
        directoriesVisited: (i + 1) * 45,
        entriesFound: i + 1,
        entriesMeasured: 0,
        bytesMeasured: 0,
      },
    });
  }

  for (let i = 0; i < samplePackages.length; i++) {
    const pkg = samplePackages[i];
    const id = `nm-${i}`;
    totalBytes += pkg.size;

    onEvent({ type: "measured", id, sizeBytes: pkg.size });
    onEvent({
      type: "progress",
      progress: {
        phase: "measuring",
        directoriesVisited: 200,
        entriesFound: samplePackages.length,
        entriesMeasured: i + 1,
        bytesMeasured: totalBytes,
      },
    });
  }

  const summary: ScanSummary = {
    scanId,
    rootPath: request.rootPath,
    totalEntries: samplePackages.length,
    totalBytes,
    durationMs: 450,
    errorsCount: 0,
  };

  onEvent({ type: "completed", summary });
  return summary;
}
