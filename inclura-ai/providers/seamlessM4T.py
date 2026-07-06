const BASE_URL =
  import.meta.env.VITE_AI_BACKEND;

export async function translateText({
  text,
  sourceLanguage,
  targetLanguage,
}) {
  const response = await fetch(
    `${BASE_URL}/api/v1/translate`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        text,
        sourceLanguage,
        targetLanguage,
      }),
    }
  );

  return await response.json();
}
