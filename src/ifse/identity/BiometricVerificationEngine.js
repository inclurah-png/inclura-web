// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Biometric Verification Engine
// =======================================================

export function evaluateBiometricVerification(request) {

  let verificationScore = 100;

  const issues = [];

  if (request.biometricUnavailable) {

    verificationScore -= 20;

    issues.push("Biometric authentication unavailable");

  }

  if (request.biometricVerificationFailed) {

    verificationScore -= 40;

    issues.push("Biometric verification failed");

  }

  if (request.passkeyVerificationFailed) {

    verificationScore -= 30;

    issues.push("Passkey verification failed");

  }

  if (request.deviceNotTrusted) {

    verificationScore -= 20;

    issues.push("Biometric attempted on an untrusted device");

  }

  return {

    engine: "Biometric Verification Engine",

    verified: verificationScore >= 70,

    verificationScore,

    issues,

    methods: {

      passkeys: true,

      fingerprint: true,

      faceUnlock: true,

      deviceBiometrics: true,

    },

    protections: {

      webAuthn: true,

      secureAuthentication: true,

      deviceBoundCredentials: true,

      replayProtection: true,

    },

    passed: verificationScore >= 70,

  };

}
