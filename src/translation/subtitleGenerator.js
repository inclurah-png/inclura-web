/**
 * Subtitle Generator
 *
 * Current status:
 * Subtitle generation from Whisper
 * timestamps is not connected yet.
 *
 * The SRT and WebVTT export utilities
 * are available for completed subtitle
 * blocks.
 */

/**
 * Generates subtitle structures.
 *
 * The actual Whisper timestamp integration
 * should be connected through the secure
 * backend once the transcription endpoint
 * is available.
 */
export async function generateSubtitles({
  transcript,
  language,
}) {
  if (
    typeof transcript !==
      "string" ||
    !transcript.trim()
  ) {
    throw new Error(
      "Transcript required."
    );
  }

  const normalizedLanguage =
    language
      ? String(language)
          .trim()
          .toLowerCase()
          .replace(/_/g, "-")
      : "auto";

  /*
   * Whisper timestamp generation is not
   * connected yet.
   *
   * Do not return success:true with an
   * empty subtitle array because that
   * falsely indicates that subtitles
   * were generated.
   */
  throw new Error(
    "Subtitle generation service is not connected yet."
  );
}

/**
 * Converts subtitle blocks to SRT.
 *
 * Expected subtitle structure:
 *
 * {
 *   start: "00:00:01,000",
 *   end: "00:00:03,000",
 *   text: "Example subtitle"
 * }
 */
export function exportSRT(
  subtitles = []
) {
  if (
    !Array.isArray(
      subtitles
    )
  ) {
    throw new Error(
      "Subtitles must be an array."
    );
  }

  return subtitles
    .map((line, index) => {
      if (
        !line ||
        typeof line.text !==
          "string"
      ) {
        return "";
      }

      const start =
        line.start || "00:00:00,000";

      const end =
        line.end || "00:00:00,000";

      return `${index + 1}
${start} --> ${end}
${line.text.trim()}
`;
    })
    .filter(Boolean)
    .join("\n");
}

/**
 * Converts subtitle blocks to WebVTT.
 *
 * Expected subtitle structure:
 *
 * {
 *   start: "00:00:01.000",
 *   end: "00:00:03.000",
 *   text: "Example subtitle"
 * }
 */
export function exportVTT(
  subtitles = []
) {
  if (
    !Array.isArray(
      subtitles
    )
  ) {
    throw new Error(
      "Subtitles must be an array."
    );
  }

  const blocks =
    subtitles
      .map((line) => {
        if (
          !line ||
          typeof line.text !==
            "string"
        ) {
          return "";
        }

        const start =
          line.start ||
          "00:00:00.000";

        const end =
          line.end ||
          "00:00:00.000";

        return `${start} --> ${end}
${line.text.trim()}
`;
      })
      .filter(Boolean)
      .join("\n");

  return `WEBVTT\n\n${blocks}`;
}
