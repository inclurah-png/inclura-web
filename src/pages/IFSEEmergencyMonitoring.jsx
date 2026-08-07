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

  useEffect(() => {
    const q = query(
  collection(db, "ifseAuditLogs"),
  where("module", "==", "SOS"),
  orderBy("createdAt", "desc"),
  limit(10)
);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
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
<h3>🛡 IFSE SOS Emergency Monitoring</h3>

<p>
  Recent IFSE security and emergency-dispatch events
</p>

      {events.length === 0 ? (
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
            }}
          >
            <strong>{event.action}</strong>

<br />

Module: {event.module}

<br />

Emergency Type: {event.emergencyType || "SOS"}

            <br />

            Emergency: {event.emergencyId}

<br />

Routing Status:{" "}
{event.routingStatus || "Automatic"}

<br />

Government Alert:{" "}
{event.governmentAlert === true
  ? "Initiated"
  : "Pending"}

<br />

Paramilitary Alert:{" "}
{event.paramilitaryAlert === true
  ? "Initiated"
  : "Pending"}

<br />

Military Alert:{" "}
{event.militaryAlert === true
  ? "Initiated"
  : "Pending"}

<br />

Actor: {

            <br />

            Description: {event.description}
                        <br />

            Event Time:{" "}
            {event.createdAt
              ? event.createdAt.toDate
                ? event.createdAt.toDate().toLocaleString()
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
                        <br />

            Assigned Agency:{" "}
            {event.assignedAgency || "Awaiting Assignment"}

            <br />

            Responder:{" "}
            {event.responderName || "Awaiting Responder"}
                        <br />

            Escalation Level:{" "}
            {event.escalationLevel ?? 0}

            <br />

            Escalation Status:{" "}
            {event.escalationStatus || "Monitoring"}

            <br />

            Satellite Backup:{" "}
            {event.satelliteActivated === true
              ? "Activated"
              : "Standby"}
                        <br />

            GPS Latitude:{" "}
            {event.gpsLatitude ?? "Unavailable"}

            <br />

            GPS Longitude:{" "}
            {event.gpsLongitude ?? "Unavailable"}

            <br />

            GPS Accuracy:{" "}
            {event.gpsAccuracy
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
            {event.auditStatus || "Recorded"}
          </div>
        ))
      )}
    </div>
  );
}

export default IFSEEmergencyMonitoring;
