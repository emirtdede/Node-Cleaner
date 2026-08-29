import { describe, it, expect } from "vitest";
import { LANGUAGES_LIST, detectSystemLanguage, isRtlLanguage, getTranslation } from "../lib/i18n";
import { DICTIONARIES } from "../locales/dictionaries";
import { usePreferencesStore } from "../stores/preferences-store";

describe("73-Language i18n Engine & Localization Tests", () => {
  it("contains exactly 73 supported languages", () => {
    expect(LANGUAGES_LIST).toHaveLength(73);
    expect(Object.keys(DICTIONARIES)).toHaveLength(73);
  });

  it("detects system language or defaults gracefully", () => {
    const detected = detectSystemLanguage();
    expect(detected).toBeDefined();
    expect(LANGUAGES_LIST.some((l) => l.id === detected)).toBe(true);
  });

  it("detects RTL languages correctly (Arabic, Hebrew, Persian, Urdu)", () => {
    expect(isRtlLanguage("ar")).toBe(true);
    expect(isRtlLanguage("he")).toBe(true);
    expect(isRtlLanguage("fa")).toBe(true);
    expect(isRtlLanguage("ur")).toBe(true);

    expect(isRtlLanguage("tr")).toBe(false);
    expect(isRtlLanguage("en")).toBe(false);
    expect(isRtlLanguage("de")).toBe(false);
    expect(isRtlLanguage("ja")).toBe(false);
  });

  it("provides complete and valid translation dictionaries for all 73 languages", () => {
    for (const meta of LANGUAGES_LIST) {
      const dict = DICTIONARIES[meta.id];
      expect(dict).toBeDefined();
      expect(dict.app.title).toBe("Node Cleaner");
      expect(dict.header.scan).toBeTruthy();
      expect(dict.header.settings).toBeTruthy();
      expect(dict.scan.idleTitle).toBeTruthy();
      expect(dict.table.project).toBeTruthy();
      expect(dict.dialog.cancel).toBeTruthy();
      expect(dict.dialog.confirm).toBeTruthy();
      expect(dict.settings.title).toBeTruthy();
    }
  });

  it("switches language and dynamically resolves translations through preferences store", () => {
    const store = usePreferencesStore.getState();

    store.setLanguage("de");
    expect(usePreferencesStore.getState().language).toBe("de");
    let t = getTranslation("de");
    expect(t.header.scan).toBe("Scannen");

    store.setLanguage("ja");
    expect(usePreferencesStore.getState().language).toBe("ja");
    t = getTranslation("ja");
    expect(t.header.scan).toBe("スキャン");

    store.setLanguage("tr");
    expect(usePreferencesStore.getState().language).toBe("tr");
    t = getTranslation("tr");
    expect(t.header.scan).toBe("Tara");
  });
});
