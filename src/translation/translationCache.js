import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

/**
 * Returns cached translation if available.
 */

export async function getCachedTranslation(
  sourceId,
  targetLanguage
) {
  const q = query(
    collection(db, "translations"),
    where("sourceId", "==", sourceId),
    where("targetLanguage", "==", targetLanguage)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  return snapshot.docs[0].data();
}

/**
 * Checks if translation already exists.
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
