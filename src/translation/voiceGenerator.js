/**
 * AI Voice Generator
 * Provider:
 * Piper (later)
 */

export async function generateVoice({
  text,
  language,
  voice = "default",
}) {
  if (!text) {
    throw new Error("Missing text.");
  }

  return {
    success: true,

    provider: "Piper",

    language,

    voice,

    audioUrl: "",

    duration: 0,
  };
}

/**
 * Available voices
 */

export function getAvailableVoices() {
  return {
    en: ["male", "female"],

    yo: ["male", "female"],

    ig: ["male", "female"],

    ha: ["male", "female"],

    pcm: ["male", "female"],

    fr: ["male", "female"],

    es: ["male", "female"],

    ar: ["male", "female"],

    de: ["male", "female"],

    pt: ["male", "female"],

    sw: ["male", "female"],

    zh: ["male", "female"],

    "zh-TW": ["male", "female"],

    ja: ["male", "female"],

    hi: ["male", "female"],

    ru: ["male", "female"],

    ko: ["male", "female"],

    vi: ["male", "female"],

    th: ["male", "female"],

    id: ["male", "female"],

    ms: ["male", "female"],

    bn: ["male", "female"],

    tr: ["male", "female"],

    it: ["male", "female"],

    nl: ["male", "female"],
  };
}
