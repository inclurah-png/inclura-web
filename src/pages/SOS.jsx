import {
  dispatchEmergency,
} from "../services/ifseDispatchEngine";

import {
  useEffect,
  useState,
} from "react";

import {
  collection,
  addDoc,
  getCountFromServer,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import {
  db,
  auth,
} from "../firebase";

import DashboardLayout from "../components/DashboardLayout";
import SOSHistory from "../pages/SOSHistory";
import TrustedContacts from "./TrustedContacts";
import ShareLiveLocation from "./ShareLiveLocation";
import EmergencyResponders from "./EmergencyResponders";
import CommunityAssistance from "./CommunityAssistance";
import IFSEEmergencyMonitoring from "./IFSEEmergencyMonitoring";
import EmergencyAnalytics from "./EmergencyAnalytics";


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

  trustedContact:
    "",

  responderNotes:
    "",

});

useEffect(() => {

  if (
    typeof navigator === "undefined" ||
    !navigator.geolocation
  ) {

    console.warn(
      "IFSE SOS: Geolocation is not supported by this device."
    );

    return;

  }


  navigator.geolocation.getCurrentPosition(

    (position) => {

      const latitude =
        position.coords.latitude;

      const longitude =
        position.coords.longitude;

      const accuracy =
        position.coords.accuracy;


      setSosForm(
        (previousForm) => ({

          ...previousForm,

          latitude:
            String(latitude),

          longitude:
            String(longitude),

          accuracy:
            String(accuracy),

        })
      );


      console.log(
        "IFSE SOS GPS Location Captured:",
        {
          latitude,
          longitude,
          accuracy,
        }
      );

    },

    (error) => {

      console.warn(
        "IFSE SOS GPS Location Error:",
        error
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

}, []);
  
  const [sosStats, setSosStats] = useState({
    open: 0,
    resolved: 0,
    highPriority: 0,
    medical: 0,
    fire: 0,
    police: 0,
    responders: 0,
  });

  const [isSubmittingSOS, setIsSubmittingSOS] =
  useState(false);

  const [submitting, setSubmitting] =
    useState(false);


  // ============================================================
  // LOAD SOS DASHBOARD STATISTICS
  // ============================================================

  useEffect(() => {

    async function loadSOSStats() {

      try {

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
              )
            )
          );


        const responderSnap =
          await getCountFromServer(
            query(
              collection(
                db,
                "users"
              ),
              where(
                "isResponder",
                "==",
                true
              )
            )
          );


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
            responderSnap
              .data()
              .count,

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

            userEmail:
              currentUser.email ||
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

            latitude:
              sosForm.latitude ||
              "",

            longitude:
              sosForm.longitude ||
              "",

            accuracy:
              sosForm.accuracy ||
              "",

            gpsLatitude:
              Number(
                sosForm.latitude
              ) || 0,

            gpsLongitude:
              Number(
                sosForm.longitude
              ) || 0,

            trustedContact:
              sosForm.trustedContact ||
              "",

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

        userEmail:
          currentUser.email ||
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

        latitude:
          sosForm.latitude ||
          "",

        longitude:
          sosForm.longitude ||
          "",

        accuracy:
          sosForm.accuracy ||
          "",

        gpsLatitude:
          Number(
            sosForm.latitude
          ) || 0,

        gpsLongitude:
          Number(
            sosForm.longitude
          ) || 0,

        trustedContact:
          sosForm.trustedContact ||
          "",

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

      const dispatchResult =
        await dispatchEmergency(
          emergencyData
        );

      console.log(
        "IFSE Dispatch Result:",
        dispatchResult
      );

      if (
        !dispatchResult ||
        dispatchResult.success !== true
      ) {

        console.error(
          "IFSE dispatch failed:",
          dispatchResult
        );

        alert(
          dispatchResult?.error ||
          "SOS was created, but IFSE could not complete emergency dispatch."
        );

        return;

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
        `Emergency SOS dispatched successfully.\n\n` +
        `Emergency ID: ${emergencyId}\n` +
        `Agency: ${
          dispatchResult.agency ||
          "Authorized Response Agency"
        }\n` +
        `Responder: ${
          dispatchResult.responderName ||
          "Responder Assigned"
        }\n` +
        `Escalation ID: ${
          escalationResult.escalationId ||
          "Already Existing"
        }`
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

        trustedContact:
          "",

        responderNotes:
          "",

      });


      // ============================================================
      // STEP 7 — REFRESH SOS DASHBOARD
      // ============================================================

      window.location.reload();


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


    {/* ==========================================================
        TRUSTED CONTACT
    ========================================================== */}

    <label style={label}>
      Trusted Contact
    </label>


    <input
      type="text"
      placeholder="Phone number or email"
      value={sosForm.trustedContact}
      onChange={(e) =>
        setSosForm({
          ...sosForm,
          trustedContact:
            e.target.value,
        })
      }
      style={input}
      disabled={isSubmittingSOS}
    />


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

      <div style={page}>

        <h1>
          🚨 SOS Emergency
        </h1>


        {/* ======================================================
            SOS STATISTICS
        ======================================================= */}

        <div
          style={
            dashboardGrid
          }
        >

          <div
            style={
              summaryCard
            }
          >

            <h3>
              🚨 Open SOS Cases
            </h3>

            <h2>
              {
                sosStats.open
              }
            </h2>

            <p>
              Awaiting Response
            </p>

          </div>


          <div
            style={
              summaryCard
            }
          >

            <h3>
              ⚠ High Priority
            </h3>

            <h2>
              {
                sosStats.highPriority
              }
            </h2>

            <p>
              High Priority Emergencies
            </p>

          </div>


          <div
            style={
              summaryCard
            }
          >

            <h3>
              🚑 Medical Emergencies
            </h3>

            <h2>
              {
                sosStats.medical
              }
            </h2>

            <p>
              Medical Cases
            </p>

          </div>


          <div
            style={
              summaryCard
            }
          >

            <h3>
              🚒 Fire Emergencies
            </h3>

            <h2>
              {
                sosStats.fire
              }
            </h2>

            <p>
              Fire Incidents
            </p>

          </div>


          <div
            style={
              summaryCard
            }
          >

            <h3>
              🚓 Police Emergencies
            </h3>

            <h2>
              {
                sosStats.police
              }
            </h2>

            <p>
              Police Cases
            </p>

          </div>


          <div
            style={
              summaryCard
            }
          >

            <h3>
              👨‍🚒 Active Responders
            </h3>

            <h2>
              {
                sosStats.responders
              }
            </h2>

            <p>
              Registered Responders
            </p>

          </div>


          <div
            style={
              summaryCard
            }
          >

            <h3>
              ✅ Resolved Cases
            </h3>

            <h2>
              {
                sosStats.resolved
              }
            </h2>

            <p>
              Successfully Closed
            </p>

          </div>

        </div>


        {/* ======================================================
            EMERGENCY ACTIONS
        ======================================================= */}

        <h2
          style={
            sectionTitle
          }
        >
          Emergency Actions
        </h2>


        {/* ======================================================
            SOS FORM
        ======================================================= */}

        <div
          style={card}
        >

          <h3>
            🚨 Emergency SOS Form
          </h3>


          <label>
            Emergency Type
          </label>


          <select
            value={
              sosForm.emergencyType
            }

            onChange={
              (e) =>
                setSosForm(
                  {
                    ...sosForm,

                    emergencyType:
                      e.target.value,
                  }
                )
            }

            style={input}
          >

            <option>
              Medical
            </option>

            <option>
              Fire
            </option>

            <option>
              Police
            </option>

            <option>
              Kidnapping
            </option>

            <option>
              Accident
            </option>

            <option>
              Disaster
            </option>

            <option>
              Security Threat
            </option>

            <option>
              Missing Person
            </option>

          </select>


          <label>
            Priority
          </label>


          <select
            value={
              sosForm.priority
            }

            onChange={
              (e) =>
                setSosForm(
                  {
                    ...sosForm,

                    priority:
                      e.target.value,
                  }
                )
            }

            style={input}
          >

            <option>
              Low
            </option>

            <option>
              Medium
            </option>

            <option>
              High
            </option>

            <option>
              Critical
            </option>

          </select>


          <label>
            Description
          </label>


          <textarea
            rows={4}

            placeholder={
              "Describe the emergency..."
            }

            value={
              sosForm.description
            }

            onChange={
              (e) =>
                setSosForm(
                  {
                    ...sosForm,

                    description:
                      e.target.value,
                  }
                )
            }

            style={input}
          />

<label>
  Location
</label>

<input
  type="text"
  placeholder="Current location"
  value={sosForm.location}
  onChange={(e) =>
    setSosForm({
      ...sosForm,
      location:
        e.target.value,
    })
  }
  style={input}
/>

<button
  type="button"
  onClick={() => {

    if (
      typeof navigator ===
        "undefined" ||
      !navigator.geolocation
    ) {

      alert(
        "GPS location is not supported on this device."
      );

      return;

    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        const accuracy =
          position.coords.accuracy;


        setSosForm(
          (previousForm) => ({

            ...previousForm,

            latitude:
              String(latitude),

            longitude:
              String(longitude),

            accuracy:
              String(accuracy),

          })
        );


        alert(
          "Current GPS location captured successfully."
        );

      },

      (error) => {

        console.error(
          "IFSE SOS GPS Error:",
          error
        );

        alert(
          "Unable to obtain your GPS location. Please make sure location permission is enabled."
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

  }}
  style={{
    ...dangerButton,
    background:
      "#2563eb",
    marginBottom:
      "15px",
  }}
>
  📍 Get Current GPS Location
</button>

<div
  style={{
    background:
      "#111827",
    border:
      "1px solid #374151",
    borderRadius:
      "10px",
    padding:
      "12px",
    marginBottom:
      "15px",
    fontSize:
      "14px",
  }}
>

  <strong>
    IFSE GPS Status
  </strong>

  <div
    style={{
      marginTop:
        "8px",
    }}
  >
    Latitude:{" "}
    {sosForm.latitude ||
      "Not captured"}
  </div>

  <div>
    Longitude:{" "}
    {sosForm.longitude ||
      "Not captured"}
  </div>

  <div>
    Accuracy:{" "}
    {sosForm.accuracy
      ? `${sosForm.accuracy} meters`
      : "Not captured"}
  </div>

</div>


          <button
            type="button"

            onClick={
              captureCurrentLocation
            }

            style={
              locationButton
            }
          >

            📍 Capture Current GPS Location

          </button>


          <div
            style={
              gpsBox
            }
          >

            <strong>
              GPS Status
            </strong>

            <p>
              Latitude:{" "}
              {
                sosForm.latitude ||
                "Not captured"
              }
            </p>

            <p>
              Longitude:{" "}
              {
                sosForm.longitude ||
                "Not captured"
              }
            </p>

            <p>
              Accuracy:{" "}
              {
                sosForm.accuracy
                  ? `${sosForm.accuracy} meters`
                  : "Not available"
              }
            </p>

          </div>


          <label>
            Trusted Contact
          </label>


          <input
            type="text"

            placeholder={
              "Phone or email"
            }

            value={
              sosForm.trustedContact
            }

            onChange={
              (e) =>
                setSosForm(
                  {
                    ...sosForm,

                    trustedContact:
                      e.target.value,
                  }
                )
            }

            style={input}
          />


          <label>
            Responder Notes
          </label>


          <textarea
            rows={3}

            placeholder={
              "Additional information for responders..."
            }

            value={
              sosForm.responderNotes
            }

            onChange={
              (e) =>
                setSosForm(
                  {
                    ...sosForm,

                    responderNotes:
                      e.target.value,
                  }
                )
            }

            style={input}
          />


          <button

            type="button"

            onClick={
              submitEmergencySOS
            }

            disabled={
              submitting
            }

            style={
              submitting
                ? disabledDangerButton
                : dangerButton
            }
          >

            {
              submitting
                ? "⏳ Processing Emergency..."
                : "🚨 Send SOS Alert"
            }

          </button>

        </div>


        {/* ======================================================
            LIVE LOCATION
        ======================================================= */}

        <div
          style={card}
        >

          📍

          <ShareLiveLocation />

        </div>

        
        {/* ======================================================
            TRUSTED CONTACTS
        ======================================================= */}

        <div
          style={card}
        >

          👨‍👩‍👧

          <TrustedContacts />

        </div>


        {/* ======================================================
            COMMUNITY ASSISTANCE
        ======================================================= */}

        <div
          style={card}
        >

          🤝

          <CommunityAssistance />

        </div>


        {/* ======================================================
            EMERGENCY RESPONDERS
        ======================================================= */}

        <div
          style={card}
        >

          🚑

          <EmergencyResponders />

        </div>


        {/* ======================================================
            IFSE MONITORING
        ======================================================= */}

        <div
          style={card}
        >

          🛡

          <IFSEEmergencyMonitoring />

        </div>


        {/* ======================================================
            EMERGENCY ANALYTICS
        ======================================================= */}

        <div
          style={card}
        >

          📊

          <EmergencyAnalytics />

        </div>


        {/* ======================================================
            SOS HISTORY
        ======================================================= */}

        <div
          style={card}
        >

          📜

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
  background:
    "#111827",

  border:
    "1px solid #374151",

  borderRadius:
    "12px",

  padding:
    "14px",

  marginBottom:
    "15px",

};


export default SOS;
