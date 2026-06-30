export async function onRequestPost(context) {
  try {
    const { text, target } = await context.request.json();

    const response = await fetch(
      "https://libretranslate.de/translate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: "auto",
          target: target,
          format: "text",
        }),
      }
    );

    const raw = await response.text();

    console.log("Status:", response.status);
    console.log("Response:", raw);

    return new Response(raw, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (err) {
    console.log("Cloudflare Error:", err);

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
