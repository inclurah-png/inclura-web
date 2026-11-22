// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Firebase Authentication Middleware
// =======================================================
//
// Verifies the Firebase ID token sent by the client as
// "Authorization: Bearer <token>". This proves the request
// comes from a signed-in Inclura user; it is never used to
// gate or delay an emergency notification.
// =======================================================

import { initializeFirebaseAdmin } from "../config/firebaseAdmin.js";

export function requireFirebaseUser(req, res, next) {
  const header = String(req.headers.authorization || "");
  const match = header.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({
      success: false,
      message: "Missing Firebase authentication token.",
    });
  }

  let app;

  try {
    app = initializeFirebaseAdmin();
  } catch (error) {
    console.error(
      "Firebase Admin is not available for emergency requests:",
      error?.message || error
    );

    return res.status(503).json({
      success: false,
      message:
        "Emergency backend is not ready: Firebase Admin failed to initialize.",
    });
  }

  app
    .auth()
    .verifyIdToken(match[1])
    .then((decoded) => {
      req.user = {
        uid: decoded.uid,
        email: decoded.email || "",
        token: decoded,
      };

      next();
    })
    .catch((error) => {
      console.warn(
        "Rejected emergency request with invalid Firebase token:",
        error?.message || error
      );

      return res.status(401).json({
        success: false,
        message: "Invalid or expired Firebase authentication token.",
      });
    });
}
