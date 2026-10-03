/**
 * Inclura Platform Supported Languages
 *
 * Central language configuration used by:
 * - i18next
 * - LanguageSelector
 * - translation services
 * - accessibility features
 * - user language preferences
 *
 * IMPORTANT:
 * - Language codes must remain compatible with the project's i18next resources.
 * - Translation strings belong in i18next resource files.
 * - This file contains language metadata only.
 */

export const SUPPORTED_LANGUAGES = Object.freeze([
  // Global

  Object.freeze({
    code: "en",
    name: "English",
    nativeName: "English",
    direction: "ltr",
    flag: "🇬🇧",
  }),

  Object.freeze({
    code: "fr",
    name: "French",
    nativeName: "Français",
    direction: "ltr",
    flag: "🇫🇷",
  }),

  Object.freeze({
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    direction: "ltr",
    flag: "🇪🇸",
  }),

  Object.freeze({
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    direction: "ltr",
    flag: "🇵🇹",
  }),

  Object.freeze({
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    direction: "rtl",
    flag: "🇸🇦",
  }),

  // African

  Object.freeze({
    code: "sw",
    name: "Swahili",
    nativeName: "Kiswahili",
    direction: "ltr",
    flag: "🇰🇪",
  }),

  Object.freeze({
    code: "ha",
    name: "Hausa",
    nativeName: "Hausa",
    direction: "ltr",
    flag: "🇳🇬",
  }),

  Object.freeze({
    code: "yo",
    name: "Yoruba",
    nativeName: "Yorùbá",
    direction: "ltr",
    flag: "🇳🇬",
  }),

  Object.freeze({
    code: "ig",
    name: "Igbo",
    nativeName: "Igbo",
    direction: "ltr",
    flag: "🇳🇬",
  }),

  Object.freeze({
    code: "am",
    name: "Amharic",
    nativeName: "አማርኛ",
    direction: "ltr",
    flag: "🇪🇹",
  }),

  Object.freeze({
    code: "zu",
    name: "Zulu",
    nativeName: "isiZulu",
    direction: "ltr",
    flag: "🇿🇦",
  }),

  // Asian

  Object.freeze({
    code: "zh-CN",
    name: "Chinese (Simplified)",
    nativeName: "简体中文",
    direction: "ltr",
    flag: "🇨🇳",
  }),

  Object.freeze({
    code: "zh-TW",
    name: "Chinese (Traditional)",
    nativeName: "繁體中文",
    direction: "ltr",
    flag: "🇹🇼",
  }),

  Object.freeze({
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    direction: "ltr",
    flag: "🇯🇵",
  }),

  Object.freeze({
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    direction: "ltr",
    flag: "🇰🇷",
  }),

  Object.freeze({
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    direction: "ltr",
    flag: "🇮🇳",
  }),

  Object.freeze({
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    direction: "ltr",
    flag: "🇧🇩",
  }),

  Object.freeze({
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    direction: "rtl",
    flag: "🇵🇰",
  }),

  Object.freeze({
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    direction: "ltr",
    flag: "🇮🇳",
  }),

  Object.freeze({
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    direction: "ltr",
    flag: "🇮🇩",
  }),

  Object.freeze({
    code: "th",
    name: "Thai",
    nativeName: "ไทย",
    direction: "ltr",
    flag: "🇹🇭",
  }),

  Object.freeze({
    code: "vi",
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    direction: "ltr",
    flag: "🇻🇳",
  }),

  // Europe

  Object.freeze({
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    direction: "ltr",
    flag: "🇩🇪",
  }),

  Object.freeze({
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    direction: "ltr",
    flag: "🇮🇹",
  }),

  Object.freeze({
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    direction: "ltr",
    flag: "🇳🇱",
  }),

  Object.freeze({
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    direction: "ltr",
    flag: "🇷🇺",
  }),

  Object.freeze({
    code: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
    direction: "ltr",
    flag: "🇹🇷",
  }),
]);

/**
 * Get language metadata by language code.
 */
export function getSupportedLanguage(languageCode) {
  if (!languageCode || typeof languageCode !== "string") {
    return null;
  }

  const normalizedCode = languageCode.trim().toLowerCase();

  return (
    SUPPORTED_LANGUAGES.find(
      (language) => language.code.toLowerCase() === normalizedCode
    ) || null
  );
}

/**
 * Check whether a language code is supported by Inclura.
 */
export function isSupportedLanguage(languageCode) {
  return Boolean(getSupportedLanguage(languageCode));
}

/**
 * Get all supported language codes.
 */
export function getSupportedLanguageCodes() {
  return SUPPORTED_LANGUAGES.map((language) => language.code);
}

/**
 * Get the text direction for a language.
 */
export function getLanguageDirection(languageCode) {
  return getSupportedLanguage(languageCode)?.direction || "ltr";
}

/**
 * Get the native display name for a language.
 */
export function getLanguageNativeName(languageCode) {
  return getSupportedLanguage(languageCode)?.nativeName || null;
}

export default SUPPORTED_LANGUAGES;
