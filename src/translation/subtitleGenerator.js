/**
 * Subtitle Generator
 * Generates subtitle structures.
 * Later connects with Whisper timestamps.
 */

export async function generateSubtitles({
  transcript,
  language,
}) {
  if (!transcript) {
    throw new Error("Transcript required.");
  }

  return {
    success: true,

    language,

    provider: "Whisper",

    subtitles: [],

    srtUrl: "",

    vttUrl: "",

    captionJson: [],
  };
}

/**
 * Converts subtitle blocks to SRT
 */

export function exportSRT(subtitles = []) {
  return subtitles
    .map((line, index) => {
      return `${index + 1}
${line.start} --> ${line.end}
${line.text}
`;
    })
    .join("\n");
}

/**
 * Converts subtitle blocks to WebVTT
 */

export function exportVTT(subtitles = []) {
  return (
    "WEBVTT\n\n" +
    subtitles
      .map((line) => {
        return `${line.start} --> ${line.end}
${line.text}
`;
      })
      .join("\n")
  );
}
