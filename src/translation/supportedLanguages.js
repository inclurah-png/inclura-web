export const SUPPORTED_LANGUAGES = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    voice: true,
    speech: true,
    rtl: true,
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "zh-TW",
    name: "Traditional Chinese",
    nativeName: "繁體中文",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "sw",
    name: "Swahili",
    nativeName: "Kiswahili",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "yo",
    name: "Yoruba",
    nativeName: "Yorùbá",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "ig",
    name: "Igbo",
    nativeName: "Igbo",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "ha",
    name: "Hausa",
    nativeName: "Hausa",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "pcm",
    name: "Nigerian Pidgin",
    nativeName: "Naijá Pidgin",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "vi",
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "th",
    name: "Thai",
    nativeName: "ไทย",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "ms",
    name: "Malay",
    nativeName: "Bahasa Melayu",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    voice: true,
    speech: true,
    rtl: false,
  },
  {
    code: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
    voice: true,
    speech: true,
    rtl: false,
  },
];

/**
 * Normalize language codes for consistent comparisons.
 *
 * Examples:
 * zh-tw  -> zh-TW
 * zh_tw  -> zh-TW
 * zh_hant -> zh-TW
 * EN     -> en
 */
export function normalizeLanguageCode(code = "") {
  const normalized = String(code)
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");

  if (
    normalized === "zh-tw" ||
    normalized === "zh-hant"
  ) {
    return "zh-TW";
  }

  return normalized;
}

/**
 * Return language metadata by code.
 *
 * Matching is case-insensitive and handles normalized
 * Traditional Chinese language codes.
 */
export function getLanguage(code) {
  const normalizedCode =
    normalizeLanguageCode(code);

  if (!normalizedCode) {
    return null;
  }

  return (
    SUPPORTED_LANGUAGES.find(
      (language) =>
        normalizeLanguageCode(language.code) ===
        normalizedCode
    ) || null
  );
}

/**
 * Check whether a language code is supported.
 */
export function isSupportedLanguage(code) {
  return Boolean(getLanguage(code));
}
