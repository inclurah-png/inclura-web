export async function onRequestPost(context) {
  try {
    const { text, target } = await context.request.json();

    if (!text || !target) {
      return new Response(
        JSON.stringify({
          error: "Text and target language are required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const response = await fetch(
  "https://translate.argosopentech.com/translate",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: text,
      source: "auto",
      target,
      format: "text",
    }),
  }
);

    const raw = await response.text();

    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      data = {
        error: raw || "Invalid response from translation service.",
      };
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error:
            data.error ||
            "Translation service request failed.",
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!data.translatedText) {
      return new Response(
        JSON.stringify({
          error: "Translation service returned no translated text.",
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        translatedText: data.translatedText,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Translation function error:", err);

    return new Response(
      JSON.stringify({
        error:
          err instanceof Error
            ? err.message
            : "Translation failed.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
