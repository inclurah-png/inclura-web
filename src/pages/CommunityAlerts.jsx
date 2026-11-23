import { useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInAnonymously, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { getMessaging, getToken, deleteToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCb7YlZynAbMKjPWAwuOH61D4uUeAVtUlU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "inclura-prod-90734.firebaseapp.com",
  projectId: "inclura-prod-90734",
  storageBucket: "inclura-prod-90734.firebasestorage.app",
  messagingSenderId: "694509989399",
  appId: "1:694509989399:web:dda8a2ba4cd25efd4af652",
};

// A separate Firebase app/auth instance is intentional. Guest alert registration
// must never sign a visitor into Inclura's primary authentication session.
const communityApp = getApps().find((item) => item.name === "IncluraCommunityAlerts")
  || initializeApp(firebaseConfig, "IncluraCommunityAlerts");
const communityAuth = getAuth(communityApp);
const communityDb = getFirestore(communityApp);
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || "";

export default function CommunityAlerts() {
  const [area, setArea] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Register this browser to receive emergency alerts for your selected area.");

  async function registerDevice() {
    setBusy(true);
    setStatus("Preparing your browser for community alerts…");
    try {
      const cleanArea = area.trim().replace(/\s+/g, " ");
      if (cleanArea.length < 3 || cleanArea.length > 100) {
        throw new Error("Enter your town or city and state (2–100 characters).");
      }
      if (!consent) throw new Error("Please agree to receive community emergency alerts.");
      if (!VAPID_KEY) throw new Error("Push notification setup is not complete on this site.");
      if (!("Notification" in window) || !("serviceWorker" in navigator)) {
        throw new Error("This browser does not support web push notifications.");
      }
      if (!(await isSupported())) throw new Error("Firebase messaging is not supported by this browser.");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Notification permission was not granted.");

      let guest = communityAuth.currentUser;
      if (!guest) {
        const credential = await signInAnonymously(communityAuth);
        guest = credential.user;
      }

      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      const messaging = getMessaging(communityApp);
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });
      if (!token) throw new Error("Firebase did not issue a notification token.");

      const deviceRef = doc(communityDb, "communityAlertDevices", guest.uid);
      const existingDevice = await getDoc(deviceRef);
      await setDoc(deviceRef, {
        uid: guest.uid,
        token,
        platform: "web",
        enabled: true,
        area: cleanArea,
        areaNormalized: cleanArea.toLocaleLowerCase(),
        localityNormalized: cleanArea.split(",")[0].trim().toLocaleLowerCase(),
        consent: true,
        createdAt: existingDevice.exists() ? existingDevice.data().createdAt : serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setStatus("This browser is registered for community emergency alerts in " + cleanArea + ". Alerts require internet access and enabled browser notifications.");
    } catch (error) {
      console.error("Community alert registration failed:", error);
      setStatus(error?.message || "Registration could not be completed.");
    } finally {
      setBusy(false);
    }
  }

  async function unsubscribe() {
    setBusy(true);
    try {
      const guest = communityAuth.currentUser;
      if (guest) {
        // Remove the server-side subscription before revoking the local token.
        await deleteDoc(doc(communityDb, "communityAlertDevices", guest.uid));
        try {
          if (await isSupported()) await deleteToken(getMessaging(communityApp));
        } catch (tokenError) {
          console.warn("Community push token revocation was not completed:", tokenError?.message || tokenError);
        }
        await signOut(communityAuth);
      }
      setStatus("This browser has been removed from community alert registration.");
    } catch (error) {
      setStatus(error?.message || "We could not remove this browser right now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#061b18", color: "#f8fafc", padding: "32px 16px", fontFamily: "Arial, sans-serif" }}>
      <section style={{ maxWidth: 620, margin: "0 auto", background: "#0d2b26", border: "1px solid #1c5b4d", borderRadius: 18, padding: 24 }}>
        <p style={{ color: "#e8c66a", fontWeight: 700, letterSpacing: 1 }}>INCLURA COMMUNITY SAFETY</p>
        <h1 style={{ marginTop: 8 }}>Community Emergency Alerts</h1>
        <p style={{ color: "#cbd5e1", lineHeight: 1.65 }}>
          Non-members and Inclura members can voluntarily register this browser to receive general emergency alerts for a selected town or city. This does not create an Inclura membership or provide access to private accounts, SOS records, or member information.
        </p>
        <label htmlFor="community-alert-area" style={{ display: "block", marginTop: 22, marginBottom: 8, fontWeight: 700 }}>Your town or city and state</label>
        <input id="community-alert-area" value={area} onChange={(event) => setArea(event.target.value)} maxLength={100} placeholder="Example: Ogbomoso, Oyo State" style={{ width: "100%", boxSizing: "border-box", padding: 13, borderRadius: 10, border: "1px solid #64748b", background: "#fff", color: "#0f172a", fontSize: 16 }} />
        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 18, color: "#e2e8f0", lineHeight: 1.5 }}>
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} style={{ marginTop: 4 }} />
          <span>I voluntarily agree to receive general community emergency notifications for the area entered above. I understand alerts are not guaranteed and I can unsubscribe at any time.</span>
        </label>
        <button type="button" onClick={registerDevice} disabled={busy} style={{ width: "100%", marginTop: 22, padding: 14, border: 0, borderRadius: 10, background: "#d7b65d", color: "#10231f", fontWeight: 800, fontSize: 16, opacity: busy ? 0.7 : 1 }}>
          {busy ? "Registering…" : "Enable Community Alerts"}
        </button>
        <button type="button" onClick={unsubscribe} disabled={busy} style={{ width: "100%", marginTop: 10, padding: 12, border: "1px solid #94a3b8", borderRadius: 10, background: "transparent", color: "#e2e8f0", fontWeight: 700 }}>
          Unsubscribe This Browser
        </button>
        <p role="status" aria-live="polite" style={{ marginTop: 18, color: "#f1d98d", lineHeight: 1.6 }}>{status}</p>
        <p style={{ marginTop: 20, color: "#94a3b8", fontSize: 13, lineHeight: 1.6 }}>
          Privacy: this registration stores a browser notification token and the area you choose. It does not collect GPS coordinates, expose emergency case details, or give this browser permission to send alerts.
        </p>
      </section>
    </main>
  );
}
