import { useEffect, useState } from "react";
import { getIdTokenResult } from "firebase/auth";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

import { auth, db } from "../firebase";

function formatDate(value) {
  if (!value) return "Unavailable";

  const date =
    typeof value?.toDate === "function"
      ? value.toDate()
      : value instanceof Date
        ? value
        : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return date.toLocaleString();
}

function displayValue(value, fallback = "Unavailable") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    return fallback;
  }

  return String(value);
}

function IFSEEmergencyMonitoring() {
  const [events, setEvents] = useState([]);
  const [monitoringError, setMonitoringError] = useState("");
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe = () => {};

    async function startMonitoring() {
      setLoading(true);
      setMonitoringError("");
      setAuthorized(false);

      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          throw new Error(
            "Sign in with an authorized administrator account to access emergency monitoring."
          );
        }

        const tokenResult = await getIdTokenResult(
          currentUser,
          true
        );

        if (tokenResult.claims.admin !== true) {
          throw new Error(
            "Administrator permission is required to access emergency audit logs."
          );
        }

        if (cancelled) return;

        setAuthorized(true);

        const eventsQuery = query(
          collection(db, "ifseAuditLogs"),
          where("module", "==", "SOS"),
          where("ifseGenerated", "==", true),
          orderBy("createdAt", "desc"),
          limit(10)
        );

        unsubscribe = onSnapshot(
          eventsQuery,
          (snapshot) => {
            if (cancelled) return;

            setEvents(
              snapshot.docs.map((eventDoc) => ({
                ...eventDoc.data(),
                id: eventDoc.id,
              }))
            );

            setLastUpdate(new Date());
            setMonitoringError("");
            setLoading(false);
          },
          (error) => {
            console.error(
              "IFSE Emergency Monitoring Error:",
              error
            );

            if (cancelled) return;

            setMonitoringError(
              error?.code === "permission-denied"
                ? "Firebase denied access. Check administrator claims and Firestore security rules."
                : "Emergency monitoring data is unavailable. Check the connection and try again."
            );

            setLoading(false);
          }
        );
      } catch (error) {
        console.error(
          "IFSE Emergency Monitoring Authorization Error:",
          error
        );

        if (!cancelled) {
          setMonitoringError(
            error?.message ||
              "Unable to authorize emergency monitoring."
          );
          setLoading(false);
        }
      }
    }

    startMonitoring();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return (
    <main style={page}>
      <h1>🛡️ IFSE SOS Emergency Monitoring</h1>

      <p>
        Recent IFSE-generated SOS security and emergency-dispatch
        audit events.
      </p>

      <div style={notice}>
        <strong>SOS service policy:</strong> Emergency SOS is free.
        No payment is required to request emergency assistance.
      </div>

      {loading && (
        <p role="status">
          Verifying administrator access and connecting to monitoring…
        </p>
      )}

      {!loading && monitoringError && (
        <div role="alert" style={errorBox}>
          <strong>Monitoring unavailable</strong>
          <p>{monitoringError}</p>

          <button
            type="button"
            style={button}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !monitoringError && authorized && (
        <section style={summaryCard}>
          <h2>Monitoring Summary</h2>

          <p>
            <strong>Events loaded:</strong> {events.length}
          </p>

          <p>
            <strong>Latest event:</strong>{" "}
            {events.length > 0
              ? formatDate(events[0].createdAt)
              : "No events returned"}
          </p>

          <p>
            <strong>Monitoring scope:</strong> SOS audit logs
          </p>

          <p>
            <strong>Last successful snapshot:</strong>{" "}
            {lastUpdate
              ? lastUpdate.toLocaleString()
              : "Not yet received"}
          </p>

          <p>
            <strong>Connection state:</strong>{" "}
            {lastUpdate ? "Snapshot received" : "Awaiting first snapshot"}
          </p>

          <p>
            <strong>Monitoring limitation:</strong>{" "}
            A successful snapshot confirms that Firestore returned data;
            it does not independently confirm that dispatch, responders,
            or external notifications are operational.
          </p>
        </section>
      )}

      {!loading &&
        !monitoringError &&
        authorized &&
        events.length === 0 && (
          <p>
            No matching IFSE-generated SOS audit events were returned.
            This does not prove that no emergency activity exists elsewhere.
          </p>
        )}

      {!loading &&
        !monitoringError &&
        authorized &&
        events.map((event) => (
          <section key={event.id} style={eventCard}>
            <h2>
              {displayValue(
                event.action,
                "IFSE Emergency Event"
              )}
            </h2>

            <p>
              <strong>Module:</strong>{" "}
              {displayValue(event.module, "SOS")}
            </p>

            <p>
              <strong>Emergency ID:</strong>{" "}
              {displayValue(event.emergencyId)}
            </p>

            <p>
              <strong>Actor:</strong>{" "}
              {displayValue(event.actor, "IFSE System")}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {displayValue(
                event.description,
                "No description recorded"
              )}
            </p>

            <p>
              <strong>Assigned agency:</strong>{" "}
              {displayValue(
                event.assignedAgency,
                "Awaiting assignment"
              )}
            </p>

            <p>
              <strong>Responder:</strong>{" "}
              {displayValue(
                event.responderName,
                "Awaiting responder"
              )}
            </p>

            <p>
              <strong>Escalation level:</strong>{" "}
              {displayValue(event.escalationLevel, "0")}
            </p>

            <p>
              <strong>Escalation status:</strong>{" "}
              {displayValue(event.escalationStatus, "Not recorded")}
            </p>

            <p>
              <strong>Satellite backup:</strong>{" "}
              {event.satelliteActivated === true
                ? "Reported active"
                : event.satelliteActivated === false
                  ? "Not reported active"
                  : "Unknown"}
            </p>

            <h3>Location information</h3>

            <p>
              <strong>GPS latitude:</strong>{" "}
              {displayValue(event.gpsLatitude)}
            </p>

            <p>
              <strong>GPS longitude:</strong>{" "}
              {displayValue(event.gpsLongitude)}
            </p>

            <p>
              <strong>GPS accuracy:</strong>{" "}
              {event.gpsAccuracy != null &&
              typeof event.gpsAccuracy === "number"
                ? `${event.gpsAccuracy} m`
                : "Unavailable"}
            </p>

            <h3>Notification routing</h3>

            <p>
              <strong>Routing:</strong>{" "}
              {displayValue(event.notificationRouting)}
            </p>

            <p>
              <strong>Trusted contacts:</strong>{" "}
              {event.trustedContactsNotified === true
                ? "Reported queued"
                : event.trustedContactsNotified === false
                  ? "Not reported queued"
                  : "Unknown"}
            </p>

            <p>
              <strong>Family network:</strong>{" "}
              {event.familyNetworkNotified === true
                ? "Reported queued"
                : event.familyNetworkNotified === false
                  ? "Not reported queued"
                  : "Unknown"}
            </p>

            <p>
              <strong>Government alert:</strong>{" "}
              {event.governmentAlert === true
                ? "Reported queued"
                : event.governmentAlert === false
                  ? "Not reported queued"
                  : "Unknown"}
            </p>

            <h3>Healthcare routing</h3>

            <p>
              <strong>Healthcare routing:</strong>{" "}
              {displayValue(event.healthcareRouting)}
            </p>

            <p>
              <strong>Healthcare recipient:</strong>{" "}
              {displayValue(event.healthcareRecipient)}
            </p>

            <p>
              <strong>Healthcare alert:</strong>{" "}
              {event.healthcareAlert === true
                ? "Reported queued"
                : event.healthcareAlert === false
                  ? "Not reported queued"
                  : "Unknown"}
            </p>

            <h3>Audit information</h3>

            <p>
              <strong>Event status:</strong>{" "}
              {displayValue(event.status, "Not recorded")}
            </p>

            <p>
              <strong>Audit status:</strong>{" "}
              {displayValue(event.auditStatus, "Not recorded")}
            </p>

            <p>
              <strong>Event time:</strong>{" "}
              {formatDate(event.createdAt)}
            </p>

            <p>
              <strong>IFSE generated:</strong>{" "}
              {event.ifseGenerated === true
                ? "Yes"
                : "No"}
            </p>

            <p>
              <strong>Automatic alert:</strong>{" "}
              {event.automaticAlert === true
                ? "Reported enabled"
                : event.automaticAlert === false
                  ? "Reported disabled"
                  : "Unknown"}
            </p>

            <p>
              <strong>Payment policy:</strong> No payment required
              for SOS.
            </p>

            {event.paymentRequired === true && (
              <p role="alert" style={warningBox}>
                Security warning: this event records paymentRequired
                as true. SOS must remain free. Investigate the record
                and its originating workflow.
              </p>
            )}
          </section>
        ))}
    </main>
  );
}

