// =======================================================
// IFSE Verification Workflow
// =======================================================
//
// Defines the standard sequence used by IFSE verification.
//
// IMPORTANT:
// - This file defines workflow configuration only.
// - Actual verification operations belong to their
//   respective IFSE services.
// - Conditional approval logic belongs to the workflow
//   engine and IFSE rules.
// =======================================================

export const IFSE_WORKFLOW = Object.freeze([
  Object.freeze({
    step: 1,
    id: "identity_verification",
    title: "Identity Verification",
  }),

  Object.freeze({
    step: 2,
    id: "document_authentication",
    title: "Document Authentication",
  }),

  Object.freeze({
    step: 3,
    id: "duplicate_detection",
    title: "Duplicate Detection",
  }),

  Object.freeze({
    step: 4,
    id: "fraud_detection",
    title: "AI Fraud Detection",
  }),

  Object.freeze({
    step: 5,
    id: "business_validation",
    title: "Business Validation",
  }),

  Object.freeze({
    step: 6,
    id: "government_validation",
    title: "Government Validation",
  }),

  Object.freeze({
    step: 7,
    id: "accessibility_review",
    title: "Accessibility Compliance",
  }),

  Object.freeze({
    step: 8,
    id: "risk_scoring",
    title: "IFSE Risk Scoring",
  }),

  Object.freeze({
    step: 9,
    id: "executive_review",
    title: "Executive Review",
  }),

  Object.freeze({
    step: 10,
    id: "badge_issuance",
    title: "Verification Badge Issuance",
  }),
]);

/**
 * Get a workflow step by its numeric step number.
 *
 * @param {number} stepNumber
 * @returns {object|null}
 */
export function getIFSEWorkflowStep(stepNumber) {
  if (!Number.isInteger(stepNumber)) {
    return null;
  }

  return (
    IFSE_WORKFLOW.find((workflowStep) => workflowStep.step === stepNumber) ||
    null
  );
}

/**
 * Get a workflow step by its ID.
 *
 * @param {string} stepId
 * @returns {object|null}
 */
export function getIFSEWorkflowStepById(stepId) {
  if (!stepId || typeof stepId !== "string") {
    return null;
  }

  return (
    IFSE_WORKFLOW.find(
      (workflowStep) => workflowStep.id === stepId
    ) || null
  );
}

/**
 * Get the total number of workflow steps.
 *
 * @returns {number}
 */
export function getIFSEWorkflowStepCount() {
  return IFSE_WORKFLOW.length;
}

/**
 * Validate the workflow sequence.
 *
 * Ensures that step numbers are sequential and that
 * every workflow step has an ID and title.
 *
 * @returns {boolean}
 */
export function isIFSEWorkflowValid() {
  return IFSE_WORKFLOW.every(
    (workflowStep, index) =>
      workflowStep.step === index + 1 &&
      typeof workflowStep.id === "string" &&
      workflowStep.id.length > 0 &&
      typeof workflowStep.title === "string" &&
      workflowStep.title.length > 0
  );
}

export default IFSE_WORKFLOW;
