const BASE_URL =
  import.meta.env.VITE_AI_BACKEND;

export async function textToSpeech({
  text,
  language,
}) {
  const response = await fetch(
    `${BASE_URL}/api/v1/tts`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        text,
        language,
      }),
    }
  );

  return await response.json();
}
