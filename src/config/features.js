/**
 * Inclura Platform Feature Registry
 *
 * Central configuration for major platform capabilities.
 *
 * IMPORTANT:
 * - This file defines feature metadata and availability.
 * - Business logic belongs in the appropriate feature/module.
 * - Security decisions belong to IFSE.
 * - Pricing belongs to pricing/verification pricing modules.
 * - Translation strings belong to i18next.
 * - This file should remain dependency-free.
 */

export const FEATURES = Object.freeze({
  // ---------------------------------------------------------------------------
  // Core Platform
  // ---------------------------------------------------------------------------

  AUTHENTICATION: {
    id: "authentication",
    name: "Authentication",
    category: "core",
    enabled: true,
    requiresIFSE: true,
  },

  USER_PROFILES: {
    id: "user_profiles",
    name: "User Profiles",
    category: "core",
    enabled: true,
    requiresIFSE: false,
  },

  DASHBOARD: {
    id: "dashboard",
    name: "Dashboard",
    category: "core",
    enabled: true,
    requiresIFSE: false,
  },

  NOTIFICATIONS: {
    id: "notifications",
    name: "Notifications",
    category: "core",
    enabled: true,
    requiresIFSE: false,
  },

  // ---------------------------------------------------------------------------
  // Communication
  // ---------------------------------------------------------------------------

  MESSAGES: {
    id: "messages",
    name: "Messages",
    category: "communication",
    enabled: true,
    requiresIFSE: true,
  },

  VOICE_NOTES: {
    id: "voice_notes",
    name: "Voice Notes",
    category: "communication",
    enabled: true,
    requiresIFSE: true,
  },

  AUDIO_CALLS: {
    id: "audio_calls",
    name: "Audio Calls",
    category: "communication",
    enabled: true,
    requiresIFSE: true,
  },

  VIDEO_CALLS: {
    id: "video_calls",
    name: "Video Calls",
    category: "communication",
    enabled: true,
    requiresIFSE: true,
  },

  MESSAGE_TRANSLATION: {
    id: "message_translation",
    name: "Message Translation",
    category: "communication",
    enabled: true,
    requiresIFSE: false,
  },

  SPEECH_TO_TEXT: {
    id: "speech_to_text",
    name: "Speech to Text",
    category: "communication",
    enabled: true,
    requiresIFSE: true,
  },

  TEXT_TO_SPEECH: {
    id: "text_to_speech",
    name: "Text to Speech",
    category: "communication",
    enabled: true,
    requiresIFSE: true,
  },

  // ---------------------------------------------------------------------------
  // Social Platform
  // ---------------------------------------------------------------------------

  FEED: {
    id: "feed",
    name: "Feed",
    category: "social",
    enabled: true,
    requiresIFSE: false,
  },

  POST_TRANSLATION: {
    id: "post_translation",
    name: "Post Translation",
    category: "social",
    enabled: true,
    requiresIFSE: false,
  },

  REACTIONS: {
    id: "reactions",
    name: "Reactions",
    category: "social",
    enabled: true,
    requiresIFSE: false,
  },

  CREATOR_SCORING: {
    id: "creator_scoring",
    name: "Creator Scoring",
    category: "social",
    enabled: true,
    requiresIFSE: true,
  },

  REFERRALS: {
    id: "referrals",
    name: "Referrals",
    category: "social",
    enabled: true,
    requiresIFSE: true,
  },

  // ---------------------------------------------------------------------------
  // Accessibility
  // ---------------------------------------------------------------------------

  ACCESSIBILITY: {
    id: "accessibility",
    name: "Accessibility",
    category: "accessibility",
    enabled: true,
    requiresIFSE: true,
  },

  SCREEN_READER: {
    id: "screen_reader",
    name: "Screen Reader Support",
    category: "accessibility",
    enabled: true,
    requiresIFSE: true,
  },

  BRAILLE: {
    id: "braille",
    name: "Braille Support",
    category: "accessibility",
    enabled: true,
    requiresIFSE: true,
  },

  SIGN_LANGUAGE: {
    id: "sign_language",
    name: "Sign Language Support",
    category: "accessibility",
    enabled: true,
    requiresIFSE: true,
  },

  CAPTIONS: {
    id: "captions",
    name: "Captions",
    category: "accessibility",
    enabled: true,
    requiresIFSE: true,
  },

  VOICE_NAVIGATION: {
    id: "voice_navigation",
    name: "Voice Navigation",
    category: "accessibility",
    enabled: true,
    requiresIFSE: true,
  },

  KEYBOARD_NAVIGATION: {
    id: "keyboard_navigation",
    name: "Keyboard Navigation",
    category: "accessibility",
    enabled: true,
    requiresIFSE: true,
  },

  COGNITIVE_ACCESSIBILITY: {
    id: "cognitive_accessibility",
    name: "Cognitive Accessibility",
    category: "accessibility",
    enabled: true,
    requiresIFSE: true,
  },

  VISUAL_ACCESSIBILITY: {
    id: "visual_accessibility",
    name: "Visual Accessibility",
    category: "accessibility",
    enabled: true,
    requiresIFSE: true,
  },

  HEARING_ACCESSIBILITY: {
    id: "hearing_accessibility",
    name: "Hearing Accessibility",
    category: "accessibility",
    enabled: true,
    requiresIFSE: true,
  },

  MOTOR_ACCESSIBILITY: {
    id: "motor_accessibility",
    name: "Motor Accessibility",
    category: "accessibility",
    enabled: true,
    requiresIFSE: true,
  },

  // ---------------------------------------------------------------------------
  // Verification
  // ---------------------------------------------------------------------------

  VERIFICATION_CENTER: {
    id: "verification_center",
    name: "Verification Centre",
    category: "verification",
    enabled: true,
    requiresIFSE: true,
  },

  IDENTITY_VERIFICATION: {
    id: "identity_verification",
    name: "Identity Verification",
    category: "verification",
    enabled: true,
    requiresIFSE: true,
  },

  BUSINESS_VERIFICATION: {
    id: "business_verification",
    name: "Business Verification",
    category: "verification",
    enabled: true,
    requiresIFSE: true,
  },

  GOVERNMENT_VERIFICATION: {
    id: "government_verification",
    name: "Government Verification",
    category: "verification",
    enabled: true,
    requiresIFSE: true,
  },

  ACCESSIBILITY_CERTIFICATION: {
    id: "accessibility_certification",
    name: "Accessibility Certification",
    category: "verification",
    enabled: true,
    requiresIFSE: true,
  },

  // ---------------------------------------------------------------------------
  // Security / IFSE
  // ---------------------------------------------------------------------------

  IFSE: {
    id: "ifse",
    name: "Inclura Fortress Security Engine",
    category: "security",
    enabled: true,
    requiresIFSE: true,
  },

  FRAUD_DETECTION: {
    id: "fraud_detection",
    name: "Fraud Detection",
    category: "security",
    enabled: true,
    requiresIFSE: true,
  },

  DUPLICATE_DETECTION: {
    id: "duplicate_detection",
    name: "Duplicate Detection",
    category: "security",
    enabled: true,
    requiresIFSE: true,
  },

  COMPLIANCE: {
    id: "compliance",
    name: "Compliance",
    category: "security",
    enabled: true,
    requiresIFSE: true,
  },

  AUDIT_LOGGING: {
    id: "audit_logging",
    name: "Audit Logging",
    category: "security",
    enabled: true,
    requiresIFSE: true,
  },

  SECURITY_MONITORING: {
    id: "security_monitoring",
    name: "Security Monitoring",
    category: "security",
    enabled: true,
    requiresIFSE: true,
  },

  // ---------------------------------------------------------------------------
  // Emergency / Social Responsibility
  // ---------------------------------------------------------------------------

  SOS: {
    id: "sos",
    name: "IFSE SOS",
    category: "emergency",
    enabled: true,
    requiresIFSE: true,
  },

  EMERGENCY_DISPATCH: {
    id: "emergency_dispatch",
    name: "Emergency Dispatch",
    category: "emergency",
    enabled: true,
    requiresIFSE: true,
  },

  EMERGENCY_ESCALATION: {
    id: "emergency_escalation",
    name: "Emergency Escalation",
    category: "emergency",
    enabled: true,
    requiresIFSE: true,
  },

  // ---------------------------------------------------------------------------
  // Premium / Business
  // ---------------------------------------------------------------------------

  PREMIUM_CENTER: {
    id: "premium_center",
    name: "Premium Centre",
    category: "business",
    enabled: true,
    requiresIFSE: true,
  },

  CORPORATE_PARTNERSHIPS: {
    id: "corporate_partnerships",
    name: "Corporate Partnerships",
    category: "business",
    enabled: true,
    requiresIFSE: true,
  },

  CORPORATE_SHIELD: {
    id: "corporate_shield",
    name: "Corporate Shield",
    category: "business",
    enabled: true,
    requiresIFSE: true,
  },

  GOVERNMENT_SUITE: {
    id: "government_suite",
    name: "Government Suite",
    category: "government",
    enabled: true,
    requiresIFSE: true,
  },

  // ---------------------------------------------------------------------------
  // Marketplace / Cross-platform
  // ---------------------------------------------------------------------------

  MARKET: {
    id: "market",
    name: "Inclura Market",
    category: "commerce",
    enabled: true,
    requiresIFSE: true,
  },

  CROSS_POST: {
    id: "cross_post",
    name: "CrossPost",
    category: "integration",
    enabled: true,
    requiresIFSE: true,
  },

  WATERMARKING: {
    id: "watermarking",
    name: "Content Watermarking",
    category: "integration",
    enabled: true,
    requiresIFSE: true,
  },

  // ---------------------------------------------------------------------------
  // AI
  // ---------------------------------------------------------------------------

  AI_TRANSLATION: {
    id: "ai_translation",
    name: "AI Translation",
    category: "ai",
    enabled: true,
    requiresIFSE: true,
  },

  AI_TRANSCRIPTION: {
    id: "ai_transcription",
    name: "AI Transcription",
    category: "ai",
    enabled: true,
    requiresIFSE: true,
  },

  // ---------------------------------------------------------------------------
  // Configuration Helpers
  // ---------------------------------------------------------------------------
});

