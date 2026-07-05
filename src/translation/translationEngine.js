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
 * Placeholder translator.
 * This will later call SeamlessM4T.
 */
async function translateText(
  text,
  from,
  to
) {
  return {
    translatedText: text,
    confidence: 1,
  };
}

/**
 * Main Translation Engine
 */
export async function translateContent({
  sourceId,
  sourceType,
  text,
  targetLanguage,
}) {
  if (!text) return null;

  // Detect source language
  const detected =
    await detectLanguage(text);

  const originalLanguage =
    detected.code;

  // Check whether this translation already exists
const cached =
  await getCachedTranslation(
    sourceId,
    targetLanguage
  );

if (cached) {
  return {
    originalLanguage: cached.originalLanguage,
    targetLanguage: cached.targetLanguage,
    translatedText: cached.translatedText,
    confidence: cached.confidence,
  };
}

  // Unsupported target
  if (
    !isSupportedLanguage(
      targetLanguage
    )
  ) {
    throw new Error(
      "Unsupported language."
    );
  }

  // Already same language
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

  // AI Translation
  const result =
    await translateText(
      text,
      originalLanguage,
      targetLanguage
    );

  // Save Translation
  await addDoc(
    collection(db, "translations"),
    {
      sourceId,
      sourceType,
      originalLanguage,
      targetLanguage,
      translatedText:
        result.translatedText,
      translatedByAI: true,
      confidence:
        result.confidence,
      audioUrl: "",
      subtitleUrl: "",
      createdAt:
        serverTimestamp(),
    }
  );

  return {
    originalLanguage,
    targetLanguage,
    translatedText:
      result.translatedText,
    confidence:
      result.confidence,
  };
}
