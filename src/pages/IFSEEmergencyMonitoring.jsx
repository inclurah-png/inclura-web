import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

function IFSEEmergencyMonitoring() {
  const [events, setEvents] = useState([]);
  const [monitoringError, setMonitoringError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "ifseAuditLogs"),
      where("module", "==", "SOS"),
      where("ifseGenerated", "==", true),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setMonitoringError("");
        setLoading(false);

        setEvents(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      },
      (error) => {
        console.error(
          "IFSE Emergency Monitoring Error:",
          error
        );

        setEvents([]);

        setMonitoringError(
          error?.message ||
            "Unable to load IFSE emergency monitoring events."
        );

        setLoading(false);
      }
    );

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
      <h3>🛡 IFSE SOS Emergency Monitoring</h3>

      <p>
        Recent IFSE security and emergency-dispatch events
      </p>

      {monitoringError && (
        <div
          style={{
            background: "#7f1d1d",
            padding: "12px",
            borderRadius: "10px",
            marginTop: "15px",
          }}
        >
          <strong>Monitoring Error:</strong>

          <br />

          {monitoringError}
        </div>
      )}

      <div
        style={{
          background: "#111827",
          padding: "15px",
          borderRadius: "12px",
          marginTop: "15px",
        }}
      >
        <strong>Monitoring Summary</strong>

        <h4
          style={{
            marginTop: "10px",
            marginBottom: "5px",
          }}
        >
          Events Loaded: {events.length}
        </h4>

        <br />

        Latest Event:{" "}
        {events.length > 0 &&
        events[0].createdAt
          ? events[0].createdAt.toDate
            ? events[0].createdAt
                .toDate()
                .toLocaleString()
            : String(events[0].createdAt)
          : "No events available"}

        <br />

        Monitoring Scope: SOS

        <br />

        Last Monitor Update:{" "}
        {new Date().toLocaleString()}

        <br />

        IFSE Generated Events: Yes

        <br />

        IFSE Monitoring Status:{" "}
        {loading
          ? "Connecting..."
          : monitoringError
          ? "Connection Error"
          : "Live"}

        <br />

        Live Monitoring:{" "}
        {monitoringError
          ? "Connection Issue"
          : "Active"}
      </div>

      {loading ? (
        <p>Loading IFSE emergency events...</p>
      ) : events.length === 0 ? (
        <p>No IFSE events found.</p>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            style={{
              background: "#111827",
              padding: "15px",
              borderRadius: "12px",
              marginTop: "15px",
              lineHeight: "1.7",
            }}
          >
            <strong>
              {event.action ||
                "IFSE Emergency Event"}
            </strong>

            <br />

            Module:{" "}
            {event.module || "SOS"}

            <br />

            Emergency:{" "}
            {event.emergencyId ||
              "Unavailable"}

            <br />

            Actor:{" "}
            {event.actor || "IFSE System"}

            <br />

            Description:{" "}
            {event.description ||
              "No description available."}

            <br />

            Assigned Agency:{" "}
            {event.assignedAgency ||
              "Awaiting Assignment"}

            <br />

            Responder:{" "}
            {event.responderName ||
              "Awaiting Responder"}

            <br />

            Escalation Level:{" "}
            {event.escalationLevel ?? 0}

            <br />

            Escalation Status:{" "}
            {event.escalationStatus ||
              "Monitoring"}

            <br />

            Satellite Backup:{" "}
            {event.satelliteActivated === true
              ? "Activated"
              : "Standby"}

            <br />

            GPS Latitude:{" "}
            {event.gpsLatitude ??
              "Unavailable"}

            <br />

            GPS Longitude:{" "}
            {event.gpsLongitude ??
              "Unavailable"}

            <br />

            GPS Accuracy:{" "}
            {event.gpsAccuracy != null
              ? `${event.gpsAccuracy} m`
              : "Unavailable"}

            <br />

            Notification Routing:{" "}
            {event.notificationRouting ||
              "Automatic IFSE Routing"}

            <br />

            Trusted Contacts:{" "}
            {event.trustedContactsNotified === true
              ? "Queued"
              : "Pending"}

            <br />

            Family Network:{" "}
            {event.familyNetworkNotified === true
              ? "Queued"
              : "Pending"}

            <br />

            Government Command:{" "}
            {event.governmentAlert === true
              ? "Queued"
              : "Pending"}

            <br />

            Healthcare Routing:{" "}
            {event.healthcareRouting ||
              "Not Applicable"}

            <br />

            Healthcare Recipient:{" "}
            {event.healthcareRecipient ||
              "Awaiting Registered Recipient"}

            <br />

            Healthcare Alert:{" "}
            {event.healthcareAlert === true
              ? "Queued"
              : "Pending"}

            <br />

            Healthcare Payment Required:{" "}
            {event.healthcarePaymentRequired === false
              ? "No"
              : "No"}

            <br />

            IFSE Status:{" "}
            {event.status || "Active"}

            <br />

            Audit Status:{" "}
            {event.auditStatus ||
              "Recorded"}

            <br />

            Event Time:{" "}
            {event.createdAt
              ? event.createdAt.toDate
                ? event.createdAt
                    .toDate()
                    .toLocaleString()
                : String(event.createdAt)
              : "Unavailable"}

            <br />

            IFSE Generated:{" "}
            {event.ifseGenerated === true
              ? "Yes"
              : "No"}

            <br />

            Automatic Alert:{" "}
            {event.automaticAlert === true
              ? "Yes"
              : "No"}

            <br />

            Payment Required:{" "}
            {event.paymentRequired === false
              ? "No"
              : "No"}
          </div>
        ))
      )}
    </div>
  );
}

export default IFSEEmergencyMonitoring;
