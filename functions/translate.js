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

    const apiKey = context.env.LIBRETRANSLATE_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "LibreTranslate API key is not configured.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const response = await fetch(
      "https://de.libretranslate.com/translate",
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
          api_key: apiKey,
        }),
      }
    );

    const raw = await response.text();

    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      data = {
        error: raw || "Invalid response from LibreTranslate.",
      };
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error:
            data.error ||
            "LibreTranslate translation request failed.",
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify(data),
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
