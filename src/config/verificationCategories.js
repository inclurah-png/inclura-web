/**
 * Verification Categories
 *
 * Central registry for Inclura verification and partnership categories.
 *
 * IMPORTANT:
 * - Existing category IDs are preserved for compatibility.
 * - Premium and IFSE protection flags are preserved.
 * - Pricing decisions belong in the pricing configuration.
 * - Security decisions belong to IFSE.
 */

export const VERIFICATION_CATEGORIES = Object.freeze({
  creator: Object.freeze({
    title: "Creator Verification",
    premium: true,
    ifseProtected: true,
  }),

  group: Object.freeze({
    title: "Group Verification",
    premium: true,
    ifseProtected: true,
  }),

  organization: Object.freeze({
    title: "Organization Verification",
    premium: true,
    ifseProtected: true,
  }),

  ngo: Object.freeze({
    title: "NGO Verification",
    premium: true,
    ifseProtected: true,
  }),

  institution: Object.freeze({
    title: "Institution Verification",
    premium: true,
    ifseProtected: true,
  }),

  healthcare: Object.freeze({
    title: "Healthcare Verification",
    premium: true,
    ifseProtected: true,
  }),

  media: Object.freeze({
    title: "Media Verification",
    premium: true,
    ifseProtected: true,
  }),

  corporate: Object.freeze({
    title: "Corporate Partnership",
    premium: true,
    ifseProtected: true,
  }),

  government: Object.freeze({
    title: "Government Partnership",
    premium: true,
    ifseProtected: true,
  }),

  enterprise: Object.freeze({
    title: "Enterprise Partnership",
    premium: true,
    ifseProtected: true,
  }),
});

/**
 * Get a verification category by ID.
 */
export function getVerificationCategory(categoryId) {
  if (!categoryId || typeof categoryId !== "string") {
    return null;
  }

  return VERIFICATION_CATEGORIES[categoryId.toLowerCase()] || null;
}

/**
 * Check whether a verification category exists.
 */
export function isValidVerificationCategory(categoryId) {
  return Boolean(getVerificationCategory(categoryId));
}

/**
 * Get all verification category IDs.
 */
export function getVerificationCategoryIds() {
  return Object.keys(VERIFICATION_CATEGORIES);
}

/**
 * Get all verification categories.
 */
export function getVerificationCategories() {
  return Object.values(VERIFICATION_CATEGORIES);
}

/**
 * Get categories that require premium access.
 */
export function getPremiumVerificationCategories() {
  return Object.entries(VERIFICATION_CATEGORIES)
    .filter(([, category]) => category.premium === true)
    .map(([id, category]) => ({
      id,
      ...category,
    }));
}

/**
 * Get categories protected by IFSE.
 */
export function getIFSEProtectedVerificationCategories() {
  return Object.entries(VERIFICATION_CATEGORIES)
    .filter(([, category]) => category.ifseProtected === true)
    .map(([id, category]) => ({
      id,
      ...category,
    }));
}

export default VERIFICATION_CATEGORIES;
