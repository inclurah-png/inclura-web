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

  /*
   * AI TRANSLATION PROVIDER
   *
   * The actual AI translation backend
   * will be connected here.
   *
   * We deliberately do not return the
   * original text and pretend it was translated.
   */

  throw new Error(
    "AI translation provider is not connected yet."
  );
}

/**
 * Save a completed translation to Firestore.
 *
 * This function is kept separate from the
 * translation request so the AI provider can
 * later return a real translation first.
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
