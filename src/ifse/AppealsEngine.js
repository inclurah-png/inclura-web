// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Appeals Engine
// =======================================================

export function evaluateAppeal(request) {

  const eligible =
    request.status === "manual_review" ||
    request.status === "executive_review";

  return {

    engine: "Appeals Engine",

    eligible,

    appealStatus: eligible
      ? "Eligible"
      : "Not Eligible",

    submitted: false,

    reviewed: false,

  };

}
