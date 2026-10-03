/**
 * IFSE Registration Types Registry
 *
 * Central registry of registration types used by IFSE verification
 * and organisation/entity onboarding workflows.
 *
 * IMPORTANT:
 * - Existing IDs are preserved for compatibility.
 * - Registration types are configuration data, not UI translation strings.
 * - Business verification logic belongs in the appropriate IFSE services.
 */

export const REGISTRATION_TYPES = Object.freeze({
  // ============================================
  // Organisation
  // ============================================

  organization: Object.freeze([
    Object.freeze({ id: "business_name", title: "Business Name" }),
    Object.freeze({ id: "startup", title: "Startup" }),
    Object.freeze({ id: "partnership", title: "Partnership" }),
    Object.freeze({ id: "cooperative", title: "Cooperative Society" }),
    Object.freeze({
      id: "limited_company",
      title: "Limited Liability Company",
    }),
    Object.freeze({
      id: "plc",
      title: "Public Limited Company (PLC)",
    }),
    Object.freeze({ id: "foundation", title: "Foundation" }),
    Object.freeze({ id: "charity", title: "Charity" }),
    Object.freeze({
      id: "nonprofit",
      title: "Non-profit Organisation",
    }),
    Object.freeze({
      id: "social_enterprise",
      title: "Social Enterprise",
    }),
  ]),

  // ============================================
  // Institution
  // ============================================

  institution: Object.freeze([
    Object.freeze({ id: "primary_school", title: "Primary School" }),
    Object.freeze({ id: "secondary_school", title: "Secondary School" }),
    Object.freeze({ id: "college", title: "College" }),
    Object.freeze({ id: "polytechnic", title: "Polytechnic" }),
    Object.freeze({ id: "university", title: "University" }),
    Object.freeze({ id: "academy", title: "Academy" }),
    Object.freeze({
      id: "training_center",
      title: "Training Centre",
    }),
    Object.freeze({
      id: "research_institute",
      title: "Research Institute",
    }),
    Object.freeze({
      id: "vocational_school",
      title: "Vocational School",
    }),
  ]),

  // ============================================
  // Healthcare
  // ============================================

  healthcare: Object.freeze([
    Object.freeze({ id: "hospital", title: "Hospital" }),
    Object.freeze({ id: "clinic", title: "Clinic" }),
    Object.freeze({
      id: "medical_center",
      title: "Medical Centre",
    }),
    Object.freeze({ id: "pharmacy", title: "Pharmacy" }),
    Object.freeze({
      id: "laboratory",
      title: "Medical Laboratory",
    }),
    Object.freeze({ id: "blood_bank", title: "Blood Bank" }),
    Object.freeze({
      id: "ambulance",
      title: "Ambulance Service",
    }),
    Object.freeze({
      id: "telemedicine",
      title: "Telemedicine Provider",
    }),
  ]),

  // ============================================
  // Government
  // ============================================

  government: Object.freeze([
    Object.freeze({ id: "ministry", title: "Ministry" }),
    Object.freeze({
      id: "agency",
      title: "Government Agency",
    }),
    Object.freeze({
      id: "department",
      title: "Government Department",
    }),
    Object.freeze({
      id: "commission",
      title: "Commission",
    }),
    Object.freeze({
      id: "parastatal",
      title: "Parastatal",
    }),
    Object.freeze({
      id: "local_government",
      title: "Local Government",
    }),
  ]),

  // ============================================
  // Media
  // ============================================

  media: Object.freeze([
    Object.freeze({ id: "television", title: "Television" }),
    Object.freeze({ id: "radio", title: "Radio" }),
    Object.freeze({ id: "newspaper", title: "Newspaper" }),
    Object.freeze({ id: "magazine", title: "Magazine" }),
    Object.freeze({
      id: "online_media",
      title: "Online Media",
    }),
    Object.freeze({ id: "podcast", title: "Podcast" }),
  ]),

  // ============================================
  // Religious
  // ============================================

  religious: Object.freeze([
    Object.freeze({ id: "church", title: "Church" }),
    Object.freeze({ id: "mosque", title: "Mosque" }),
    Object.freeze({ id: "temple", title: "Temple" }),
    Object.freeze({
      id: "synagogue",
      title: "Synagogue",
    }),
    Object.freeze({
      id: "ministry",
      title: "Religious Ministry",
    }),
  ]),

  // ============================================
  // Financial
  // ============================================

  financial: Object.freeze([
    Object.freeze({ id: "bank", title: "Bank" }),
    Object.freeze({
      id: "microfinance",
      title: "Microfinance Bank",
    }),
    Object.freeze({
      id: "insurance",
      title: "Insurance Company",
    }),
    Object.freeze({
      id: "investment",
      title: "Investment Company",
    }),
    Object.freeze({
      id: "fintech",
      title: "FinTech Company",
    }),
    Object.freeze({
      id: "payment_provider",
      title: "Payment Provider",
    }),
  ]),

  // ============================================
  // Emergency Services
  // ============================================

  emergency_services: Object.freeze([
    Object.freeze({
      id: "fire_service",
      title: "Fire Service",
    }),
    Object.freeze({
      id: "ambulance_service",
      title: "Ambulance Service",
    }),
    Object.freeze({
      id: "civil_defence",
      title: "Civil Defence",
    }),
    Object.freeze({
      id: "search_rescue",
      title: "Search and Rescue",
    }),
    Object.freeze({
      id: "disaster_management",
      title: "Disaster Management",
    }),
  ]),
});

/**
 * Get all registration types for a category.
 */
export function getRegistrationTypes(category) {
  if (!category || typeof category !== "string") {
    return [];
  }

  return REGISTRATION_TYPES[category.toLowerCase()] || [];
}

/**
 * Get a specific registration type by category and ID.
 */
export function getRegistrationType(category, registrationId) {
  if (
    !category ||
    typeof category !== "string" ||
    !registrationId ||
    typeof registrationId !== "string"
  ) {
    return null;
  }

  const types = getRegistrationTypes(category);

  return (
    types.find((registrationType) => registrationType.id === registrationId) ||
    null
  );
}

/**
 * Check whether a registration category exists.
 */
export function hasRegistrationCategory(category) {
  if (!category || typeof category !== "string") {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(
    REGISTRATION_TYPES,
    category.toLowerCase()
  );
}

/**
 * Check whether a registration type exists within a category.
 */
export function isValidRegistrationType(category, registrationId) {
  return Boolean(getRegistrationType(category, registrationId));
}

/**
 * Get all registration categories.
 */
export function getRegistrationCategories() {
  return Object.keys(REGISTRATION_TYPES);
}

export default REGISTRATION_TYPES;
