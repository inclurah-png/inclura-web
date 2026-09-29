import {
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";

import { db } from "../firebase";

/**
 * Normalize language codes so cache lookups use
 * the same representation throughout the translation system.
 */
function normalizeLanguageCode(code = "") {
  const normalized = String(code).trim().toLowerCase();

  if (
    normalized === "zh-tw" ||
    normalized === "zh_hant"
  ) {
    return "zh-TW";
  }

  return normalized;
}

/**
 * Returns a valid cached translation if one exists.
 *
 * The cache is only considered valid when it contains:
 * - the requested sourceId
 * - the requested target language
 * - a non-empty translatedText value
 */
export async function getCachedTranslation(
  sourceId,
  targetLanguage
) {
  if (!sourceId || !targetLanguage) {
    return null;
  }

  const normalizedTargetLanguage =
    normalizeLanguageCode(targetLanguage);

  if (!normalizedTargetLanguage) {
    return null;
  }

  const q = query(
    collection(db, "translations"),
    where("sourceId", "==", sourceId),
    where(
      "targetLanguage",
      "==",
      normalizedTargetLanguage
    ),
    limit(10)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  /**
   * Multiple translation documents may exist because
   * older versions of saveTranslation() used addDoc().
   *
   * Search for the first document containing a valid
   * translatedText instead of blindly returning docs[0].
   */
  for (const translationDoc of snapshot.docs) {
    const data = translationDoc.data();

    const translatedText =
      typeof data?.translatedText === "string"
        ? data.translatedText.trim()
        : "";

    if (!translatedText) {
      continue;
    }

    return {
      ...data,
      id: translationDoc.id,
      translatedText,
      targetLanguage:
        normalizeLanguageCode(
          data.targetLanguage ||
            normalizedTargetLanguage
        ),
    };
  }

  return null;
}

/**
 * Checks whether a valid translation already exists.
 */
export async function translationExists(
  sourceId,
  targetLanguage
) {
  const cached =
    await getCachedTranslation(
      sourceId,
      targetLanguage
    );

  return cached !== null;
}