/**
 * Returns whether a feature exists and is enabled.
 *
 * @param {string} featureId
 * @returns {boolean}
 */
export function isFeatureEnabled(featureId) {
  if (!featureId || typeof featureId !== "string") {
    return false;
  }

  const feature = Object.values(FEATURES).find(
    (item) => item.id === featureId
  );

  return Boolean(feature?.enabled);
}

/**
 * Returns a feature definition by its ID.
 *
 * @param {string} featureId
 * @returns {object|null}
 */
export function getFeature(featureId) {
  if (!featureId || typeof featureId !== "string") {
    return null;
  }

  return (
    Object.values(FEATURES).find(
      (item) => item.id === featureId
    ) || null
  );
}

/**
 * Returns all features belonging to a category.
 *
 * @param {string} category
 * @returns {object[]}
 */
export function getFeaturesByCategory(category) {
  if (!category || typeof category !== "string") {
    return [];
  }

  return Object.values(FEATURES).filter(
    (feature) => feature.category === category
  );
}

/**
 * Returns all currently enabled features.
 *
 * @returns {object[]}
 */
export function getEnabledFeatures() {
  return Object.values(FEATURES).filter(
    (feature) => feature.enabled === true
  );
}

/**
 * Returns all features that require IFSE protection.
 *
 * @returns {object[]}
 */
export function getIFSEProtectedFeatures() {
  return Object.values(FEATURES).filter(
    (feature) => feature.requiresIFSE === true
  );
}

export default FEATURES;
