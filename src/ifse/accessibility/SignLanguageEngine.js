// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Sign Language Engine
// =======================================================

export function evaluateSignLanguage(request = {}) {

  const source =
    request && typeof request === "object"
      ? request
      : {};

  const rawNeeds =
    source.accessibilityNeeds;

  const needs = Array.isArray(rawNeeds)
    ? rawNeeds
    : typeof rawNeeds === "string"
      ? rawNeeds.split(",")
      : [];

  const normalizedNeeds =
    needs
      .filter(
        (need) =>
          typeof need === "string"
      )
      .map(
        (need) =>
          need
            .trim()
            .toLowerCase()
            .replace(/[-_]+/g, " ")
            .replace(/\s+/g, " ")
      );

  const deafNeed =
    normalizedNeeds.some(
      (need) =>
        need === "deaf" ||
        need === "deaf support" ||
        need === "hearing impairment" ||
        need === "hearing disability" ||
        need === "hearing accessibility" ||
        need === "sign language"
    );

  const enabled =
    source.signLanguage === true ||
    deafNeed;

  return {

    engine:
      "Sign Language Engine",

    enabled,

    preferredLanguage:
      typeof source.preferredSignLanguage === "string" &&
      source.preferredSignLanguage.trim()
        ? source.preferredSignLanguage.trim()
        : "International Sign",

    supportedLanguages: {

      internationalSign: true,

      americanSignLanguage: true,

      britishSignLanguage: true,

      nigerianSignLanguage: true,

      frenchSignLanguage: true,

      germanSignLanguage: true,

      spanishSignLanguage: true,

      japaneseSignLanguage: true,

      koreanSignLanguage: true,

      chineseSignLanguage: true,

      australianSignLanguage: true,

      newZealandSignLanguage: true,

      southAfricanSignLanguage: true,

    },

    features: {

      signLanguageInterpreter:
        enabled,

      aiSignLanguageTranslation:
        enabled,

      signLanguageAvatar:
        enabled,

      signLanguageDictionary:
        enabled,

      videoSigningSupport:
        enabled,

      liveSigningSupport:
        enabled,

      educationalSigning:
        enabled,

    },

    score:
      100,

    passed:
      true,

    issues:
      [],

  };

}
