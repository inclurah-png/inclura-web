import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

function EmergencyAnalytics() {
  const [stats, setStats] = useState({
  totalEmergencies: 0,
  resolved: 0,
  active: 0,
  responders: 0,
  reports: 0,

  medical: 0,
  fire: 0,
  police: 0,
  kidnapping: 0,
  accident: 0,
  disaster: 0,
  securityThreat: 0,
  missingPerson: 0,

  governmentAlerts: 0,
  paramilitaryAlerts: 0,
  militaryAlerts: 0,
  healthcareAlerts: 0,

  pendingNotifications: 0,
  completedNotifications: 0,
});

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const emergencySnap = await getDocs(
          collection(db, "emergencySOS")
        );

        const reportSnap = await getDocs(
          collection(db, "incidentReports")
        );

        const responderSnap = await getDocs(
          collection(db, "emergencyAssignments")
        );

        let active = 0;
let resolved = 0;

let medical = 0;
let fire = 0;
let police = 0;
let kidnapping = 0;
let accident = 0;
let disaster = 0;
let securityThreat = 0;
let missingPerson = 0;

emergencySnap.forEach((doc) => {
  const data = doc.data();

  if (data.status === "resolved") {
    resolved++;
  } else {
    active++;
  }

  switch (data.emergencyType) {
    case "Medical":
      medical++;
      break;

    case "Fire":
      fire++;
      break;

    case "Police":
      police++;
      break;

    case "Kidnapping":
      kidnapping++;
      break;

    case "Accident":
      accident++;
      break;

    case "Disaster":
      disaster++;
      break;

    case "Security Threat":
      securityThreat++;
      break;

    case "Missing Person":
      missingPerson++;
      break;

    default:
      break;
  }
});
          const data = doc.data();

          if (data.status === "resolved") {
            resolved++;
          } else {
            active++;
          }
        });

      let pendingNotifications = 0;
let completedNotifications = 0;

      const notificationSnap = await getDocs(
  collection(db, "emergencyNotifications")
);

notificationSnap.forEach((doc) => {
  const data = doc.data();
    const notificationStatus =
    String(
      data.notificationStatus || ""
    ).toLowerCase();

  if (
    notificationStatus === "pending"
  ) {
    pendingNotifications++;
  }

  if (
    notificationStatus === "completed" ||
    notificationStatus === "delivered"
  ) {
    completedNotifications++;
  }

  const recipientType =
    String(data.recipientType || "").toLowerCase();

  const assignedAgency =
    String(data.assignedAgency || "").toLowerCase();

  const healthcareRouting =
    String(data.healthcareRouting || "").toLowerCase();

  if (
    recipientType.includes("government") ||
    assignedAgency.includes("government")
  ) {
    governmentAlerts++;
  }

  if (
    recipientType.includes("police") ||
    recipientType.includes("fire") ||
    recipientType.includes("paramilitary") ||
    assignedAgency.includes("police") ||
    assignedAgency.includes("fire") ||
    assignedAgency.includes("paramilitary")
  ) {
    paramilitaryAlerts++;
  }

  if (
    recipientType.includes("military") ||
    assignedAgency.includes("army") ||
    assignedAgency.includes("navy") ||
    assignedAgency.includes("military")
  ) {
    militaryAlerts++;
  }

  if (
    recipientType.includes("healthcare") ||
    recipientType.includes("hospital") ||
    healthcareRouting.includes("government_military")
  ) {
    healthcareAlerts++;
  }
});

        setStats({
  totalEmergencies: emergencySnap.size,
  active,
  resolved,
  responders: responderSnap.size,
  reports: reportSnap.size,

  medical,
  fire,
  police,
  kidnapping,
  accident,
  disaster,
  securityThreat,
  missingPerson,

  governmentAlerts,
  paramilitaryAlerts,
  militaryAlerts,
  healthcareAlerts,

  pendingNotifications,
  completedNotifications,
});
      } catch (err) {
        console.error(err);
      }
    }

    loadAnalytics();
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
      <h3>📊 Emergency Analytics</h3>

      <div style={grid}>

        <Card
          title="Total Emergencies"
          value={stats.totalEmergencies}
        />

        <Card
          title="Active"
          value={stats.active}
        />

        <Card
          title="Resolved"
          value={stats.resolved}
        />

        <Card
          title="Assignments"
          value={stats.responders}
        />

           <Card
          title="Medical"
          value={stats.medical}
        />

        <Card
          title="Fire"
          value={stats.fire}
        />

        <Card
          title="Police"
          value={stats.police}
        />

        <Card
          title="Kidnapping"
          value={stats.kidnapping}
        />

        <Card
          title="Accident"
          value={stats.accident}
        />

        <Card
          title="Disaster"
          value={stats.disaster}
        />

        <Card
          title="Security Threat"
          value={stats.securityThreat}
        />

        <Card
          title="Missing Person"
          value={stats.missingPerson}
        />
                <Card
          title="Government Alerts"
          value={stats.governmentAlerts}
        />

        <Card
          title="Paramilitary Alerts"
          value={stats.paramilitaryAlerts}
        />

        <Card
          title="Military Alerts"
          value={stats.militaryAlerts}
        />

        <Card
          title="Healthcare Alerts"
          value={stats.healthcareAlerts}
        />
                <Card
          title="Pending Notifications"
          value={stats.pendingNotifications}
        />

        <Card
          title="Completed Notifications"
          value={stats.completedNotifications}
        />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#111827",
        padding: "20px",
        borderRadius: "15px",
      }}
    >
      <h4>{title}</h4>

      <h2>{value}</h2>
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: "15px",
};

export default EmergencyAnalytics;
