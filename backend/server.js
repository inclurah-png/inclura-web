// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Identity Backend Server
// Production Foundation
// =======================================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import passkeyRoutes from "./src/routes/passkeyRoutes.js";

import {
  initializeFirebaseAdmin,
} from "./src/config/firebaseAdmin.js";

import {
  validateEnvironment,
  environment,
} from "./src/config/environment.js";

// =======================================================
// Environment
// =======================================================

dotenv.config();

validateEnvironment();

initializeFirebaseAdmin();

// =======================================================
// Express Application
// =======================================================

const app = express();

// =======================================================
// Configuration
// =======================================================

const PORT =
  process.env.PORT || 5000;

// =======================================================
// CORS
// =======================================================

app.use(
  cors({
    origin:
      "https://inclura-web.pages.dev",

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: false,
  })
);

// =======================================================
// JSON Body Parser
// =======================================================
//
// IMPORTANT:
// This allows Express to read JSON sent by Login.jsx.
//
// Without this middleware:
// req.body can be undefined.
//
// That was preventing the email from reaching
// authenticationOptionsService().
//

app.use(
  express.json({
    limit: "1mb",
  })
);

// =======================================================
// URL-Encoded Body Parser
// =======================================================

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

// =======================================================
// OPTIONS / CORS Preflight
// =======================================================

app.options(
  "*",
  cors()
);

// =======================================================
// Health Check
// =======================================================

app.get(
  "/",
  (req, res) => {

    res.status(200).json({

      platform:
        "Inclura",

      service:
        "IFSE Identity Backend",

      version:
        "1.0.0",

      status:
        "Running",

      timestamp:
        new Date().toISOString(),

    });

  }
);

// =======================================================
// API Status
// =======================================================

app.get(
  "/api/status",
  (req, res) => {

    res.status(200).json({

      success:
        true,

      backend:
        "Identity Backend",

      securityEngine:
        "IFSE",

      environment:
        process.env.NODE_ENV ||
        "development",

      uptime:
        process.uptime(),

      timestamp:
        new Date().toISOString(),

    });

  }
);

// =======================================================
// IFSE Identity Routes
// =======================================================

app.use(
  "/api/identity",
  passkeyRoutes
);

// =======================================================
// 404 Handler
// =======================================================

app.use(
  (req, res) => {

    res.status(404).json({

      success:
        false,

      message:
        "Endpoint not found.",

    });

  }
);

// =======================================================
// Global Error Handler
// =======================================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {

    console.error(
      "IFSE Backend Error:",
      error
    );

    res.status(500).json({

      success:
        false,

      message:
        "Internal server error.",

    });

  }
);

// =======================================================
// Start Server
// =======================================================

app.listen(
  PORT,
  () => {

    console.log("");

    console.log(
      "===================================="
    );

    console.log(
      " Inclura IFSE Identity Backend"
    );

    console.log(
      "===================================="
    );

    console.log(
      ` Server Running : ${PORT}`
    );

    console.log(
      ` Environment : ${
        process.env.NODE_ENV ||
        "development"
      }`
    );

    console.log(
      " JSON Body Parser : Enabled"
    );

    console.log(
      "===================================="
    );

  }
);
