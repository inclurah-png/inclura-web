
import { useEffect, useState } from "react";
import { getIdTokenResult } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useTranslation } from "react-i18next";

function EmergencyResponders() {
  const { t } = useTranslation();
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorised, setAuthorised] = useState(false);
  const [error, setError] = useState("");
  const [accessChecked, setAccessChecked] = useState(false);
  const [notificationOnly, setNotificationOnly] = useState(false);

  useEffect(() => {
    let unsubscribe = null;
    let active = true;

    async function initialise() {
      setLoading(true);
      setError("");

      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          throw new Error(t("responderSignInAdmin"));
        }

        // Refresh the token so the current administrator claim is checked.
        const tokenResult = await getIdTokenResult(currentUser, true);

        if (!active) return;

        if (tokenResult.claims.sosNotificationOnly === true) {
          // Notification-only accounts must not see responder-management controls.
          setNotificationOnly(true);
          setAuthorised(false);
          setAccessChecked(true);
          setLoading(false);
          return;
        }

        if (tokenResult.claims.admin !== true) {
          setAuthorised(false);
          setError(t("responderAdminOnly"));
          setAccessChecked(true);
          setLoading(false);
          return;
        }

        setAuthorised(true);
        setAccessChecked(true);

        const respondersQuery = query(
          collection(db, "users"),
          where("isResponder", "==", true)
        );

        unsubscribe = onSnapshot(
          respondersQuery,
          (snapshot) => {
            if (!active) return;

            const list = snapshot.docs.map((document) => {
              const data = document.data();

              // Keep only fields needed by this monitoring screen.
              return {
                id: document.id,
                displayName:
                  data.displayName || data.fullName || t("emergencyResponders"),
                responderAgency: data.responderAgency || t("unknown"),
                responderRole: data.responderRole || t("emergencyResponders"),
                availability: data.availability || t("unknown"),
                onDuty: data.onDuty === true,
                verified: data.verified === true,
                ifseVerified: data.ifseVerified === true,
                suspended: data.suspended === true,
                completedMissions:
                  Number.isFinite(data.completedMissions) &&
                  data.completedMissions >= 0
                    ? data.completedMissions
                    : 0,
              };
            });

            setResponders(list);
            setLoading(false);
            setError("");
          },
          (snapshotError) => {
            if (!active) return;

            console.error(
              "IFSE Emergency Responders listener failed:",
              snapshotError
            );

            setError(
              snapshotError.code === "permission-denied"
                ? t("responderAccessDenied")
                : t("responderLoadError")
            );

            setResponders([]);
            setLoading(false);
          }
        );
      } catch (initialiseError) {
        if (!active) return;

        console.error(
          "IFSE Emergency Responders initialisation failed:",
          initialiseError
        );

        setAuthorised(false);
        setAccessChecked(true);
        setResponders([]);
        setError(
          initialiseError.message ||
            t("responderVerifyError")
        );
        setLoading(false);
      }
    }

    initialise();

    return () => {
      active = false;

      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const isAvailable = (responder) => {
    const availability =
      typeof responder.availability === "string"
        ? responder.availability.toLowerCase().trim()
        : "";

    return (
      responder.onDuty &&
      availability === "available" &&
      responder.verified &&
      responder.ifseVerified &&
      !responder.suspended
    );
  };

  const availableCount = responders.filter(isAvailable).length;

  if (notificationOnly) return null;

  const cardStyle = {
    background: "#111827",
    padding: "15px",
    borderRadius: "12px",
    marginTop: "15px",
    border: "1px solid #334155",
  };

  return (
    <section
      style={{
        background: "#0f172a",
        color: "#f8fafc",
        padding: "24px",
        borderRadius: "20px",
        marginBottom: "20px",
      }}
    >
      <h3>🚑 {t("ifseEmergencyResponders")}</h3>

      <p>
        {t("responderRecords")}: <strong>{responders.length}</strong>
      </p>

      <p>
        {t("responderEligibleAvailable")}:{" "}
        <strong>{availableCount}</strong>
      </p>

      <p style={{ color: "#cbd5e1", fontSize: "13px" }}>
        {t("responderEligibilityNote")}
      </p>

      {loading && (
        <p role="status">{t("responderLoading")}</p>
      )}

      {!loading && error && (
        <div
          role="alert"
          style={{
            background: "#451a1a",
            color: "#fecaca",
            padding: "12px",
            borderRadius: "10px",
            marginTop: "15px",
          }}
        >
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        accessChecked &&
        authorised &&
        responders.length === 0 && (
          <p>{t("responderNone")}</p>
        )}

      {!loading &&
        !error &&
        authorised &&
        responders.map((responder) => {
          const eligible = isAvailable(responder);

          return (
            <article key={responder.id} style={cardStyle}>
              <strong>{responder.displayName}</strong>

              <p>
                Agency: {responder.responderAgency}
              </p>

              <p>
                Role: {responder.responderRole}
              </p>

              <p>
                {t("responderAvailability")}: {responder.availability}
              </p>

              <p>
                Duty status: {responder.onDuty ? t(responder.onDuty ? "responderOnDuty" : "responderOffDuty")}
              </p>

              <p>
                {t("responderIdentityVerification")}:{" "}
                {responder.verified ? t(responder.verified ? "verified" : "notVerified")}
              </p>

              <p>
                {t("responderIfseVerification")}:{" "}
                {responder.ifseVerified ? "Verified" : "Not verified"}
              </p>

              <p>
                {t("responderAccountStatus")}:{" "}
                {responder.suspended ? t(responder.suspended ? "suspended" : "notSuspended")}
              </p>

              <p>
                {t("responderMissionsCompleted")}: {responder.completedMissions}
              </p>

              <p
                style={{
                  color: eligible ? "#86efac" : "#fcd34d",
                  fontWeight: "bold",
                }}
              >
                {eligible
                  ? t("responderEligibleAvailable")
                  : t("responderNotEligible")}
              </p>
            </article>
          );
        })}
    </section>
  );
}

export default EmergencyResponders;
