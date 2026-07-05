import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

import { SUPPORTED_LANGUAGES } from "./supportedLanguages";

export async function updateTranslationAnalytics() {
  try {
    const translationsSnapshot = await getDocs(
      collection(db, "translations")
    );

    let translatedPosts = 0;
    let translatedComments = 0;
    let translatedMessages = 0;
    let translatedVideos = 0;
    let translatedAudio = 0;

    let aiTranslations = 0;

    let confidenceSum = 0;

    const languageCounter = {};

    translationsSnapshot.forEach((docSnap) => {
      const translation = docSnap.data();

      switch (translation.sourceType) {
        case "post":
          translatedPosts++;
          break;

        case "comment":
          translatedComments++;
          break;

        case "message":
          translatedMessages++;
          break;

        case "video":
          translatedVideos++;
          break;

        case "audio":
          translatedAudio++;
          break;

        default:
          break;
      }

      if (translation.translatedByAI)
        aiTranslations++;

      confidenceSum +=
        translation.confidence || 0;

      const lang =
        translation.targetLanguage || "unknown";

      languageCounter[lang] =
        (languageCounter[lang] || 0) + 1;
    });

    //----------------------------------

    let topLanguage = "English";

    let maxCount = 0;

    Object.entries(languageCounter).forEach(
      ([language, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topLanguage = language;
        }
      }
    );

    //----------------------------------

    const translationAccuracy =
      aiTranslations === 0
        ? 0
        : confidenceSum / aiTranslations;

    //----------------------------------

    const accessibilityCoverage =
      translatedVideos === 0
        ? 0
        : (
            (translatedVideos /
              (translatedVideos +
                translatedPosts +
                translatedComments)) *
            100
          );

    //----------------------------------

    let translationHealth =
      "Excellent";

    if (translationAccuracy < 0.75)
      translationHealth = "Poor";

    else if (translationAccuracy < 0.90)
      translationHealth = "Good";

    //----------------------------------

    await updateDoc(
      doc(db, "executiveReports", "current"),
      {
        translationHealth,

        translatedPosts,

        translatedComments,

        translatedMessages,

        translatedVideos,

        translatedAudio,

        supportedLanguages:
          SUPPORTED_LANGUAGES.length,

        accessibilityCoverage,

        translationAccuracy,

        topLanguage,

        generatedAt:
          serverTimestamp(),
      }
    );
  } catch (error) {
    console.error(
      "Translation Analytics Error:",
      error
    );
  }
}
