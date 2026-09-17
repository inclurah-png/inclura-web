import {
  evaluateAccessibilityProfile,
} from "./AccessibilityProfileEngine";

import {
  evaluateAccessibilityPreference,
} from "./AccessibilityPreferenceEngine";

import {
  evaluateBlindSupport,
} from "./BlindSupportEngine";

import {
  evaluateLowVision,
} from "./LowVisionEngine";

import {
  evaluateColorBlindSupport,
} from "./ColorBlindSupportEngine";

import {
  evaluateScreenReader,
} from "./ScreenReaderEngine";

import {
  evaluateBraille,
} from "./BrailleEngine";

import {
  evaluateVoiceNavigation,
} from "./VoiceNavigationEngine";

import {
  evaluateKeyboardNavigation,
} from "./KeyboardNavigationEngine";

import {
  evaluateHearingAccessibility,
} from "./HearingAccessibilityEngine";

import {
  evaluateSpeechAccessibility,
} from "./SpeechAccessibilityEngine";

import {
  evaluateMotorAccessibility,
} from "./MotorAccessibilityEngine";

import {
  evaluateCognitiveAccessibility,
} from "./CognitiveAccessibilityEngine";

// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Accessibility Runtime Engine
// =======================================================

let runtimeState = {

  initialized: false,

  currentUser: null,

  accessibilityProfile: null,

  activeModules: {},

  lastUpdated: null,

};

const runtimeListeners = [];


export function initializeAccessibilityRuntime(
  user = null
) {

  const normalizedUser =
    user && typeof user === "object"
      ? user
      : null;

  runtimeState.initialized = true;

  runtimeState.currentUser =
    normalizedUser;

  runtimeState.lastUpdated =
    new Date().toISOString();

  notifyAccessibilityListeners();

  return runtimeState;

}


export function getAccessibilityRuntime() {

  return runtimeState;

}


export function updateAccessibilityRuntime(
  update = {}
) {

  const normalizedUpdate =
    update && typeof update === "object"
      ? update
      : {};

  runtimeState = {

    ...runtimeState,

    ...normalizedUpdate,

    lastUpdated:
      new Date().toISOString(),

  };

  notifyAccessibilityListeners();

  return runtimeState;

}


export function subscribeAccessibility(
  listener
) {

  if (
    typeof listener !== "function"
  ) {

    return () => {};

  }

  runtimeListeners.push(listener);

  return () => {

    const index =
      runtimeListeners.indexOf(
        listener
      );

    if (index >= 0) {

      runtimeListeners.splice(
        index,
        1
      );

    }

  };

}


export function notifyAccessibilityListeners() {

  runtimeListeners.forEach(
    (listener) => {

      try {

        listener(runtimeState);

      } catch (error) {

        console.error(
          "IFSE Accessibility Runtime listener error:",
          error
        );

      }

    }
  );

}


export function shutdownAccessibilityRuntime() {

  runtimeState = {

    initialized: false,

    currentUser: null,

    accessibilityProfile: null,

    activeModules: {},

    lastUpdated: null,

  };

  notifyAccessibilityListeners();

  return runtimeState;

}


export function loadAccessibilityModules(
  user = null
) {

  const normalizedUser =
    user && typeof user === "object"
      ? user
      : runtimeState.currentUser;

  const profile =
    evaluateAccessibilityProfile(
      normalizedUser
    );

  const preferences =
    evaluateAccessibilityPreference(
      normalizedUser
    );

  const blindSupport =
    evaluateBlindSupport(
      normalizedUser
    );

  const lowVision =
    evaluateLowVision(
      normalizedUser
    );

  const colorBlindSupport =
    evaluateColorBlindSupport(
      normalizedUser
    );

  const screenReader =
    evaluateScreenReader(
      normalizedUser
    );

  const braille =
    evaluateBraille(
      normalizedUser
    );

  const voiceNavigation =
    evaluateVoiceNavigation(
      normalizedUser
    );

  const keyboardNavigation =
    evaluateKeyboardNavigation(
      normalizedUser
    );

  const hearingAccessibility =
    evaluateHearingAccessibility(
      normalizedUser
    );

  const speechAccessibility =
    evaluateSpeechAccessibility(
      normalizedUser
    );

  const motorAccessibility =
    evaluateMotorAccessibility(
      normalizedUser
    );

  const cognitiveAccessibility =
    evaluateCognitiveAccessibility(
      normalizedUser
    );

  runtimeState.accessibilityProfile =
    profile;

  runtimeState.activeModules = {

    profile,

    preferences,

    blindSupport,

    lowVision,

    colorBlindSupport,

    screenReader,

    braille,

    voiceNavigation,

    keyboardNavigation,

    hearingAccessibility,

    speechAccessibility,

    motorAccessibility,

    cognitiveAccessibility,

  };

  runtimeState.lastUpdated =
    new Date().toISOString();

  notifyAccessibilityListeners();

  return runtimeState;

}
