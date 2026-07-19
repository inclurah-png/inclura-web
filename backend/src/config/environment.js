// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Environment Configuration
// =======================================================

import dotenv from "dotenv";

dotenv.config();

export function validateEnvironment() {

  const required = [

    "NODE_ENV",

    "PORT",

    "FIREBASE_PROJECT_ID",

    "FIREBASE_CLIENT_EMAIL",

    "FIREBASE_PRIVATE_KEY",

  ];

  const missing = [];

  required.forEach((item) => {

    if (!process.env[item]) {

      missing.push(item);

    }

  });

  if (missing.length) {

    console.error("");

    console.error("====================================");

    console.error(" Missing Environment Variables");

    console.error("====================================");

    missing.forEach((item) => {

      console.error(item);

    });

    console.error("====================================");

    process.exit(1);

  }

}

export const environment = {

  nodeEnv:
    process.env.NODE_ENV,

  port:
    Number(process.env.PORT),

  firebase: {

    projectId:
      process.env.FIREBASE_PROJECT_ID,

    clientEmail:
      process.env.FIREBASE_CLIENT_EMAIL,

    privateKey:
      process.env.FIREBASE_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      ),

  },

};
