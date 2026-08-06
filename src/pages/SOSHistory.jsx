import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

function SOSHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "emergencySOS"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHistory(data);
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
      <h3>📜 SOS History</h3>

      <p>Total Emergencies: {history.length}</p>

      {history.length === 0 ? (
        <p>No emergency history available.</p>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#111827",
              padding: "15px",
              borderRadius: "12px",
              marginTop: "15px",
            }}
          >
            <strong>{item.emergencyType}</strong>

            <br />

            Priority: {item.priority}

            <br />

            Status: {item.status}

            <br />

            Response: {item.responseStatus || "Awaiting Response"}

            <br />

            Location: {item.location}

            <br />

            Incident Number: {item.incidentNumber}
          </div>
        ))
      )}
    </div>
  );
}

export default SOSHistory;
