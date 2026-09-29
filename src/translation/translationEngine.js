import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  translateText,
  saveTranslation,
} from "./textTranslator";

import {
  detectLanguage,
  isSupportedLanguage,
} from "./languageDetector";

function normalizeLanguageCode(code = "") {
  const normalized = String(code)
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");

  if (
    normalized === "zh-tw" ||
    normalized === "zh-hant"
  ) {
    return "zh-TW";
  }

  return normalized;
}

function getStoredTranslation(
  data,
  targetLanguage
) {
  if (!data?.translatedText) {
    return "";
  }

  const normalizedTarget =
    normalizeLanguageCode(
      targetLanguage
    );

  const direct =
    data.translatedText?.[
      normalizedTarget
    ];

  if (
    typeof direct === "string" &&
    direct.trim()
  ) {
    return direct.trim();
  }

  if (
    normalizedTarget === "zh-TW"
  ) {
    const legacy =
      data.translatedText?.[
        "zh-tw"
      ];

    if (
      typeof legacy === "string" &&
      legacy.trim()
    ) {
      return legacy.trim();
    }
  }

  return "";
}

export async function translateContent({
  sourceId,
  sourceType,
  text,
  targetLanguage,
}) {
  const sourceText =
    typeof text === "string"
      ? text.trim()
      : "";

  if (!sourceText) {
    return null;
  }

  const normalizedTargetLanguage =
    normalizeLanguageCode(
      targetLanguage
    );

  if (
    !normalizedTargetLanguage ||
    !isSupportedLanguage(
      normalizedTargetLanguage
    )
  ) {
    throw new Error(
      "Unsupported target language."
    );
  }

  let detectedLanguage = {
    code: "en",
    language: "English",
    confidence: 0,
  };

  try {
    detectedLanguage =
      await detectLanguage(
        sourceText
      );
  } catch (error) {
    console.warn(
      "Inclura Translation Engine Language Detection Warning:",
      error
    );
  }

  const originalLanguage =
    normalizeLanguageCode(
      detectedLanguage?.code ||
        "en"
    );

  /*
   * If the requested language is already
   * the source language, no translation is
   * necessary.
   */
  if (
    originalLanguage ===
    normalizedTargetLanguage
  ) {
    return {
      originalLanguage,
      targetLanguage:
        normalizedTargetLanguage,
      translatedText:
        sourceText,
      confidence:
        typeof detectedLanguage?.confidence ===
        "number"
          ? detectedLanguage.confidence
          : 1,
      audioUrl: "",
      subtitleUrl: "",
    };
  }

  /*
   * First check the central translation
   * cache used by the Inclura translation
   * system.
   */
  if (sourceId) {
    try {
      const translationRef =
        doc(
          db,
          "translations",
          `${sourceId}_${normalizedTargetLanguage}`
        );

      const translationSnap =
        await getDoc(
          translationRef
        );

      if (
        translationSnap.exists()
      ) {
        const cached =
          translationSnap.data();

        const cachedText =
          typeof cached?.translatedText ===
          "string"
            ? cached.translatedText.trim()
            : "";

        if (cachedText) {
          return {
            originalLanguage:
              normalizeLanguageCode(
                cached.originalLanguage ||
                  originalLanguage
              ),
            targetLanguage:
              normalizeLanguageCode(
                cached.targetLanguage ||
                  normalizedTargetLanguage
              ),
            translatedText:
              cachedText,
            confidence:
              typeof cached.confidence ===
              "number"
                ? cached.confidence
                : 0,
            audioUrl:
              cached.audioUrl || "",
            subtitleUrl:
              cached.subtitleUrl || "",
          };
        }
      }
    } catch (error) {
      console.warn(
        "Inclura Translation Engine Document Cache Warning:",
        error
      );
    }
  }

  /*
   * Also support posts or other content
   * that already contains translations
   * directly on the source document.
   */
  if (sourceId) {
    try {
      const collectionName =
        sourceType === "post"
          ? "posts"
          : "";

      if (collectionName) {
        const sourceRef =
          doc(
            db,
            collectionName,
            sourceId
          );

        const sourceSnap =
          await getDoc(
            sourceRef
          );

        if (
          sourceSnap.exists()
        ) {
          const sourceData =
            sourceSnap.data();

          const storedTranslation =
            getStoredTranslation(
              sourceData,
              normalizedTargetLanguage
            );

          if (storedTranslation) {
            return {
              originalLanguage:
                normalizeLanguageCode(
                  sourceData.originalLanguage ||
                    originalLanguage
                ),
              targetLanguage:
                normalizedTargetLanguage,
              translatedText:
                storedTranslation,
              confidence: 1,
              audioUrl: "",
              subtitleUrl: "",
            };
          }
        }
      }
    } catch (error) {
      console.warn(
        "Inclura Translation Engine Source Lookup Warning:",
        error
      );
    }
  }

  /*
   * Use the real Inclura translation
   * gateway through textTranslator.js.
   *
   * This replaces the old placeholder
   * implementation that returned the
   * original text unchanged.
   */
  const result =
    await translateText({
      sourceId,
      sourceType:
        sourceType || "unknown",
      text: sourceText,
      targetLanguage:
        normalizedTargetLanguage,
    });

  if (
    !result?.translatedText ||
    typeof result.translatedText !==
      "string"
  ) {
    throw new Error(
      "Translation engine returned no translated text."
    );
  }

  const translatedText =
    result.translatedText.trim();

  if (!translatedText) {
    throw new Error(
      "Translation engine returned empty text."
    );
  }

  /*
   * Save through the same central
   * translation persistence layer used
   * by the current Inclura translation
   * system.
   *
   * A cache persistence failure should
   * not erase a successful translation
   * result from the caller.
   */
  let savedTranslation = null;

  try {
    savedTranslation =
      await saveTranslation({
        sourceId,
        sourceType:
          sourceType || "unknown",
        originalLanguage:
          result.originalLanguage ||
          originalLanguage,
        targetLanguage:
          normalizedTargetLanguage,
        translatedText,
        confidence:
          typeof result.confidence ===
          "number"
            ? result.confidence
            : 0,
      });
  } catch (error) {
    console.error(
      "Inclura Translation Engine Cache Save Warning:",
      error
    );
  }

  return {
    id:
      savedTranslation?.id ||
      null,
    sourceId:
      sourceId || null,
    sourceType:
      sourceType || "unknown",
    originalLanguage:
      normalizeLanguageCode(
        result.originalLanguage ||
          originalLanguage
      ),
    targetLanguage:
      normalizeLanguageCode(
        result.targetLanguage ||
          normalizedTargetLanguage
      ),
    translatedText,
    confidence:
      typeof result.confidence ===
      "number"
        ? result.confidence
        : 0,
    audioUrl: "",
    subtitleUrl: "",
  };
}

export default translateContent;
