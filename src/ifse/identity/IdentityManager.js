// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Identity Manager
// Master Identity Coordinator
// =======================================================

import { evaluateIdentity } from "../identity";

export function evaluateIdentityManager(request) {

  const identity = evaluateIdentity(request);

  return {

    engine: "Identity Manager",

    enabled: true,

    identity,

    identityModules: {

      coreIdentity: true,

      digitalIdentity: true,

      biometricVerification: true,

      deviceTrust: true,

      sessionTrust: true,

      faceAuthenticity: true,

      voiceAuthenticity: true,

    },

    security: {

      identityProtection: true,

      fraudDetection: true,

      impersonationDetection: true,

      realtimeMonitoring: true,

    },

    monitoring: {

      identityAudit: true,

      identityAnalytics: true,

      complianceMonitoring: true,

    },

    score: identity.score,

    passed: identity.passed,

    issues: identity.issues,

  };

}
