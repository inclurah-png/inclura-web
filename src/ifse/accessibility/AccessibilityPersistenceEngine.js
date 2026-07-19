// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Accessibility Persistence Engine
// =======================================================

const STORAGE_KEY = "inclura_accessibility_preferences";

export function saveAccessibilityPreferences(preferences) {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(preferences)
    );

    return true;

  } catch {

    return false;

  }

}

export function loadAccessibilityPreferences() {

  try {

    const saved =
      localStorage.getItem(STORAGE_KEY);

    return saved ? JSON.parse(saved) : null;

  } catch {

    return null;

  }

}

export function clearAccessibilityPreferences() {

  try {

    localStorage.removeItem(STORAGE_KEY);

    return true;

  } catch {

    return false;

  }

}
