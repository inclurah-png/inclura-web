import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

function EmergencyResponders() {
  const [responders, setResponders] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("isResponder", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setResponders(list);
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
      <h3>🚑 Emergency Responders</h3>

      <p>Available Responders: {responders.length}</p>

      {responders.length === 0 ? (
        <p>No responders currently available.</p>
      ) : (
        responders.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#111827",
              padding: "15px",
              borderRadius: "12px",
              marginTop: "15px",
            }}
          >
            <strong>
              {item.displayName || item.fullName || "Responder"}
            </strong>

            <br />

            Agency:
            {" "}
            {item.responderAgency || "Unknown"}

            <br />

            Role:
            {" "}
            {item.responderRole || "Responder"}

            <br />

            Availability:
            {" "}
            {item.availability || "Unknown"}

            <br />

            Missions Completed:
            {" "}
            {item.completedMissions || 0}
          </div>
        ))
      )}
    </div>
  );
}

export default EmergencyResponders;
