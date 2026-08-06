import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

function ResolvedEmergencies() {
  const [resolved, setResolved] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "emergencySOS"),
      where("status", "==", "resolved"),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setResolved(list);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      style={{
        marginTop: 20,
        background: "#111827",
        borderRadius: 14,
        padding: 20,
      }}
    >
      <h2>✅ Resolved Emergencies</h2>

      <p>Total: {resolved.length}</p>

      {resolved.length === 0 ? (
        <p>No resolved emergencies.</p>
      ) : (
        resolved.map((item) => (
          <div
            key={item.id}
            style={{
              marginTop: 15,
              padding: 15,
              background: "#1f2937",
              borderRadius: 10,
            }}
          >
            <strong>{item.emergencyType}</strong>

            <br />

            Priority: {item.priority}

            <br />

            Location: {item.location}

            <br />

            Status: {item.responseStatus}

            <br />

            Assigned Agency:

            {" "}

            {item.assignedAgency || "N/A"}

            <br />

            Assigned Responder:

            {" "}

            {item.assignedResponder || "N/A"}

            <br />

            <button
              style={{
                marginTop: 10,
                padding: "8px 14px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              View Incident Report
            </button>

            <button
              style={{
                marginLeft: 10,
                marginTop: 10,
                padding: "8px 14px",
                background: "#0891b2",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              View Timeline
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default ResolvedEmergencies;
