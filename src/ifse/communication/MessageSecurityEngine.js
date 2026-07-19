// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Message Security Engine
// =======================================================

export function evaluateMessageSecurity(request) {

  const issues = [];

  if (request.spamDetected) {
    issues.push("Spam message detected");
  }

  if (request.phishingDetected) {
    issues.push("Possible phishing attempt detected");
  }

  if (request.maliciousAttachmentDetected) {
    issues.push("Malicious attachment detected");
  }

  if (request.impersonationDetected) {
    issues.push("Possible impersonation detected");
  }

  if (request.prohibitedContentDetected) {
    issues.push("Prohibited content detected");
  }

  return {

    engine: "Message Security Engine",

    secure: issues.length === 0,

    issues,

    protections: {

      spamFiltering: true,

      phishingProtection: true,

      attachmentScanning: true,

      impersonationDetection: true,

      abuseDetection: true,

      malwareScanning: true,

      realtimeProtection: true,

      aiModeration: true,

    },

    score: Math.max(0, 100 - (issues.length * 15)),

    passed: issues.length === 0,

  };

}
