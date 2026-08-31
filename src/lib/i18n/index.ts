import { usePreferencesStore } from "@/stores/preferences-store";
import { SupportedLanguage } from "@/types";
import { DICTIONARIES } from "@/locales/dictionaries";
import { TranslationSchema, LegalSchema, FullTranslationSchema } from "@/locales/types";
import { LANGUAGES_LIST, detectSystemLanguage, isRtlLanguage } from "@/locales/languages";
import trDict from "@/locales/langs/tr";
import enDict from "@/locales/langs/en";

export { LANGUAGES_LIST, detectSystemLanguage, isRtlLanguage };
export type { TranslationSchema, LegalSchema, FullTranslationSchema };

export function getTranslation(lang?: SupportedLanguage): FullTranslationSchema {
  const currentLang = lang || usePreferencesStore.getState().language || "en";
  const dict = DICTIONARIES[currentLang] || DICTIONARIES["en"] || DICTIONARIES["tr"];
  const legal = (dict.legal || (currentLang === "tr" ? trDict.legal : enDict.legal)) as LegalSchema;
  return {
    ...dict,
    legal,
  };
}

export function useI18n() {
  const language = usePreferencesStore((s) => s.language) || "en";
  const setLanguage = usePreferencesStore((s) => s.setLanguage);
  const isRtl = isRtlLanguage(language);
  const dict = DICTIONARIES[language] || DICTIONARIES["en"] || DICTIONARIES["tr"];
  const legal = (dict.legal || (language === "tr" ? trDict.legal : enDict.legal)) as LegalSchema;

  const t: FullTranslationSchema = {
    ...dict,
    legal,
  };

  return {
    language,
    setLanguage,
    isRtl,
    t,
  };
}

export const useTranslation = useI18n;

// Smart reactive proxy for backward compatibility with `import { tr } from "@/locales/tr"`
export function createTranslationProxy(): TranslationSchema {
  return new Proxy({} as TranslationSchema, {
    get(_target, sectionKey: string) {
      const activeLang = usePreferencesStore.getState().language || "en";
      const dict = DICTIONARIES[activeLang] || DICTIONARIES["en"] || DICTIONARIES["tr"];
      const section = (dict as any)[sectionKey];

      if (typeof section === "object" && section !== null) {
        return new Proxy(section, {
          get(_secTarget, propKey: string) {
            const currentLang = usePreferencesStore.getState().language || "en";
            const currentDict = DICTIONARIES[currentLang] || DICTIONARIES["en"] || DICTIONARIES["tr"];
            const currentSection = (currentDict as any)[sectionKey] || {};
            return currentSection[propKey] ?? (dict as any)[sectionKey]?.[propKey];
          },
        });
      }

      return section;
    },
  });
}

export const tr = createTranslationProxy();
export default tr;
