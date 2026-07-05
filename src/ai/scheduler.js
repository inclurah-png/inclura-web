import { updateRevenueInsights } from "./revenueInsights";

import { updateCreatorEconomyInsights } from "./creatorEconomyInsights";

import { runCommunityScheduler } from "./communityScheduler";

import { runTranslationScheduler } from "../translation/translationScheduler";

import { updateModerationInsights } from "./moderationInsights";

/**
 * Inclura Master AI Scheduler
 *
 * Runs every AI engine.
 */

export async function runAIScheduler() {
  try {
    console.log(
      "🧠 Inclura AI Scheduler Started..."
    );

    // Creator Economy
    await updateCreatorEconomyInsights();

    // Revenue
    await updateRevenueInsights();

    // Translation Intelligence
    await runTranslationScheduler();

    // Community Intelligence
    await runCommunityScheduler();

    await updateModerationInsights();

    console.log(
      "✅ Inclura AI Scheduler Finished."
    );

    return true;
  } catch (error) {
    console.error(
      "❌ AI Scheduler Error:",
      error
    );

    return false;
  }
}
