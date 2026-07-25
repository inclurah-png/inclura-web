// =======================================================
// Verification ID Migration
// Converts legacy verification IDs to the new IFSE IDs
// =======================================================

export const VERIFICATION_ID_MIGRATION = {

  // Legacy General
  verified_member: "verified_creator",

  // Creator
  creator: "verified_creator",
  creator_verified: "verified_creator",

  // Institution
  university: "verified_institution",
  college: "verified_institution",
  school: "verified_institution",
  institution: "verified_institution",

  // Organisation
  organization: "verified_organization",
  organisation: "verified_organization",
  ngo: "verified_organization",

  // Healthcare
  hospital: "verified_healthcare",
  clinic: "verified_healthcare",

  // Government
  government: "verified_government",
  ministry: "verified_government",

  // Media
  media: "verified_media",
  newspaper: "verified_media",
  television: "verified_media",
  radio: "verified_media",

  // Religious
  church: "verified_religious",
  mosque: "verified_religious",
  religious: "verified_religious",

  // Financial
  bank: "verified_financial",
  fintech: "verified_financial",

  // Emergency
  emergency: "verified_emergency_service",
  rescue: "verified_emergency_service",
  fire_service: "verified_emergency_service",
  ambulance: "verified_emergency_service",

  // Enterprise
  enterprise: "enterprise_partner",
};

export function migrateVerificationId(id) {
  if (!id) return null;

  return (
    VERIFICATION_ID_MIGRATION[id] ||
    id
  );
}
