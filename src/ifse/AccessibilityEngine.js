// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Accessibility Engine
// =======================================================

export function evaluateAccessibility(request) {

  let score = 100;

  const issues = [];

  if (
    request.accessibilityNeeds &&
    request.accessibilityNeeds.length > 0
  ) {

    score = 100;

  }

  if (!request.language) {

    issues.push(
      "Preferred language not specified"
    );

  }

  if (!request.timezone) {

    issues.push(
      "Timezone not specified"
    );

  }

  return {

    engine: "Accessibility Engine",

    score,

    passed: true,

    issues,

  };

}
