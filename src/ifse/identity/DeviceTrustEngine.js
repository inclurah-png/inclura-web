// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Device Trust Engine
// =======================================================

export function evaluateDeviceTrust(request) {

  let trustScore = 100;

  const issues = [];

  if (request.unknownDevice) {

    trustScore -= 25;

    issues.push("Unknown device detected");

  }

  if (request.deviceFingerprintMismatch) {

    trustScore -= 20;

    issues.push("Device fingerprint mismatch");

  }

  if (request.rootedOrJailbrokenDevice) {

    trustScore -= 25;

    issues.push("Rooted or jailbroken device detected");

  }

  if (request.emulatorDetected) {

    trustScore -= 20;

    issues.push("Emulator detected");

  }

  if (request.deviceTimeManipulationDetected) {

    trustScore -= 10;

    issues.push("Device time manipulation detected");

  }

  return {

    engine: "Device Trust Engine",

    trusted: trustScore >= 70,

    trustScore,

    issues,

    protections: {

      deviceFingerprinting: true,

      trustedDeviceRecognition: true,

      emulatorDetection: true,

      rootedDeviceDetection: true,

      integrityMonitoring: true,

    },

    passed: trustScore >= 70,

  };

}
