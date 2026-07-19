// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Environment Configuration
// =======================================================

import dotenv from "dotenv";

dotenv.config();

// =======================================================
// Required Environment Variables
// =======================================================

const REQUIRED_VARIABLES = [

  "NODE_ENV",

  "PORT",

  "FIREBASE_PROJECT_ID",

  "FIREBASE_CLIENT_EMAIL",

  "FIREBASE_PRIVATE_KEY",

  "WEBAUTHN_RP_NAME",

  "WEBAUTHN_RP_ID",

  "WEBAUTHN_ORIGIN",

  "JWT_SECRET",

  "SESSION_SECRET",

  "ENCRYPTION_SECRET",

];

// =======================================================
// Validate Environment
// =======================================================

export function validateEnvironment() {

  const missing = [];

  REQUIRED_VARIABLES.forEach((variable) => {

    if (!process.env[variable]) {

      missing.push(variable);

    }

  });

  if (missing.length > 0) {

    console.error("");

    console.error("====================================");

    console.error(" Missing Environment Variables");

    console.error("====================================");

    missing.forEach((item) => {

      console.error(`- ${item}`);

    });

    console.error("====================================");

    process.exit(1);

  }

}

// =======================================================
// Environment Configuration
// =======================================================

export const environment = {

  nodeEnv: process.env.NODE_ENV,

  port: Number(process.env.PORT),

  firebase: {

    projectId: process.env.FIREBASE_PROJECT_ID,

    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,

    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),

  },

  webAuthn: {

    rpName: process.env.WEBAUTHN_RP_NAME,

    rpId: process.env.WEBAUTHN_RP_ID,

    origin: process.env.WEBAUTHN_ORIGIN,

  },

  security: {

    jwtSecret: process.env.JWT_SECRET,

    sessionSecret: process.env.SESSION_SECRET,

    encryptionSecret: process.env.ENCRYPTION_SECRET,

  },

  logLevel: process.env.LOG_LEVEL || "info",

  renderUrl: process.env.RENDER_EXTERNAL_URL || "",

};
