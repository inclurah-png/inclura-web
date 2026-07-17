import { evaluateIdentity } from "./IdentityEngine";
import { evaluateDocuments } from "./DocumentEngine";
import { evaluateFraud } from "./FraudEngine";
import { evaluateDuplicates } from "./DuplicateDetectionEngine";
import { evaluatePayment } from "./PaymentEngine";
import { evaluateAccessibility } from "./AccessibilityEngine";
import { evaluateRisk } from "./RiskAnalysisEngine";
import { evaluateMonitoring } from "./MonitoringEngine";
import { generateBadge } from "./BadgeEngine";
import { generateCertificate } from "./CertificateEngine";
import { evaluateCompliance } from "./ComplianceEngine";
import { evaluateApproval } from "./ApprovalEngine";
import { generateAuditLog } from "./AuditEngine";
import { generateNotification } from "./NotificationEngine";
import { evaluateRenewal } from "./RenewalEngine";
import { evaluateExpiry } from "./ExpiryEngine";
import { evaluateAppeal } from "./AppealsEngine";
import { evaluateRevocation } from "./RevocationEngine";
import { evaluateLicense } from "./LicensingEngine";
import { evaluateAccreditation } from "./AccreditationEngine";
import { evaluatePartnership } from "./PartnershipEngine";
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

  const duplicates = evaluateDuplicates(request);

  const payment = evaluatePayment(request);

  const accessibility =
    evaluateAccessibility(request);
  
const risk =
  evaluateRisk(request);

const monitoring =
  evaluateMonitoring(request);

 const compliance =
  evaluateCompliance(request);

const approval =
  evaluateApproval(request);
  
  const score = Math.round(
  (
    identity.score +
    documents.score +
    fraud.score +
    duplicates.score +
    payment.score +
    accessibility.score +
    compliance.score +
    approval.score +
    risk.score
  ) / 9
  );

  const result =
    generateDecision(score);
  
const badge =
  generateBadge({
    ...request,
    status: result.status,
  });

const certificate =
  generateCertificate({
    ...request,
    status: result.status,
  });

  const audit =
  generateAuditLog({
    ...request,
    status: result.status,
    eventType: "verification",
  });

  const notification =
  generateNotification({
    ...request,
    status: result.status,
  });

  const expiry =
  evaluateExpiry({
    ...request,
    expiryDate: renewal.renewalDate,
  });

  const renewal =
  evaluateRenewal({
    ...request,
    status: result.status,
  });

  const appeal =
  evaluateAppeal({
    ...request,
    status: result.status,
  });

  const revocation =
  evaluateRevocation(request);

  const license =
  evaluateLicense(request);

  const accreditation =
  evaluateAccreditation(request);

  const partnership =
  evaluatePartnership(request);
  
    return {

  identity,

  documents,

  fraud,

  duplicates,

  payment,

  accessibility,

  compliance,

  license,

  accreditation,

  partnership,
      
  approval,

  risk,

  monitoring,

  badge,

  certificate,

  audit,

  notification,

  renewal,

  expiry,

  appeal,

  revocation,

  score,

  ...result,

};
  
}
