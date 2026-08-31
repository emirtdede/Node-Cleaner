import { TranslationSchema } from "../types";

export const en: TranslationSchema = {
  app: {
    title: "Node Cleaner",
    tagline: "node_modules Cleaner",
    description: "Reclaim developer disk space instantly.",
  },
  header: {
    changeLocation: "Change Location",
    chooseFolder: "Choose a Different Location...",
    chooseFolderSub: "Browse and select folder from disk",
    scan: "Scan",
    scanning: "Scanning...",
    stopScan: "Stop",
    rescan: "Rescan",
    settings: "Settings",
    defaultLocations: "DEFAULT LOCATIONS",
    favorites: "FAVORITES",
    recent: "RECENT LOCATIONS",
    noFavorites: "No favorites added yet.",
    folderNotSelected: "Select Folder...",
    startScan: "Start Scan",
  },
  quickLocations: {
    title: "Quick Locations",
    desktop: "Desktop",
    documents: "Documents",
    projects: "Projects",
    code: "Code",
    dev: "Dev",
    repos: "Repos",
    addFavorite: "Add to Favorites",
  },
  favorites: {
    title: "Favorites",
    empty: "No favorite locations added yet",
    addCurrent: "Add Current Location to Favorites",
    remove: "Remove from Favorites",
    rename: "Rename",
    notFound: "Location not found",
  },
  recent: {
    title: "Recent Locations",
  },
  scan: {
    idleTitle: "Reclaim Your Disk Space",
    idleSubtitle: "Find and safely clean node_modules folders across all your projects.",
    selectFolderFirst: "Select a folder above to start scanning.",
    discovering: "Discovering projects...",
    measuring: "Calculating sizes...",
    cancelling: "Cancelling scan...",
    completed: "Scan completed",
    cancelled: "Scan cancelled",
    failed: "Scan failed",
    noResultsFound: "No node_modules folders were found in this directory.",
    statsProjects: (count: number) => `${count} projects found`,
    statsCleanable: (size: string) => `${size} cleanable`,
    statsDirectoriesVisited: (count: number) => `${count} directories visited`,
  },
  table: {
    selectAll: "Select all",
    selectRow: "Select row",
    project: "Project",
    path: "Path",
    size: "Size",
    modified: "Last Modified",
    packageManager: "Package Manager",
    actions: "Actions",
    searchPlaceholder: "Filter by project name or path... (Ctrl+F)",
    sortBy: "Sort by",
    sortSizeDesc: "Size (Largest First)",
    sortSizeAsc: "Size (Smallest First)",
    sortDateDesc: "Last Modified (Newest First)",
    sortDateAsc: "Last Modified (Oldest First)",
    sortNameAsc: "Project Name (A-Z)",
    sortNameDesc: "Project Name (Z-A)",
    measuring: "Measuring...",
    unknown: "An unknown error occurred.",
    noPackageJson: "no package.json",
    noSearchResults: "No matching projects found for your search.",
    folderCount: (count: number) => `${count} Folders`,
  },
  rowActions: {
    openInExplorer: "Open in File Explorer",
    copyPath: "Copy Path",
    copyProjectRoot: "Copy Project Root Path",
    pathCopied: "Path copied to clipboard",
    recycleItem: "Move to Recycle Bin",
    permanentDeleteItem: "Permanently Delete",
    expand: "Expand",
    collapse: "Collapse",
  },
  actionBar: {
    selectedCount: (count: number) => `${count} items selected`,
    totalSize: (size: string) => `Total: ${size}`,
    recycleBinButton: "Move to Recycle Bin",
    permanentDeleteButton: "Permanently Delete",
    clearSelection: "Clear Selection",
  },
  dialog: {
    cancel: "Cancel",
    confirm: "Confirm",
    recycleTitle: "Move Selected Folders to Recycle Bin?",
    recycleDescription: (count: number, size: string) => `${count} node_modules folders (${size}) will be moved to the Recycle Bin. You can restore them anytime.`,
    recycleConfirmButton: "Move to Recycle Bin",
    permanentTitle: "Permanently Delete Selected Folders?",
    permanentDescription: (count: number, size: string) => `${count} node_modules folders (${size}) will be permanently deleted from disk. This cannot be undone.`,
    permanentWarning: "WARNING: This action is permanent! Folders will not be sent to the Recycle Bin.",
    permanentConfirmButton: "Permanently Delete",
    deletingInProgress: "Deleting in progress...",
    recycleSuccess: (count: number) => `${count} folders moved to the Recycle Bin successfully.`,
    permanentSuccess: (count: number) => `${count} folders permanently deleted successfully.`,
    partialErrorTitle: "Partial Deletion Report",
    partialErrorDescription: (successCount: number, errorCount: number) => `${successCount} folders cleaned, but ${errorCount} folders could not be deleted.`,
    lockedOrPermissionNote: "Some files may be locked by running processes or require elevated permissions. Close relevant programs and try again.",
  },
  settings: {
    title: "Settings",
    appearance: "Appearance",
    theme: "Theme",
    darkThemes: "Dark Themes",
    lightThemes: "Light Themes",
    themes: {
      "dark-black": "Black",
      "dark-gray": "Dark Gray",
      "dark-blue": "Dark Blue",
      "dark-purple": "Dark Purple",
      "dark-green": "Dark Green",
      "dark-red": "Dark Red",
      "dark-orange": "Dark Orange",
      "dark-yellow": "Dark Yellow",
      "light-white": "White",
      "light-gray": "Light Gray",
      "light-blue": "Light Blue",
      "light-purple": "Light Purple",
      "light-green": "Light Green",
      "light-red": "Light Red",
      "light-orange": "Light Orange",
      "light-yellow": "Light Yellow",
    },
    language: "Language",
    languageDesc: "Select user interface language (73 languages)",
    searchLanguage: "Search language... (73 languages)",
    systemDefault: "System Default",
    performance: "Performance & Animation",
    reduceMotion: "Reduce Motion",
    reduceMotionDesc: "Disables animations and visual effects for lower resource usage.",
    favoritesManagement: "Favorites Management",
    noFavorites: "No saved favorites yet.",
    deleteFavoriteConfirm: "Are you sure you want to remove this favorite location?",
    favoriteRemoved: "Favorite location removed.",
    favoriteAdded: "Added to favorites.",
    about: "About",
    version: "Version",
    platform: "Tauri v2 + React 18 + Rust",
    publisher: "Publisher: Vellium • © 2026 Vellium. All rights reserved.",
    privacyNote: "All scans and deletions occur 100% locally on your computer. Zero telemetry or data transmission.",
    close: "Close",
  },
  legal: {
    sectionTitle: "Legal Information & Corporate",
    back: "Back",
    velliumItemTitle: "About Vellium",
    velliumItemDesc: "Our engineering philosophy, vision, and corporate identity",
    privacyItemTitle: "Privacy Policy",
    privacyItemDesc: "100% local-first, zero telemetry, and on-device data safety",
    termsItemTitle: "Terms of Service & EULA",
    termsItemDesc: "End user license agreement, usage terms, and intellectual property",
    securityItemTitle: "Security & Data Safety",
    securityItemDesc: "System protection, safe deletion mechanics, and data guarantees",
    licensesItemTitle: "Third-Party Licenses",
    licensesItemDesc: "Open-source libraries, licenses, and copyright attributions",
    visitWebsite: "Visit Vellium.dev",
    officialWebsite: "Official Website: Vellium.dev",
    allRightsReserved: "© 2026 Vellium. All rights reserved.",
    velliumTagline: "Enduring Software Shaped by Precision, Privacy, and Reliability",
    velliumManifesto: [
      "Vellium builds enduring software systems shaped by precision, privacy, and long-term reliability.",
      "We create software products that integrate naturally into everyday workflows, reduce digital friction, and continue to deliver a refined user experience over time. Our work spans desktop utilities, enterprise management systems, intelligent reading workspaces, secure commerce platforms, camera tools, simulation applications, and emerging digital communities.",
      "Every product we build follows the same principle: software should not feel fragile, noisy, or disposable. It should feel stable, deliberate, and respectful of the user’s attention, data, and environment.",
      "From local-first architectures and native desktop integrations to privacy-conscious processing, secure admin systems, algorithmic validation, machine-learning-supported simulations, and user-controlled AI features, Vellium approaches software as an engineered comfort space — not a temporary interface.",
      "We build systems that reduce chaos, preserve control, and turn technology into something precise, reliable, and lasting."
    ],
    privacyIntro: "Node Cleaner is engineered with a strict local-first philosophy and absolute respect for user privacy.",
    privacySections: [
      {
        title: "1. Zero Telemetry & Offline Architecture",
        content: "Node Cleaner never collects usage statistics, telemetry metrics, crash logs, or analytics. The application operates entirely offline without sending network requests to external servers."
      },
      {
        title: "2. Filesystem & Project Confidentiality",
        content: "Scanned folder paths, project structures, and file lists are processed exclusively in volatile memory and local storage. No folder or code metadata is ever transmitted across the network."
      },
      {
        title: "3. Local Configuration Storage",
        content: "Your preferences, selected themes, language choices, and saved favorite paths reside strictly within your operating system's standard application data directory (%APPDATA%/com.vellium.nodecleaner)."
      },
      {
        title: "4. User-Directed Execution",
        content: "All scanning and cleaning activities run solely when explicitly triggered by you. There are no background daemons, automated cloud syncs, or hidden watchers."
      }
    ],
    termsIntro: "By using Node Cleaner, you acknowledge and agree to the following terms and licensing provisions.",
    termsSections: [
      {
        title: "1. License Grant",
        content: "Vellium grants you a non-exclusive, non-transferable end-user license to install and use Node Cleaner for personal and commercial project maintenance."
      },
      {
        title: "2. User Responsibility",
        content: "You retain full responsibility for selecting target directories and confirming cleanup operations. Vellium is not responsible for inadvertent deletion of uncommitted or critical files resulting from user confirmation."
      },
      {
        title: "3. Intellectual Property",
        content: "Node Cleaner, including its source code, visual design, trademarks, branding, and algorithms, is the exclusive intellectual property of Vellium and protected under international copyright treaties."
      },
      {
        title: "4. Disclaimer of Warranty (AS IS)",
        content: "The software is provided 'AS IS', without warranty of any kind. Vellium makes no warranties that the application will be uninterrupted, error-free, or compatible with all operating system environments."
      }
    ],
    securityIntro: "Node Cleaner incorporates robust safety layers to safeguard your system stability and prevent unintended data loss.",
    securitySections: [
      {
        title: "1. System Directory Safeguard",
        content: "The scanner enforces built-in barriers preventing execution against root drives (C:\\, D:\\), Windows system folders (C:\\Windows, System32), and Program Files to prevent operating system corruption."
      },
      {
        title: "2. Recycle Bin by Default",
        content: "Deleted dependency trees are transferred to the Windows Recycle Bin by default, allowing quick and painless recovery of mistakenly selected packages."
      },
      {
        title: "3. Double-Confirmation Permanent Deletion",
        content: "Permanent disk deletion requires explicit verification and displays non-reversible warning prompts before any sectors are purged from storage."
      },
      {
        title: "4. Clean Exit (No Lingering Background Processes)",
        content: "When closed, Node Cleaner shuts down completely. It leaves no background services, hidden tray watchers, or scheduled tasks on your computer."
      }
    ],
    licensesIntro: "Node Cleaner proudly leverages open-source technology. The third-party libraries and their licenses are listed below:",
    licensesList: [
      {
        name: "Tauri",
        version: "2.2.0",
        license: "MIT / Apache-2.0",
        description: "Lightweight and secure native desktop application runtime and architecture.",
        url: "https://tauri.app"
      },
      {
        name: "React & React DOM",
        version: "18.3.1",
        license: "MIT",
        description: "Modern, declarative, and reactive user interface library.",
        url: "https://react.dev"
      },
      {
        name: "Lucide React",
        version: "1.16.0",
        license: "ISC",
        description: "Clean, consistent, and optimized modern UI icon collection.",
        url: "https://lucide.dev"
      },
      {
        name: "Zustand",
        version: "5.0.3",
        license: "MIT",
        description: "Small, fast, and scalable reactive state management library.",
        url: "https://zustand-demo.pmnd.rs"
      },
      {
        name: "Tokio",
        version: "1.49.0",
        license: "MIT",
        description: "Asynchronous I/O runtime and multithreaded task scheduler for Rust.",
        url: "https://tokio.rs"
      },
      {
        name: "Trash (Rust)",
        version: "5.2.2",
        license: "MIT",
        description: "Native and secure Windows Recycle Bin integration.",
        url: "https://crates.io/crates/trash"
      },
      {
        name: "WalkDir",
        version: "2.5.0",
        license: "Unlicense / MIT",
        description: "High-performance recursive filesystem walker.",
        url: "https://crates.io/crates/walkdir"
      },
      {
        name: "Serde & Serde JSON",
        version: "1.0.219",
        license: "MIT / Apache-2.0",
        description: "Efficient and type-safe data serialization/deserialization framework.",
        url: "https://serde.rs"
      },
      {
        name: "Chrono",
        version: "0.4.44",
        license: "MIT / Apache-2.0",
        description: "Date and time handling library for Rust.",
        url: "https://crates.io/crates/chrono"
      },
      {
        name: "Windows Crate",
        version: "0.58.0",
        license: "MIT / Apache-2.0",
        description: "Official Microsoft Windows Win32 API bindings for Rust.",
        url: "https://github.com/microsoft/windows-rs"
      },
      {
        name: "Vite",
        version: "6.2.0",
        license: "MIT",
        description: "Next generation ultra-fast frontend build tooling.",
        url: "https://vitejs.dev"
      },
      {
        name: "TypeScript",
        version: "5.7.3",
        license: "Apache-2.0",
        description: "Statically typed superset of JavaScript with strict type safety.",
        url: "https://www.typescriptlang.org"
      }
    ]
  },
  errors: {
    invalidPath: "Invalid directory path selected.",
    accessDenied: "Access denied to the specified directory. Check permissions.",
    pathNotFound: "Specified path was not found.",
    scanCancelled: "Scan was cancelled by user.",
    scanFailed: "An error occurred during scanning.",
    unsafeDeleteTarget: "For safety, root and system folders cannot be deleted.",
    recycleBinFailed: "Failed to move folders to Recycle Bin.",
    permanentDeleteFailed: "Failed to permanently delete folders.",
    settingsReadFailed: "Could not read settings file.",
    settingsWriteFailed: "Could not save settings.",
    openInExplorerFailed: "Could not open file explorer.",
    copyPathFailed: "Could not copy path to clipboard.",
    unknown: "An unknown error occurred.",
  },
  windowControls: {
    minimize: "Minimize",
    maximize: "Maximize",
    restore: "Restore",
    close: "Close",
  },
  errorBoundary: {
    title: "An Error Occurred While Starting the Application",
    unknownError: "An unexpected error occurred.",
    reload: "Restart",
  },
};

export default en;
