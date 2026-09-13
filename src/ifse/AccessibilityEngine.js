// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Accessibility Engine (Master Controller)
// =======================================================

const DEFAULT_ENGINES = {
  visual: false,
  blindSupport: false,
  lowVision: false,
  colorBlind: false,
  hearing: false,
  deafSupport: false,
  speech: false,
  cognitive: false,
  dyslexia: false,
  autism: false,
  adhd: false,
  motor: false,
  keyboardNavigation: false,
  voiceNavigation: false,
  screenReader: false,
  braille: false,
  signLanguage: false,
  captions: false,
  liveTranscription: false,
  simplifiedReading: false,
  easyLanguage: false,
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

function evaluateAccessibilityEngines(
  accessibilityNeeds
) {
  const engines = {
    ...DEFAULT_ENGINES,
  };

  const needs =
    accessibilityNeeds.map(
      normalizeNeed
    );

  engines.visual =
    hasNeed(needs, [
      "visual",
      "visual impairment",
      "vision impairment",
    ]);

  engines.blindSupport =
    hasNeed(needs, [
      "blind",
      "blindness",
      "visually impaired",
      "visual impairment",
    ]);

  engines.lowVision =
    hasNeed(needs, [
      "low vision",
      "partial sight",
      "vision impairment",
    ]);

  engines.colorBlind =
    hasNeed(needs, [
      "color blind",
      "colour blind",
      "color blindness",
      "colour blindness",
    ]);

  engines.hearing =
    hasNeed(needs, [
      "hearing",
      "hearing impairment",
      "hearing impaired",
      "hard of hearing",
    ]);

  engines.deafSupport =
    hasNeed(needs, [
      "deaf",
      "deafness",
      "hearing loss",
    ]);

  engines.speech =
    hasNeed(needs, [
      "speech",
      "speech impairment",
      "speech impaired",
      "non verbal",
      "nonverbal",
      "unable to speak",
    ]);

  engines.cognitive =
    hasNeed(needs, [
      "cognitive",
      "cognitive impairment",
      "cognitive disability",
    ]);

  engines.dyslexia =
    hasNeed(needs, [
      "dyslexia",
      "dyslexic",
    ]);

  engines.autism =
    hasNeed(needs, [
      "autism",
      "autistic",
    ]);

  engines.adhd =
    hasNeed(needs, [
      "adhd",
      "attention deficit",
    ]);

  engines.motor =
    hasNeed(needs, [
      "motor",
      "motor impairment",
      "motor impaired",
      "mobility",
      "mobility impairment",
      "physical disability",
      "wheelchair",
    ]);

  engines.keyboardNavigation =
    hasNeed(needs, [
      "keyboard",
      "keyboard navigation",
      "keyboard only",
    ]);

  engines.voiceNavigation =
    hasNeed(needs, [
      "voice navigation",
      "voice control",
      "voice access",
      "voice",
    ]);

  engines.screenReader =
    hasNeed(needs, [
      "screen reader",
      "screenreader",
      "blind",
      "blindness",
      "visual impairment",
      "visually impaired",
    ]);

  engines.braille =
    hasNeed(needs, [
      "braille",
      "braille support",
    ]);

  engines.signLanguage =
    hasNeed(needs, [
      "sign language",
      "asl",
      "nsl",
      "signing",
    ]);

  engines.captions =
    hasNeed(needs, [
      "caption",
      "captions",
      "closed captions",
      "subtitles",
    ]);

  engines.liveTranscription =
    hasNeed(needs, [
      "live transcription",
      "real time transcription",
      "real-time transcription",
      "transcription",
    ]);

  engines.simplifiedReading =
    hasNeed(needs, [
      "simplified reading",
      "simple reading",
      "simplified text",
    ]);

  engines.easyLanguage =
    hasNeed(needs, [
      "easy language",
      "easy read",
      "easy reading",
      "plain language",
    ]);

  return engines;
}

function findUnsupportedNeeds(
  accessibilityNeeds
) {
  const recognizedPatterns = [
    "visual",
    "vision",
    "blind",
    "low vision",
    "partial sight",
    "color blind",
    "colour blind",
    "hearing",
    "deaf",
    "speech",
    "non verbal",
    "nonverbal",
    "cognitive",
    "dyslexia",
    "dyslexic",
    "autism",
    "autistic",
    "adhd",
    "attention deficit",
    "motor",
    "mobility",
    "physical disability",
    "wheelchair",
    "keyboard",
    "voice",
    "screen reader",
    "screenreader",
    "braille",
    "sign language",
    "asl",
    "nsl",
    "caption",
    "subtitle",
    "transcription",
    "simplified",
    "easy language",
    "easy read",
    "plain language",
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

function calculateAccessibilityScore(
  accessibilityNeeds,
  unsupportedNeeds
) {
  if (
    accessibilityNeeds.length === 0
  ) {
    return 100;
  }

  if (
    unsupportedNeeds.length === 0
  ) {
    return 100;
  }

  const recognizedCount =
    accessibilityNeeds.length -
    unsupportedNeeds.length;

  return Math.max(
    0,
    Math.round(
      (recognizedCount /
        accessibilityNeeds.length) *
        100
    )
  );
}

export function evaluateAccessibility(
  request = {}
) {
  const accessibilityNeeds =
    normalizeAccessibilityNeeds(
      request.accessibilityNeeds
    );

  const engines =
    evaluateAccessibilityEngines(
      accessibilityNeeds
    );

  const unsupportedNeeds =
    findUnsupportedNeeds(
      accessibilityNeeds
    );

  const issues =
    unsupportedNeeds.map(
      (need) => ({
        type:
          "UNRECOGNIZED_ACCESSIBILITY_NEED",
        need,
        message:
          `Accessibility need "${need}" was not recognized by the IFSE Accessibility Engine.`,
      })
    );

  const score =
    calculateAccessibilityScore(
      accessibilityNeeds,
      unsupportedNeeds
    );

  return {
    engine:
      "Accessibility Engine",

    enabled: true,

    profile:
      request.accessibilityProfile ||
      "default",

    preferredLanguage:
      request.language ||
      "en",

    timezone:
      request.timezone ||
      null,

    accessibilityNeeds,

    engines,

    score,

    passed:
      unsupportedNeeds.length ===
      0,

    issues,
  };
    }
