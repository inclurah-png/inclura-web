import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";
import DashboardLayout from "../components/DashboardLayout";

function FamilyEmergencyDashboard() {

  const [emergencies, setEmergencies] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = loadEmergencies();
    return () => unsubscribe();
  }, []);

  function loadEmergencies() {
    const q = query(
      collection(db, "emergencySOS"),
      where("visibleToFamily", "==", true)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((emergencyDoc) => ({
          id: emergencyDoc.id,
          ...emergencyDoc.data(),
        }));

        setEmergencies(data);
        setLoading(false);
      },
      (error) => {
        console.error("Family emergency dashboard subscription failed:", error);
        setLoading(false);
      }
    );
  }

  return (

    <DashboardLayout>

      <div style={container}>

        <h1>👨‍👩‍👧 Family Emergency Dashboard</h1>

        <p>

          Active Family Emergencies:

          <strong> {emergencies.length}</strong>

        </p>

        {loading ? (

          <p>Loading...</p>

        ) : emergencies.length === 0 ? (

          <p>No emergency available.</p>

        ) : (

          emergencies.map(emergency => (

            <div
              key={emergency.id}
              style={card}
            >

              <h3>

                {emergency.emergencyType}

              </h3>

              <p>

                <strong>Status:</strong>

                {" "}

                {emergency.status}

              </p>

              <p>

                <strong>Agency:</strong>

                {" "}

                {emergency.assignedAgency || "Pending"}

              </p>

              <p>

                <strong>Responder:</strong>

                {" "}

                {emergency.assignedResponder || "Pending"}

              </p>

              <p>

                <strong>Priority:</strong>

                {" "}

                {emergency.priority}

              </p>

              <p>

                <strong>Location:</strong>

                {" "}

                {emergency.location || "Unavailable"}

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

export default FamilyEmergencyDashboard;
