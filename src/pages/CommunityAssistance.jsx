import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useTranslation } from "react-i18next";

function CommunityAssistance() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "communityAssistance"),
      where("status", "==", "Active")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRequests(data);
    });

    return () => unsubscribe();
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
      <h3>{t("communityAssistanceTitle", { defaultValue: "Community Assistance" })}</h3>

      <p>{t("communityActiveAlerts", { defaultValue: "Active Community Alerts" })}: {requests.length}</p>

      {requests.length === 0 ? (
        <p>{t("communityNoRequests", { defaultValue: "No community assistance requests." })}</p>
      ) : (
        requests.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#111827",
              padding: "15px",
              borderRadius: "12px",
              marginTop: "15px",
            }}
          >
            <strong>{item.assistanceType || "Community Help"}</strong>

            <br />

            {t("communityDescription", { defaultValue: "Description" })}:
            {" "}
            {item.description}

            <br />

            {t("sosLocation", { defaultValue: "Location" })}:
            {" "}
            {item.location}

            <br />

            {t("communityPriority", { defaultValue: "Priority" })}:
            {" "}
            {item.priority}

            <br />

            {t("sosStatus", { defaultValue: "Status" })}:
            {" "}
            {item.status}
          </div>
        ))
      )}
    </div>
  );
}

export default CommunityAssistance;
