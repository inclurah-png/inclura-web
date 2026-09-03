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
//   "translatedText": "Bawo"
// }
//
// Translation engine:
// Google Gemini API
// Model:
// gemini-3.1-flash-lite
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

        "Cache-Control":
          "no-store",
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
// Language names
// =======================================================
//
// These names give Gemini explicit language targets,
// especially for African languages where language-code
// interpretation needs to be unambiguous.
// =======================================================

const LANGUAGE_NAMES = {

  en: "English",
  es: "Spanish",
  fr: "French",
  pt: "Portuguese",
  ar: "Arabic",
  zh: "Simplified Chinese",
  "zh-TW": "Traditional Chinese",
  ja: "Japanese",
  de: "German",
  hi: "Hindi",
  ru: "Russian",
  it: "Italian",
  nl: "Dutch",

  sw: "Swahili",
  yo: "Yoruba",
  ig: "Igbo",
  ha: "Hausa",
  pcm: "Nigerian Pidgin",

  ko: "Korean",
  vi: "Vietnamese",
  th: "Thai",
  id: "Indonesian",
  ms: "Malay",
  bn: "Bengali",
  tr: "Turkish",

  af: "Afrikaans",
  am: "Amharic",
  zu: "Zulu",
  xh: "Xhosa",
  so: "Somali",
  st: "Southern Sotho",
  tn: "Tswana",
  ts: "Tsonga",
  ss: "Swati",
  rw: "Kinyarwanda",
  lg: "Luganda",
  ln: "Lingala",
  ff: "Fula",
  wo: "Wolof",
  tw: "Twi",
  bm: "Bambara",
  ee: "Ewe",
};


// =======================================================
// Supported languages
// =======================================================

const SUPPORTED_LANGUAGES =
  new Set(
    Object.keys(
      LANGUAGE_NAMES
    )
  );


// =======================================================
// Gemini configuration
// =======================================================

const GEMINI_MODEL =
  "gemini-3.1-flash-lite";


// =======================================================
// POST /translate
// =======================================================

export async function onRequestPost(
  context
) {

  try {

    // ---------------------------------------------------
    // Check Gemini secret
    // ---------------------------------------------------

    const apiKey =
      context.env.GEMINI_API_KEY;


    if (!apiKey) {

      return jsonResponse(
        {
          error:
            "Gemini API key is not configured.",
          code:
            "GEMINI_API_KEY_NOT_CONFIGURED",
        },

        500
      );
    }


    // ---------------------------------------------------
    // Read request
    // ---------------------------------------------------

    let body;

    try {

      body =
        await context.request.json();

    } catch {

      return jsonResponse(
        {
          error:
            "Invalid JSON request.",
          code:
            "INVALID_JSON",
        },

        400
      );
    }


    const text =
      typeof body.text === "string"
        ? body.text.trim()
        : "";


    const target =
      normalizeLanguage(
        body.target
      );


    // ---------------------------------------------------
    // Validate request
    // ---------------------------------------------------

    if (
      !text ||
      !target
    ) {

      return jsonResponse(
        {
          error:
            "Text and target language are required.",
          code:
            "INVALID_TRANSLATION_REQUEST",
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
          code:
            "TEXT_TOO_LONG",
        },

        413
      );
    }


    // ---------------------------------------------------
    // Validate target language
    // ---------------------------------------------------

    if (
      !SUPPORTED_LANGUAGES.has(
        target
      )
    ) {

      return jsonResponse(
        {
          error:
            `Unsupported target language: ${target}`,
          code:
            "UNSUPPORTED_TARGET_LANGUAGE",
        },

        400
      );
    }


    const targetLanguage =
      LANGUAGE_NAMES[target];


    // ---------------------------------------------------
    // Gemini API endpoint
    // ---------------------------------------------------

    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;


    // ---------------------------------------------------
    // Translation instruction
    // ---------------------------------------------------
    //
    // The model is instructed to return ONLY the
    // translation. This prevents explanations,
    // quotation marks, labels, or extra commentary
    // from being inserted into Inclura posts.
    // ---------------------------------------------------

    const prompt = `
You are the translation engine for Inclura.

Translate the user's text into ${targetLanguage}.

Target language code: ${target}

Rules:
1. Return ONLY the translated text.
2. Do NOT explain the translation.
3. Do NOT add quotation marks.
4. Do NOT add labels such as "Translation:".
5. Do NOT summarize.
6. Preserve the original meaning and tone.
7. Preserve names, usernames, URLs, hashtags, emojis, numbers, and punctuation whenever appropriate.
8. Do not translate URLs or usernames.
9. Preserve paragraph breaks where possible.
10. If the source text is already in ${targetLanguage}, return it unchanged.
11. For Nigerian Pidgin (pcm), use natural Nigerian Pidgin rather than Standard English.
12. For Yoruba (yo), use natural contemporary Yoruba.
13. For Igbo (ig), use natural contemporary Igbo.
14. For Hausa (ha), use natural contemporary Hausa.
15. Do not invent information that is not present in the source.

Text to translate:

${text}
`;


    // ---------------------------------------------------
    // Call Gemini
    // ---------------------------------------------------

    const response =
      await fetch(
        endpoint,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            "x-goog-api-key":
              apiKey,
          },

          body:
            JSON.stringify(
              {
                contents: [
                  {
                    parts: [
                      {
                        text:
                          prompt,
                      },
                    ],
                  },
                ],

                generationConfig: {

                  temperature:
                    0.1,

                  maxOutputTokens:
                    4096,
                },
              }
            ),
        }
      );


    // ---------------------------------------------------
    // Read Gemini response
    // ---------------------------------------------------

    const raw =
      await response.text();


    let data;


    try {

      data =
        JSON.parse(raw);

    } catch {

      data = null;

    }


    // ---------------------------------------------------
    // Gemini provider failure
    // ---------------------------------------------------

    if (
      !response.ok
    ) {

      console.error(
        "Gemini Translation Error:",
        response.status,
        data || raw
      );


      let errorMessage =
        "Gemini translation request failed.";


      if (
        data &&
        data.error &&
        typeof data.error.message ===
          "string"
      ) {

        errorMessage =
          data.error.message;
      }


      return jsonResponse(
        {
          error:
            errorMessage,

          code:
            "GEMINI_TRANSLATION_FAILED",

          providerStatus:
            response.status,
        },

        502
      );
    }


    // ---------------------------------------------------
    // Extract translated text
    // ---------------------------------------------------

    const translatedText =
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text;


    // ---------------------------------------------------
    // Validate Gemini output
    // ---------------------------------------------------

    if (
      typeof translatedText !==
        "string" ||
      !translatedText.trim()
    ) {

      console.error(
        "Gemini returned no translated text:",
        data
      );


      return jsonResponse(
        {
          error:
            "Gemini returned no translated text.",

          code:
            "EMPTY_TRANSLATION_RESPONSE",
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
          translatedText.trim(),

        targetLanguage:
          target,

        model:
          GEMINI_MODEL,

        provider:
          "Google Gemini API",
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

        code:
          "TRANSLATION_GATEWAY_ERROR",
      },

      500
    );
  }
}
