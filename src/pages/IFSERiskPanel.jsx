import { useCallback, useEffect, useState } from "react";
import { getIdTokenResult } from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase";

function getRiskColor(level) {
  switch (String(level || "").toUpperCase()) {
    case "CRITICAL":
      return "#dc2626";
    case "HIGH":
      return "#ea580c";
    case "MEDIUM":
      return "#ca8a04";
    case "LOW":
      return "#16a34a";
    default:
      return "#64748b";
  }
}

function formatDate(value) {
  if (!value) return "Not recorded";

  const date =
    typeof value?.toDate === "function"
      ? value.toDate()
      : value instanceof Date
        ? value
        : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString();
}

export default function IFSERiskPanel() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [actionErrors, setActionErrors] = useState({});
  const [busyActions, setBusyActions] = useState({});

  useEffect(() => {
    let unsubscribe = () => {};
    let cancelled = false;

    async function startMonitoring() {
      setLoading(true);
      setError("");
      setAuthorized(false);

      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          throw new Error(
            "Sign in with an authorized administrator account to access IFSE monitoring."
          );
        }

        const tokenResult = await getIdTokenResult(currentUser, true);

        if (tokenResult.claims.admin !== true) {
          throw new Error(
            "Administrator permission is required to access IFSE security events."
          );
        }

        if (cancelled) return;

        setAuthorized(true);

        const eventsQuery = query(
          collection(db, "ifseSecurityEvents"),
          orderBy("createdAt", "desc")
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

            setError("");
            setLoading(false);
          },
          (err) => {
            console.error("IFSE monitoring subscription error:", err);

            if (cancelled) return;

            setError(
              err?.code === "permission-denied"
                ? "Firebase denied access to IFSE security events. Check administrator claims and Firestore rules."
                : "IFSE security events could not be loaded. Monitoring data is currently unavailable."
            );

            setLoading(false);
          }
        );
      } catch (err) {
        console.error("IFSE authorization error:", err);

        if (!cancelled) {
          setError(
            err?.message ||
              "Unable to authorize access to IFSE monitoring."
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

  const updateEvent = useCallback(
    async (eventId, action) => {
      if (!authorized || !eventId) return;

      const actionKey = `${eventId}:${action}`;

      if (busyActions[actionKey]) return;

      setBusyActions((previous) => ({
        ...previous,
        [actionKey]: true,
      }));

      setActionErrors((previous) => ({
        ...previous,
        [eventId]: "",
      }));

      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          throw new Error("Your session has expired. Please sign in again.");
        }

        const tokenResult = await getIdTokenResult(currentUser, true);

        if (tokenResult.claims.admin !== true) {
          throw new Error(
            "Administrator permission is required for this action."
          );
        }

        const changes =
          action === "review"
            ? {
                reviewed: true,
                reviewedAt: serverTimestamp(),
                reviewedBy: currentUser.uid,
              }
            : {
                resolved: true,
                resolvedAt: serverTimestamp(),
                resolvedBy: currentUser.uid,
              };

        await updateDoc(
          doc(db, "ifseSecurityEvents", eventId),
          changes
        );
      } catch (err) {
        console.error(`IFSE ${action} action failed:`, err);

        setActionErrors((previous) => ({
          ...previous,
          [eventId]:
            err?.code === "permission-denied"
              ? "Firebase denied this change. Check the security rules."
              : err?.message ||
                "The action failed. The event has not been confirmed as updated.",
        }));
      } finally {
        setBusyActions((previous) => ({
          ...previous,
          [actionKey]: false,
        }));
      }
    },
    [authorized, busyActions]
  );

  return (
    <main style={page}>
      <h1>IFSE Risk Monitoring</h1>

      <p style={notice}>
        Security events are shown only after the administrator claim check.
        Access to the underlying data must also be enforced by Firebase rules.
      </p>

      {loading && (
        <p role="status">Authorizing access and loading security events…</p>
      )}

      {!loading && error && (
        <div role="alert" style={errorBox}>
          <strong>IFSE monitoring unavailable</strong>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={button}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && authorized && events.length === 0 && (
        <p>No security events were returned by Firestore.</p>
      )}

      {!loading &&
        !error &&
        authorized &&
        events.map((event) => {
          const level = String(
            event.threatLevel || "UNKNOWN"
          ).toUpperCase();

          const reviewBusy = Boolean(
            busyActions[`${event.id}:review`]
          );

          const resolveBusy = Boolean(
            busyActions[`${event.id}:resolve`]
          );

          const reasons = Array.isArray(event.reasons)
            ? event.reasons.filter(
                (reason) => typeof reason === "string"
              )
            : [];

          return (
            <section
              key={event.id}
              style={{
                ...eventCard,
                borderLeft: `6px solid ${getRiskColor(level)}`,
              }}
            >
              <h2 style={{ marginTop: 0 }}>
                <span style={{ color: getRiskColor(level) }}>
                  {level}
                </span>{" "}
                Risk
              </h2>

              <p>
                <strong>Risk Score:</strong>{" "}
                {typeof event.riskScore === "number"
                  ? event.riskScore
                  : "Not available"}
              </p>

              <p>
                <strong>User ID:</strong>{" "}
                {event.userId || "Unknown"}
              </p>

              <p>
                <strong>Verification ID:</strong>{" "}
                {event.verificationId || "N/A"}
              </p>

              <p>
                <strong>Created:</strong>{" "}
                {formatDate(event.createdAt)}
              </p>

              <p>
                <strong>Review status:</strong>{" "}
                {event.reviewed ? "Reviewed" : "Pending review"}
              </p>

              <p>
                <strong>Resolution status:</strong>{" "}
                {event.resolved
                  ? "Marked resolved"
                  : "Open"}
              </p>

              <h3>Reasons</h3>

              {reasons.length > 0 ? (
                <ul>
                  {reasons.map((reason, index) => (
                    <li key={`${event.id}-reason-${index}`}>
                      {reason}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No reasons were recorded for this event.</p>
              )}

              {event.resolved && (
                <p>
                  <strong>Resolved at:</strong>{" "}
                  {formatDate(event.resolvedAt)}
                </p>
              )}

              {actionErrors[event.id] && (
                <p role="alert" style={inlineError}>
                  {actionErrors[event.id]}
                </p>
              )}

              <div style={actions}>
                {!event.reviewed && (
                  <button
                    type="button"
                    disabled={reviewBusy || resolveBusy}
                    onClick={() => updateEvent(event.id, "review")}
                    style={button}
                  >
                    {reviewBusy
                      ? "Saving review…"
                      : "Mark Reviewed"}
                  </button>
                )}

                {!event.resolved && (
                  <button
                    type="button"
                    disabled={resolveBusy || reviewBusy}
                    onClick={() => updateEvent(event.id, "resolve")}
                    style={button}
                  >
                    {resolveBusy
                      ? "Saving resolution…"
                      : "Mark Resolved"}
                  </button>
                )}
              </div>
            </section>
          );
        })}
    </main>
  );
}

const page = {
  padding: "24px",
  color: "#fff",
  background: "#020617",
  minHeight: "100%",
};

const notice = {
  background: "#172554",
  border: "1px solid #1d4ed8",
  padding: "12px 16px",
  borderRadius: "10px",
  lineHeight: 1.5,
};

const eventCard = {
  background: "#0f172a",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "20px",
  overflowWrap: "anywhere",
};

const actions = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "15px",
};

const button = {
  background: "#1e293b",
  color: "#fff",
  border: "1px solid #475569",
  borderRadius: "8px",
  padding: "10px 14px",
  cursor: "pointer",
};

const errorBox = {
  background: "#450a0a",
  border: "1px solid #991b1b",
  borderRadius: "10px",
  padding: "16px",
  overflowWrap: "anywhere",
};

const inlineError = {
  color: "#fca5a5",
  overflowWrap: "anywhere",
};
