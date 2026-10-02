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
  getCachedTranslation,
} from "./translationCache";

import {
  detectLanguage,
  isSupportedLanguage,
} from "./languageDetector";

function normalizeLanguageCode(
  code = ""
) {
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
  if (
    !data ||
    !data.translatedText ||
    typeof data.translatedText !==
      "object" ||
    Array.isArray(
      data.translatedText
    )
  ) {
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

  /*
   * Detect the source language.
   *
   * We only use the detected language to
   * bypass translation when detection
   * actually succeeds. If detection fails,
   * we must not assume the text is English.
   */
  let detectedLanguage = null;

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
        ""
    );

  /*
   * If language detection succeeded and
   * the source language is already the
   * requested language, no translation is
   * necessary.
   */
  if (
    originalLanguage &&
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
   * First check the same translation
   * collection used by textTranslator.js.
   *
   * This is important because
   * saveTranslation() currently uses
   * addDoc(), not a deterministic document
   * ID.
   */
  if (sourceId) {
    try {
      const cachedTranslation =
        await getCachedTranslation(
          sourceId,
          normalizedTargetLanguage
        );

      const cachedText =
        typeof cachedTranslation?.translatedText ===
        "string"
          ? cachedTranslation.translatedText.trim()
          : "";

      if (cachedText) {
        return {
          id:
            cachedTranslation.id ||
            null,
          sourceId,
          sourceType:
            cachedTranslation.sourceType ||
            sourceType ||
            "unknown",
          originalLanguage:
            normalizeLanguageCode(
              cachedTranslation.originalLanguage ||
                originalLanguage ||
                "en"
            ),
          targetLanguage:
            normalizeLanguageCode(
              cachedTranslation.targetLanguage ||
                normalizedTargetLanguage
            ),
          translatedText:
            cachedText,
          confidence:
            typeof cachedTranslation.confidence ===
            "number"
              ? cachedTranslation.confidence
              : 0,
          audioUrl:
            cachedTranslation.audioUrl ||
            "",
          subtitleUrl:
            cachedTranslation.subtitleUrl ||
            "",
        };
      }
    } catch (error) {
      console.warn(
        "Inclura Translation Engine Collection Cache Warning:",
        error
      );
    }
  }

  /*
   * Also support translations already
   * stored directly inside the source
   * document.
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
              sourceId,
              sourceType:
                sourceType ||
                "unknown",
              originalLanguage:
                normalizeLanguageCode(
                  sourceData.originalLanguage ||
                    originalLanguage ||
                    "en"
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
   * No usable cached translation was
   * found, so use the real translation
   * gateway.
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
   * Persist the successful translation
   * through the central translation
   * persistence layer.
   *
   * Persistence failure does not destroy
   * the successful translation result.
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
          originalLanguage ||
          "en",
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
          originalLanguage ||
          "en"
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
    audioUrl:
      result.audioUrl ||
      "",
    subtitleUrl:
      result.subtitleUrl ||
      "",
  };
}

export default translateContent;
