import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

function formatTimestamp(value) {
  if (!value) return "Unavailable";
  if (value.toDate) return value.toDate().toLocaleString();
  return String(value);
}

function SOSHistory() {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return undefined;

    const q = query(
      collection(db, "emergencySOS"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      setHistory(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );
    });
  }, []);

  return (
    <section
      aria-labelledby="sos-history-title"
      style={{
        background: "#0f172a",
        padding: "24px",
        borderRadius: "20px",
        marginBottom: "20px",
      }}
    >
      <h3 id="sos-history-title">{t("sosHistoryTitle", { defaultValue: "SOS History" })}</h3>
      <p aria-live="polite">{t("sosTotalEmergencies", { defaultValue: "Total Emergencies" })}: {history.length}</p>

      {history.length === 0 ? (
        <p>{t("sos{t("sosNo", { defaultValue: "No" })}History", { defaultValue: "{t("sosNo", { defaultValue: "No" })} emergency history available." })}</p>
      ) : (
        history.map((item) => {
          const gps =
            item.latitude || item.gpsLatitude
              ? `${item.latitude || item.gpsLatitude}, ${item.longitude || item.gpsLongitude || ""}`
              : "{t("sosCoordinatesUnavailable", { defaultValue: "Location coordinates unavailable" })}";

          const automaticDispatch =
            item.automaticDispatch === true || item.ifseDispatch === true;

          return (
            <article
              key={item.id}
              style={{
                background: "#111827",
                padding: "15px",
                borderRadius: "12px",
                marginTop: "15px",
              }}
            >
              <h4 style={{ marginTop: 0 }}>
                {item.emergencyType || "{t("sosEmergency", { defaultValue: "Emergency" })}"}
              </h4>

              <p><strong>{t("sosPriority", { defaultValue: "Priority" })}:</strong> {item.priority || "Unknown"}</p>
              <p><strong>{t("sosStatus", { defaultValue: "Status" })}:</strong> {item.status || "Unknown"}</p>
              <p>
                <strong>{t("sosResponse", { defaultValue: "Response" })}:</strong>{" "}
                {item.responseStatus || "{t("sos{t("sosPending", { defaultValue: "Pending" })}", { defaultValue: "Awaiting Response" })}"}
              </p>
              <p>
                <strong>{t("sosIfseDispatch", { defaultValue: "IFSE Dispatch" })}:</strong>{" "}
                {automaticDispatch ? "{t("sosAutomatic", { defaultValue: "Automatic" })}" : "{t("sos{t("sosNo", { defaultValue: "No" })}tRecorded", { defaultValue: "{t("sosNo", { defaultValue: "No" })}t recorded" })}"}
              </p>
              <p><strong>{t("sosLocation", { defaultValue: "Location" })}:</strong> {item.location || "{t("sos{t("sosNo", { defaultValue: "No" })}tProvided", { defaultValue: "{t("sosNo", { defaultValue: "No" })}t provided" })}"}</p>
              <p><strong>{t("sosGps", { defaultValue: "GPS" })}:</strong> {gps}</p>
              <p>
                <strong>{t("sosIncidentNumber", { defaultValue: "Incident Number" })}:</strong>{" "}
                {item.incidentNumber || "{t("sos{t("sosNo", { defaultValue: "No" })}tAssigned", { defaultValue: "{t("sosNo", { defaultValue: "No" })}t assigned" })}"}
              </p>
              <p>
                <strong>{t("sosClassification", { defaultValue: "IFSE Classification" })}:</strong>{" "}
                {item.ifseClassification || "{t("sosPending", { defaultValue: "Pending" })}"}
              </p>
              <p>
                <strong>{t("sosMonitoring", { defaultValue: "Monitoring" })}:</strong>{" "}
                {item.ifseMonitoring === true ? "{t("sosActive", { defaultValue: "Active" })}" : "{t("sos{t("sosNo", { defaultValue: "No" })}tRecorded", { defaultValue: "{t("sosNo", { defaultValue: "No" })}t recorded" })}"}
              </p>
              <p>
                <strong>{t("sosAssignedAgency", { defaultValue: "Assigned Agency" })}:</strong>{" "}
                {item.assignedAgency || "{t("sos{t("sosNo", { defaultValue: "No" })}tAssigned", { defaultValue: "{t("sosNo", { defaultValue: "No" })}t assigned" })}"}
              </p>
              <p>
                <strong>{t("sosAssignedResponder", { defaultValue: "Assigned Responder" })}:</strong>{" "}
                {item.assignedResponder || "{t("sos{t("sosNo", { defaultValue: "No" })}tAssigned", { defaultValue: "{t("sosNo", { defaultValue: "No" })}t assigned" })}"}
              </p>
              <p>
                <strong>Assignment {t("sosStatus", { defaultValue: "Status" })}:</strong>{" "}
                {item.assignmentStatus || "{t("sosPending", { defaultValue: "Pending" })}"}
              </p>
              <p>
                <strong>Incident {t("sosStatus", { defaultValue: "Status" })}:</strong>{" "}
                {item.incidentStatus || "{t("sosActive", { defaultValue: "Active" })}"}
              </p>
              <p>
                <strong>{t("sosResolved", { defaultValue: "Resolved" })}:</strong>{" "}
                {item.resolved === true ? "{t("sosYes", { defaultValue: "Yes" })}" : "{t("sosNo", { defaultValue: "No" })}"}
              </p>
              <p>
                <strong>{t("sosResolution", { defaultValue: "Resolution" })}:</strong>{" "}
                {item.resolution{t("sosNo", { defaultValue: "No" })}tes || "{t("sosNo", { defaultValue: "No" })} resolution recorded"}
              </p>
              <p>
                <strong>{t("sosResolvedBy", { defaultValue: "Resolved By" })}:</strong>{" "}
                {item.resolvedBy || "{t("sosNo", { defaultValue: "No" })}t yet resolved"}
              </p>
              <p>
                <strong>{t("sosCreatedAt", { defaultValue: "Created At" })}:</strong> {formatTimestamp(item.createdAt)}
              </p>
              <p>
                <strong>{t("sosLastUpdated", { defaultValue: "Last Updated" })}:</strong>{" "}
                {formatTimestamp(item.lastUpdated || item.updatedAt)}
              </p>
              <p>
                <strong>{t("sosClosedAt", { defaultValue: "Closed At" })}:</strong> {formatTimestamp(item.closedAt)}
              </p>
            </article>
          );
        })
      )}
    </section>
  );
}

export default SOSHistory;
