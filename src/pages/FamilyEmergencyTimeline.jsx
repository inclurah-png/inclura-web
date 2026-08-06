import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import DashboardLayout from "../components/DashboardLayout";

function FamilyEmergencyTimeline() {

  const [timeline, setTimeline] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadTimeline();

  }, []);

  async function loadTimeline() {

    try {

      const q = query(
        collection(db, "emergencyTimeline"),
        where("visibleToFamily", "==", true),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTimeline(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }

  return (

    <DashboardLayout>

      <div style={container}>

        <h1>📜 Family Emergency Timeline</h1>

        {loading ? (

          <p>Loading timeline...</p>

        ) : timeline.length === 0 ? (

          <p>No emergency events available.</p>

        ) : (

          timeline.map(event => (

            <div
              key={event.id}
              style={card}
            >

              <h3>{event.eventType}</h3>

              <p>{event.eventDescription}</p>

              <p>

                <strong>Status:</strong>{" "}
                {event.eventStatus}

              </p>

              <p>

                <strong>Responder:</strong>{" "}
                {event.responderName || "Pending"}

              </p>

              <p>

                <strong>Agency:</strong>{" "}
                {event.responderAgency || "Pending"}

              </p>

            </div>

          ))

        )}

      </div>

    </DashboardLayout>

  );

}

const container = {

  color: "#fff",

};

const card = {

  marginTop: "20px",

  background: "#111827",

  padding: "18px",

  borderRadius: "12px",

};

export default FamilyEmergencyTimeline;
