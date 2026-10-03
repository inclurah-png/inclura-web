/**
 * Verification ID Migration
 *
 * Converts legacy verification IDs to the current IFSE verification IDs.
 *
 * IMPORTANT:
 * - Existing migration mappings are preserved for backward compatibility.
 * - Do not remove or rename legacy IDs without a migration plan.
 * - Unknown IDs are returned unchanged so existing data is not silently lost.
 */

export const VERIFICATION_ID_MIGRATION = Object.freeze({
  // =======================================================
  // Legacy General
  // =======================================================

  verified_member: "verified_creator",

  // =======================================================
  // Creator
  // =======================================================

  creator: "verified_creator",
  creator_verified: "verified_creator",

  // =======================================================
  // Institution
  // =======================================================

  university: "verified_institution",
  college: "verified_institution",
  school: "verified_institution",
  institution: "verified_institution",

  // =======================================================
  // Organisation
  // =======================================================

  organization: "verified_organization",
  organisation: "verified_organization",
  ngo: "verified_organization",

  // =======================================================
  // Healthcare
  // =======================================================

  hospital: "verified_healthcare",
  clinic: "verified_healthcare",

  // =======================================================
  // Government
  // =======================================================

  government: "verified_government",
  ministry: "verified_government",

  // =======================================================
  // Media
  // =======================================================

  media: "verified_media",
  newspaper: "verified_media",
  television: "verified_media",
  radio: "verified_media",

  // =======================================================
  // Religious
  // =======================================================

  church: "verified_religious",
  mosque: "verified_religious",
  religious: "verified_religious",

  // =======================================================
  // Financial
  // =======================================================

  bank: "verified_financial",
  fintech: "verified_financial",

  // =======================================================
  // Emergency
  // =======================================================

  emergency: "verified_emergency_service",
  rescue: "verified_emergency_service",
  fire_service: "verified_emergency_service",
  ambulance: "verified_emergency_service",

  // =======================================================
  // Enterprise
  // =======================================================

  enterprise: "enterprise_partner",
});

/**
 * Migrate a legacy verification ID to its current IFSE ID.
 *
 * Unknown IDs are returned unchanged.
 */
export function migrateVerificationId(id) {
  if (!id || typeof id !== "string") {
    return null;
  }

  return VERIFICATION_ID_MIGRATION[id] || id;
}

/**
 * Check whether a verification ID has a defined migration.
 */
export function hasVerificationMigration(id) {
  if (!id || typeof id !== "string") {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(
    VERIFICATION_ID_MIGRATION,
    id
  );
}

/**
 * Get the migrated ID without changing unknown IDs.
 */
export function getMigratedVerificationId(id) {
  return migrateVerificationId(id);
}

/**
 * Get all legacy verification IDs with migration mappings.
 */
export function getLegacyVerificationIds() {
  return Object.keys(VERIFICATION_ID_MIGRATION);
}

/**
 * Get all unique current IFSE verification IDs.
 */
export function getMigratedVerificationIds() {
  return [...new Set(Object.values(VERIFICATION_ID_MIGRATION))];
}

export default VERIFICATION_ID_MIGRATION;
