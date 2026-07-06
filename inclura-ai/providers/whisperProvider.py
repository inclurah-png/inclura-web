const BASE_URL =
  import.meta.env.VITE_AI_BACKEND;

export async function speechToText(
  audioFile
) {
  const form = new FormData();

  form.append(
    "audio",
    audioFile
  );

  const response = await fetch(
    `${BASE_URL}/api/v1/speech`,
    {
      method: "POST",
      body: form,
    }
  );

  return await response.json();
}
