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

import { db } from "../../firebase";

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

  const [loading, setLoading] =
    useState(true);
    useEffect(() => {

    const q = query(
      collection(db, "ifseSecurityEvents"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {

        const data = snapshot.docs.map(
          (docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          })
        );

        setEvents(data);

        setLoading(false);

      });

    return () => unsubscribe();

  }, []);

    async function markReviewed(id) {

    await updateDoc(
      doc(db, "ifseSecurityEvents", id),
      {
        reviewed: true,
        reviewedAt: serverTimestamp(),
      }
    );

  }

  async function markResolved(id) {

  await updateDoc(
    doc(db, "ifseSecurityEvents", id),
    {
      resolved: true,
      resolvedAt: serverTimestamp(),
    }
  );

}
  
return (
  <div
    style={{
      color: "white",
      padding: "24px",
    }}
  >
    <h2
      style={{
        marginBottom: "20px",
      }}
    >
      IFSE Risk Monitoring
    </h2>

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
            border: "1px solid #334155",
            borderLeft:
              "6px solid " +
              getRiskColor(event.threatLevel),
            borderRadius: "12px",
            padding: "18px",
            marginBottom: "18px",
          }}
        >
          <h3>
            {event.threatLevel} Risk
          </h3>

          <p>
            <strong>Risk Score:</strong>{" "}
            {event.riskScore}
          </p>

          <p>
            <strong>User:</strong>{" "}
            {event.userId || "Unknown"}
          </p>

          <p>
            <strong>Verification:</strong>{" "}
            {event.verificationId || "N/A"}
          </p>

          <p>
            <strong>Executive Review:</strong>{" "}
            {event.executiveReview
              ? "Required"
              : "Not Required"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {event.reviewed
              ? "Reviewed"
              : "Pending Review"}
          </p>

          <p>
            <strong>Resolution:</strong>{" "}
            {event.resolved
              ? "Resolved"
              : "Open"}
          </p>

          <div
            style={{
              marginTop: "10px",
            }}
          >
            <strong>Reasons</strong>

            <ul>
              {(event.reasons || []).map(
                (reason, index) => (
                  <li key={index}>
                    {reason}
                  </li>
                )
              )}
            </ul>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "18px",
            }}
          >
            {!event.reviewed && (
              <button
                onClick={() =>
                  markReviewed(event.id)
                }
              >
                Mark Reviewed
              </button>
            )}

            {!event.resolved && (
              <button
                onClick={() =>
                  markResolved(event.id)
                }
              >
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
  
