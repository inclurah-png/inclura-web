import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import DashboardLayout from "../components/DashboardLayout";
import { useTranslation } from "react-i18next";

function SOSResponderDashboard() {
  const { t } = useTranslation();
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
        <h1>{t("sosResponderDashboard", { defaultValue: "SOS Responder Dashboard" })}</h1>
        <p style={notice}>
          {t("sosReadOnlyNotice", { defaultValue: "Read-only emergency monitoring. SOS dispatch is automatic; responder assignment and case-control actions are restricted to authorized IFSE server workflows." })}
        </p>

        <section style={card}>
          <h2>{t("sosActiveEmergencies", { defaultValue: "Active Emergencies" })}</h2>
          <p>{t("sosTotal", { defaultValue: "Total" })}: {activeEmergencies.length}</p>

          {activeEmergencies.length === 0 ? (
            <p>{t("sosNoActiveEmergencies", { defaultValue: "No active emergencies." })}</p>
          ) : (
            activeEmergencies.map((item) => (
              <article key={item.id} style={itemCard}>
                <strong>{item.emergencyType || t("sosEmergency", { defaultValue: "Emergency" })}</strong>
                <p>{t("sosPriority", { defaultValue: "Priority" })}: {item.priority || t("sosUnknown", { defaultValue: "Unknown" })}</p>
                <p>{t("sosLocation", { defaultValue: "Location" })}: {item.location || t("sosUnknown", { defaultValue: "Unknown" })}</p>
                <p>{t("sosStatus", { defaultValue: "Status" })}: {item.status || t("sosUnknown", { defaultValue: "Unknown" })}</p>
                <p>Emergency ID: {item.id}</p>
              </article>
            ))
          )}
        </section>

        <section style={card}>
          <h2>{t("sosAssignedEmergencies", { defaultValue: "Assigned Emergencies" })}</h2>
          <p>{t("sosTotal", { defaultValue: "Total" })}: {assignedEmergencies.length}</p>

          {assignedEmergencies.length === 0 ? (
            <p>{t("sosNoAssignedEmergencies", { defaultValue: "No assigned emergencies." })}</p>
          ) : (
            assignedEmergencies.map((item) => (
              <article key={item.id} style={itemCard}>
                <strong>{item.emergencyType || t("sosEmergency", { defaultValue: "Emergency" })}</strong>
                <p>{t("sosPriority", { defaultValue: "Priority" })}: {item.priority || t("sosUnknown", { defaultValue: "Unknown" })}</p>
                <p>{t("sosAssignedTo", { defaultValue: "Assigned To" })}: {item.assignedResponder || t("sosNotDisclosed", { defaultValue: "Not disclosed" })}</p>
                <p>{t("sosAgency", { defaultValue: "Agency" })}: {item.assignedAgency || t("sosNotDisclosed", { defaultValue: "Not disclosed" })}</p>
                <p>{t("sosLocation", { defaultValue: "Location" })}: {item.location || t("sosUnknown", { defaultValue: "Unknown" })}</p>
                <p>{t("sosStatus", { defaultValue: "Status" })}: {item.status || t("sosUnknown", { defaultValue: "Unknown" })}</p>
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
