// =======================================================
// Inclura Fortress Security Engine (IFSE)
// Firebase Admin Initialization
// =======================================================

import admin from "firebase-admin";

import { environment } from "./environment.js";

let firebaseApp = null;

// =======================================================
// Initialize Firebase Admin
// =======================================================

export function initializeFirebaseAdmin() {

  if (firebaseApp) {

    return firebaseApp;

  }

  firebaseApp = admin.initializeApp({

    credential: admin.credential.cert({

      projectId: environment.firebase.projectId,

      clientEmail: environment.firebase.clientEmail,

      privateKey: environment.firebase.privateKey,

    }),

  });

  console.log("");

  console.log("====================================");

  console.log(" Firebase Admin Initialized");

  console.log("====================================");

  return firebaseApp;

}

// =======================================================
// Export Services
// =======================================================

export const firestore = () =>

  initializeFirebaseAdmin().firestore();

export const auth = () =>

  initializeFirebaseAdmin().auth();

export const storage = () =>

  initializeFirebaseAdmin().storage();
