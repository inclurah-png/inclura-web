import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

function EmergencyAnalytics() {
  const [stats, setStats] = useState({
    totalEmergencies: 0,
    resolved: 0,
    active: 0,
    responders: 0,
    reports: 0,
  });

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const emergencySnap = await getDocs(
          collection(db, "emergencySOS")
        );

        const reportSnap = await getDocs(
          collection(db, "incidentReports")
        );

        const responderSnap = await getDocs(
          collection(db, "emergencyAssignments")
        );

        let active = 0;
        let resolved = 0;

        emergencySnap.forEach((doc) => {
          const data = doc.data();

          if (data.status === "resolved") {
            resolved++;
          } else {
            active++;
          }
        });

        setStats({
          totalEmergencies: emergencySnap.size,
          active,
          resolved,
          responders: responderSnap.size,
          reports: reportSnap.size,
        });

      } catch (err) {
        console.error(err);
      }
    }

    loadAnalytics();
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
      <h3>📊 Emergency Analytics</h3>

      <div style={grid}>

        <Card
          title="Total Emergencies"
          value={stats.totalEmergencies}
        />

        <Card
          title="Active"
          value={stats.active}
        />

        <Card
          title="Resolved"
          value={stats.resolved}
        />

        <Card
          title="Assignments"
          value={stats.responders}
        />

        <Card
          title="Incident Reports"
          value={stats.reports}
        />

      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#111827",
        padding: "20px",
        borderRadius: "15px",
      }}
    >
      <h4>{title}</h4>

      <h2>{value}</h2>
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: "15px",
};

export default EmergencyAnalytics;
