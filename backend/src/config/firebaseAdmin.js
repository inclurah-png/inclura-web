// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Firebase Admin Configuration
// =======================================================

import admin from "firebase-admin";

import { environment } from "./environment.js";

let app = null;

export function initializeFirebaseAdmin() {

  if (app) {

    return app;

  }

  app = admin.initializeApp({

    credential: admin.credential.cert({

      projectId:
        environment.firebase.projectId,

      clientEmail:
        environment.firebase.clientEmail,

      privateKey:
        environment.firebase.privateKey,

    }),

  });

  console.log("");

  console.log("====================================");

  console.log(" Firebase Admin Connected");

  console.log("====================================");

  return app;

}

export function firestore() {

  return initializeFirebaseAdmin().firestore();

}

export function auth() {

  return initializeFirebaseAdmin().auth();

}

export function storage() {

  return initializeFirebaseAdmin().storage();

}
