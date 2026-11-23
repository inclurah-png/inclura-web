import { useState } from "react";
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import app, { auth, db } from "../firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || "";

export default function SOSPushRegistration() {
  const [status, setStatus] = useState("Push alerts are not enabled on this device.");
  const [busy, setBusy] = useState(false);
  const [diagnostic, setDiagnostic] = useState("");
  const [checking, setChecking] = useState(false);

  async function checkPushSetup() {
    setChecking(true);
    setDiagnostic("Checking this device…");
    try {
      if (!("serviceWorker" in navigator)) {
        setDiagnostic("Service worker: NOT SUPPORTED by this browser.");
        return;
      }

      const registration = await navigator.serviceWorker.getRegistration("/");
      if (!registration) {
        setDiagnostic("Service worker: NOT REGISTERED.\nFirebase device token: NOT CHECKED.");
        return;
      }

      const workerState = registration.active?.state || "No active worker";
      if (!registration.active || workerState !== "activated") {
        setDiagnostic("Service worker: REGISTERED, but not active yet (" + workerState + ").\nPlease keep this page open and check again.");
        return;
      }

      if (!("Notification" in window)) {
        setDiagnostic("Service worker: ACTIVE.\nNotifications: NOT SUPPORTED.");
        return;
      }

      const permission = Notification.permission;
      if (permission !== "granted") {
        setDiagnostic("Service worker: ACTIVE.\nChrome notification permission: " + permission + ".\nAllow notifications before continuing.");
        return;
      }

      if (!VAPID_KEY) {
        setDiagnostic("Service worker: ACTIVE.\nChrome permission: GRANTED.\nFirebase VAPID key: MISSING.");
        return;
      }

      if (!(await isSupported())) {
        setDiagnostic("Service worker: ACTIVE.\nChrome permission: GRANTED.\nFirebase Messaging: NOT SUPPORTED.");
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        setDiagnostic("Service worker: ACTIVE.\nChrome permission: GRANTED.\nPlease sign in to verify the Inclura account registration.");
        return;
      }

      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (!token) {
        setDiagnostic("Service worker: ACTIVE.\nChrome permission: GRANTED.\nFirebase device token: NOT ISSUED.");
        return;
      }

      const saved = await getDocs(query(
        collection(db, "fcmTokens"),
        where("userId", "==", user.uid),
        where("token", "==", token)
      ));

      setDiagnostic(
        "Service worker: ACTIVE.\n" +
        "Chrome notification permission: GRANTED.\n" +
        "Firebase device token: ISSUED.\n" +
        "Inclura account registration: " + (saved.empty ? "NOT FOUND" : "SAVED") + "."
      );
    } catch (error) {
      console.error("Inclura push setup check failed:", error);
      setDiagnostic("The check encountered an error: " + (error?.message || "Unknown error"));
    } finally {
      setChecking(false);
    }
  }

  async function enablePush() {
    setBusy(true);
    setStatus("Preparing this device for SOS push alerts…");
    try {
      if (!auth.currentUser) throw new Error("Please sign in first.");
      if (!VAPID_KEY) throw new Error("Firebase Web Push public key is not configured in the frontend build.");
      if (!("Notification" in window) || !("serviceWorker" in navigator)) {
        throw new Error("This browser does not support web push notifications.");
      }
      if (!(await isSupported())) throw new Error("Firebase Messaging is not supported by this browser.");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Notification permission was not granted.");
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });
      if (!token) throw new Error("Firebase did not issue a device registration token.");
      await addDoc(collection(db, "fcmTokens"), {
        userId: auth.currentUser.uid,
        token,
        platform: "web",
        enabled: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      onMessage(messaging, (payload) => {
        const title = payload.notification?.title || "Inclura SOS alert";
        const body = payload.notification?.body || "An emergency notification was received.";
        setStatus(`Push notification received: ${title} — ${body}`);
      });
      setStatus("This device is registered for Inclura push notifications. This does not yet register phone-only contacts.");
      await checkPushSetup();
    } catch (error) {
      console.error("SOS push registration failed:", error);
      setStatus(error?.message || "Push registration could not be completed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 20, marginBottom: 20, color: "#fff" }}>
      <h3>🔔 Enable SOS Push Alerts</h3>
      <p style={{ color: "#94a3b8", lineHeight: 1.6 }}>
        Register this signed-in device to receive Inclura push notifications. Allow notifications when your browser asks. Trusted contacts must also have an Inclura account and register their own devices.
      </p>
      <button type="button" onClick={enablePush} disabled={busy} style={{ background: "#0f766e", color: "#fff", border: 0, borderRadius: 10, padding: "12px 16px", fontWeight: 700, opacity: busy ? 0.7 : 1 }}>
        {busy ? "Registering device…" : "Enable Push Notifications on This Device"}
      </button>
      <button type="button" onClick={checkPushSetup} disabled={checking || busy} style={{ display: "block", marginTop: 12, background: "#334155", color: "#fff", border: 0, borderRadius: 10, padding: "12px 16px", fontWeight: 700, opacity: checking ? 0.7 : 1 }}>
        {checking ? "Checking…" : "Check Push Setup"}
      </button>
      {diagnostic ? (
        <pre role="status" aria-live="polite" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", color: "#e2e8f0", background: "#111827", border: "1px solid #334155", borderRadius: 10, padding: 12, marginTop: 14, fontSize: 14, lineHeight: 1.7 }}>
          {diagnostic}
        </pre>
      ) : null}
      <p role="status" aria-live="polite" style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>{status}</p>
    </section>
  );
}
