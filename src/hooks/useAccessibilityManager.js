import { useAccessibility } from "../context/AccessibilityProvider";

function useAccessibilityManager() {

  const accessibility = useAccessibility();

  // Future central place for:
  // - Firestore sync
  // - Speech synthesis
  // - OCR
  // - Screen reader helpers
  // - Language switching
  // - Captions
  // - AI image descriptions

  return {
    ...accessibility,

    increaseFont() {
      accessibility.setFontScale((prev) =>
        Math.min(prev + 0.1, 1.8)
      );
    },

    decreaseFont() {
      accessibility.setFontScale((prev) =>
        Math.max(prev - 0.1, 0.8)
      );
    },

    toggleContrast() {
      accessibility.setHighContrast(
        !accessibility.highContrast
      );
    },

    toggleMotion() {
      accessibility.setReducedMotion(
        !accessibility.reducedMotion
      );
    },

    toggleVoice() {
      accessibility.setVoiceEnabled(
        !accessibility.voiceEnabled
      );
    },
  };
}

export default useAccessibilityManager
