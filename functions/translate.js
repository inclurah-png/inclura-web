export async function onRequestPost(context) {
  try {
    const { text, target } = await context.request.json();

    const response = await fetch(
      "https://libretranslate.de/translate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: "auto",
          target: target,
          format: "text",
        }),
      }
    );

    const data = await response.json();

    return new Response(
      JSON.stringify({
        translatedText: data.translatedText,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err.message,
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
