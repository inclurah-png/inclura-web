// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Accessibility Profile Engine
// =======================================================

const DEFAULT_PROFILE = {
  blind: false,
  lowVision: false,
  colorBlind: false,
  deaf: false,
  hardOfHearing: false,
  speechImpairment: false,
  motorImpairment: false,
  cognitiveDisability: false,
  dyslexia: false,
  autism: false,
  adhd: false,
};

function normalizeAccessibilityNeeds(
  accessibilityNeeds
) {
  if (Array.isArray(accessibilityNeeds)) {
    return accessibilityNeeds
      .filter(
        (need) =>
          need !== null &&
          need !== undefined
      )
      .map((need) =>
        String(need).trim()
      )
      .filter(Boolean);
  }

  if (
    typeof accessibilityNeeds ===
    "string"
  ) {
    return accessibilityNeeds
      .split(",")
      .map((need) =>
        need.trim()
      )
      .filter(Boolean);
  }

  return [];
}

function normalizeNeed(need) {
  return String(need)
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function hasNeed(
  needs,
  patterns
) {
  return needs.some((need) =>
    patterns.some((pattern) =>
      need.includes(pattern)
    )
  );
}

function buildAccessibilityProfile(
  accessibilityNeeds
) {
  const needs =
    accessibilityNeeds.map(
      normalizeNeed
    );

  return {
    blind: hasNeed(needs, [
      "blind",
      "blindness",
      "visually impaired",
      "visual impairment",
    ]),

    lowVision: hasNeed(needs, [
      "low vision",
      "partial sight",
      "vision impairment",
    ]),

    colorBlind: hasNeed(needs, [
      "color blind",
      "colour blind",
      "color blindness",
      "colour blindness",
    ]),

    deaf: hasNeed(needs, [
      "deaf",
      "deafness",
    ]),

    hardOfHearing: hasNeed(needs, [
      "hard of hearing",
      "hearing impairment",
      "hearing impaired",
      "hearing loss",
    ]),

    speechImpairment: hasNeed(needs, [
      "speech impairment",
      "speech impaired",
      "speech disability",
      "non verbal",
      "nonverbal",
      "unable to speak",
    ]),

    motorImpairment: hasNeed(needs, [
      "motor impairment",
      "motor impaired",
      "mobility impairment",
      "mobility impaired",
      "physical disability",
      "wheelchair",
    ]),

    cognitiveDisability: hasNeed(needs, [
      "cognitive disability",
      "cognitive impairment",
      "cognitive",
    ]),

    dyslexia: hasNeed(needs, [
      "dyslexia",
      "dyslexic",
    ]),

    autism: hasNeed(needs, [
      "autism",
      "autistic",
    ]),

    adhd: hasNeed(needs, [
      "adhd",
      "attention deficit",
    ]),
  };
}

function findUnrecognizedNeeds(
  accessibilityNeeds
) {
  const recognizedPatterns = [
    "blind",
    "blindness",
    "visually impaired",
    "visual impairment",
    "low vision",
    "partial sight",
    "vision impairment",
    "color blind",
    "colour blind",
    "color blindness",
    "colour blindness",
    "deaf",
    "deafness",
    "hard of hearing",
    "hearing impairment",
    "hearing impaired",
    "hearing loss",
    "speech impairment",
    "speech impaired",
    "speech disability",
    "non verbal",
    "nonverbal",
    "unable to speak",
    "motor impairment",
    "motor impaired",
    "mobility impairment",
    "mobility impaired",
    "physical disability",
    "wheelchair",
    "cognitive disability",
    "cognitive impairment",
    "cognitive",
    "dyslexia",
    "dyslexic",
    "autism",
    "autistic",
    "adhd",
    "attention deficit",
  ];

  return accessibilityNeeds.filter(
    (need) => {
      const normalized =
        normalizeNeed(need);

      if (!normalized) {
        return false;
      }

      if (
        normalized ===
        "no disability"
      ) {
        return false;
      }

      return !recognizedPatterns.some(
        (pattern) =>
          normalized.includes(
            pattern
          )
      );
    }
  );
}

export function evaluateAccessibilityProfile(
  request = {}
) {
  const accessibilityNeeds =
    normalizeAccessibilityNeeds(
      request.accessibilityNeeds
    );

  const profile =
    buildAccessibilityProfile(
      accessibilityNeeds
    );

  const unrecognizedNeeds =
    findUnrecognizedNeeds(
      accessibilityNeeds
    );

  const issues =
    unrecognizedNeeds.map(
      (need) => ({
        type:
          "UNRECOGNIZED_ACCESSIBILITY_NEED",
        need,
        message:
          `Accessibility need "${need}" was not recognized by the IFSE Accessibility Profile Engine.`,
      })
    );

  return {
    engine:
      "Accessibility Profile Engine",

    profile,

    score:
      unrecognizedNeeds.length ===
      0
        ? 100
        : Math.max(
            0,
            Math.round(
              ((accessibilityNeeds.length -
                unrecognizedNeeds.length) /
                accessibilityNeeds.length) *
                100
            )
          ),

    passed:
      unrecognizedNeeds.length ===
      0,

    issues,
  };
}
