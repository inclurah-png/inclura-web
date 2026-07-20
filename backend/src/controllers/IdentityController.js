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

  const result = await healthService();

  return res.status(200).json(result);

}

// =======================================================
// Passkey Registration
// =======================================================

export async function registerPasskey(req, res) {

  const result = await registerPasskeyService(req.body);

  return res.status(200).json(result);

}
// =======================================================
// Verify Passkey Registration
// =======================================================

export async function verifyRegistration(req, res) {

  try {

    const result =
      await verifyPasskeyRegistrationService(req.body);

    return res.status(200).json(result);

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

}

// =======================================================
// Authentication Options
// =======================================================

export async function authenticationOptions(req, res) {

  const result = await authenticationOptionsService();

  return res.status(200).json(result);

}

// =======================================================
// Verify Authentication
// =======================================================

export async function verifyAuthentication(req, res) {

  const result = await verifyAuthenticationService(req.body);

  return res.status(200).json(result);

}

// =======================================================
// Face Verification
// =======================================================

export async function verifyFace(req, res) {

  const result = await verifyFaceService(req.body);

  return res.status(200).json(result);

}

// =======================================================
// Biometric Verification
// =======================================================

export async function verifyBiometric(req, res) {

  const result = await verifyBiometricService(req.body);

  return res.status(200).json(result);

}

// =======================================================
// Identity Verification
// =======================================================

export async function verifyIdentity(req, res) {

  const result = await verifyIdentityService(req.body);

  return res.status(200).json(result);

}    
