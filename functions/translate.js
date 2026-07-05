export async function onRequestPost(context) {
  try {
    const { text, target } = await context.request.json();

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
        }),
      }
    );

    const raw = await response.text();

    console.log(raw);

    return new Response(raw, {
      headers: {
        "Content-Type": "text/plain",
      },
    });

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
