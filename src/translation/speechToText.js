/**
 * Speech → Text Engine
 *
 * Current status:
 * The speech-to-text provider is not connected yet.
 *
 * Planned provider:
 * Whisper
 */

const AUDIO_FORMATS = [
  "mp3",
  "wav",
  "aac",
  "m4a",
  "ogg",
  "webm",
  "flac",
];

function normalizeAudioFormat(
  audioFile
) {
  if (!audioFile) {
    return "";
  }

  if (
    typeof audioFile ===
    "string"
  ) {
    const cleanPath =
      audioFile
        .split("?")[0]
        .split("#")[0];

    const parts =
      cleanPath.split(".");

    return (
      parts.length > 1
        ? parts[
            parts.length - 1
          ]
        : ""
    )
      .trim()
      .toLowerCase();
  }

  const fileName =
    audioFile.name || "";

  const parts =
    fileName.split(".");

  return (
    parts.length > 1
      ? parts[
          parts.length - 1
        ]
      : ""
  )
    .trim()
    .toLowerCase();
}

function normalizeLanguage(
  language
) {
  if (
    !language ||
    language === "auto"
  ) {
    return "auto";
  }

  return String(language)
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
}

/**
 * Speech → Text
 *
 * The actual Whisper integration should
 * be connected through the secure backend
 * once its endpoint is available.
 *
 * This function therefore does not falsely
 * report a successful transcription.
 */
export async function speechToText({
  audioFile,
  language = "auto",
}) {
  if (!audioFile) {
    throw new Error(
      "Missing audio."
    );
  }

  const audioFormat =
    normalizeAudioFormat(
      audioFile
    );

  if (
    audioFormat &&
    !AUDIO_FORMATS.includes(
      audioFormat
    )
  ) {
    throw new Error(
      `Unsupported audio format: ${audioFormat}.`
    );
  }

  const requestedLanguage =
    normalizeLanguage(
      language
    );

  /*
   * Whisper is not connected yet.
   *
   * Do not return success:true with an
   * empty transcript because that makes
   * callers believe transcription actually
   * occurred.
   */
  throw new Error(
    "Speech-to-text service is not connected yet."
  );
}

/**
 * Supported audio formats
 */
export function supportedAudioFormats() {
  return [
    ...AUDIO_FORMATS,
  ];
}
