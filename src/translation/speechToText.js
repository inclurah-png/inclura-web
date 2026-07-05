/**
 * Speech → Text Engine
 * Provider:
 * Whisper (later)
 */

export async function speechToText({
  audioFile,
  language = "auto",
}) {
  if (!audioFile) {
    throw new Error("Missing audio.");
  }

  return {
    success: true,

    provider: "Whisper",

    detectedLanguage: language,

    transcript: "",

    confidence: 0,

    duration: 0,
  };
}

/**
 * Supported audio formats
 */

export function supportedAudioFormats() {
  return [
    "mp3",
    "wav",
    "aac",
    "m4a",
    "ogg",
    "webm",
    "flac",
  ];
}
