// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Accessibility Preference Engine
// =======================================================

export function evaluateAccessibilityPreference(request = {}) {

  const source =
    request && typeof request === "object"
      ? request
      : {};

  const normalizeBoolean = (value, fallback = false) => {

    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {

      const normalized =
        value
          .trim()
          .toLowerCase();

      if (
        normalized === "true" ||
        normalized === "yes" ||
        normalized === "enabled" ||
        normalized === "on"
      ) {
        return true;
      }

      if (
        normalized === "false" ||
        normalized === "no" ||
        normalized === "disabled" ||
        normalized === "off"
      ) {
        return false;
      }

    }

    return fallback;
  };

  const normalizeLanguage = (value) => {

    if (
      typeof value !== "string" ||
      !value.trim()
    ) {
      return "en";
    }

    return value
      .trim()
      .toLowerCase();

  };

  const normalizeTheme = (value) => {

    if (
      typeof value !== "string"
    ) {
      return "system";
    }

    const theme =
      value
        .trim()
        .toLowerCase();

    if (
      theme === "light" ||
      theme === "dark" ||
      theme === "system"
    ) {
      return theme;
    }

    return "system";

  };

  const normalizeFontSize = (value) => {

    if (
      typeof value !== "string"
    ) {
      return "medium";
    }

    const fontSize =
      value
        .trim()
        .toLowerCase();

    if (
      fontSize === "small" ||
      fontSize === "medium" ||
      fontSize === "large" ||
      fontSize === "x-large"
    ) {
      return fontSize;
    }

    return "medium";

  };

  const preferences = {

    language:
      normalizeLanguage(
        source.language
      ),

    theme:
      normalizeTheme(
        source.theme
      ),

    fontSize:
      normalizeFontSize(
        source.fontSize
      ),

    highContrast:
      normalizeBoolean(
        source.highContrast
      ),

    reducedMotion:
      normalizeBoolean(
        source.reducedMotion
      ),

    screenReader:
      normalizeBoolean(
        source.screenReader
      ),

    voiceNavigation:
      normalizeBoolean(
        source.voiceNavigation
      ),

    keyboardNavigation:
      normalizeBoolean(
        source.keyboardNavigation
      ),

    captions:
      normalizeBoolean(
        source.captions
      ),

    liveTranscription:
      normalizeBoolean(
        source.liveTranscription
      ),

    signLanguage:
      normalizeBoolean(
        source.signLanguage
      ),

    braille:
      normalizeBoolean(
        source.braille
      ),

    simplifiedReading:
      normalizeBoolean(
        source.simplifiedReading
      ),

    easyLanguage:
      normalizeBoolean(
        source.easyLanguage
      ),

  };

  const issues = [];

  if (
    source.theme !== undefined &&
    typeof source.theme === "string" &&
    ![
      "light",
      "dark",
      "system",
    ].includes(
      source.theme
        .trim()
        .toLowerCase()
    )
  ) {
    issues.push(
      "Unsupported theme preference."
    );
  }

  if (
    source.fontSize !== undefined &&
    typeof source.fontSize === "string" &&
    ![
      "small",
      "medium",
      "large",
      "x-large",
    ].includes(
      source.fontSize
        .trim()
        .toLowerCase()
    )
  ) {
    issues.push(
      "Unsupported font size preference."
    );
  }

  const score =
    issues.length === 0
      ? 100
      : Math.max(
          0,
          100 - (issues.length * 10)
        );

  return {

    engine:
      "Accessibility Preference Engine",

    preferences,

    score,

    passed:
      issues.length === 0,

    issues,

  };

}
