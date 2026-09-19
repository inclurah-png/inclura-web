// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Accessibility Persistence Engine
// =======================================================

const STORAGE_KEY =
  "inclura_accessibility_preferences";

export function saveAccessibilityPreferences(
  preferences = {}
) {
  try {
    if (
      typeof localStorage === "undefined"
    ) {
      return false;
    }

    const normalizedPreferences =
      preferences &&
      typeof preferences === "object"
        ? preferences
        : {};

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        normalizedPreferences
      )
    );

    return true;
  } catch {
    return false;
  }
}

export function loadAccessibilityPreferences() {
  try {
    if (
      typeof localStorage === "undefined"
    ) {
      return null;
    }

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) {
      return null;
    }

    const parsed =
      JSON.parse(saved);

    return parsed &&
      typeof parsed === "object"
      ? parsed
      : null;
  } catch {
    return null;
  }
}

export function clearAccessibilityPreferences() {
  try {
    if (
      typeof localStorage === "undefined"
    ) {
      return false;
    }

    localStorage.removeItem(
      STORAGE_KEY
    );

    return true;
  } catch {
    return false;
  }
}
