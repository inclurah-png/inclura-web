import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

function SOSHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "emergencySOS"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHistory(data);
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
      <h3>📜 SOS History</h3>

      <p>Total Emergencies: {history.length}</p>

      {history.length === 0 ? (
        <p>No emergency history available.</p>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#111827",
              padding: "15px",
              borderRadius: "12px",
              marginTop: "15px",
            }}
          >
                        <strong>{item.emergencyType}</strong>

            <br />

            Emergency Service:{" "}
            {item.emergencyService || "General Emergency"}

            <br />

            Priority: {item.priority}

            <br />

            Status: {item.status}

            <br />

            Response:{" "}
            {item.responseStatus || "Awaiting Response"}

            <br />

            IFSE Dispatch:{" "}
            {item.ifseDispatch
              ? "Automatic"
              : "Pending"}

            <br />

            Government Response:{" "}
            {item.governmentResponse
              ? "Initiated"
              : "Pending"}

            <br />

            Paramilitary Response:{" "}
            {item.paramilitaryResponse
              ? "Initiated"
              : "Pending"}

            <br />

            Military Response:{" "}
            {item.militaryResponse
              ? "Initiated"
              : "Pending"}

            <br />

            SOS Service:{" "}
            {item.sosService ||
              "Social Responsibility"}

            <br />

            Payment Required:{" "}
            {item.paymentRequired === false
              ? "No"
              : "No"}
            
                        Location: {item.location}

            <br />

            GPS:{" "}
            {item.latitude || item.gpsLatitude
              ? `${item.latitude || item.gpsLatitude}, ${
                  item.longitude || item.gpsLongitude || ""
                }`
              : "Location coordinates unavailable"}

            <br />

            Registered Inclura User:{" "}
            {item.registeredIncluraUser === true
              ? "Yes"
              : "Yes"}

            <br />

            Healthcare Routing:{" "}
            {item.healthcareRouting ||
              "Not applicable"}

            <br />

                        Incident Number: {item.incidentNumber}

            <br />

            IFSE Classification:{" "}
            {item.ifseClassification ||
              "Pending"}

            <br />

            IFSE Monitoring:{" "}
            {item.ifseMonitoring
              ? "Active"
              : "Inactive"}

            <br />

            Automatic Alert:{" "}
            {item.automaticDispatch ||
            item.ifseDispatch
              ? "Yes"
              : "Pending"}

            <br />

            Assigned Agency:{" "}
            {item.assignedAgency ||
              "Awaiting Assignment"}

            <br />

            Assigned Responder:{" "}
            {item.assignedResponder ||
              "Awaiting Responder"}

            <br />

                        Incident Number: {item.incidentNumber}

            <br />

            Assigned Responder:{" "}
            {item.assignedResponder ||
              "Awaiting Responder"}

            <br />

            Responder Agency:{" "}
            {item.assignedAgency ||
              "Awaiting Emergency Authority"}

            <br />

            Assignment Status:{" "}
            {item.assignmentStatus ||
              "Pending"}

            <br />

            Automatic Dispatch:{" "}
            {item.automaticDispatch === true
              ? "Yes"
              : "Pending"}

            <br />

            IFSE Generated:{" "}
            {item.ifseDispatch === true
              ? "Yes"
              : "Pending"}
                        <br />

                        <br />

            Emergency Alerts:{" "}
            {item.automaticDispatch === true
              ? "Automatically Initiated"
              : "Pending"}

            <br />

            Government Alert:{" "}
            {item.governmentAlert === true
              ? "Initiated"
              : "Pending"}

            <br />

            Paramilitary Alert:{" "}
            {item.paramilitaryAlert === true
              ? "Initiated"
              : "Pending"}

            <br />

            Military Alert:{" "}
            {item.militaryAlert === true
              ? "Initiated"
              : "Pending"}

            Incident Status:{" "}
            {item.incidentStatus ||
              "Active"}

            <br />

            Resolved:{" "}
            {item.resolved === true
              ? "Yes"
              : "No"}

            <br />

            Resolution:{" "}
            {item.resolutionNotes ||
              "No resolution recorded"}

            <br />

            Resolved By:{" "}
            {item.resolvedBy ||
              "Not yet resolved"}

            <br />

            Closed At:{" "}
            {item.closedAt
              ? item.closedAt.toDate
                ? item.closedAt.toDate().toLocaleString()
                : String(item.closedAt)
              : "Not closed"}
                        <br />

            Created At:{" "}
            {item.createdAt
              ? item.createdAt.toDate
                ? item.createdAt.toDate().toLocaleString()
                : String(item.createdAt)
              : "Unavailable"}

            <br />

            Last Updated:{" "}
            {item.lastUpdated
              ? item.lastUpdated.toDate
                ? item.lastUpdated.toDate().toLocaleString()
                : String(item.lastUpdated)
              : item.updatedAt
                ? item.updatedAt.toDate
                  ? item.updatedAt.toDate().toLocaleString()
                  : String(item.updatedAt)
                : "Unavailable"}
          </div>
        ))
      )}
    </div>
  );
}

export default SOSHistory;
