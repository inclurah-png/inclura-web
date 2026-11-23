

import {
  useEffect,
  useState,
} from "react";

import {
  collection,
  addDoc,
  doc,
  getCountFromServer,
  query,
  where,
  serverTimestamp,
  getDoc,
  setDoc,
} from "firebase/firestore";

import {
  db,
  auth,
} from "../firebase";

import DashboardLayout from "../components/DashboardLayout";
import SOSPushRegistration from "../components/SOSPushRegistration";
import SOSHistory from "../pages/SOSHistory";
import TrustedContacts from "./TrustedContacts";
import ShareLiveLocation from "./ShareLiveLocation";
import EmergencyResponders from "./EmergencyResponders";
import CommunityAssistance from "./CommunityAssistance";
import IFSEEmergencyMonitoring from "./IFSEEmergencyMonitoring";
import EmergencyAnalytics from "./EmergencyAnalytics";

const SOS_BACKEND_URL = (import.meta.env.VITE_AI_BACKEND_URL || "https://inclura-ai-backend.onrender.com").replace(/\/+$/, "");
const SOS_NOTIFICATION_BACKEND_URL = (import.meta.env.VITE_SOS_NOTIFICATION_BACKEND_URL || "https://inclura-ifse-backend.onrender.com").replace(/\/+$/, "");


