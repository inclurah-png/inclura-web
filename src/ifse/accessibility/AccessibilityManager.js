// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Accessibility Manager
// Master Accessibility Coordinator
// =======================================================

import { evaluateAccessibility } from "./AccessibilityEngine";
import { evaluateAccessibilityProfile } from "./AccessibilityProfileEngine";
import { evaluateAccessibilityPreference } from "./AccessibilityPreferenceEngine";

import { evaluateBlindSupport } from "./BlindSupportEngine";
import { evaluateLowVision } from "./LowVisionEngine";
import { evaluateColorBlindSupport } from "./ColorBlindSupportEngine";
import { evaluateScreenReader } from "./ScreenReaderEngine";
import { evaluateBraille } from "./BrailleEngine";

import { evaluateVoiceNavigation } from "./VoiceNavigationEngine";
import { evaluateKeyboardNavigation } from "./KeyboardNavigationEngine";

import { evaluateMotorAccessibility } from "./MotorAccessibilityEngine";
import { evaluateSwitchControl } from "./SwitchControlEngine";
import { evaluateEyeTracking } from "./EyeTrackingEngine";
import { evaluateGestureControl } from "./GestureControlEngine";

import { evaluateHearingAccessibility } from "./HearingAccessibilityEngine";
import { evaluateDeafSupport } from "./DeafSupportEngine";
import { evaluateCaption } from "./CaptionEngine";
import { evaluateLiveTranscription } from "./LiveTranscriptionEngine";
import { evaluateSignLanguage } from "./SignLanguageEngine";

import { evaluateSpeechAccessibility } from "./SpeechAccessibilityEngine";

import { evaluateCognitiveAccessibility } from "./CognitiveAccessibilityEngine";
import { evaluateDyslexiaSupport } from "./DyslexiaSupportEngine";
import { evaluateAutismSupport } from "./AutismSupportEngine";
import { evaluateADHDSupport } from "./ADHDSupportEngine";
import { evaluateSimplifiedReading } from "./SimplifiedReadingEngine";
import { evaluateEasyLanguage } from "./EasyLanguageEngine";

import { evaluateAccessibilityAudit } from "./AccessibilityAuditEngine";
import { evaluateAccessibilityCompliance } from "./AccessibilityComplianceEngine";
import { evaluateAccessibilityAnalytics } from "./AccessibilityAnalyticsEngine";

import { evaluateAccessibilityIntegration } from "./AccessibilityIntegrationEngine";
import { evaluateAccessibilityPersonalization } from "./AccessibilityPersonalizationEngine";

export function evaluateAccessibilityManager(request) {

  return {

    engine: "Accessibility Manager",

    accessibility:
      evaluateAccessibility(request),

    profile:
      evaluateAccessibilityProfile(request),

    preferences:
      evaluateAccessibilityPreference(request),

    visual: {

      blind:
        evaluateBlindSupport(request),

      lowVision:
        evaluateLowVision(request),

      colorBlind:
        evaluateColorBlindSupport(request),

      screenReader:
        evaluateScreenReader(request),

      braille:
        evaluateBraille(request),

    },

    navigation: {

      voice:
        evaluateVoiceNavigation(request),

      keyboard:
        evaluateKeyboardNavigation(request),

    },

    motor: {

      accessibility:
        evaluateMotorAccessibility(request),

      switchControl:
        evaluateSwitchControl(request),

      eyeTracking:
        evaluateEyeTracking(request),

      gestureControl:
        evaluateGestureControl(request),

    },

    hearing: {

      accessibility:
        evaluateHearingAccessibility(request),

      deaf:
        evaluateDeafSupport(request),

      captions:
        evaluateCaption(request),

      transcription:
        evaluateLiveTranscription(request),

      signLanguage:
        evaluateSignLanguage(request),

    },

    speech:
      evaluateSpeechAccessibility(request),

    cognitive: {

      accessibility:
        evaluateCognitiveAccessibility(request),

      dyslexia:
        evaluateDyslexiaSupport(request),

      autism:
        evaluateAutismSupport(request),

      adhd:
        evaluateADHDSupport(request),

      simplifiedReading:
        evaluateSimplifiedReading(request),

      easyLanguage:
        evaluateEasyLanguage(request),

    },

    quality: {

      audit:
        evaluateAccessibilityAudit(request),

      compliance:
        evaluateAccessibilityCompliance(request),

      analytics:
        evaluateAccessibilityAnalytics(request),

    },

    integration:
      evaluateAccessibilityIntegration(request),

    personalization:
      evaluateAccessibilityPersonalization(request),

  };

}
