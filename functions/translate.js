function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function normalizeLanguage(code = "") {
  const normalized = String(code).trim().toLowerCase().replace(/_/g, "-");

  if (normalized === "zh-tw" || normalized === "zh-hant") {
    return "zh-TW";
  }

  if (normalized === "zh-cn") {
    return "zh-CN";
  }

  return normalized;
}

const LANGUAGE_NAMES = {
  en: "English (en)",
  es: "Spanish (es)",
  fr: "French (fr)",
  pt: "Portuguese (pt)",
  ar: "Arabic (ar)",
  zh: "Simplified Chinese",
  "zh-CN": "Simplified Chinese",
  "zh-TW": "Traditional Chinese",
  ja: "Japanese (ja)",
  de: "German (de)",
  hi: "Hindi (hi)",
  ru: "Russian",
  it: "Italian",
  nl: "Dutch",
  sw: "Swahili (sw)",
  yo: "Yoruba (yo)",
  ig: "Igbo (ig)",
  ha: "Hausa (ha)",
  pcm: "Nigerian Pidgin",
  ko: "Korean (ko)",
  vi: "Vietnamese",
  th: "Thai",
  id: "Indonesian",
  ms: "Malay",
  bn: "Bengali",
  ur: "Urdu",
  ta: "Tamil",
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

const SUPPORTED_LANGUAGES = new Set(
  Object.keys(LANGUAGE_NAMES)
);

// These are the languages currently exposed
// by your MADLAD-400 Hugging Face Space.
const MADLAD_LANGUAGES = {
  en: "English (en)",
  fr: "French (fr)",
  es: "Spanish (es)",
  de: "German (de)",
  pt: "Portuguese (pt)",
  ar: "Arabic (ar)",
  zh: "Chinese (zh)",
  hi: "Hindi (hi)",
  sw: "Swahili (sw)",
  ig: "Igbo (ig)",
  ha: "Hausa (ha)",
  ja: "Japanese (ja)",
  ko: "Korean (ko)",
};

const HF_SPACE =
  "https://inclura-platform-madlad400-zerogpu-test.hf.space";

const MADLAD_MODEL = "santhosh/madlad400-3b-ct2";

/*
 * Secondary free translation engine.
 * NLLB-200 exposes a CPU API with FLORES-200 language codes and
 * includes Yoruba, Igbo, Hausa and many other low-resource languages.
 * It is used only when the current MADLAD Space does not expose
 * the requested target language.
 */
const NLLB_SPACE =
  "https://winstxnhdw-nllb-api.hf.space/api/v4/translator";

const FLORES_CODES = {
  en: "eng_Latn",
  fr: "fra_Latn",
  es: "spa_Latn",
  pt: "por_Latn",
  ar: "arb_Arab",
  "zh-CN": "zho_Hans",
  "zh-TW": "zho_Hant",
  ja: "jpn_Jpan",
  de: "deu_Latn",
  hi: "hin_Deva",
  sw: "swh_Latn",
  ig: "ibo_Latn",
  ha: "hau_Latn",
  yo: "yor_Latn",
  ko: "kor_Hang",
  ru: "rus_Cyrl",
  it: "ita_Latn",
  nl: "nld_Latn",
  vi: "vie_Latn",
  th: "tha_Thai",
  id: "ind_Latn",
  ms: "zsm_Latn",
  bn: "ben_Beng",
  ur: "urd_Arab",
  ta: "tam_Taml",
  tr: "tur_Latn",
  af: "afr_Latn",
  am: "amh_Ethi",
  zu: "zul_Latn",
  xh: "xho_Latn",
  so: "som_Latn",
  st: "sot_Latn",
  tn: "tsn_Latn",
  ts: "tso_Latn",
  ss: "ssw_Latn",
  rw: "kin_Latn",
  lg: "lug_Latn",
  ln: "lin_Latn",
  ff: "fuv_Latn",
  wo: "wol_Latn",
  tw: "twi_Latn",
  bm: "bam_Latn",
  ee: "ewe_Latn",
};

const NLLB_SUPPORTED_TARGETS = new Set(
  Object.keys(FLORES_CODES)
);

const MAX_SUBMISSION_ATTEMPTS = 1;
const RETRY_DELAYS_MS = [];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options = {}, attempts = MAX_SUBMISSION_ATTEMPTS) {
  let lastError = null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, options);

      if (response.ok || response.status < 500) {
        return response;
      }

      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < attempts - 1) {
      await sleep(RETRY_DELAYS_MS[attempt] || 3500);
    }
  }

  throw lastError || new Error("Translation provider request failed.");
}

