import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

function IFSEEmergencyMonitoring() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "ifseAuditLogs"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      style={{
        background: "#0f172a",
        padding: "24px",
        borderRadius: "20px",
        marginBottom: "20px",
      }}
    >
      <h3>🛡 IFSE Emergency Monitoring</h3>

      <p>Recent IFSE Security Events</p>

      {events.length === 0 ? (
        <p>No IFSE events found.</p>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            style={{
              background: "#111827",
              padding: "15px",
              borderRadius: "12px",
              marginTop: "15px",
            }}
          >
            <strong>{event.action}</strong>

            <br />

            Module: {event.module}

            <br />

            Emergency: {event.emergencyId}

            <br />

            Actor: {event.actor}

            <br />

            Description: {event.description}
          </div>
        ))
      )}
    </div>
  );
}

export default IFSEEmergencyMonitoring;
