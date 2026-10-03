/**
 * Inclura Verification Pricing
 *
 * Central pricing configuration for verification registration types.
 *
 * IMPORTANT:
 * - Existing prices are preserved.
 * - Existing registration IDs are preserved.
 * - IFSE contract-based pricing remains controlled by IFSE.
 * - Currency values are expressed in USD.
 * - Pricing display and payment processing belong to the appropriate
 *   verification/payment modules.
 */

export const VERIFICATION_PRICING = Object.freeze({
  organization: Object.freeze({
    business_name: Object.freeze({
      yearlyUSD: 250,
    }),

    startup: Object.freeze({
      monthlyUSD: 35,
      yearlyUSD: 420,
    }),

    cooperative: Object.freeze({
      yearlyUSD: 750,
    }),

    charity: Object.freeze({
      yearlyUSD: 600,
    }),

    nonprofit: Object.freeze({
      yearlyUSD: 600,
    }),

    social_enterprise: Object.freeze({
      yearlyUSD: 800,
    }),

    small_limited_company: Object.freeze({
      yearlyUSD: 1500,
    }),

    medium_limited_company: Object.freeze({
      pricing: "IFSE",
      contractRequired: true,
    }),

    large_limited_company: Object.freeze({
      pricing: "IFSE",
      contractRequired: true,
    }),

    plc: Object.freeze({
      pricing: "IFSE",
      contractRequired: true,
    }),
  }),
});

/**
 * Get pricing configuration for a verification category
 * and registration type.
 */
export function getVerificationPricing(category, registrationType) {
  if (
    !category ||
    typeof category !== "string" ||
    !registrationType ||
    typeof registrationType !== "string"
  ) {
    return null;
  }

  const categoryPricing = VERIFICATION_PRICING[category.toLowerCase()];

  if (!categoryPricing) {
    return null;
  }

  return categoryPricing[registrationType] || null;
}

/**
 * Check whether pricing exists for a category and registration type.
 */
export function hasVerificationPricing(category, registrationType) {
  return Boolean(getVerificationPricing(category, registrationType));
}

/**
 * Check whether a verification type requires IFSE-controlled pricing.
 */
export function requiresIFSEPricing(category, registrationType) {
  const pricing = getVerificationPricing(category, registrationType);

  return Boolean(
    pricing?.pricing === "IFSE" ||
    pricing?.contractRequired === true
  );
}

/**
 * Get all pricing definitions for a verification category.
 */
export function getVerificationCategoryPricing(category) {
  if (!category || typeof category !== "string") {
    return {};
  }

  return VERIFICATION_PRICING[category.toLowerCase()] || {};
}

/**
 * Get all configured verification pricing categories.
 */
export function getVerificationPricingCategories() {
  return Object.keys(VERIFICATION_PRICING);
}

/**
 * Get the fixed yearly USD price for a verification type.
 *
 * Returns null when the price is monthly, IFSE-controlled,
 * contract-based, or otherwise not a fixed yearly price.
 */
export function getYearlyVerificationPrice(category, registrationType) {
  const pricing = getVerificationPricing(category, registrationType);

  if (
    !pricing ||
    typeof pricing.yearlyUSD !== "number" ||
    !Number.isFinite(pricing.yearlyUSD)
  ) {
    return null;
  }

  return pricing.yearlyUSD;
}

/**
 * Get the fixed monthly USD price for a verification type.
 *
 * Returns null when no fixed monthly price is configured.
 */
export function getMonthlyVerificationPrice(category, registrationType) {
  const pricing = getVerificationPricing(category, registrationType);

  if (
    !pricing ||
    typeof pricing.monthlyUSD !== "number" ||
    !Number.isFinite(pricing.monthlyUSD)
  ) {
    return null;
  }

  return pricing.monthlyUSD;
}

export default VERIFICATION_PRICING;
