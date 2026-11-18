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





  // Asian























  // Europe










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
