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
import { evaluateGovernment } from "./GovernmentVerificationEngine";
import { evaluateHealthcare } from "./HealthcareVerificationEngine";
import { evaluateEducation } from "./EducationVerificationEngine";
import { evaluateFinancial } from "./FinancialVerificationEngine";
import { evaluateLegal } from "./LegalVerificationEngine";
import { evaluateInsurance } from "./InsuranceVerificationEngine";
import { evaluateTax } from "./TaxVerificationEngine";
import { evaluateIntellectualProperty } from "./IntellectualPropertyVerificationEngine";
import { evaluateNonProfit } from "./NonProfitVerificationEngine";
import { evaluateReligiousOrganization } from "./ReligiousOrganizationVerificationEngine";
import { evaluateMediaOrganization } from "./MediaOrganizationVerificationEngine";
import { evaluateTelecommunications } from "./TelecommunicationsVerificationEngine";
import { evaluateEnergy } from "./EnergyVerificationEngine";
import { evaluateUtilities } from "./UtilitiesVerificationEngine";
import { evaluateTransportation } from "./TransportationVerificationEngine";
import { evaluateAviation } from "./AviationVerificationEngine";
import { evaluateGenericOrganization } from "./GenericOrganizationVerificationEngine";
import { evaluateMaritime } from "./MaritimeVerificationEngine";
import { evaluateLogistics } from "./LogisticsVerificationEngine";
import { evaluateRealEstate } from "./RealEstateVerificationEngine";
import { evaluateManufacturing } from "./ManufacturingVerificationEngine";
import { evaluateAgriculture } from "./AgricultureVerificationEngine";
import { evaluateMining } from "./MiningVerificationEngine";
import { evaluateHospitality } from "./HospitalityVerificationEngine";
import { evaluateTourism } from "./TourismVerificationEngine";
import { evaluateSports } from "./SportsVerificationEngine";
import { evaluateEntertainment } from "./EntertainmentVerificationEngine";
import { evaluateResearchInstitution } from "./ResearchInstitutionVerificationEngine";
import { evaluateInternationalOrganization } from "./InternationalOrganizationVerificationEngine";
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

  const government =
  evaluateGovernment(request);

  const healthcare =
  evaluateHealthcare(request);

  const education =
  evaluateEducation(request);

  const financial =
  evaluateFinancial(request);

  const legal =
  evaluateLegal(request);

  const insurance =
  evaluateInsurance(request);

  const tax =
  evaluateTax(request);

  const intellectualProperty =
  evaluateIntellectualProperty(request);

  const nonProfit =
  evaluateNonProfit(request);

  const religiousOrganization =
  evaluateReligiousOrganization(request);

  const mediaOrganization =
  evaluateMediaOrganization(request);

  const telecommunications =
  evaluateTelecommunications(request);

  const energy =
  evaluateEnergy(request);

  const utilities =
  evaluateUtilities(request);
  
  const transportation =
  evaluateTransportation(request);

  const aviation =
  evaluateAviation(request);

  const genericOrganization =
  evaluateGenericOrganization(request);

  const maritime =
  evaluateMaritime(request);

  const logistics =
  evaluateLogistics(request);

  const realEstate =
  evaluateRealEstate(request);

  const manufacturing =
  evaluateManufacturing(request);

  const agriculture =
  evaluateAgriculture(request);
  
  const mining =
  evaluateMining(request);

  const hospitality =
  evaluateHospitality(request);

  const tourism =
  evaluateTourism(request);

  const sports =
  evaluateSports(request);

  const entertainment =
  evaluateEntertainment(request);

  const researchInstitution =
  evaluateResearchInstitution(request);

  const internationalOrganization =
  evaluateInternationalOrganization(request);
  
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

  government,

  healthcare,

  education,

  financial,

  legal,

  insurance,

  tax,
      
  intellectualProperty,

  nonProfit,

  religiousOrganization,

  mediaOrganization,

  genericOrganization,

  telecommunications,

  energy,

  utilities,

  transportation,

  aviation,

  maritime,

  logistics,

  realEstate,

  manufacturing,

  agriculture,

  mining,

  hospitality,

  tourism,

  sports,

  entertainment,

  researchInstitution,

  internationalOrganization,
      
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