function extractFirstString(value) {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = extractFirstString(item);
      if (found) return found;
    }
  }

  if (value && typeof value === "object") {
    if (value.error) {
      return String(value.error);
    }

    for (const item of Object.values(value)) {
      const found = extractFirstString(item);
      if (found) return found;
    }
  }

  return "";
}

function extractCompletedResult(streamText) {
  const blocks = streamText.split(/\r?\n\r?\n/);
  let completedResult = "";
  let reportedError = "";

  for (const block of blocks) {
    const eventMatch = block.match(/^event:\s*(.+)$/m);
    const eventName = eventMatch ? eventMatch[1].trim() : "";

    const dataLines = block
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trim());

    if (!dataLines.length) continue;

    const dataText = dataLines.join("\n");

    let parsedData;

    try {
      parsedData = JSON.parse(dataText);
    } catch {
      parsedData = dataText;
    }

    const result = extractFirstString(parsedData);

    if (eventName === "error") {
      reportedError = result || "The translation Space reported an error.";
    }

    if (eventName === "complete" && result) {
      completedResult = result;
    }
  }

  if (reportedError) {
    throw new Error(reportedError);
  }

  if (completedResult) {
    return completedResult;
  }

  throw new Error("The translation Space did not return a completed result.");
}

export async function onRequestPost(context) {
  try {
    let body;

    try {
      body = await context.request.json();
    } catch {
      return jsonResponse(
        {
          error: "Invalid JSON request.",
          code: "INVALID_JSON",
        },
        400
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonResponse(
        {
          error: "Request body must be a JSON object.",
          code: "INVALID_REQUEST",
        },
        400
      );
    }

    const text = typeof body.text === "string"
      ? body.text.trim()
      : "";

    const target = normalizeLanguage(body.target);
    const source = normalizeLanguage(body.source || "en");

    if (!text) {
      return jsonResponse(
        {
          error: "Text is required.",
          code: "TEXT_REQUIRED",
        },
        400
      );
    }

    if (!target) {
      return jsonResponse(
        {
          error: "Target language is required.",
          code: "TARGET_REQUIRED",
        },
        400
      );
    }

    if (text.length > 5000) {
      return jsonResponse(
        {
          error: "Text exceeds the 5000-character limit.",
          code: "TEXT_TOO_LONG",
        },
        400
      );
    }

    if (!SUPPORTED_LANGUAGES.has(target)) {
      return jsonResponse(
        {
          error: "The requested language is not supported.",
          code: "UNSUPPORTED_LANGUAGE",
        },
        400
      );
    }
    
    const targetLanguage = MADLAD_LANGUAGES[target] ||
      (target === "zh-CN" || target === "zh-TW" ? "Chinese" : null);

    /*
     * Provider selection:
     * - Keep the existing MADLAD Space for its currently exposed languages.
     * - Automatically fall back to NLLB-200 for every language in the
     *   Inclura language registry that the MADLAD Space does not expose.
     *
     * This removes the old hard dependency on the 13-language MADLAD
     * dropdown and prevents errors such as "Yoruba is not in the list".
     */
    /*
     * MADLAD remains the first provider for the languages exposed by
     * the current Inclura MADLAD Space. NLLB is the automatic fallback
     * not only for languages MADLAD does not expose, but also when
     * MADLAD itself returns a provider-side language/queue error.
     */
    const madladAvailable = Boolean(targetLanguage);
    const nllbAvailable = Boolean(FLORES_CODES[target]);

    if (!madladAvailable && !nllbAvailable) {
      return jsonResponse(
        {
          error: `The requested language is not currently available from the configured translation engines: ${LANGUAGE_NAMES[target] || target}.`,
          code: "LANGUAGE_UNAVAILABLE",
          targetLanguage: target,
        },
        400
      );
    }

    if (!FLORES_CODES[source]) {
      return jsonResponse(
        {
          error: `The detected source language (${source}) is not supported by the NLLB fallback mapping.`,
          code: "SOURCE_LANGUAGE_UNAVAILABLE",
          sourceLanguage: source,
          targetLanguage: target,
        },
        400
      );
    }

    let lastProviderError = null;
    let translatedText = "";
    let providerUsed = "";

    /*
     * Provider order is deterministic:
     * 1. MADLAD for its currently exposed languages.
     * 2. NLLB automatically for unsupported MADLAD targets or any
     *    MADLAD provider failure.
     *
     * This is the important permanent behavior: the app never sends
     * Yoruba/Igbo/Hausa/etc. to MADLAD when that Space does not list them,
     * and ordinary MADLAD failures do not leak its internal 13-language
     * validation error to the user.
     */
    const providers = [];
    if (madladAvailable) providers.push("madlad");
    if (nllbAvailable) providers.push("nllb");

    for (const provider of providers) {
      try {
        if (provider === "nllb") {
          const nllbUrl = new URL(NLLB_SPACE);
          nllbUrl.searchParams.set("text", text);
          nllbUrl.searchParams.set("source", FLORES_CODES[source]);
          nllbUrl.searchParams.set("target", FLORES_CODES[target]);

          const nllbResponse = await fetchWithRetry(
            nllbUrl.toString(),
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!nllbResponse.ok) {
            const errorDetails = await nllbResponse.text();
            throw new Error(
              `NLLB translation failed (HTTP ${nllbResponse.status}): ${errorDetails.slice(0, 500)}`
            );
          }

          const nllbData = await nllbResponse.json();
          const nllbResult =
            typeof nllbData?.translation === "string"
              ? nllbData.translation
              : extractFirstString(nllbData);

          if (!nllbResult || !nllbResult.trim()) {
            throw new Error("NLLB returned an empty translation.");
          }

          translatedText = nllbResult.trim();
          providerUsed = "Hugging Face NLLB-200 CPU API";
          break;
        }

        let submitResponse;

        try {
          submitResponse = await fetchWithRetry(
            `${HF_SPACE}/gradio_api/call/v2/test_translation`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                text,
                target_languages: [targetLanguage],
              }),
            }
          );
        } catch (error) {
          throw new Error(
            `Could not submit translation job: ${error instanceof Error ? error.message : "Unknown provider error."}`
          );
        }

        if (!submitResponse.ok) {
          const errorDetails = await submitResponse.text();
          throw new Error(
            `Translation submission failed (HTTP ${submitResponse.status}): ${errorDetails.slice(0, 500)}`
          );
        }

        const submission = await submitResponse.json();
        const eventId = submission.event_id || submission.eventId;

        if (!eventId) {
          throw new Error("Hugging Face did not return a translation event ID.");
        }

        let resultResponse;

        try {
          resultResponse = await fetchWithRetry(
            `${HF_SPACE}/gradio_api/call/test_translation/${encodeURIComponent(eventId)}`,
            {
              method: "GET",
              headers: {
                "Accept": "text/event-stream",
              },
            }
          );
        } catch (error) {
          throw new Error(
            `Could not retrieve translation result: ${error instanceof Error ? error.message : "Unknown provider error."}`
          );
        }

        if (!resultResponse.ok) {
          const errorDetails = await resultResponse.text();
          throw new Error(
            `Translation result request failed (HTTP ${resultResponse.status}): ${errorDetails.slice(0, 500)}`
          );
        }

        const streamText = await resultResponse.text();
        const report = extractCompletedResult(streamText);

        if (
          report.includes("TRANSLATION TEST FAILED") ||
          report.includes("TRANSLATION FAILED:")
        ) {
          throw new Error(report.slice(0, 500));
        }

        const markerCandidates = [
          `${targetLanguage}:\\n`,
          `${target}:\\n`,
          `${LANGUAGE_NAMES[target] || target}:\\n`,
        ];

        let candidate = "";

        for (const marker of markerCandidates) {
          const markerPosition = report.lastIndexOf(marker);
          if (markerPosition !== -1) {
            candidate = report.slice(markerPosition + marker.length).trim();
            break;
          }
        }

        if (!candidate && report.trim()) {
          candidate = report.trim();
        }

        if (!candidate) {
          throw new Error("MADLAD-400 returned an empty translation.");
        }

        translatedText = candidate;
        providerUsed = "Hugging Face MADLAD-400 ZeroGPU";
        break;
      } catch (error) {
        lastProviderError = error;
        /*
         * Do not retry the same MADLAD ZeroGPU job. If NLLB is available,
         * move directly to it instead of consuming more ZeroGPU quota.
         */
        continue;
      }
    }

    if (!translatedText) {
      return jsonResponse(
        {
          error: "Translation could not be completed by the configured free translation providers.",
          code: "TRANSLATION_PROVIDER_FAILED",
          details: lastProviderError instanceof Error
            ? lastProviderError.message
            : "Unknown provider error.",
        },
        502
      );
    }

    return jsonResponse({
      translatedText,
      targetLanguage: target,
      model: providerUsed === "Hugging Face MADLAD-400 ZeroGPU"
        ? MADLAD_MODEL
        : "NLLB-200",
      provider: providerUsed,
    });
  } catch (error) {
    return jsonResponse(
      {
        error: "Translation service failed.",
        code: "TRANSLATION_SERVICE_ERROR",
        details: error instanceof Error
          ? error.message
          : "Unknown server error.",
      },
      500
    );
  }
}
