import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

import DashboardLayout from "../components/DashboardLayout";

function SOSResponderDashboard() {
const [activeEmergencies, setActiveEmergencies] = useState([]);
useEffect(() => {

  async function loadEmergencies() {

    try {

      const q = query(

        collection(db, "emergencySOS"),

        where("status", "==", "open")

      );

      const snapshot = await getDocs(q);

      const emergencies = snapshot.docs.map((doc) => ({

        id: doc.id,

        ...doc.data(),

      }));

      setActiveEmergencies(emergencies);

    } catch (err) {

      console.error("SOS Dashboard:", err);

    }

  }

  loadEmergencies();

}, []);
  
  return (

    <DashboardLayout>

      <div style={{ color: "white" }}>

        <h1>🚑 SOS Responder Dashboard</h1>

        <div style={card}>

  <h2>🔴 Active Emergencies</h2>

  <p>Total: {activeEmergencies.length}</p>

  {activeEmergencies.length === 0 ? (

    <p>No active emergencies.</p>

  ) : (

    activeEmergencies.map((item) => (

      <div
        key={item.id}
        style={{
          marginTop: "15px",
          padding: "15px",
          background: "#111827",
          borderRadius: "10px",
        }}
      >

        <strong>{item.emergencyType}</strong>

        <br />

        Priority: {item.priority}

        <br />

        Location: {item.location || "Unknown"}

        <br />

        Status: {item.status}

      </div>

    ))

  )}

</div>

        <div style={card}>
          🚑 Assigned Emergencies
        </div>

        <div style={card}>
          ✅ Resolved Emergencies
        </div>

        <div style={card}>
          👮 Available Responders
        </div>

      </div>

    </DashboardLayout>

  );

}

const card = {

  background: "#0f172a",

  padding: "24px",

  borderRadius: "18px",

  marginBottom: "20px",

};

export default SOSResponderDashboard;
