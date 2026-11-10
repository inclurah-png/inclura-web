import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  getFirestore,
} from "firebase/firestore";
import {
  getStorage,
} from "firebase/storage";

// Only authDomain varies by environment: it is the origin Firebase serves
// /__/auth/* from, and it is what email links and the Google popup use.
// Override it in Cloudflare Pages variables (VITE_FIREBASE_AUTH_DOMAIN) once
// that origin is an authorized domain and its handler is registered as a
// Google redirect URI; otherwise the default keeps Google sign-in working.
const AUTH_DOMAIN =
  import.meta.env
    .VITE_FIREBASE_AUTH_DOMAIN ||
  "inclura-prod-90734.firebaseapp.com";

const firebaseConfig = {
  apiKey: "AIzaSyCb7YlZynAbMKjPWAwuOH61D4uUeAVtUlU",
  authDomain: AUTH_DOMAIN,
  projectId:
    "inclura-prod-90734",
  storageBucket:
    "inclura-prod-90734.firebasestorage.app",
  messagingSenderId:
    "694509989399",
  appId:
    "1:694509989399:web:dda8a2ba4cd25efd4af652",
};

const app =
  initializeApp(firebaseConfig);

export const auth =
  getAuth(app);

export const db =
  getFirestore(app);

export const storage =
  getStorage(app);

export const googleProvider =
  new GoogleAuthProvider();

export default app;
