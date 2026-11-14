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
    code: "zh-CN",
    name: "Chinese (Simplified)",
    nativeName: "中文",
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
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
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

  if (normalized === "zh" || normalized === "zh-cn") {
    return "zh-CN";
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
