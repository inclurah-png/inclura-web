import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import app, { db } from "../firebase";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || "";

export async function enableIncluraPush(user) {
  if (!user?.uid) throw new Error("Sign in before enabling device notifications.");
  if (!VAPID_PUBLIC_KEY) throw new Error("Firebase Web Push public key is not configured.");
  if (!(await isSupported())) throw new Error("Push notifications are not supported by this browser.");
  if (!("Notification" in window)) throw new Error("This browser does not support notifications.");

  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Notification permission was not granted.");

  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  const messaging = getMessaging(app);
  const token = await getToken(messaging, {
    vapidKey: VAPID_PUBLIC_KEY,
    serviceWorkerRegistration: registration,
  });
  if (!token) throw new Error("Firebase did not issue a device notification token.");

  const tokenQuery = query(
    collection(db, "fcmTokens"),
    where("userId", "==", user.uid),
    where("token", "==", token)
  );
  const existing = await getDocs(tokenQuery);
  const record = {
    userId: user.uid,
    token,
    enabled: true,
    platform: "web",
    userAgent: navigator.userAgent.slice(0, 300),
    updatedAt: serverTimestamp(),
  };

  if (existing.empty) {
    await addDoc(collection(db, "fcmTokens"), {
      ...record,
      createdAt: serverTimestamp(),
    });
  } else {
    await Promise.all(existing.docs.map((item) => updateDoc(item.ref, record)));
  }

  return { token, permission };
}

export async function listenForIncluraPush(callback) {
  if (!callback || !(await isSupported())) return () => {};
  return onMessage(getMessaging(app), callback);
}
