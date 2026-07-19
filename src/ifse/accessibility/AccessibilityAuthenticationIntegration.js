// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Accessibility Authentication Integration
// =======================================================

import {

  initializeAccessibilityRuntime,

  loadAccessibilityModules,

} from "./AccessibilityRuntimeEngine";

export async function initializeUserAccessibility(user) {

  if (!user) {

    return null;

  }

  initializeAccessibilityRuntime(user);

  loadAccessibilityModules(user);

  return true;

}
