
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

const firebaseConfig = {
  apiKey:
    "AIzaSyCb7YlZynAbMKjPWAwuOH61D4uUeAVtUlU",

  authDomain:
    "inclura-prod-90734.firebaseapp.com",

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

export const storage =
getStorage(app);

export const db =
  getFirestore(app);

export const storage =
  getStorage(app);

export const googleProvider =
  new GoogleAuthProvider();

export default app;
