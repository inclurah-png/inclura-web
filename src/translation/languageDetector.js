import { SUPPORTED_LANGUAGES } from "./supportedLanguages";

/**
 * Detect language from text.
 * Placeholder until SeamlessM4T is connected.
 */
export async function detectLanguage(text = "") {
  if (!text.trim()) {
    return {
      code: "en",
      language: "English",
      confidence: 0,
    };
  }

  // Basic heuristics before AI
  const lower = text.toLowerCase();

  // Arabic
  if (/[\u0600-\u06FF]/.test(text)) {
    return {
      code: "ar",
      language: "Arabic",
      confidence: 0.99,
    };
  }

  // Chinese
  if (/[\u4E00-\u9FFF]/.test(text)) {
    return {
      code: "zh",
      language: "Chinese",
      confidence: 0.99,
    };
  }

  // Japanese
  if (/[\u3040-\u30FF]/.test(text)) {
    return {
      code: "ja",
      language: "Japanese",
      confidence: 0.99,
    };
  }

  // Korean
  if (/[\uAC00-\uD7AF]/.test(text)) {
    return {
      code: "ko",
      language: "Korean",
      confidence: 0.99,
    };
  }

  // Yoruba
  if (
    lower.includes("ẹ") ||
    lower.includes("ọba") ||
    lower.includes("ṣ")
  ) {
    return {
      code: "yo",
      language: "Yoruba",
      confidence: 0.90,
    };
  }

  // Hausa
  if (
    lower.includes("ina") ||
    lower.includes("allah") ||
    lower.includes("sannu")
  ) {
    return {
      code: "ha",
      language: "Hausa",
      confidence: 0.88,
    };
  }

  // Igbo
  if (
    lower.includes("anyị") ||
    lower.includes("ndị") ||
    lower.includes("ụlọ")
  ) {
    return {
      code: "ig",
      language: "Igbo",
      confidence: 0.88,
    };
  }

  // Nigerian Pidgin
  if (
    lower.includes("abeg") ||
    lower.includes("wetin") ||
    lower.includes("dey")
  ) {
    return {
      code: "pcm",
      language: "Nigerian Pidgin",
      confidence: 0.87,
    };
  }

  // Default
  return {
    code: "en",
    language: "English",
    confidence: 0.70,
  };
}

/**
 * Validate supported language.
 */
export function isSupportedLanguage(code) {
  return SUPPORTED_LANGUAGES.some(
    (lang) => lang.code === code
  );
}

/**
 * Get language metadata.
 */
export function getLanguageInfo(code) {
  return (
    SUPPORTED_LANGUAGES.find(
      (lang) => lang.code === code
    ) || null
  );
  }