const page = {
  background: "#0f172a",
  color: "#fff",
  padding: "24px",
  borderRadius: "20px",
  marginBottom: "20px",
  overflowWrap: "anywhere",
};

const notice = {
  background: "#172554",
  border: "1px solid #1d4ed8",
  padding: "14px",
  borderRadius: "10px",
  marginBottom: "16px",
  lineHeight: 1.6,
};

const summaryCard = {
  background: "#111827",
  padding: "18px",
  borderRadius: "12px",
  marginTop: "15px",
  lineHeight: 1.7,
};

const eventCard = {
  background: "#111827",
  padding: "18px",
  borderRadius: "12px",
  marginTop: "15px",
  lineHeight: 1.7,
  overflowWrap: "anywhere",
};

const errorBox = {
  background: "#450a0a",
  border: "1px solid #991b1b",
  padding: "16px",
  borderRadius: "10px",
  marginTop: "15px",
  overflowWrap: "anywhere",
};

const warningBox = {
  background: "#451a03",
  border: "1px solid #c2410c",
  color: "#fed7aa",
  padding: "12px",
  borderRadius: "8px",
};

const button = {
  background: "#1e293b",
  color: "#fff",
  border: "1px solid #475569",
  borderRadius: "8px",
  padding: "10px 14px",
  cursor: "pointer",
};

export default IFSEEmergencyMonitoring;
