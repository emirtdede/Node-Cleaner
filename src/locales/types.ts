export interface TranslationSchema {
  app: {
    title: string;
    tagline: string;
    description: string;
  };
  header: {
    changeLocation: string;
    chooseFolder: string;
    chooseFolderSub: string;
    scan: string;
    scanning: string;
    stopScan: string;
    rescan: string;
    settings: string;
    defaultLocations: string;
    favorites: string;
    recent: string;
    noFavorites: string;
    folderNotSelected: string;
    startScan: string;
  };
  quickLocations: {
    title: string;
    desktop: string;
    documents: string;
    projects: string;
    code: string;
    dev: string;
    repos: string;
    addFavorite: string;
  };
  favorites: {
    title: string;
    empty: string;
    addCurrent: string;
    remove: string;
    rename: string;
    notFound: string;
  };
  recent: {
    title: string;
  };
  scan: {
    idleTitle: string;
    idleSubtitle: string;
    selectFolderFirst: string;
    discovering: string;
    measuring: string;
    cancelling: string;
    completed: string;
    cancelled: string;
    failed: string;
    noResultsFound: string;
    statsProjects: (count: number) => string;
    statsCleanable: (size: string) => string;
    statsDirectoriesVisited: (count: number) => string;
  };
  table: {
    selectAll: string;
    selectRow: string;
    project: string;
    path: string;
    size: string;
    modified: string;
    packageManager: string;
    actions: string;
    searchPlaceholder: string;
    sortBy: string;
    sortSizeDesc: string;
    sortSizeAsc: string;
    sortDateDesc: string;
    sortDateAsc: string;
    sortNameAsc: string;
    sortNameDesc: string;
    measuring: string;
    unknown: string;
    noPackageJson: string;
    noSearchResults: string;
    folderCount: (count: number) => string;
  };
  rowActions: {
    openInExplorer: string;
    copyPath: string;
    copyProjectRoot: string;
    pathCopied: string;
    recycleItem: string;
    permanentDeleteItem: string;
    expand: string;
    collapse: string;
  };
  actionBar: {
    selectedCount: (count: number) => string;
    totalSize: (size: string) => string;
    recycleBinButton: string;
    permanentDeleteButton: string;
    clearSelection: string;
  };
  dialog: {
    cancel: string;
    confirm: string;
    recycleTitle: string;
    recycleDescription: (count: number, size: string) => string;
    recycleConfirmButton: string;
    permanentTitle: string;
    permanentDescription: (count: number, size: string) => string;
    permanentWarning: string;
    permanentConfirmButton: string;
    deletingInProgress: string;
    recycleSuccess: (count: number) => string;
    permanentSuccess: (count: number) => string;
    partialErrorTitle: string;
    partialErrorDescription: (successCount: number, errorCount: number) => string;
    lockedOrPermissionNote: string;
  };
  settings: {
    title: string;
    appearance: string;
    theme: string;
    darkThemes: string;
    lightThemes: string;
    themes: {
      "dark-black": string;
      "dark-gray": string;
      "dark-blue": string;
      "dark-purple": string;
      "dark-green": string;
      "dark-red": string;
      "dark-orange": string;
      "dark-yellow": string;
      "light-white": string;
      "light-gray": string;
      "light-blue": string;
      "light-purple": string;
      "light-green": string;
      "light-red": string;
      "light-orange": string;
      "light-yellow": string;
    };
    language: string;
    languageDesc: string;
    searchLanguage: string;
    systemDefault: string;
    performance: string;
    reduceMotion: string;
    reduceMotionDesc: string;
    favoritesManagement: string;
    noFavorites: string;
    deleteFavoriteConfirm: string;
    favoriteRemoved: string;
    favoriteAdded: string;
    about: string;
    version: string;
    platform: string;
    publisher: string;
    privacyNote: string;
    close: string;
  };
  legal?: LegalSchema;
  errors: {
    invalidPath: string;
    accessDenied: string;
    pathNotFound: string;
    scanCancelled: string;
    scanFailed: string;
    unsafeDeleteTarget: string;
    recycleBinFailed: string;
    permanentDeleteFailed: string;
    settingsReadFailed: string;
    settingsWriteFailed: string;
    openInExplorerFailed: string;
    copyPathFailed: string;
    unknown: string;
  };
  windowControls: {
    minimize: string;
    maximize: string;
    restore: string;
    close: string;
  };
  errorBoundary: {
    title: string;
    unknownError: string;
    reload: string;
  };
}

export interface LegalSchema {
  sectionTitle: string;
  back: string;
  velliumItemTitle: string;
  velliumItemDesc: string;
  privacyItemTitle: string;
  privacyItemDesc: string;
  termsItemTitle: string;
  termsItemDesc: string;
  securityItemTitle: string;
  securityItemDesc: string;
  licensesItemTitle: string;
  licensesItemDesc: string;
  visitWebsite: string;
  officialWebsite: string;
  allRightsReserved: string;
  velliumTagline: string;
  velliumManifesto: string[];
  privacyIntro: string;
  privacySections: Array<{ title: string; content: string }>;
  termsIntro: string;
  termsSections: Array<{ title: string; content: string }>;
  securityIntro: string;
  securitySections: Array<{ title: string; content: string }>;
  licensesIntro: string;
  licensesList: Array<{ name: string; version: string; license: string; description: string; url: string }>;
}

export type FullTranslationSchema = TranslationSchema & { legal: LegalSchema };

