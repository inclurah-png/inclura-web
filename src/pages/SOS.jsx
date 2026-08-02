import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";
import DashboardLayout from "../components/DashboardLayout";

function SOS() {
const [sosStats, setSosStats] = useState({
  open: 0,
  resolved: 0,
  highPriority: 0,
  medical: 0,
  fire: 0,
  police: 0,
  responders: 0,
});

  useEffect(() => {
  async function loadSOSStats() {
    try {
      const openSnap = await getCountFromServer(
        query(
          collection(db, "emergencySOS"),
          where("status", "==", "open")
        )
      );

      const resolvedSnap = await getCountFromServer(
        query(
          collection(db, "emergencySOS"),
          where("status", "==", "resolved")
        )
      );

      const highSnap = await getCountFromServer(
        query(
          collection(db, "emergencySOS"),
          where("priority", "==", "high")
        )
      );

      const medicalSnap = await getCountFromServer(
        query(
          collection(db, "emergencySOS"),
          where("emergencyType", "==", "Medical")
        )
      );

      const fireSnap = await getCountFromServer(
        query(
          collection(db, "emergencySOS"),
          where("emergencyType", "==", "Fire")
        )
      );

      const policeSnap = await getCountFromServer(
        query(
          collection(db, "emergencySOS"),
          where("emergencyType", "==", "Police")
        )
      );

      const responderSnap = await getCountFromServer(
        query(
          collection(db, "users"),
          where("isResponder", "==", true)
        )
      );

      setSosStats({
        open: Math.max(0, openSnap.data().count - 1),
        resolved: resolvedSnap.data().count,
        highPriority: Math.max(0, highSnap.data().count - 1),
        medical: Math.max(0, medicalSnap.data().count - 1),
        fire: Math.max(0, fireSnap.data().count - 1),
        police: Math.max(0, policeSnap.data().count - 1),
        responders: responderSnap.data().count,
      });

    } catch (err) {
      console.error(err);
    }
  }

  loadSOSStats();
}, []);

  async function submitEmergencySOS() {

  try {

    await addDoc(collection(db, "emergencySOS"), {

      systemPlaceholder: false,

      userId: "SYSTEM",

      emergencyType: "Medical",

      priority: "low",

      description: "Manual SOS test from Admin Panel",

      location: "Unknown",

      status: "open",

      handledBy: "",

      resolved: false,

      createdAt: serverTimestamp(),

      updatedAt: serverTimestamp(),

    });

    alert("Emergency SOS submitted successfully.");

    window.location.reload();

  } catch (err) {

    console.error(err);

    alert("Unable to submit SOS.");

  }

  }
  
  return (
    <DashboardLayout>
      <div style={page}>
        <h1>🚨 SOS Emergency</h1>

<div style={dashboardGrid}>

  <div style={summaryCard}>
    <h3>🚨 Open SOS Cases</h3>
    <h2>{sosStats.open}</h2>
    <p>Awaiting Response</p>
  </div>

  <div style={summaryCard}>
    <h3>⚠ High Priority</h3>
    <h2>{sosStats.highPriority}</h2>
    <p>Critical Emergencies</p>
  </div>

  <div style={summaryCard}>
    <h3>🚑 Medical Emergencies</h3>
    <h2>{sosStats.medical}</h2>
    <p>Medical Cases</p>
  </div>

  <div style={summaryCard}>
    <h3>🚒 Fire Emergencies</h3>
    <h2>{sosStats.fire}</h2>
    <p>Fire Incidents</p>
  </div>

  <div style={summaryCard}>
    <h3>🚓 Police Emergencies</h3>
    <h2>{sosStats.police}</h2>
    <p>Police Cases</p>
  </div>

  <div style={summaryCard}>
    <h3>👨‍🚒 Active Responders</h3>
    <h2>{sosStats.responders}</h2>
    <p>Available Responders</p>
  </div>

  <div style={summaryCard}>
    <h3>✅ Resolved Cases</h3>
    <h2>{sosStats.resolved}</h2>
    <p>Successfully Closed</p>
  </div>

</div>

<h2 style={sectionTitle}>Emergency Actions</h2>

<div style={card}>

  <h3>🚨 Send Emergency Alert</h3>

  <p>Create a new emergency incident.</p>

  <button
    onClick={submitEmergencySOS}
    style={{
      marginTop: "15px",
      padding: "12px 18px",
      background: "#dc2626",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "600",
    }}
  >
    Send SOS Alert
  </button>

</div>

<div style={card}>
  📍 Share Live Location
</div>

<div style={card}>
  👨‍👩‍👧 Trusted Contacts
</div>

<div style={card}>
  🤝 Community Assistance
</div>

<div style={card}>
  🚑 Emergency Responders
</div>

<div style={card}>
  🛡 IFSE Emergency Monitoring
</div>

<div style={card}>
  📊 Emergency Analytics
</div>

<div style={card}>
  📜 SOS History
</div>
      </div>
    </DashboardLayout>
  );
}

const dashboardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "18px",
  marginBottom: "30px",
};

const summaryCard = {
  background: "#111827",
  borderRadius: "18px",
  padding: "20px",
  border: "1px solid #1f2937",
};

const sectionTitle = {
  marginTop: "35px",
  marginBottom: "15px",
  color: "#60a5fa",
  fontSize: "22px",
  fontWeight: "700",
};

const page = { color: "white" };

const card = {
  background: "#0f172a",
  padding: "24px",
  borderRadius: "20px",
  marginBottom: "20px",
};

export default SOS;
