
import { useEffect, useState } from "react";
import { getIdTokenResult } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebase";

function EmergencyResponders() {
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorised, setAuthorised] = useState(false);
  const [error, setError] = useState("");
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    let unsubscribe = null;
    let active = true;

    async function initialise() {
      setLoading(true);
      setError("");

      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          throw new Error("Please sign in with an administrator account.");
        }

        // Refresh the token so the current administrator claim is checked.
        const tokenResult = await getIdTokenResult(currentUser, true);

        if (!active) return;

        if (tokenResult.claims.admin !== true) {
          setAuthorised(false);
          setError("Access denied. Administrator permission is required.");
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
                  data.displayName || data.fullName || "Responder",
                responderAgency: data.responderAgency || "Unknown",
                responderRole: data.responderRole || "Responder",
                availability: data.availability || "Unknown",
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
                ? "Access denied by Firestore Security Rules. Confirm that administrator access is configured securely."
                : "Unable to load emergency responders. Please try again later."
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
            "Unable to verify administrator access."
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
      <h3>🚑 IFSE Emergency Responders</h3>

      <p>
        Responder records: <strong>{responders.length}</strong>
      </p>

      <p>
        Currently eligible and available:{" "}
        <strong>{availableCount}</strong>
      </p>

      <p style={{ color: "#cbd5e1", fontSize: "13px" }}>
        Eligibility shown here is an administrative overview, not
        confirmation that a responder has accepted an emergency assignment.
      </p>

      {loading && (
        <p role="status">Loading and verifying responder records...</p>
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
          <p>No registered emergency responders were found.</p>
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
                Reported availability: {responder.availability}
              </p>

              <p>
                Duty status: {responder.onDuty ? "On duty" : "Not on duty"}
              </p>

              <p>
                Identity verification:{" "}
                {responder.verified ? "Verified" : "Not verified"}
              </p>

              <p>
                IFSE verification:{" "}
                {responder.ifseVerified ? "Verified" : "Not verified"}
              </p>

              <p>
                Account status:{" "}
                {responder.suspended ? "Suspended" : "Not suspended"}
              </p>

              <p>
                Missions completed: {responder.completedMissions}
              </p>

              <p
                style={{
                  color: eligible ? "#86efac" : "#fcd34d",
                  fontWeight: "bold",
                }}
              >
                {eligible
                  ? "Eligible and available"
                  : "Not currently eligible for dispatch"}
              </p>
            </article>
          );
        })}
    </section>
  );
}

export default EmergencyResponders;
