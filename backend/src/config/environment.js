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
      "IFSE Identity Health Error:",
      error
    );

    return res
      .status(500)
      .json({

        success: false,

        message:
          error.message ||
          "Identity service health check failed.",

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
      "IFSE Passkey Registration Error:",
      error
    );

    return res
      .status(400)
      .json({

        success: false,

        message:
          error.message ||
          "Passkey registration failed.",

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
      "IFSE Passkey Registration Verification Error:",
      error
    );

    return res
      .status(400)
      .json({

        success: false,

        message:
          error.message ||
          "Passkey registration verification failed.",

      });

  }

}

// =======================================================
// Authentication Options
// =======================================================

export async function authenticationOptions(req, res) {

  try {

    // IMPORTANT:
    // The email/userId MUST be passed to the service.

    const result =
      await authenticationOptionsService(
        req.body
      );

    return res
      .status(200)
      .json(result);

  } catch (error) {

    console.error(
      "IFSE Authentication Options Error:",
      error
    );

    return res
      .status(400)
      .json({

        success: false,

        message:
          error.message ||
          "Could not create passkey authentication options.",

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
      "IFSE Passkey Authentication Verification Error:",
      error
    );

    return res
      .status(400)
      .json({

        success: false,

        authenticated: false,

        message:
          error.message ||
          "Passkey authentication verification failed.",

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
      "IFSE Face Verification Error:",
      error
    );

    return res
      .status(400)
      .json({

        success: false,

        verified: false,

        message:
          error.message ||
          "Face verification failed.",

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
      "IFSE Biometric Verification Error:",
      error
    );

    return res
      .status(400)
      .json({

        success: false,

        verified: false,

        message:
          error.message ||
          "Biometric verification failed.",

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
      "IFSE Identity Verification Error:",
      error
    );

    return res
      .status(400)
      .json({

        success: false,

        verified: false,

        message:
          error.message ||
          "Identity verification failed.",

      });

  }

}
