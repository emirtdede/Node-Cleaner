import { SupportedLanguage } from "@/types";

export interface LanguageMeta {
  id: SupportedLanguage;
  name: string;
  nativeName: string;
  rtl?: boolean;
}

export const LANGUAGES_LIST: LanguageMeta[] = [
  { id: "tr", name: "Turkish", nativeName: "Türkçe" },
  { id: "en", name: "English", nativeName: "English" },
  { id: "de", name: "German", nativeName: "Deutsch" },
  { id: "es", name: "Spanish", nativeName: "Español" },
  { id: "fr", name: "French", nativeName: "Français" },
  { id: "it", name: "Italian", nativeName: "Italiano" },
  { id: "pt", name: "Portuguese", nativeName: "Português" },
  { id: "nl", name: "Dutch", nativeName: "Nederlands" },
  { id: "pl", name: "Polish", nativeName: "Polski" },
  { id: "ru", name: "Russian", nativeName: "Русский" },
  { id: "ja", name: "Japanese", nativeName: "日本語" },
  { id: "ko", name: "Korean", nativeName: "한국어" },
  { id: "zh", name: "Chinese (Simplified)", nativeName: "简体中文" },
  { id: "zh-tw", name: "Chinese (Traditional)", nativeName: "繁體中文" },
  { id: "sv", name: "Swedish", nativeName: "Svenska" },
  { id: "ar", name: "Arabic", nativeName: "العربية", rtl: true },
  { id: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { id: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { id: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { id: "uk", name: "Ukrainian", nativeName: "Українська" },
  { id: "el", name: "Greek", nativeName: "Ελληνικά" },
  { id: "cs", name: "Czech", nativeName: "Čeština" },
  { id: "da", name: "Danish", nativeName: "Dansk" },
  { id: "fi", name: "Finnish", nativeName: "Suomi" },
  { id: "no", name: "Norwegian", nativeName: "Norsk" },
  { id: "hu", name: "Hungarian", nativeName: "Magyar" },
  { id: "ro", name: "Romanian", nativeName: "Română" },
  { id: "th", name: "Thai", nativeName: "ไทย" },
  { id: "ms", name: "Malay", nativeName: "Bahasa Melayu" },
  { id: "fil", name: "Filipino", nativeName: "Filipino" },
  { id: "bn", name: "Bengali", nativeName: "বাংলা" },
  { id: "he", name: "Hebrew", nativeName: "עברית", rtl: true },
  { id: "fa", name: "Persian", nativeName: "فارسی", rtl: true },
  { id: "ur", name: "Urdu", nativeName: "اردو", rtl: true },
  { id: "az", name: "Azerbaijani", nativeName: "Azərbaycan dili" },
  { id: "kk", name: "Kazakh", nativeName: "Қазақша" },
  { id: "uz", name: "Uzbek", nativeName: "Oʻzbekcha" },
  { id: "bg", name: "Bulgarian", nativeName: "Български" },
  { id: "sk", name: "Slovak", nativeName: "Slovenčina" },
  { id: "hr", name: "Croatian", nativeName: "Hrvatski" },
  { id: "et", name: "Estonian", nativeName: "Eesti" },
  { id: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { id: "te", name: "Telugu", nativeName: "తెలుగు" },
  { id: "mr", name: "Marathi", nativeName: "मराठी" },
  { id: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { id: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { id: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { id: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { id: "lt", name: "Lithuanian", nativeName: "Lietuvių" },
  { id: "lv", name: "Latvian", nativeName: "Latviešu" },
  { id: "sr", name: "Serbian", nativeName: "Srpski" },
  { id: "sl", name: "Slovenian", nativeName: "Slovenščina" },
  { id: "bs", name: "Bosnian", nativeName: "Bosanski" },
  { id: "sq", name: "Albanian", nativeName: "Shqip" },
  { id: "mk", name: "Macedonian", nativeName: "Македонски" },
  { id: "is", name: "Icelandic", nativeName: "Íslenska" },
  { id: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { id: "am", name: "Amharic", nativeName: "አማርኛ" },
  { id: "ha", name: "Hausa", nativeName: "Hausa" },
  { id: "yo", name: "Yoruba", nativeName: "Yorùbá" },
  { id: "af", name: "Afrikaans", nativeName: "Afrikaans" },
  { id: "ka", name: "Georgian", nativeName: "ქართული" },
  { id: "hy", name: "Armenian", nativeName: "Հայերեն" },
  { id: "ky", name: "Kyrgyz", nativeName: "Кыргызча" },
  { id: "tk", name: "Turkmen", nativeName: "Türkmençe" },
  { id: "mn", name: "Mongolian", nativeName: "Монгол" },
  { id: "ca", name: "Catalan", nativeName: "Català" },
  { id: "eu", name: "Basque", nativeName: "Euskara" },
  { id: "gl", name: "Galician", nativeName: "Galego" },
  { id: "ga", name: "Irish", nativeName: "Gaeilge" },
  { id: "my", name: "Burmese", nativeName: "မြန်မာစာ" },
  { id: "km", name: "Khmer", nativeName: "ភាសាខ្មែរ" },
  { id: "si", name: "Sinhala", nativeName: "සිංහල" },
];

export function detectSystemLanguage(): SupportedLanguage {
  if (typeof navigator === "undefined" || !navigator.language) {
    return "en";
  }

  const raw = navigator.language.toLowerCase();

  // Exact matches
  if (raw === "zh-tw" || raw === "zh-hk" || raw === "zh-hant") return "zh-tw";
  if (raw.startsWith("zh")) return "zh";

  const prefix = raw.split("-")[0] as SupportedLanguage;
  const exists = LANGUAGES_LIST.some((l) => l.id === prefix);
  if (exists) {
    return prefix;
  }

  return "en";
}

export function isRtlLanguage(lang: SupportedLanguage): boolean {
  const meta = LANGUAGES_LIST.find((l) => l.id === lang);
  return Boolean(meta?.rtl);
}