function SOS() {

  const [sosForm, setSosForm] = useState({

  emergencyType:
    "Medical",

  priority:
    "Low",

  description:
    "",

  location:
    "",

  latitude:
    "",

  longitude:
    "",

  accuracy:
    "",
  responderNotes:
    "",

});

// GPS is captured only when the member explicitly presses the GPS button.
  const [sosStats, setSosStats] = useState({
    open: 0,
    resolved: 0,
    highPriority: 0,
    medical: 0,
    fire: 0,
    police: 0,
    responders: 0,
  });

  const [locationReadiness, setLocationReadiness] = useState("Checking readiness…");
  const [isPreparingLocation, setIsPreparingLocation] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadLocationReadiness() {
      const user = auth.currentUser;
      if (!user) {
        if (active) setLocationReadiness("Sign in to prepare emergency location.");
        return;
      }
      try {
        const saved = await getDoc(doc(db, "sosReadiness", user.uid));
        let permission = "unknown";
        if (navigator.permissions?.query) {
          try {
            permission = (await navigator.permissions.query({ name: "geolocation" })).state;
          } catch (_) {}
        }
        if (!active) return;
        if (permission === "granted") {
          setLocationReadiness("Location permission is already allowed on this device. Complete a test fix below to verify GPS.");
        } else if (permission === "denied") {
          setLocationReadiness("Location is blocked by your browser/device. Change this in Android site permissions, then run the readiness check again.");
        } else if (saved.exists() && saved.data().locationVerified === true) {
          setLocationReadiness("A previous readiness check was completed. Browser permission may have changed; verify again before relying on SOS.");
        } else {
          setLocationReadiness("Not prepared yet. Enable location now, during normal use—not during an emergency.");
        }
      } catch (error) {
        console.error("SOS readiness load failed:", error);
        if (active) setLocationReadiness("Readiness status could not be checked. You can still send an SOS.");
      }
    }
    loadLocationReadiness();
    return () => { active = false; };
  }, []);

  async function prepareEmergencyLocation() {
    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in before preparing emergency location.");
      return;
    }
    if (!navigator.geolocation) {
      setLocationReadiness("This browser does not provide GPS location. SOS can still be sent with a written location.");
      return;
    }
    setIsPreparingLocation(true);
    setLocationReadiness("Requesting location permission and checking GPS…");
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        await setDoc(doc(db, "sosReadiness", user.uid), {
          userId: user.uid,
          locationVerified: true,
          locationPermission: "granted",
          verifiedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        setSosForm(previous => ({
          ...previous,
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
          accuracy: String(position.coords.accuracy)
        }));
        setLocationReadiness("READY: location permission is granted and GPS was verified. The coordinates shown are a readiness test, not a live tracking guarantee. Refresh this check when you change device or browser settings.");
      } catch (error) {
        console.error("SOS readiness save failed:", error);
        setLocationReadiness("GPS works, but readiness could not be saved. SOS remains available.");
      } finally {
        setIsPreparingLocation(false);
      }
    }, async (error) => {
      const denied = error.code === 1;
      setLocationReadiness(denied
        ? "Location permission was denied. Enable location for this site in Android/browser settings, then try again. SOS will still work with a written location."
        : "GPS could not obtain a fix. Check device location settings and try again. SOS will still work with a written location.");
      try {
        await setDoc(doc(db, "sosReadiness", user.uid), {
          userId: user.uid,
          locationVerified: false,
          locationPermission: denied ? "denied" : "unavailable",
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (saveError) {
        console.error("SOS readiness status save failed:", saveError);
      } finally {
        setIsPreparingLocation(false);
      }
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
  }

  const [isSubmittingSOS, setIsSubmittingSOS] =
  useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [isTestingNotifications, setIsTestingNotifications] = useState(false);
  const [notificationTestResult, setNotificationTestResult] = useState("");

  async function runSOSNotificationTest() {
    if (isTestingNotifications) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setNotificationTestResult("Please sign in to run the notification test.");
      return;
    }

    const confirmed = window.confirm(
      "Send a clearly labelled TEST push notification to this signed-in device only? No SMS, email, or real SOS will be sent."
    );
    if (!confirmed) return;

    setIsTestingNotifications(true);
    setNotificationTestResult("Sending a test push notification to this device…");

    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch(
        SOS_NOTIFICATION_BACKEND_URL + "/api/emergency/notification-test",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + idToken
          },
          body: JSON.stringify({ dryRun: false, channel: "push" })
        }
      );

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success !== true) {
        const detail = result.message || result.status || "The test request failed.";
        const attempts = Array.isArray(result.attempts)
          ? result.attempts.map((item) =>
              `${item.channel || "channel"} to ${item.to || "recipient"}: ${item.error || item.outcome || "not accepted"}`
            ).join("\n")
          : "";
        throw new Error(attempts ? detail + "\n" + attempts : detail);
      }

      const report = (result.attempts || []).map((item) =>
        `${item.channel.toUpperCase()} to ${item.to}: ${item.providerAccepted ? "ACCEPTED BY PROVIDER" : "NOT ACCEPTED"}${item.error ? " — " + item.error : ""}`
      ).join("\n");

      setNotificationTestResult(
        (report || "The endpoint returned success, but no attempt details were provided.") +
        "\n\nProvider acceptance is not proof of delivery. Check the test phone and inbox."
      );
    } catch (error) {
      console.error("SOS notification test failed:", error);
      setNotificationTestResult(error?.message || "SOS notification test failed.");
    } finally {
      setIsTestingNotifications(false);
    }
  }


  // ============================================================
  // LOAD SOS DASHBOARD STATISTICS
  // ============================================================

  useEffect(() => {

    async function loadSOSStats() {

      try {

        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.warn("SOS statistics skipped because no authenticated user is available yet.");
          return;
        }

        const openSnap =
          await getCountFromServer(
            query(
              collection(
                db,
                "emergencySOS"
              ),
              where(
                "status",
                "==",
                "open"
              ),
              where(
                "userId",
                "==",
                currentUser.uid
              )
            )
          );


        const resolvedSnap =
          await getCountFromServer(
            query(
              collection(
                db,
                "emergencySOS"
              ),
              where(
                "status",
                "==",
                "resolved"
              ),
              where(
                "userId",
                "==",
                currentUser.uid
              )
            )
          );


        const highSnap =
          await getCountFromServer(
            query(
              collection(
                db,
                "emergencySOS"
              ),
              where(
                "priority",
                "==",
                "High"
              ),
              where(
                "userId",
                "==",
                currentUser.uid
              )
            )
          );


        const medicalSnap =
          await getCountFromServer(
            query(
              collection(
                db,
                "emergencySOS"
              ),
              where(
                "emergencyType",
                "==",
                "Medical"
              ),
              where(
                "userId",
                "==",
                currentUser.uid
              )
            )
          );


        const fireSnap =
          await getCountFromServer(
            query(
              collection(
                db,
                "emergencySOS"
              ),
              where(
                "emergencyType",
                "==",
                "Fire"
              ),
              where(
                "userId",
                "==",
                currentUser.uid
              )
            )
          );


        const policeSnap =
          await getCountFromServer(
            query(
              collection(
                db,
                "emergencySOS"
              ),
              where(
                "emergencyType",
                "==",
                "Police"
              ),
              where(
                "userId",
                "==",
                currentUser.uid
              )
            )
          );


        // The private users collection cannot be counted across all members
        // from a standard member session. Keep this metric neutral here.
        const responderCount = 0;


        setSosStats({

          open:
            openSnap
              .data()
              .count,

          resolved:
            resolvedSnap
              .data()
              .count,

          highPriority:
            highSnap
              .data()
              .count,

          medical:
            medicalSnap
              .data()
              .count,

          fire:
            fireSnap
              .data()
              .count,

          police:
            policeSnap
              .data()
              .count,

          responders:
            responderCount,

        });

      } catch (err) {

        console.error(
          "SOS Statistics Error:",
          err
        );

      }

    }


    loadSOSStats();

  }, []);


  // ============================================================
  // GET CURRENT GPS LOCATION
  // ============================================================

  function captureCurrentLocation() {

    if (
      typeof navigator ===
      "undefined" ||
      !navigator.geolocation
    ) {

      alert(
        "Geolocation is not available on this device."
      );

      return;

    }


    navigator.geolocation.getCurrentPosition(

      (position) => {

        setSosForm(
          (previous) => ({
            ...previous,

            latitude:
              String(
                position.coords.latitude
              ),

            longitude:
              String(
                position.coords.longitude
              ),

            accuracy:
              String(
                position.coords.accuracy
              ),

          })
        );

      },

      (error) => {

        console.error(
          "GPS Location Error:",
          error
        );

        alert(
          "Unable to obtain your current GPS location. Please check location permission."
        );

      },

      {
        enableHighAccuracy:
          true,

        timeout:
          15000,

        maximumAge:
          0,
      }

    );

  }


  // ============================================================
  // SUBMIT EMERGENCY SOS
  // ============================================================

   async function submitEmergencySOS() {

    if (isSubmittingSOS) {
      return;
    }

    setIsSubmittingSOS(true);

    try {

      const currentUser =
        auth.currentUser;

      if (!currentUser) {

        throw new Error(
          "You must be logged in to send an emergency SOS."
        );

      }

      // ============================================================
      // STEP 0 — FAST GPS LOOKUP WITHOUT A CRISIS-TIME PERMISSION PROMPT
      // ============================================================

      let emergencyLocation = {
        latitude: sosForm.latitude || "",
        longitude: sosForm.longitude || "",
        accuracy: sosForm.accuracy || "",
        locationSource: sosForm.latitude && sosForm.longitude ? "previously_verified_or_manual_gps" : "unavailable",
        locationCapturedAt: null,
      };

      // Only request a fresh fix when permission is already granted.
      // Never trigger a first-time permission prompt during SOS.
      try {
        let permissionState = "unknown";
        if (navigator.permissions?.query) {
          try {
            permissionState = (await navigator.permissions.query({ name: "geolocation" })).state;
          } catch (_) {}
        }
        if (navigator.geolocation && permissionState === "granted") {
          const freshFix = await new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (position) => resolve({ ok: true, position }),
              () => resolve({ ok: false }),
              { enableHighAccuracy: true, timeout: 2500, maximumAge: 60000 }
            );
          });
          if (freshFix.ok) {
            emergencyLocation = {
              latitude: String(freshFix.position.coords.latitude),
              longitude: String(freshFix.position.coords.longitude),
              accuracy: String(freshFix.position.coords.accuracy),
              locationSource: "gps_permission_previously_granted",
              locationCapturedAt: new Date().toISOString(),
            };
          }
        }
      } catch (locationError) {
        console.warn("SOS proceeding without a fresh GPS fix:", locationError);
      }

      // ============================================================
      // STEP 1 — CREATE EMERGENCY SOS RECORD
      // ============================================================

      const emergencyRef =
        await addDoc(
          collection(
            db,
            "emergencySOS"
          ),
          {

            systemPlaceholder:
              false,

            userId:
              currentUser.uid,

            userName:
              currentUser.displayName ||
              "",


            userPhoto:
              currentUser.photoURL ||
              "",

            emergencyType:
              sosForm.emergencyType,

            priority:
              sosForm.priority,

            description:
              sosForm.description,

            location:
              sosForm.location,

            latitude: emergencyLocation.latitude,
            longitude: emergencyLocation.longitude,
            accuracy: emergencyLocation.accuracy,
            locationSource: emergencyLocation.locationSource,
            locationCapturedAt: emergencyLocation.locationCapturedAt,
            gpsLatitude: Number(emergencyLocation.latitude) || 0,
            gpsLongitude: Number(emergencyLocation.longitude) || 0,
            responderNotes:
              sosForm.responderNotes ||
              "",

            status:
              "open",

            handledBy:
              "",

            resolved:
              false,

            assignedResponder:
              "",

            assignedResponderId:
              "",

            assignedAgency:
              "",

            assignedAgencyCode:
              "",

            assignedAgencyType:
              "",

            incidentStatus:
              "Active",

            incidentNumber:
              Date.now().toString(),

            assignedStation:
              "",

            assignedVehicle:
              "",

            estimatedArrival:
              "",

            responseStatus:
              "Awaiting Response",

            assignmentStatus:
              "Pending",

            ifseThreatScore:
              0,

            ifseClassification:
              "Pending",

            resolvedBy:
              "",

            resolutionNotes:
              "",

            closedAt:
              null,

            createdAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp(),

            lastUpdated:
              serverTimestamp(),

          }
        );

      const emergencyId =
        emergencyRef.id;

      console.log(
        "IFSE SOS Record Created:",
        emergencyId
      );


      // ============================================================
      // STEP 2 — BUILD COMPLETE IFSE EMERGENCY DATA
      // ============================================================

      const emergencyData = {

        id:
          emergencyId,

        userId:
          currentUser.uid,

        userName:
          currentUser.displayName ||
          "",


        userPhoto:
          currentUser.photoURL ||
          "",

        emergencyType:
          sosForm.emergencyType,

        priority:
          sosForm.priority,

        description:
          sosForm.description,

        location:
          sosForm.location,

        latitude: emergencyLocation.latitude,
        longitude: emergencyLocation.longitude,
        accuracy: emergencyLocation.accuracy,
        locationSource: emergencyLocation.locationSource,
        locationCapturedAt: emergencyLocation.locationCapturedAt,
        gpsLatitude: Number(emergencyLocation.latitude) || 0,
        gpsLongitude: Number(emergencyLocation.longitude) || 0,
        responderNotes:
          sosForm.responderNotes ||
          "",

        emergencyService:
          sosForm.emergencyType,

        healthcareRouting:
          sosForm.emergencyType ===
          "Medical"
            ? "medical"
            : "not_applicable",

      };


      // ============================================================
      // STEP 3 — AUTHORITATIVE IFSE DISPATCH
      // ============================================================
      // Dispatch is performed server-side because Firestore protects
      // responder assignments and emergency status from client writes.

      let dispatchResult = null;

      try {
        const signedInUser = auth.currentUser;

        if (!signedInUser) {
          throw new Error("Your Inclura session has expired. Please sign in again.");
        }

        const idToken = await signedInUser.getIdToken();

        const dispatchResponse = await fetch(
          SOS_BACKEND_URL + "/api/ifse-dispatch/" + encodeURIComponent(emergencyId) + "/dispatch",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + idToken
            }
          }
        );

        dispatchResult = await dispatchResponse.json().catch(() => ({}));

        if (!dispatchResponse.ok || dispatchResult.success !== true) {
          console.error("IFSE server dispatch failed:", dispatchResult);
          dispatchResult = {
            ...(dispatchResult || {}),
            success: false,
            message: dispatchResult.detail || dispatchResult.message || "The dispatch service did not provide a failure reason. No responder assignment is confirmed."
          };
        }
      } catch (dispatchError) {
        console.error("IFSE server dispatch request failed:", dispatchError);
        dispatchResult = {
          success: false,
          message: "The dispatch service could not be reached. No responder assignment is confirmed."
        };
      }


      // ============================================================
      // STEP 3B — SEND SMS TO ACTIVE TRUSTED CONTACTS
      // ============================================================
      let trustedSmsResult = null;
      try {
        const signedInUser = auth.currentUser;
        if (signedInUser) {
          const idToken = await signedInUser.getIdToken();
          const smsResponse = await fetch(
            SOS_NOTIFICATION_BACKEND_URL + "/api/sos-notifications/" + encodeURIComponent(emergencyId) + "/send",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + idToken
              }
            }
          );
          trustedSmsResult = await smsResponse.json().catch(() => ({}));
          if (!smsResponse.ok) {
            console.warn("Trusted-contact SMS was not processed:", trustedSmsResult.message || smsResponse.status);
          }
        }
      } catch (smsError) {
        console.error("Trusted-contact SMS request failed:", smsError);
      }

      // ============================================================
      // STEP 4 — ESCALATION INFORMATION
      // ============================================================

      const escalationResult = {

        success:
          Boolean(
            dispatchResult?.escalationId
          ),

        escalationId:
          dispatchResult?.escalationId ||
          "",

      };

      console.log(
        "IFSE Escalation Result:",
        escalationResult
      );


      // ============================================================
      // STEP 5 — SUCCESS
      // ============================================================

      alert(
        "Your SOS request has been recorded.\n\n" +
        "Emergency ID: " + emergencyId + "\n" +
        (dispatchResult?.success === true
          ? "IFSE assignment created for: " + (dispatchResult.responderName || "Responder pending") + " (" + (dispatchResult.agency || "Agency not specified") + "). Acceptance and arrival are not yet confirmed.\n"
          : "Responder dispatch is NOT confirmed: " + (dispatchResult?.message || "No eligible responder is currently available.") + "\n") +
        (trustedSmsResult ? "Trusted-contact SMS accepted: " + (trustedSmsResult.sent || 0) + "; failed: " + (trustedSmsResult.failed || 0) + ". Acceptance is not delivery confirmation.\n" : "Trusted-contact SMS status could not be confirmed.\n") +
        "\nIf anyone is in immediate danger, contact local emergency services directly now."
      );


      // ============================================================
      // STEP 6 — RESET FORM
      // ============================================================

      setSosForm({

        emergencyType:
          "Medical",

        priority:
          "Low",

        description:
          "",

        location:
          "",

        latitude:
          "",

        longitude:
          "",

        accuracy:
          "",
        responderNotes:
          "",

      });


      // ============================================================
      // STEP 7 — REFRESH SOS DASHBOARD WITHOUT RELOADING THE PAGE
      // ============================================================
      // A full browser reload here can destroy the active React/Firebase
      // session state and produce a generic "This page needs attention"
      // error on some Android WebView/browser sessions. Keep the SOS page
      // alive and refresh only the local counters instead.
      setSosStats(previous => ({
        ...previous,
        open: Number(previous.open || 0) + 1
      }));


    } catch (err) {

      console.error(
        "SOS Error:",
        err
      );

      alert(
        err?.message ||
        "Unable to submit emergency SOS."
      );

    } finally {

      setIsSubmittingSOS(
        false
      );

    }

  }     
      
