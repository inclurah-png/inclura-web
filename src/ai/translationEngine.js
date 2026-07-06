import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  detectLanguage,
  isSupportedLanguage,
} from "./languageDetector";

import {
  translateText,
} from "../providers/SeamlessM4T";

/**
 * Inclura Translation Engine
 *
 * Detects language,
 * translates using SeamlessM4T,
 * stores translation in Firestore.
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
    await translateText({
      text,
      sourceLanguage:
        originalLanguage,
      targetLanguage,
    });

  // Store translation
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
        result.confidence ?? 1,
      audioUrl:
        result.audioUrl ?? "",
      subtitleUrl:
        result.subtitleUrl ?? "",
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
      result.confidence ?? 1,
    audioUrl:
      result.audioUrl ?? "",
    subtitleUrl:
      result.subtitleUrl ?? "",
  };
}
