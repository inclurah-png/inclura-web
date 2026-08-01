import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

function getRiskColor(level) {
  switch (level) {
    case "CRITICAL":
      return "#dc2626";
    case "HIGH":
      return "#ea580c";
    case "MEDIUM":
      return "#ca8a04";
    default:
      return "#16a34a";
  }
}

export default function IFSERiskPanel() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "ifseSecurityEvents"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(
        snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markReviewed = async (id) => {
    await updateDoc(doc(db, "ifseSecurityEvents", id), {
      reviewed: true,
      reviewedAt: serverTimestamp(),
    });
  };

  const markResolved = async (id) => {
    await updateDoc(doc(db, "ifseSecurityEvents", id), {
      resolved: true,
      resolvedAt: serverTimestamp(),
    });
  };

  return (
    <div style={{ padding: 24, color: "#fff" }}>
      <h1>IFSE Risk Monitoring</h1>

      {loading ? (
        <p>Loading security events...</p>
      ) : events.length === 0 ? (
        <p>No IFSE security events found.</p>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            style={{
              background: "#0f172a",
              borderRadius: 12,
              borderLeft: `6px solid ${getRiskColor(event.threatLevel)}`,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <h3>{event.threatLevel} Risk</h3>

            <p>
              <strong>Risk Score:</strong> {event.riskScore}
            </p>

            <p>
              <strong>User:</strong> {event.userId || "Unknown"}
            </p>

            <p>
              <strong>Verification:</strong>{" "}
              {event.verificationId || "N/A"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {event.reviewed ? "Reviewed" : "Pending"}
            </p>

            <p>
              <strong>Resolution:</strong>{" "}
              {event.resolved ? "Resolved" : "Open"}
            </p>

            <strong>Reasons</strong>

            <ul>
              {(event.reasons || []).map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 15,
              }}
            >
              {!event.reviewed && (
                <button onClick={() => markReviewed(event.id)}>
                  Mark Reviewed
                </button>
              )}

              {!event.resolved && (
                <button onClick={() => markResolved(event.id)}>
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
