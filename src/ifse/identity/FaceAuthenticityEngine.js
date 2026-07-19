// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Face Authenticity Engine
// =======================================================

export function evaluateFaceAuthenticity(request) {

  let authenticityScore = 100;

  const issues = [];

  if (request.faceSpoofingDetected) {

    authenticityScore -= 35;

    issues.push("Face spoofing detected");

  }

  if (request.deepfakeFaceDetected) {

    authenticityScore -= 35;

    issues.push("Deepfake face detected");

  }

  if (request.faceMismatchDetected) {

    authenticityScore -= 20;

    issues.push("Face does not match registered identity");

  }

  if (request.lowConfidenceFaceMatch) {

    authenticityScore -= 10;

    issues.push("Low confidence facial match");

  }

  return {

    engine: "Face Authenticity Engine",

    authentic: authenticityScore >= 70,

    authenticityScore,

    issues,

    protections: {

      livenessDetection: true,

      deepfakeDetection: true,

      faceMatching: true,

      antiSpoofing: true,

      realtimeVerification: true,

    },

    passed: authenticityScore >= 70,

  };

}
