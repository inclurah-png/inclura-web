/**
 * Verification Documents
 *
 * Central registry of documents required for IFSE verification categories
 * and registration types.
 *
 * IMPORTANT:
 * - Existing document identifiers are preserved.
 * - Existing document requirements are preserved.
 * - Document requirements should not be changed without considering
 *   verification workflow and stored application data.
 * - User-facing document labels can be localized at the UI layer.
 */

export const VERIFICATION_DOCUMENTS = Object.freeze({
  // =======================================================
  // Creator
  // =======================================================

  creator: Object.freeze({
    verified_creator: Object.freeze([
      "Government-issued ID",
      "Selfie Verification",
      "Primary Social Media Link",
    ]),

    creator_pro: Object.freeze([
      "Government-issued ID",
      "Selfie Verification",
    ]),

    creator_elite: Object.freeze([
      "Government-issued ID",
      "Selfie Verification",
      "Business Registration (optional)",
    ]),
  }),

  // =======================================================
  // Group
  // =======================================================

  group: Object.freeze({
    community: Object.freeze([
      "Group Ownership Proof",
      "Administrator ID",
    ]),

    fan_club: Object.freeze([
      "Administrator ID",
      "Official Fan Club Evidence",
    ]),

    support_group: Object.freeze([
      "Administrator ID",
    ]),
  }),

  // =======================================================
  // Organization
  // =======================================================

  organization: Object.freeze({
    business_name: Object.freeze([
      "Business Registration Certificate",
      "Owner Government ID",
    ]),

    startup: Object.freeze([
      "Business Registration",
      "Founder Government ID",
      "Official Website or Pitch Deck",
    ]),

    cooperative: Object.freeze([
      "Cooperative Registration Certificate",
      "Chairperson Government ID",
    ]),

    charity: Object.freeze([
      "Charity Registration",
      "Trustee Government ID",
    ]),

    nonprofit: Object.freeze([
      "Nonprofit Registration Certificate",
      "Executive Director Government ID",
    ]),

    social_enterprise: Object.freeze([
      "Business Registration",
      "Founder Government ID",
    ]),

    small_limited_company: Object.freeze([
      "Certificate of Incorporation",
      "Director Government ID",
    ]),

    medium_limited_company: Object.freeze([
      "Certificate of Incorporation",
      "Company Profile",
      "Director Government ID",
      "Financial Statement",
    ]),

    large_limited_company: Object.freeze([
      "IFSE Corporate Due Diligence Package",
    ]),

    plc: Object.freeze([
      "IFSE PLC Due Diligence Package",
    ]),
  }),
});

/**
 * Get the document requirements for a verification category
 * and registration type.
 */
export function getVerificationDocuments(category, registrationType) {
  if (
    !category ||
    typeof category !== "string" ||
    !registrationType ||
    typeof registrationType !== "string"
  ) {
    return [];
  }

  const categoryDocuments =
    VERIFICATION_DOCUMENTS[category.toLowerCase()];

  if (!categoryDocuments) {
    return [];
  }

  return categoryDocuments[registrationType] || [];
}

/**
 * Check whether a verification category has document requirements.
 */
export function hasVerificationDocumentCategory(category) {
  if (!category || typeof category !== "string") {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(
    VERIFICATION_DOCUMENTS,
    category.toLowerCase()
  );
}

/**
 * Check whether a registration type has a document definition
 * within a verification category.
 */
export function hasVerificationDocuments(category, registrationType) {
  return getVerificationDocuments(category, registrationType).length > 0;
}

/**
 * Get all registration types that have document requirements
 * for a verification category.
 */
export function getVerificationDocumentTypes(category) {
  if (!category || typeof category !== "string") {
    return [];
  }

  const categoryDocuments =
    VERIFICATION_DOCUMENTS[category.toLowerCase()];

  if (!categoryDocuments) {
    return [];
  }

  return Object.keys(categoryDocuments);
}

/**
 * Get all verification document categories.
 */
export function getVerificationDocumentCategories() {
  return Object.keys(VERIFICATION_DOCUMENTS);
}

export default VERIFICATION_DOCUMENTS;
