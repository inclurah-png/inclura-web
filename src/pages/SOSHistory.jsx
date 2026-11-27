import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

function formatTimestamp(value) {
  if (!value) return "Unavailable";
  if (value.toDate) return value.toDate().toLocaleString();
  return String(value);
}

function SOSHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return undefined;

    const q = query(
      collection(db, "emergencySOS"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      setHistory(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );
    });
  }, []);

  return (
    <section
      aria-labelledby="sos-history-title"
      style={{
        background: "#0f172a",
        padding: "24px",
        borderRadius: "20px",
        marginBottom: "20px",
      }}
    >
      <h3 id="sos-history-title">📜 SOS History</h3>
      <p aria-live="polite">Total Emergencies: {history.length}</p>

      {history.length === 0 ? (
        <p>No emergency history available.</p>
      ) : (
        history.map((item) => {
          const gps =
            item.latitude || item.gpsLatitude
              ? `${item.latitude || item.gpsLatitude}, ${item.longitude || item.gpsLongitude || ""}`
              : "Location coordinates unavailable";

          const automaticDispatch =
            item.automaticDispatch === true || item.ifseDispatch === true;

          return (
            <article
              key={item.id}
              style={{
                background: "#111827",
                padding: "15px",
                borderRadius: "12px",
                marginTop: "15px",
              }}
            >
              <h4 style={{ marginTop: 0 }}>
                {item.emergencyType || "Emergency"}
              </h4>

              <p><strong>Priority:</strong> {item.priority || "Unknown"}</p>
              <p><strong>Status:</strong> {item.status || "Unknown"}</p>
              <p>
                <strong>Response:</strong>{" "}
                {item.responseStatus || "Awaiting Response"}
              </p>
              <p>
                <strong>IFSE Dispatch:</strong>{" "}
                {automaticDispatch ? "Automatic" : "Not recorded"}
              </p>
              <p><strong>Location:</strong> {item.location || "Not provided"}</p>
              <p><strong>GPS:</strong> {gps}</p>
              <p>
                <strong>Incident Number:</strong>{" "}
                {item.incidentNumber || "Not assigned"}
              </p>
              <p>
                <strong>IFSE Classification:</strong>{" "}
                {item.ifseClassification || "Pending"}
              </p>
              <p>
                <strong>Monitoring:</strong>{" "}
                {item.ifseMonitoring === true ? "Active" : "Not recorded"}
              </p>
              <p>
                <strong>Assigned Agency:</strong>{" "}
                {item.assignedAgency || "Not assigned"}
              </p>
              <p>
                <strong>Assigned Responder:</strong>{" "}
                {item.assignedResponder || "Not assigned"}
              </p>
              <p>
                <strong>Assignment Status:</strong>{" "}
                {item.assignmentStatus || "Pending"}
              </p>
              <p>
                <strong>Incident Status:</strong>{" "}
                {item.incidentStatus || "Active"}
              </p>
              <p>
                <strong>Resolved:</strong>{" "}
                {item.resolved === true ? "Yes" : "No"}
              </p>
              <p>
                <strong>Resolution:</strong>{" "}
                {item.resolutionNotes || "No resolution recorded"}
              </p>
              <p>
                <strong>Resolved By:</strong>{" "}
                {item.resolvedBy || "Not yet resolved"}
              </p>
              <p>
                <strong>Created At:</strong> {formatTimestamp(item.createdAt)}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {formatTimestamp(item.lastUpdated || item.updatedAt)}
              </p>
              <p>
                <strong>Closed At:</strong> {formatTimestamp(item.closedAt)}
              </p>
            </article>
          );
        })
      )}
    </section>
  );
}

export default SOSHistory;
