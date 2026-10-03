/**
 * Verification Request Status
 *
 * Central status registry for verification requests and IFSE workflows.
 *
 * IMPORTANT:
 * - Existing status values are preserved for database compatibility.
 * - Do not rename stored status values without a migration.
 * - Workflow transitions belong in the appropriate verification service.
 */

export const REQUEST_STATUS = Object.freeze({
  DRAFT: "draft",

  SUBMITTED: "submitted",

  PAYMENT_PENDING: "payment_pending",

  DOCUMENT_REVIEW: "document_review",

  SECURITY_REVIEW: "security_review",

  ACCESSIBILITY_REVIEW: "accessibility_review",

  COMPLIANCE_REVIEW: "compliance_review",

  MANUAL_REVIEW: "manual_review",

  APPROVED: "approved",

  REJECTED: "rejected",

  ACTIVE: "active",

  SUSPENDED: "suspended",

  EXPIRED: "expired",

  CANCELLED: "cancelled",
});

/**
 * Get all available request status values.
 */
export function getRequestStatuses() {
  return Object.values(REQUEST_STATUS);
}

/**
 * Check whether a value is a valid request status.
 */
export function isValidRequestStatus(status) {
  if (!status || typeof status !== "string") {
    return false;
  }

  return getRequestStatuses().includes(status);
}

/**
 * Check whether a request is in a final decision state.
 */
export function isFinalRequestStatus(status) {
  return [
    REQUEST_STATUS.APPROVED,
    REQUEST_STATUS.REJECTED,
    REQUEST_STATUS.CANCELLED,
    REQUEST_STATUS.EXPIRED,
  ].includes(status);
}

/**
 * Check whether a request is currently active.
 */
export function isActiveRequestStatus(status) {
  return status === REQUEST_STATUS.ACTIVE;
}

/**
 * Check whether a request is suspended.
 */
export function isSuspendedRequestStatus(status) {
  return status === REQUEST_STATUS.SUSPENDED;
}

export default REQUEST_STATUS;
