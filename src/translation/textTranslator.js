import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  detectLanguage,
  isSupportedLanguage,
} from "./languageDetector";

import {
  getCachedTranslation,
} from "./translationCache";

/**
 * Normalize language codes so the translation system
 * uses one consistent representation.
 */
function normalizeLanguageCode(code = "") {
  const normalized = String(code).trim().toLowerCase();

  if (normalized === "zh-tw" || normalized === "zh_hant") {
    return "zh-TW";
  }

  return normalized;
}

/**
 * Translate text through the Inclura Translation Gateway.
 *
 * The translation flow is intentionally resilient:
 * 1. Validate the target language first.
 * 2. Detect the source language.
 * 3. Attempt to use a valid cached translation.
 * 4. If cache lookup fails, continue to the gateway.
 * 5. Never allow a Firestore cache problem to prevent translation.
 */
export async function translateText({
  sourceId,
  sourceType,
  text,
  targetLanguage,
}) {
  const sourceText =
    typeof text === "string" ? text.trim() : "";

  if (!sourceText) {
    return null;
  }

  const normalizedTargetLanguage =
    normalizeLanguageCode(targetLanguage);

  if (!normalizedTargetLanguage) {
    throw new Error("Target language is required.");
  }

  if (!isSupportedLanguage(normalizedTargetLanguage)) {
    throw new Error("Unsupported target language.");
  }

  let detected = {
    code: "en",
    language: "English",
    confidence: 0,
  };

  /**
   * Language detection should never prevent the actual
   * translation request from being attempted.
   */
  try {
    detected = await detectLanguage(sourceText);
  } catch (error) {
    console.warn(
      "Inclura Translation Language Detection Warning:",
      error
    );
  }

  const originalLanguage =
    normalizeLanguageCode(detected?.code || "en");

  /**
   * Check the cache, but never let a cache failure
   * prevent the translation gateway from being called.
   */
  if (sourceId) {
    try {
      const cached = await getCachedTranslation(
        sourceId,
        normalizedTargetLanguage
      );

      const cachedText =
        typeof cached?.translatedText === "string"
          ? cached.translatedText.trim()
          : "";

      /**
       * Only use the cache when it contains an actual
       * translation value.
       *
       * A missing/empty cached value is ignored.
       */
      if (cachedText) {
        return {
          originalLanguage:
            normalizeLanguageCode(
              cached.originalLanguage || originalLanguage
            ),
          targetLanguage:
            normalizeLanguageCode(
              cached.targetLanguage ||
                normalizedTargetLanguage
            ),
          translatedText: cachedText,
          confidence:
            typeof cached.confidence === "number"
              ? cached.confidence
              : 0,
        };
      }
    } catch (error) {
      /**
       * Cache problems must NEVER block the gateway.
       *
       * This is particularly important because the cache
       * uses a Firestore query and that query may fail because
       * of indexing, permissions, network, or another
       * Firestore issue.
       */
      console.warn(
        "Inclura Translation Cache Lookup Warning:",
        error
      );
    }
  }

  /**
   * Do not return the original text merely because the
   * language detector thinks the source and target are
   * identical.
   *
   * The detector is currently heuristic and can produce
   * false positives. The Translation Gateway is the
   * authoritative translation layer.
   */

  let response;

  try {
    response = await fetch("/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: sourceText,
        target: normalizedTargetLanguage,
      }),
    });
  } catch (error) {
    console.error(
      "Inclura Translation Gateway Network Error:",
      error
    );

    throw new Error(
      "Unable to connect to the translation service."
    );
  }

  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    console.error(
      "Inclura Translation Gateway Invalid Response:",
      error
    );

    throw new Error(
      "Translation service returned an invalid response."
    );
  }

  if (!response.ok) {
    console.error(
      "Inclura Translation Gateway Error:",
      data
    );

    throw new Error(
      data?.error ||
        "Translation service request failed."
    );
  }

  if (
    !data?.translatedText ||
    typeof data.translatedText !== "string"
  ) {
    throw new Error(
      "Translation service returned no translated text."
    );
  }

  const translatedText =
    data.translatedText.trim();

  if (!translatedText) {
    throw new Error(
      "Translation service returned empty text."
    );
  }

  const finalTargetLanguage =
    normalizeLanguageCode(
      data.targetLanguage ||
        normalizedTargetLanguage
    );

  return {
    originalLanguage,
    targetLanguage: finalTargetLanguage,
    translatedText,
    confidence:
      typeof data.confidence === "number"
        ? data.confidence
        : 0,
  };
}

/**
 * Save a translation to Firestore.
 *
 * This remains a separate operation from the actual
 * translation request so that a Firestore save problem
 * does not invalidate a successful translation.
 */
export async function saveTranslation({
  sourceId,
  sourceType,
  originalLanguage,
  targetLanguage,
  translatedText,
  confidence = 0,
}) {
  const normalizedTargetLanguage =
    normalizeLanguageCode(targetLanguage);

  const normalizedOriginalLanguage =
    normalizeLanguageCode(originalLanguage);

  const cleanTranslatedText =
    typeof translatedText === "string"
      ? translatedText.trim()
      : "";

  if (
    !sourceId ||
    !cleanTranslatedText ||
    !normalizedTargetLanguage
  ) {
    throw new Error(
      "Missing translation data."
    );
  }

  if (!isSupportedLanguage(normalizedTargetLanguage)) {
    throw new Error(
      "Unsupported target language."
    );
  }

  const translationRef = await addDoc(
    collection(db, "translations"),
    {
      sourceId,
      sourceType:
        sourceType || "unknown",
      originalLanguage:
        normalizedOriginalLanguage,
      targetLanguage:
        normalizedTargetLanguage,
      translatedText:
        cleanTranslatedText,
      translatedByAI: true,
      confidence:
        typeof confidence === "number"
          ? confidence
          : 0,
      audioUrl: "",
      subtitleUrl: "",
      createdAt: serverTimestamp(),
    }
  );

  return {
    id: translationRef.id,
    sourceId,
    sourceType:
      sourceType || "unknown",
    originalLanguage:
      normalizedOriginalLanguage,
    targetLanguage:
      normalizedTargetLanguage,
    translatedText:
      cleanTranslatedText,
    confidence:
      typeof confidence === "number"
        ? confidence
        : 0,
  };
}
