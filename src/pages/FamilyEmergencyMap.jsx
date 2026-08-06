import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import DashboardLayout from "../components/DashboardLayout";

function FamilyEmergencyMap() {

  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {

    loadLocations();

  }, []);

  async function loadLocations() {

    try {

      const q = query(
        collection(db, "emergencySOS"),
        where("visibleToFamily", "==", true)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEmergencies(data);

    } catch (err) {

      console.error(err);

    }

  }

  return (

    <DashboardLayout>

      <div style={container}>

        <h1>🗺 Family Emergency Map</h1>

        <p>
          This page displays emergency locations tracked by IFSE.
        </p>

        {emergencies.length === 0 ? (

          <p>No emergency location available.</p>

        ) : (

          emergencies.map(item => (

            <div
              key={item.id}
              style={card}
            >

              <h3>{item.emergencyType}</h3>

              <p>

                <strong>Location:</strong>{" "}

                {item.location || "Unknown"}

              </p>

              <p>

                <strong>Status:</strong>{" "}

                {item.status}

              </p>

              <p>

                <strong>Agency:</strong>{" "}

                {item.assignedAgency || "Pending"}

              </p>

              <p>

                <strong>Responder:</strong>{" "}

                {item.assignedResponder || "Pending"}

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

export default FamilyEmergencyMap;
