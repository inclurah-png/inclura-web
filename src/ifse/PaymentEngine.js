// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Payment Verification Engine
// =======================================================

export function evaluatePayment(request) {

  let score = 0;

  const issues = [];

  if (request.paymentStatus === "paid") {

    score = 100;

  } else if (request.paymentStatus === "free") {

    score = 100;

  } else {

    issues.push("Payment not completed");

  }

  return {

    engine: "Payment Engine",

    score,

    passed: score >= 100,

    issues,

  };

}
