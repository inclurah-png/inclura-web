import { useState } from "react";
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import app, { auth, db } from "../firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || "";

export default function SOSPushRegistration() {
  const [status, setStatus] = useState("Push alerts are not enabled on this device.");
  const [busy, setBusy] = useState(false);

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
      <p role="status" aria-live="polite" style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>{status}</p>
    </section>
  );
}
