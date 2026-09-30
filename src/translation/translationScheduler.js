import {
  updateTranslationAnalytics,
} from "./translationAnalytics";

/**
 * Translation Background Scheduler
 *
 * Current responsibilities:
 * - Refresh translation analytics
 *
 * Future responsibilities:
 * - Process queued translations
 * - Generate subtitles
 * - Generate AI voice
 * - Warm translation cache
 */
export async function runTranslationScheduler() {
  try {
    console.log(
      "Translation Scheduler Started..."
    );

    const analytics =
      await updateTranslationAnalytics();

    console.log(
      "Translation Scheduler Completed."
    );

    return {
      success: true,
      analytics,
    };
  } catch (error) {
    console.error(
      "Translation Scheduler Error:",
      error
    );

    /*
     * Do not silently report success when
     * the scheduled translation operation
     * failed.
     */
    throw error;
  }
}

export default runTranslationScheduler;