return (
 <DashboardLayout>

<div style={page}>

  <h1>🚨 SOS Emergency</h1>

  <p style={introText}>
    Use this emergency service to request authorized assistance
    through the Inclura Fortress Security Engine (IFSE).
  </p>

  <SOSPushRegistration />

  <div style={card}>
    <h3>🛡 SOS Emergency Readiness — Prepare Before Danger</h3>
    <p style={helpText}>
      Allow location access now, during normal use. Inclura will not ask you to grant
      permission for the first time while you are trying to send an SOS. This check
      verifies permission and a GPS fix; it does not provide continuous background tracking.
    </p>
    <p role="status" aria-live="polite" style={gpsText}>{locationReadiness}</p>
    <button type="button" onClick={prepareEmergencyLocation}
      style={locationButton} disabled={isPreparingLocation || isSubmittingSOS}>
      {isPreparingLocation ? "Checking GPS…" : "Enable & Verify Emergency Location"}
    </button>
    <p style={securityNotice}>
      If GPS is unavailable or permission is denied, you can still submit an SOS using
      the written location. A web app cannot guarantee GPS tracking while closed or
      restricted by Android background settings.
    </p>
  </div>


  {/* ============================================================
      SOS DASHBOARD SUMMARY
  ============================================================ */}

  <div style={dashboardGrid}>

    <div style={summaryCard}>
      <h3>🚨 Open SOS Cases</h3>
      <h2>{sosStats.open}</h2>
      <p>Awaiting Response</p>
    </div>


    <div style={summaryCard}>
      <h3>⚠ High Priority</h3>
      <h2>{sosStats.highPriority}</h2>
      <p>High Priority Emergencies</p>
    </div>


    <div style={summaryCard}>
      <h3>🚑 Medical Emergencies</h3>
      <h2>{sosStats.medical}</h2>
      <p>Medical Cases</p>
    </div>


    <div style={summaryCard}>
      <h3>🚒 Fire Emergencies</h3>
      <h2>{sosStats.fire}</h2>
      <p>Fire Incidents</p>
    </div>


    <div style={summaryCard}>
      <h3>🚓 Police Emergencies</h3>
      <h2>{sosStats.police}</h2>
      <p>Police Cases</p>
    </div>


    <div style={summaryCard}>
      <h3>👨‍🚒 Active Responders</h3>
      <h2>{sosStats.responders}</h2>
      <p>Registered Responders</p>
    </div>


    <div style={summaryCard}>
      <h3>✅ Resolved Cases</h3>
      <h2>{sosStats.resolved}</h2>
      <p>Successfully Closed</p>
    </div>

  </div>


  {/* ============================================================
      SAFE SOS NOTIFICATION TEST
  ============================================================ */}

  <div style={card}>
    <h3>🧪 Test SOS Push Notification</h3>
    <p style={helpText}>
      Sends a clearly labelled test push notification only to this signed-in device
      after push notifications have been enabled. No SMS, email, real emergency,
      responder contact, or real emergency recipient list is used.
    </p>
    <button
      type="button"
      onClick={runSOSNotificationTest}
      disabled={isTestingNotifications || isSubmittingSOS}
      style={{
        ...locationButton,
        background: isTestingNotifications ? "#475569" : "#0f766e",
        opacity: isTestingNotifications ? 0.75 : 1
      }}
    >
      {isTestingNotifications ? "Sending test push…" : "Send Test Push Notification"}
    </button>
    {notificationTestResult ? (
      <pre
        role="status"
        aria-live="polite"
        style={{
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
          color: "#e2e8f0",
          background: "#111827",
          border: "1px solid #334155",
          borderRadius: "10px",
          padding: "12px",
          marginTop: "14px",
          fontSize: "13px"
        }}
      >
        {notificationTestResult}
      </pre>
    ) : null}
    <p style={securityNotice}>
      Firebase acceptance does not guarantee that the notification appeared on the device.
    </p>
  </div>

  {/* ============================================================
      EMERGENCY ACTIONS
  ============================================================ */}

  <h2 style={sectionTitle}>
    Emergency Actions
  </h2>


  <div style={card}>

    <h3>
      🚨 Emergency SOS
    </h3>


    <p style={helpText}>
      Provide the emergency details below. IFSE will resolve the
      authoritative response rule and route the emergency through
      the registered response agency system.
    </p>


    {/* ==========================================================
        EMERGENCY TYPE
    ========================================================== */}

    <label style={label}>
      Emergency Type
    </label>


    <select
      value={sosForm.emergencyType}
      onChange={(e) =>
        setSosForm({
          ...sosForm,
          emergencyType:
            e.target.value,
        })
      }
      style={input}
      disabled={isSubmittingSOS}
    >

      <option value="Medical">
        Medical
      </option>

      <option value="Fire">
        Fire
      </option>

      <option value="Police">
        Police
      </option>

      <option value="Kidnapping">
        Kidnapping
      </option>

      <option value="Accident">
        Accident
      </option>

      <option value="Disaster">
        Disaster
      </option>

      <option value="Security Threat">
        Security Threat
      </option>

      <option value="Missing Person">
        Missing Person
      </option>

    </select>


    {/* ==========================================================
        PRIORITY
    ========================================================== */}

    <label style={label}>
      Priority
    </label>


    <select
      value={sosForm.priority}
      onChange={(e) =>
        setSosForm({
          ...sosForm,
          priority:
            e.target.value,
        })
      }
      style={input}
      disabled={isSubmittingSOS}
    >

      <option value="Low">
        Low
      </option>

      <option value="Medium">
        Medium
      </option>

      <option value="High">
        High
      </option>

      <option value="Critical">
        Critical
      </option>

    </select>


    {/* ==========================================================
        DESCRIPTION
    ========================================================== */}

    <label style={label}>
      Emergency Description
    </label>


    <textarea
      rows={5}
      placeholder="Describe what is happening..."
      value={sosForm.description}
      onChange={(e) =>
        setSosForm({
          ...sosForm,
          description:
            e.target.value,
        })
      }
      style={input}
      disabled={isSubmittingSOS}
    />


    {/* ==========================================================
        LOCATION
    ========================================================== */}

    <label style={label}>
      Location
    </label>


    <input
      type="text"
      placeholder="Enter your current location"
      value={sosForm.location}
      onChange={(e) =>
        setSosForm({
          ...sosForm,
          location:
            e.target.value,
        })
      }
      style={input}
      disabled={isSubmittingSOS}
    />


    {/* ==========================================================
        GPS LOCATION
    ========================================================== */}

    <div style={gpsBox}>

      <div>

        <strong>
          📍 GPS Emergency Location
        </strong>

        <p style={gpsText}>

          Latitude:{" "}
          {sosForm.latitude ||
            "Not captured"}

          <br />

          Longitude:{" "}
          {sosForm.longitude ||
            "Not captured"}

          <br />

          Accuracy:{" "}
          {sosForm.accuracy
            ? `${sosForm.accuracy} meters`
            : "Not available"}

        </p>

      </div>


      <button
        type="button"
        onClick={
          captureCurrentLocation
        }
        style={locationButton}
        disabled={isSubmittingSOS}
      >

        📍 Capture Current GPS

      </button>

    </div>


    <p style={helpText}>
      SOS alerts are sent to your saved active Trusted Contacts below. Manage that list in the Trusted Contacts section; do not enter a separate recipient here.
    </p>


    {/* ==========================================================
        RESPONDER NOTES
    ========================================================== */}

    <label style={label}>
      Additional Responder Notes
    </label>


    <textarea
      rows={3}
      placeholder="Any additional information responders should know..."
      value={sosForm.responderNotes}
      onChange={(e) =>
        setSosForm({
          ...sosForm,
          responderNotes:
            e.target.value,
        })
      }
      style={input}
      disabled={isSubmittingSOS}
    />


    {/* ==========================================================
        SOS SUBMISSION
    ========================================================== */}

    <button
      type="button"
      onClick={
        submitEmergencySOS
      }
      style={
        isSubmittingSOS
          ? disabledDangerButton
          : dangerButton
      }
      disabled={
        isSubmittingSOS
      }
    >

      {isSubmittingSOS
        ? "🛡 IFSE Processing Emergency..."
        : "🚨 Send Emergency SOS"}

    </button>


    <p style={securityNotice}>
      🛡 Your SOS is processed through the IFSE emergency
      dispatch workflow. Do not submit false emergency reports.
    </p>

  </div>


  {/* ============================================================
      LIVE LOCATION
  ============================================================ */}

  <div style={card}>

    <h3>
      📍 Share Live Location
    </h3>

    <ShareLiveLocation />

  </div>


  {/* ============================================================
      TRUSTED CONTACTS
  ============================================================ */}

  <div style={card}>

    <h3>
      👨‍👩‍👧 Trusted Contacts
    </h3>

    <TrustedContacts />

  </div>


  {/* ============================================================
      COMMUNITY ASSISTANCE
  ============================================================ */}

  <div style={card}>

    <h3>
      🤝 Community Assistance
    </h3>

    <CommunityAssistance />

  </div>


  {/* ============================================================
      EMERGENCY RESPONDERS
  ============================================================ */}

  <div style={card}>

    <h3>
      🚑 Emergency Responders
    </h3>

    <EmergencyResponders />

  </div>


  {/* ============================================================
      IFSE MONITORING
  ============================================================ */}

  <div style={card}>

    <h3>
      🛡 IFSE Emergency Monitoring
    </h3>

    <IFSEEmergencyMonitoring />

  </div>


  {/* ============================================================
      EMERGENCY ANALYTICS
  ============================================================ */}

  <div style={card}>

    <h3>
      📊 Emergency Analytics
    </h3>

    <EmergencyAnalytics />

  </div>


  {/* ============================================================
      SOS HISTORY
  ============================================================ */}

  <div style={card}>

    <h3>
      📜 SOS History
    </h3>

    <SOSHistory />

  </div>

</div>

  </DashboardLayout>
  );
}

