import { evaluateAccessibilityProfile } from "./AccessibilityProfileEngine";
import { evaluateAccessibilityPreference } from "./AccessibilityPreferenceEngine";

import { evaluateBlindSupport } from "./BlindSupportEngine";
import { evaluateLowVision } from "./LowVisionEngine";
import { evaluateColorBlindSupport } from "./ColorBlindSupportEngine";

import { evaluateScreenReader } from "./ScreenReaderEngine";
import { evaluateBraille } from "./BrailleEngine";

import { evaluateVoiceNavigation } from "./VoiceNavigationEngine";
import { evaluateKeyboardNavigation } from "./KeyboardNavigationEngine";

import { evaluateHearingAccessibility } from "./HearingAccessibilityEngine";
import { evaluateSpeechAccessibility } from "./SpeechAccessibilityEngine";

import { evaluateMotorAccessibility } from "./MotorAccessibilityEngine";
import { evaluateCognitiveAccessibility } from "./CognitiveAccessibilityEngine";
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

export function initializeAccessibilityRuntime(user) {

  runtimeState.initialized = true;

  runtimeState.currentUser = user;

  runtimeState.lastUpdated = new Date().toISOString();

  return runtimeState;

}

export function getAccessibilityRuntime() {

  return runtimeState;

}

export function updateAccessibilityRuntime(update) {

  runtimeState = {

    ...runtimeState,

    ...update,

    lastUpdated: new Date().toISOString(),

  };
  notifyAccessibilityListeners();
  
  return runtimeState;

}
export function subscribeAccessibility(listener) {

  runtimeListeners.push(listener);

  return () => {

    const index = runtimeListeners.indexOf(listener);

    if (index >= 0) {

      runtimeListeners.splice(index, 1);

    }

  };

}

export function notifyAccessibilityListeners() {

  runtimeListeners.forEach((listener) => {

    listener(runtimeState);

  });

}
export function shutdownAccessibilityRuntime() {

  runtimeState = {

    initialized: false,

    currentUser: null,

    accessibilityProfile: null,

    activeModules: {},

    lastUpdated: null,

  };
return runtimeState;
  }

  export function loadAccessibilityModules(user) {

  runtimeState.accessibilityProfile =
    evaluateAccessibilityProfile(user);

  runtimeState.activeModules = {

    profile:
      evaluateAccessibilityProfile(user),

    preferences:
      evaluateAccessibilityPreference(user),

    blindSupport:
      evaluateBlindSupport(user),

    lowVision:
      evaluateLowVision(user),

    colorBlindSupport:
      evaluateColorBlindSupport(user),

    screenReader:
      evaluateScreenReader(user),

    braille:
      evaluateBraille(user),

    voiceNavigation:
      evaluateVoiceNavigation(user),

    keyboardNavigation:
      evaluateKeyboardNavigation(user),

    hearingAccessibility:
      evaluateHearingAccessibility(user),

    speechAccessibility:
      evaluateSpeechAccessibility(user),

    motorAccessibility:
      evaluateMotorAccessibility(user),

    cognitiveAccessibility:
      evaluateCognitiveAccessibility(user),

  };

  runtimeState.lastUpdated =
    new Date().toISOString();
    
notifyAccessibilityListeners();
    
  return runtimeState;

  }
