// =======================================================
// Inclura Translation Gateway
// Cloudflare Pages Function
// =======================================================
//
// POST /translate
//
// Request:
// {
//   "text": "Hello",
//   "target": "yo"
// }
//
// Response:
// {
//   "translatedText": "..."
// }
//
// Translation engine:
// Inclura Translation Service
// MADLAD-400-3B-CT2
// =======================================================


// =======================================================
// JSON helper
// =======================================================

function jsonResponse(
  body,
  status = 200
) {
  return new Response(
    JSON.stringify(body),
    {
      status,

      headers: {
        "Content-Type":
          "application/json",
      },
    }
  );
}


// =======================================================
// Language normalization
// =======================================================

function normalizeLanguage(
  code
) {
  if (!code) {
    return "";
  }

  const value =
    String(code)
      .trim()
      .toLowerCase();

  if (
    value === "zh-tw" ||
    value === "zh_hant"
  ) {
    return "zh-TW";
  }

  return value;
}


// =======================================================
// POST /translate
// =======================================================

export async function onRequestPost(
  context
) {

  try {

    // ---------------------------------------------------
    // Read request
    // ---------------------------------------------------

    const body =
      await context.request.json();


    const text =
      typeof body.text === "string"
        ? body.text.trim()
        : "";


    const target =
      normalizeLanguage(
        body.target
      );


    // ---------------------------------------------------
    // Validate
    // ---------------------------------------------------

    if (
      !text ||
      !target
    ) {

      return jsonResponse(
        {
          error:
            "Text and target language are required.",
        },

        400
      );
    }


    // ---------------------------------------------------
    // Maximum request size
    // ---------------------------------------------------

    if (
      text.length > 5000
    ) {

      return jsonResponse(
        {
          error:
            "Text is too long. Maximum length is 5000 characters.",
        },

        413
      );
    }


    // ---------------------------------------------------
    // Translation service URL
    // ---------------------------------------------------
    //
    // Configure this in Cloudflare Pages:
    //
    // TRANSLATION_SERVICE_URL
    //
    // Example:
    //
    // https://your-inclura-translation-service.example.com
    //
    // We deliberately do NOT hard-code an imaginary
    // deployment URL.
    // ---------------------------------------------------

    const serviceUrl =
      context.env
        .TRANSLATION_SERVICE_URL;


    if (!serviceUrl) {

      return jsonResponse(
        {
          error:
            "Translation service is not configured.",
          code:
            "TRANSLATION_SERVICE_NOT_CONFIGURED",
        },

        500
      );
    }


    // ---------------------------------------------------
    // Build inference request
    // ---------------------------------------------------

    const endpoint =
      `${serviceUrl.replace(/\/$/, "")}/translate`;


    const response =
      await fetch(
        endpoint,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            text,
            target,
          }),
        }
      );


    // ---------------------------------------------------
    // Read response
    // ---------------------------------------------------

    const raw =
      await response.text();


    let data;


    try {

      data =
        JSON.parse(raw);

    } catch {

      data = {
        error:
          raw ||
          "Invalid translation service response.",
      };

    }


    // ---------------------------------------------------
    // Provider failure
    // ---------------------------------------------------

    if (
      !response.ok
    ) {

      return jsonResponse(
        {
          error:
            data.detail ||
            data.error ||
            "Translation service request failed.",
        },

        response.status
      );
    }


    // ---------------------------------------------------
    // Validate translation
    // ---------------------------------------------------

    if (
      !data.translatedText ||
      typeof data.translatedText !==
        "string"
    ) {

      return jsonResponse(
        {
          error:
            "Translation service returned no translated text.",
        },

        502
      );
    }


    // ---------------------------------------------------
    // Successful translation
    // ---------------------------------------------------

    return jsonResponse(
      {
        translatedText:
          data.translatedText.trim(),
      },

      200
    );


  } catch (err) {

    console.error(
      "Inclura Translation Gateway Error:",
      err
    );


    return jsonResponse(
      {
        error:
          err instanceof Error
            ? err.message
            : "Translation failed.",
      },

      500
    );
  }
}