// ============================================================
// STYLES
// ============================================================

const dashboardGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
  marginBottom: "30px",
};

const summaryCard = {
background:
"#111827",
borderRadius:
"18px",
padding:
"20px",
border:
"1px solid #1f2937",
boxShadow:
"0 8px 24px rgba(0,0,0,0.18)",
};

const sectionTitle = {
marginTop:
"35px",
marginBottom:
"15px",
color:
"#60a5fa",
fontSize:
"22px",
fontWeight:
"700",
};

const page = {
color:
"white",
width:
"100%",
maxWidth:
"1200px",
margin:
"0 auto",
padding:
"20px",
boxSizing:
"border-box",
};

const introText = {
color:
"#cbd5e1",
fontSize:
"15px",
lineHeight:
"1.6",
marginBottom:
"25px",
};

const card = {
background:
"#0f172a",
padding:
"24px",
borderRadius:
"20px",
marginBottom:
"20px",
border:
"1px solid #1e293b",
boxShadow:
"0 8px 24px rgba(0,0,0,0.16)",
};

const helpText = {
color:
"#94a3b8",
fontSize:
"14px",
lineHeight:
"1.6",
marginBottom:
"20px",
};

const label = {
display:
"block",
marginTop:
"14px",
marginBottom:
"6px",
fontWeight:
"600",
color:
"#e5e7eb",
};

