/**
 * AI Voice Generator
 *
 * Current provider:
 * Piper (planned)
 *
 * The actual voice-generation service is not
 * connected yet. This module provides the
 * normalized interface for future integration.
 */

function normalizeLanguageCode(code = "") {
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

  return normalized || "en";
}

function normalizeVoice(voice = "default") {
  const normalized =
    String(voice)
      .trim()
      .toLowerCase();

  return normalized || "default";
}

export async function generateVoice({
  text,
  language = "en",
  voice = "default",
}) {
  const sourceText =
    typeof text === "string"
      ? text.trim()
      : "";

  if (!sourceText) {
    throw new Error(
      "Missing text."
    );
  }

  const normalizedLanguage =
    normalizeLanguageCode(
      language
    );

  const normalizedVoice =
    normalizeVoice(voice);

  return {
    success: true,

    provider: "Piper",

    language:
      normalizedLanguage,

    voice:
      normalizedVoice,

    audioUrl: "",

    duration: 0,
  };
}

/**
 * Available voices
 */

export function getAvailableVoices() {
  return {
    en: [
      "male",
      "female",
    ],

    yo: [
      "male",
      "female",
    ],

    ig: [
      "male",
      "female",
    ],

    ha: [
      "male",
      "female",
    ],

    pcm: [
      "male",
      "female",
    ],

    fr: [
      "male",
      "female",
    ],

    es: [
      "male",
      "female",
    ],

    ar: [
      "male",
      "female",
    ],

    de: [
      "male",
      "female",
    ],

    pt: [
      "male",
      "female",
    ],

    sw: [
      "male",
      "female",
    ],

    zh: [
      "male",
      "female",
    ],

    "zh-TW": [
      "male",
      "female",
    ],

    ja: [
      "male",
      "female",
    ],

    hi: [
      "male",
      "female",
    ],

    ru: [
      "male",
      "female",
    ],

    ko: [
      "male",
      "female",
    ],

    vi: [
      "male",
      "female",
    ],

    th: [
      "male",
      "female",
    ],

    id: [
      "male",
      "female",
    ],

    ms: [
      "male",
      "female",
    ],

    bn: [
      "male",
      "female",
    ],

    tr: [
      "male",
      "female",
    ],

    it: [
      "male",
      "female",
    ],

    nl: [
      "male",
      "female",
    ],
  };
}
