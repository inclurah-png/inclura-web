// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Passkey Controller
// =======================================================

import {
  registerPasskeyService,
} from "../services/IdentityService.js";

import {
  verifyPasskeyRegistrationService,
} from "../services/PasskeyVerificationService.js";

export async function registerPasskey(req, res) {

  try {

    const result = await registerPasskeyService(req.body);

    res.status(200).json(result);

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

}

export async function verifyPasskeyRegistration(req, res) {

  try {

    const result =
      await verifyPasskeyRegistrationService(req.body);

    res.status(200).json(result);

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

}
