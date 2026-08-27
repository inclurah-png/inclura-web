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

    const result =
      await healthService();

    return res
      .status(200)
      .json(result);

  } catch (error) {

    console.error(
      "IFSE Identity health error:",
      error
    );

    return res
      .status(500)
      .json({
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
      await registerPasskeyService(
        req.body
      );

    return res
      .status(200)
      .json(result);

  } catch (error) {

    console.error(
      "IFSE passkey registration error:",
      error
    );

    return res
      .status(500)
      .json({
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

    return res
      .status(200)
      .json(result);

  } catch (error) {

    console.error(
      "IFSE passkey registration verification error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,
        message: error.message,
      });

  }

}

// =======================================================
// Authentication Options
// =======================================================

export async function authenticationOptions(req, res) {

  try {

    // IMPORTANT:
    // The email/userId from the frontend MUST be
    // passed into the Identity Service.

    const result =
      await authenticationOptionsService(
        req.body
      );

    return res
      .status(200)
      .json(result);

  } catch (error) {

    console.error(
      "IFSE authentication options error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,
        message: error.message,
      });

  }

}

// =======================================================
// Verify Authentication
// =======================================================

export async function verifyAuthentication(req, res) {

  try {

    const result =
      await verifyAuthenticationService(
        req.body
      );

    return res
      .status(200)
      .json(result);

  } catch (error) {

    console.error(
      "IFSE authentication verification error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,
        authenticated: false,
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
      await verifyFaceService(
        req.body
      );

    return res
      .status(200)
      .json(result);

  } catch (error) {

    console.error(
      "IFSE face verification error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,
        verified: false,
        message: error.message,
      });

  }

}

// =======================================================
// Biometric Verification
// =======================================================

export async function verifyBiometric(req, res) {

  try {

    const result =
      await verifyBiometricService(
        req.body
      );

    return res
      .status(200)
      .json(result);

  } catch (error) {

    console.error(
      "IFSE biometric verification error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,
        verified: false,
        message: error.message,
      });

  }

}

// =======================================================
// Identity Verification
// =======================================================

export async function verifyIdentity(req, res) {

  try {

    const result =
      await verifyIdentityService(
        req.body
      );

    return res
      .status(200)
      .json(result);

  } catch (error) {

    console.error(
      "IFSE identity verification error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,
        verified: false,
        message: error.message,
      });

  }

}
