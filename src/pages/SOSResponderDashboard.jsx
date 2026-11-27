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
  const [assignedEmergencies, setAssignedEmergencies] = useState([]);

  useEffect(() => {
    async function loadEmergencies() {
      try {
        const activeQuery = query(
          collection(db, "emergencySOS"),
          where("status", "==", "open"),
          where("systemPlaceholder", "==", false)
        );
        const assignedQuery = query(
          collection(db, "emergencySOS"),
          where("status", "==", "assigned")
        );

        const [activeSnapshot, assignedSnapshot] = await Promise.all([
          getDocs(activeQuery),
          getDocs(assignedQuery),
        ]);

        setActiveEmergencies(
          activeSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
        );
        setAssignedEmergencies(
          assignedSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
        );
      } catch (error) {
        console.error("SOS responder dashboard:", error);
      }
    }

    loadEmergencies();
  }, []);

  return (
    <DashboardLayout>
      <div style={{ color: "white" }}>
        <h1>🚑 SOS Responder Dashboard</h1>
        <p style={notice}>
          Read-only emergency monitoring. SOS dispatch is automatic; responder
          assignment and case-control actions are restricted to authorized IFSE
          server workflows.
        </p>

        <section style={card}>
          <h2>🔴 Active Emergencies</h2>
          <p>Total: {activeEmergencies.length}</p>

          {activeEmergencies.length === 0 ? (
            <p>No active emergencies.</p>
          ) : (
            activeEmergencies.map((item) => (
              <article key={item.id} style={itemCard}>
                <strong>{item.emergencyType || "Emergency"}</strong>
                <p>Priority: {item.priority || "Unknown"}</p>
                <p>Location: {item.location || "Unknown"}</p>
                <p>Status: {item.status || "Unknown"}</p>
                <p>Emergency ID: {item.id}</p>
              </article>
            ))
          )}
        </section>

        <section style={card}>
          <h2>🚑 Assigned Emergencies</h2>
          <p>Total: {assignedEmergencies.length}</p>

          {assignedEmergencies.length === 0 ? (
            <p>No assigned emergencies.</p>
          ) : (
            assignedEmergencies.map((item) => (
              <article key={item.id} style={itemCard}>
                <strong>{item.emergencyType || "Emergency"}</strong>
                <p>Priority: {item.priority || "Unknown"}</p>
                <p>Assigned To: {item.assignedResponder || "Not disclosed"}</p>
                <p>Agency: {item.assignedAgency || "Not disclosed"}</p>
                <p>Location: {item.location || "Unknown"}</p>
                <p>Status: {item.status || "Unknown"}</p>
              </article>
            ))
          )}
        </section>
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

const itemCard = {
  marginTop: "15px",
  padding: "15px",
  background: "#111827",
  borderRadius: "10px",
};

const notice = {
  color: "#cbd5e1",
  lineHeight: "1.6",
  marginBottom: "20px",
};

export default SOSResponderDashboard;
