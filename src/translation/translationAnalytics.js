import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  SUPPORTED_LANGUAGES,
  normalizeLanguageCode,
} from "./supportedLanguages";

function getLanguageName(code) {
  const normalizedCode =
    normalizeLanguageCode(code);

  const language =
    SUPPORTED_LANGUAGES.find(
      (item) =>
        normalizeLanguageCode(
          item.code
        ) === normalizedCode
    );

  return (
    language?.name ||
    normalizedCode ||
    "Unknown"
  );
}

function normalizeConfidence(value) {
  const numericValue =
    Number(value);

  if (
    !Number.isFinite(
      numericValue
    )
  ) {
    return 0;
  }

  return Math.min(
    1,
    Math.max(
      0,
      numericValue
    )
  );
}

export async function updateTranslationAnalytics() {
  try {
    const translationsSnapshot =
      await getDocs(
        collection(
          db,
          "translations"
        )
      );

    let translatedPosts = 0;
    let translatedComments = 0;
    let translatedMessages = 0;
    let translatedVideos = 0;
    let translatedAudio = 0;

    let aiTranslations = 0;

    let aiConfidenceSum = 0;

    const languageCounter =
      {};

    translationsSnapshot.forEach(
      (docSnap) => {
        const translation =
          docSnap.data() || {};

        switch (
          translation.sourceType
        ) {
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

        /*
         * Only AI-generated translations
         * contribute to AI translation
         * accuracy.
         */
        if (
          translation.translatedByAI ===
          true
        ) {
          aiTranslations++;

          aiConfidenceSum +=
            normalizeConfidence(
              translation.confidence
            );
        }

        /*
         * Normalize language codes before
         * counting them so values such as
         * zh-tw and zh-TW are not counted
         * as separate languages.
         */
        const languageCode =
          normalizeLanguageCode(
            translation.targetLanguage ||
              ""
          );

        if (!languageCode) {
          return;
        }

        languageCounter[
          languageCode
        ] =
          (
            languageCounter[
              languageCode
            ] || 0
          ) + 1;
      }
    );

    //----------------------------------
    // TOP TRANSLATION LANGUAGE
    //----------------------------------

    let topLanguageCode = "";
    let maxCount = 0;

    Object.entries(
      languageCounter
    ).forEach(
      ([languageCode, count]) => {
        if (
          count >
          maxCount
        ) {
          maxCount = count;
          topLanguageCode =
            languageCode;
        }
      }
    );

    const topLanguage =
      topLanguageCode
        ? getLanguageName(
            topLanguageCode
          )
        : "None";

    //----------------------------------
    // AI TRANSLATION ACCURACY
    //----------------------------------

    const translationAccuracy =
      aiTranslations === 0
        ? 0
        : aiConfidenceSum /
          aiTranslations;

    //----------------------------------
    // ACCESSIBILITY COVERAGE
    //----------------------------------
    /*
     * Accessibility coverage should
     * represent translated content that
     * can contribute to accessibility,
     * rather than comparing videos against
     * posts/comments.
     *
     * For the current analytics model,
     * translated video and audio content
     * are treated as the accessibility
     * content categories.
     */
    const accessibilityContent =
      translatedVideos +
      translatedAudio;

    const totalTranslatedContent =
      translatedPosts +
      translatedComments +
      translatedMessages +
      translatedVideos +
      translatedAudio;

    const accessibilityCoverage =
      totalTranslatedContent === 0
        ? 0
        : (
            accessibilityContent /
            totalTranslatedContent
          ) * 100;

    //----------------------------------
    // TRANSLATION HEALTH
    //----------------------------------

    let translationHealth =
      "Excellent";

    if (
      translationAccuracy <
      0.75
    ) {
      translationHealth =
        "Poor";
    } else if (
      translationAccuracy <
      0.9
    ) {
      translationHealth =
        "Good";
    }

    //----------------------------------
    // REPORT
    //----------------------------------

    const analytics = {
      translationHealth,

      translatedPosts,

      translatedComments,

      translatedMessages,

      translatedVideos,

      translatedAudio,

      aiTranslations,

      supportedLanguages:
        SUPPORTED_LANGUAGES.length,

      accessibilityCoverage,

      translationAccuracy,

      topLanguage,

      topLanguageCode:
        topLanguageCode ||
        "",

      totalTranslations:
        translationsSnapshot.size,

      generatedAt:
        serverTimestamp(),
    };

    await updateDoc(
      doc(
        db,
        "executiveReports",
        "current"
      ),
      analytics
    );

    /*
     * Return the calculated analytics
     * so callers can also use the result
     * immediately without reading
     * Firestore again.
     */
    return {
      ...analytics,
      generatedAt: null,
    };
  } catch (error) {
    console.error(
      "Translation Analytics Error:",
      error
    );

    throw error;
  }
}
