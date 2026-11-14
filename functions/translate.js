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

  return normalized;
}

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

const SUPPORTED_LANGUAGES = new Set(
  Object.keys(LANGUAGE_NAMES)
);

// These are the languages currently exposed
// by your MADLAD-400 Hugging Face Space.
const MADLAD_LANGUAGES = {
  en: "English",
  fr: "French",
  es: "Spanish",
  de: "German",
  pt: "Portuguese",
  ar: "Arabic",
  zh: "Chinese",
  hi: "Hindi",
  sw: "Swahili",
  yo: "Yoruba",
  ig: "Igbo",
  ha: "Hausa",
  ja: "Japanese",
  ko: "Korean",
};

const HF_SPACE =
  "https://inclura-platform-madlad400-zerogpu-test.hf.space";

const MADLAD_MODEL = "santhosh/madlad400-3b-ct2";

const MAX_SUBMISSION_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [800, 1800, 3500];

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
    
if (target === "en") {
  return jsonResponse({
    translatedText: text,
    targetLanguage: "en",
    model: "native",
    provider: "INCLURA Translation Gateway",
  });
}
    const targetLanguage = MADLAD_LANGUAGES[target];

    if (!targetLanguage) {
      return jsonResponse(
        {
          error: `The translation provider does not currently support ${LANGUAGE_NAMES[target]}.`,
          code: "MADLAD_LANGUAGE_UNAVAILABLE",
          targetLanguage: target,
        },
        400
      );
    }

    // Hugging Face ZeroGPU can fail after a job is accepted (queue wake-up,
    // provider-side errors, malformed SSE, or an empty result). Treat the
    // whole submission + result cycle as retryable so one bad job does not
    // make every later post fail.
    const MAX_TRANSLATION_ATTEMPTS = 3;
    let lastProviderError = null;
    let translatedText = "";

    for (let translationAttempt = 1;
      translationAttempt <= MAX_TRANSLATION_ATTEMPTS;
      translationAttempt += 1) {
      try {
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

        // Extract only the requested language from the Space report.
        const marker = `${targetLanguage}:\\n`;
        const markerPosition = report.lastIndexOf(marker);

        if (markerPosition === -1) {
          throw new Error(
            `The expected ${targetLanguage} translation was not found in the provider result.`
          );
        }

        const candidate = report
          .slice(markerPosition + marker.length)
          .trim();

        if (!candidate) {
          throw new Error("MADLAD-400 returned an empty translation.");
        }

        translatedText = candidate;
        break;
      } catch (error) {
        lastProviderError = error;

        if (translationAttempt < MAX_TRANSLATION_ATTEMPTS) {
          // Give ZeroGPU a little time to recover before creating a fresh job.
          await sleep(RETRY_DELAYS_MS[translationAttempt - 1] || 3500);
        }
      }
    }

    if (!translatedText) {
      return jsonResponse(
        {
          error: "MADLAD-400 could not complete this translation after automatic retries.",
          code: "MADLAD_TRANSLATION_FAILED",
          details: lastProviderError instanceof Error
            ? lastProviderError.message
            : "Unknown provider error.",
        },
        502
      );
    }

    // Preserve the response format used by INCLURA.
    return jsonResponse({
      translatedText,
      targetLanguage: target,
      model: MADLAD_MODEL,
      provider: "Hugging Face MADLAD-400 ZeroGPU",
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
