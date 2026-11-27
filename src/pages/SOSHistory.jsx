import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { auth, db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

function formatTimestamp(value) {
  if (!value) return "—";
  if (typeof value.toDate === "function") return value.toDate().toLocaleString();
  return String(value);
}

function SOSHistory() {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  useEffect(() => {
    if (!auth.currentUser) return undefined;
    const q = query(collection(db, "emergencySOS"), where("userId", "==", auth.currentUser.uid), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => setHistory(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))));
  }, []);

  return (
    <section aria-labelledby="sos-history-title" style={{ background: "#0f172a", padding: "24px", borderRadius: "20px", marginBottom: "20px" }}>
      <h3 id="sos-history-title">{t("sosHistoryTitle", { defaultValue: "SOS History" })}</h3>
      <p aria-live="polite">{t("sosTotalEmergencies", { defaultValue: "Total Emergencies" })}: {history.length}</p>
      {history.length === 0 ? <p>{t("sosNoHistory", { defaultValue: "No emergency history available." })}</p> : history.map((item) => {
        const gps = item.latitude || item.gpsLatitude ? `${item.latitude || item.gpsLatitude}, ${item.longitude || item.gpsLongitude || ""}` : t("sosCoordinatesUnavailable", { defaultValue: "Location coordinates unavailable" });
        const automaticDispatch = item.automaticDispatch === true || item.ifseDispatch === true;
        return (
          <article key={item.id} style={{ background: "#111827", padding: "15px", borderRadius: "12px", marginTop: "15px" }}>
            <h4 style={{ marginTop: 0 }}>{item.emergencyType || t("sosEmergency", { defaultValue: "Emergency" })}</h4>
            <p><strong>{t("sosPriority", { defaultValue: "Priority" })}:</strong> {item.priority || t("sosUnknown", { defaultValue: "Unknown" })}</p>
            <p><strong>{t("sosStatus", { defaultValue: "Status" })}:</strong> {item.status || t("sosUnknown", { defaultValue: "Unknown" })}</p>
            <p><strong>{t("sosResponse", { defaultValue: "Response" })}:</strong> {item.responseStatus || t("sosPending", { defaultValue: "Awaiting response" })}</p>
            <p><strong>{t("sosIfseDispatch", { defaultValue: "IFSE Dispatch" })}:</strong> {automaticDispatch ? t("sosAutomatic", { defaultValue: "Automatic" }) : t("sosNotRecorded", { defaultValue: "Not recorded" })}</p>
            <p><strong>{t("sosLocation", { defaultValue: "Location" })}:</strong> {item.location || t("sosNotProvided", { defaultValue: "Not provided" })}</p>
            <p><strong>GPS:</strong> {gps}</p>
            <p><strong>{t("sosIncidentNumber", { defaultValue: "Incident number" })}:</strong> {item.incidentNumber || t("sosNotAssigned", { defaultValue: "Not assigned" })}</p>
            <p><strong>{t("sosClassification", { defaultValue: "IFSE Classification" })}:</strong> {item.ifseClassification || t("sosPending", { defaultValue: "Pending" })}</p>
            <p><strong>{t("sosMonitoring", { defaultValue: "Monitoring" })}:</strong> {item.ifseMonitoring === true ? t("sosActive", { defaultValue: "Active" }) : t("sosNotRecorded", { defaultValue: "Not recorded" })}</p>
            <p><strong>{t("sosAssignedAgency", { defaultValue: "Assigned agency" })}:</strong> {item.assignedAgency || t("sosNotAssigned", { defaultValue: "Not assigned" })}</p>
            <p><strong>{t("sosAssignedResponder", { defaultValue: "Assigned responder" })}:</strong> {item.assignedResponder || t("sosNotAssigned", { defaultValue: "Not assigned" })}</p>
            <p><strong>{t("sosAssignmentStatus", { defaultValue: "Assignment status" })}:</strong> {item.assignmentStatus || t("sosPending", { defaultValue: "Pending" })}</p>
            <p><strong>{t("sosIncidentStatus", { defaultValue: "Incident status" })}:</strong> {item.incidentStatus || t("sosActive", { defaultValue: "Active" })}</p>
            <p><strong>{t("sosResolved", { defaultValue: "Resolved" })}:</strong> {item.resolved === true ? t("sosYes", { defaultValue: "Yes" }) : t("sosNo", { defaultValue: "No" })}</p>
            <p><strong>{t("sosResolution", { defaultValue: "Resolution" })}:</strong> {item.resolutionNotes || t("sosNoResolution", { defaultValue: "No resolution recorded" })}</p>
            <p><strong>{t("sosResolvedBy", { defaultValue: "Resolved by" })}:</strong> {item.resolvedBy || t("sosNotResolved", { defaultValue: "Not yet resolved" })}</p>
            <p><strong>{t("sosCreatedAt", { defaultValue: "Created at" })}:</strong> {formatTimestamp(item.createdAt)}</p>
            <p><strong>{t("sosLastUpdated", { defaultValue: "Last updated" })}:</strong> {formatTimestamp(item.lastUpdated || item.updatedAt)}</p>
            <p><strong>{t("sosClosedAt", { defaultValue: "Closed at" })}:</strong> {formatTimestamp(item.closedAt)}</p>
          </article>
        );
      })}
    </section>
  );
}
export default SOSHistory;