const input = {
width:
"100%",
marginTop:
"4px",
marginBottom:
"15px",
padding:
"12px",
borderRadius:
"10px",
border:
"1px solid #374151",
background:
"#111827",
color:
"#fff",
boxSizing:
"border-box",
fontSize:
"15px",
outline:
"none",
};

const gpsBox = {
display:
"flex",
flexWrap:
"wrap",
alignItems:
"center",
justifyContent:
"space-between",
gap:
"15px",
padding:
"16px",
marginBottom:
"18px",
borderRadius:
"14px",
border:
"1px solid #334155",
background:
"#111827",
};

const gpsText = {
color:
"#94a3b8",
fontSize:
"13px",
lineHeight:
"1.8",
margin:
"8px 0 0 0",
};

const locationButton = {
background:
"#2563eb",
color:
"#fff",
border:
"none",
padding:
"12px 16px",
borderRadius:
"10px",
cursor:
"pointer",
fontWeight:
"700",
fontSize:
"14px",
};

const dangerButton = {
background:
"#dc2626",
color:
"#fff",
border:
"none",
padding:
"15px",
borderRadius:
"12px",
cursor:
"pointer",
width:
"100%",
fontWeight:
"700",
fontSize:
"16px",
marginTop:
"10px",
};

const disabledDangerButton = {
background:
"#7f1d1d",
color:
"#fecaca",
border:
"none",
padding:
"15px",
borderRadius:
"12px",
cursor:
"not-allowed",
width:
"100%",
fontWeight:
"700",
fontSize:
"16px",
marginTop:
"10px",
opacity:
"0.85",
};

const securityNotice = {
color:
"#94a3b8",
fontSize:
"12px",
lineHeight:
"1.5",
marginTop:
"14px",
textAlign:
"center",
};

export default SOS;
