import { evaluateIdentity } from "./IdentityEngine";
import { evaluateDocuments } from "./DocumentEngine";
import { evaluateFraud } from "./FraudEngine";
// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Core Security Engine
// =======================================================

export function calculateRisk(request) {

  let score = 0;

  // Identity
  if (request.fullName) score += 10;
  if (request.email) score += 10;
  if (request.phone) score += 10;

  // Organization
  if (request.organizationName) score += 10;
  if (request.website) score += 10;

  // Documents
  if (request.documentName) score += 15;

  // Payment
  if (request.paymentStatus === "paid")
    score += 15;

  // Official Email
  if (request.officialEmail)
    score += 10;

  // Accessibility
  score += 10;

  return score;

}

export function generateDecision(score) {

  if (score >= 80) {
    return {
      status: "approved",
      decision: "Auto Approve",
      executiveReview: false,
    };
  }

  if (score >= 50) {
    return {
      status: "manual_review",
      decision: "Manual Review",
      executiveReview: true,
    };
  }

  return {
    status: "executive_review",
    decision: "Executive Review",
    executiveReview: true,
  };

}

export function evaluateVerification(request) {

  const identity = evaluateIdentity(request);

  const documents = evaluateDocuments(request);

  const fraud = evaluateFraud(request);

  const score = Math.round(
    (
      identity.score +
      documents.score +
      fraud.score
    ) / 3
  );

  const result = generateDecision(score);

  return {

    identity,

    documents,

    fraud,

    score,

    ...result,

  };

}
