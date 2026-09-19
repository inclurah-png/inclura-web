// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Accessibility Compliance Engine
// =======================================================

export function evaluateAccessibilityCompliance(
  request = {}
) {
  const source =
    request && typeof request === "object"
      ? request
      : {};

  const standards = {
    wcag21AA: true,
    wcag22AA: true,
    aria: true,
    screenReaderCompatibility: true,
    keyboardAccessibility: true,
    captionSupport: true,
    transcriptSupport: true,
    colorContrastCompliance: true,
  };

  const failures = [];

  if (
    source.hasImages === true &&
    source.hasAltText !== true
  ) {
    failures.push(
      "Alternative text missing."
    );
  }

  if (
    source.hasVideo === true &&
    source.hasCaptions !== true
  ) {
    failures.push(
      "Video captions missing."
    );
  }

  if (
    source.hasAudio === true &&
    source.hasTranscript !== true
  ) {
    failures.push(
      "Audio transcript missing."
    );
  }

  if (
    source.requiresKeyboardNavigation === true &&
    source.keyboardAccessible !== true
  ) {
    failures.push(
      "Keyboard accessibility requirement not satisfied."
    );
  }

  if (
    source.requiresScreenReader === true &&
    source.screenReaderCompatible !== true
  ) {
    failures.push(
      "Screen reader compatibility requirement not satisfied."
    );
  }

  if (
    source.requiresAria === true &&
    source.ariaAccessible !== true
  ) {
    failures.push(
      "ARIA accessibility requirement not satisfied."
    );
  }

  if (
    source.requiresColorContrast === true &&
    source.colorContrastCompliant !== true
  ) {
    failures.push(
      "Color contrast requirement not satisfied."
    );
  }

  const passed =
    failures.length === 0;

  const score =
    passed
      ? 100
      : Math.max(
          0,
          Math.round(
            100 -
              (failures.length /
                Object.keys(standards).length) *
                100
          )
        );

  return {
    engine:
      "Accessibility Compliance Engine",

    enabled: true,

    standards,

    failures,

    score,

    passed,

    issues: failures,
  };
}
