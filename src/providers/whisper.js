/**
 * Whisper Provider
 *
 * Handles:
 * - Speech → Text
 */

const BASE_URL =
  import.meta.env.VITE_WHISPER_API;

export async function speechToText(
  audioUrl
) {
  try {
    const response = await fetch(
      `${BASE_URL}/transcribe`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          audioUrl,
        }),
      }
    );

    return await response.json();
  } catch (error) {
    console.error(
      "Whisper Error:",
      error
    );

    throw error;
  }
}
