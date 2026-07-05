import { runTranslationScheduler } from "../translation/translationScheduler";

import { runCommunityScheduler } from "./communityScheduler";

import { updateRevenueInsights } from "./revenueInsights";

import { updateCreatorEconomyInsights } from "./creatorEconomyInsights";

/**
 * Inclura Executive Scheduler
 *
 * Runs all AI intelligence engines.
 */
export async function runExecutiveScheduler() {
  try {
    console.log("Executive AI Started...");

    await updateRevenueInsights();

    await updateCreatorEconomyInsights();

    await runTranslationScheduler();

    await runCommunityScheduler();

    console.log("Executive AI Completed.");
  } catch (error) {
    console.error(
      "Executive Scheduler Error:",
      error
    );
  }
}
