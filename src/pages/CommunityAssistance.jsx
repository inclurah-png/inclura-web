import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

function CommunityAssistance() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "communityAssistance"),
      where("status", "==", "Active")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRequests(data);
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
      <h3>🤝 Community Assistance</h3>

      <p>Active Community Alerts: {requests.length}</p>

      {requests.length === 0 ? (
        <p>No community assistance requests.</p>
      ) : (
        requests.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#111827",
              padding: "15px",
              borderRadius: "12px",
              marginTop: "15px",
            }}
          >
            <strong>{item.assistanceType || "Community Help"}</strong>

            <br />

            Description:
            {" "}
            {item.description}

            <br />

            Location:
            {" "}
            {item.location}

            <br />

            Priority:
            {" "}
            {item.priority}

            <br />

            Status:
            {" "}
            {item.status}
          </div>
        ))
      )}
    </div>
  );
}

export default CommunityAssistance;
