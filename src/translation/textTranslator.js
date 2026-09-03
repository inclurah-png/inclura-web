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
 * Inclura Translation Engine
 *
 * This function receives translation requests
 * from PostPage and other platform features.
 *
 * Translation is handled through the secure
 * Cloudflare Pages /translate gateway.
 *
 * The Gemini API key is never exposed to
 * the browser.
 */
export async function translateText({
  sourceId,
  sourceType,
  text,
  targetLanguage,
}) {
  if (!text) return null;

  if (!targetLanguage) {
    throw new Error(
      "Target language is required."
    );
  }

  // Detect the original language.
  const detected =
    await detectLanguage(text);

  const originalLanguage =
    detected.code;

  // Validate target language.
  if (
    !isSupportedLanguage(
      targetLanguage
    )
  ) {
    throw new Error(
      "Unsupported target language."
    );
  }

  // If the content is already in the
  // requested language, no translation is needed.
  if (
    originalLanguage ===
    targetLanguage
  ) {
    return {
      originalLanguage,
      targetLanguage,
      translatedText: text,
      confidence: 1,
    };
  }

  // Check Firestore translation cache.
  if (sourceId) {
    const cached =
      await getCachedTranslation(
        sourceId,
        targetLanguage
      );

    if (cached) {
      return {
        originalLanguage:
          cached.originalLanguage,
        targetLanguage:
          cached.targetLanguage,
        translatedText:
          cached.translatedText,
        confidence:
          cached.confidence,
      };
    }
  }

  // ---------------------------------------------------
  // Secure AI translation gateway
  // ---------------------------------------------------
  //
  // The browser calls the same-origin Cloudflare
  // Pages Function at /translate.
  //
  // The Gemini API key remains server-side in the
  // Cloudflare environment and is never exposed here.
  // ---------------------------------------------------

  let response;

  try {
    response =
      await fetch(
        "/translate",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            text,
            target:
              targetLanguage,
          }),
        }
      );
  } catch (error) {
    console.error(
      "Inclura Translation Gateway Network Error:",
      error
    );

    throw new Error(
      "Unable to connect to the translation service."
    );
  }

  // ---------------------------------------------------
  // Read gateway response
  // ---------------------------------------------------

  let data = null;

  try {
    data =
      await response.json();
  } catch (error) {
    console.error(
      "Inclura Translation Gateway Invalid Response:",
      error
    );

    throw new Error(
      "Translation service returned an invalid response."
    );
  }

  // ---------------------------------------------------
  // Handle gateway/provider failure
  // ---------------------------------------------------

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

  // ---------------------------------------------------
  // Validate translation
  // ---------------------------------------------------

  if (
    !data?.translatedText ||
    typeof data.translatedText !==
      "string"
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

  // ---------------------------------------------------
  // Return real translation
  // ---------------------------------------------------
  //
  // Confidence is set to 0 because the Gemini gateway
  // does not currently provide a calibrated translation
  // confidence score. We must not invent one.
  // ---------------------------------------------------

  return {
    originalLanguage,
    targetLanguage:
      data.targetLanguage ||
      targetLanguage,
    translatedText,
    confidence: 0,
  };
}

/**
 * Save a completed translation to Firestore.
 *
 * This function is kept separate from the
 * translation request so the AI provider can
 * return a real translation first.
 */
export async function saveTranslation({
  sourceId,
  sourceType,
  originalLanguage,
  targetLanguage,
  translatedText,
  confidence = 0,
}) {
  if (
    !sourceId ||
    !translatedText ||
    !targetLanguage
  ) {
    throw new Error(
      "Missing translation data."
    );
  }

  const translationRef =
    await addDoc(
      collection(
        db,
        "translations"
      ),
      {
        sourceId,
        sourceType:
          sourceType || "unknown",
        originalLanguage:
          originalLanguage || "",
        targetLanguage,
        translatedText,
        translatedByAI: true,
        confidence,
        audioUrl: "",
        subtitleUrl: "",
        createdAt:
          serverTimestamp(),
      }
    );

  return {
    id: translationRef.id,
    sourceId,
    sourceType:
      sourceType || "unknown",
    originalLanguage,
    targetLanguage,
    translatedText,
    confidence,
  };
}     
