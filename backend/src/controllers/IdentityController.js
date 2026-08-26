// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Identity Controller
// =======================================================

import {
  healthService,
  registerPasskeyService,
  authenticationOptionsService,
  verifyAuthenticationService,
  verifyFaceService,
  verifyBiometricService,
  verifyIdentityService,
} from "../services/IdentityService.js";

import {
  verifyPasskeyRegistrationService,
} from "../services/PasskeyVerificationService.js";

// =======================================================
// Health
// =======================================================

export async function health(req, res) {
  try {
    const result = await healthService();

    return res.status(200).json(result);
  } catch (error) {
    console.error("IFSE Identity Health Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// =======================================================
// Passkey Registration
// =======================================================

export async function registerPasskey(req, res) {
  try {
    const result =
      await registerPasskeyService(req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "IFSE Passkey Registration Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// =======================================================
// Verify Passkey Registration
// =======================================================

export async function verifyRegistration(req, res) {
  try {
    const result =
      await verifyPasskeyRegistrationService(
        req.body
      );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "IFSE Passkey Registration Verification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// =======================================================
// Authentication Options
// =======================================================

export async function authenticationOptions(
  req,
  res
) {
  try {
    // IMPORTANT:
    // Pass the frontend request body to the service.
    //
    // Login.jsx sends:
    // {
    //   email: "user@example.com"
    // }
    //
    // IdentityService.js uses that email to resolve
    // the Firebase UID and locate registered passkeys.

    const result =
      await authenticationOptionsService(
        req.body
      );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "IFSE Authentication Options Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// =======================================================
// Verify Authentication
// =======================================================

export async function verifyAuthentication(
  req,
  res
) {
  try {
    const result =
      await verifyAuthenticationService(
        req.body
      );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "IFSE Authentication Verification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// =======================================================
// Face Verification
// =======================================================

export async function verifyFace(req, res) {
  try {
    const result =
      await verifyFaceService(req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "IFSE Face Verification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// =======================================================
// Biometric Verification
// =======================================================

export async function verifyBiometric(
  req,
  res
) {
  try {
    const result =
      await verifyBiometricService(
        req.body
      );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "IFSE Biometric Verification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// =======================================================
// Identity Verification
// =======================================================

export async function verifyIdentity(
  req,
  res
) {
  try {
    const result =
      await verifyIdentityService(
        req.body
      );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "IFSE Identity Verification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
      }
