import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  addDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import DashboardLayout from "../components/DashboardLayout";

function ResponderAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {
    try {
      const q = query(
  collection(db, "emergencyAssignments"),
  where("assignmentStatus", "==", "Pending"),
  where("accepted", "==", false),
  where("cancelled", "==", false)
);

      const snapshot = await getDocs(q);
    console.log("Documents found:", snapshot.size);

snapshot.forEach(doc => {
  console.log(doc.id, doc.data());
});

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAssignments(data);
    } catch (err) {
      console.error("Responder Assignments:", err);
    } finally {
      setLoading(false);
    }
  }

  // =========================
// START RESPONSE
// =========================
async function startResponse(assignment) {
  try {
    await updateDoc(
  doc(db, "emergencyAssignments", assignment.id),
  {
    assignmentStatus: "Responding",
    responderStatus: "En Route",
    startedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
);

await syncFamilyEmergency({

  emergencyId: assignment.emergencyId,

  assignmentId: assignment.id,

  responderId: assignment.responderId,

  responderName: assignment.responderName,

  responderAgency: assignment.responderAgency,

  emergencyType: assignment.emergencyType,

  location: assignment.location,

  priority: assignment.dispatchPriority,

  status: "Responder Travelling",

  responseStatus: "Responder En Route",

  eventType: "Responder Started",

  eventDescription:
    assignment.responderName +
    " has started responding.",

});
    await loadAssignments();

    alert("Response started successfully.");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// =========================
// ARRIVED
// =========================
async function markArrived(assignment) {
  try {
    await updateDoc(
  doc(db, "emergencyAssignments", assignment.id),
  {
    assignmentStatus: "On Scene",
    arrived: true,
    arrivedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
);

await syncFamilyEmergency({

  emergencyId: assignment.emergencyId,

  assignmentId: assignment.id,

  responderId: assignment.responderId,

  responderName: assignment.responderName,

  responderAgency: assignment.responderAgency,

  emergencyType: assignment.emergencyType,

  location: assignment.location,

  priority: assignment.dispatchPriority,

  status: "Responder On Scene",

  responseStatus: "Responder Arrived",

  eventType: "Responder Arrived",

  eventDescription:
    assignment.responderName +
    " arrived at the incident scene.",

});

    await loadAssignments();

    alert("Arrival recorded.");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// =========================
// REQUEST BACKUP
// =========================
async function requestBackup(assignment) {
  try {

    await addDoc(
      collection(db, "backupRequests"),
      {
        emergencyId: assignment.emergencyId,
        assignmentId: assignment.id,
        responderAgency: assignment.responderAgency,
        responderId: assignment.responderId,
        priority: assignment.dispatchPriority,
        requestedAt: serverTimestamp(),
        status: "Pending IFSE Dispatch",
      }
    );

    alert("Backup request sent to IFSE.");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// =========================
// COMPLETE MISSION
// =========================
async function completeMission(assignment) {
  try {

    await updateDoc(
  doc(db, "emergencyAssignments", assignment.id),
  {
    assignmentStatus: "Completed",
    completed: true,
    completedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
);

// Close Emergency SOS
await updateDoc(
  doc(db, "emergencySOS", assignment.emergencyId),
  {
    status: "resolved",
    responseStatus: "Mission Completed",
    incidentStatus: "Closed",
    updatedAt: serverTimestamp(),
  }
);

// Timeline
await addDoc(collection(db, "emergencyTimeline"), {
  emergencyId: assignment.emergencyId,
  eventType: "Mission Completed",
  eventDescription:
    assignment.responderName + " completed the emergency response.",
  performerType: "Responder",
  responderId: assignment.responderId,
  responderName: assignment.responderName,
  responderAgency: assignment.responderAgency,
  eventStatus: "Completed",
  severity: assignment.dispatchPriority,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

// Emergency Notification
await addDoc(collection(db, "emergencyNotifications"), {
  emergencyId: assignment.emergencyId,
  recipientType: "Emergency User",
  emergencyType: "Mission Completed",
  priority: assignment.dispatchPriority,
  assignedAgency: assignment.responderAgency,
  notificationStatus: "Pending",
  deliveryMethod: "System",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});
    await loadAssignments();

    alert("Mission completed.");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}
  return (
    <DashboardLayout>
      <div style={{ color: "#fff" }}>
        <h1>🚑 Responder Assignments</h1>

        <div style={card}>
          <h2>Pending Assignments</h2>

          <p>Total: {assignments.length}</p>

          {loading ? (
            <p>Loading...</p>
          ) : assignments.length === 0 ? (
            <p>No pending assignments.</p>
          ) : (
            assignments.map((assignment) => (
              <div
                key={assignment.id}
                style={assignmentCard}
              >
                <h3>
                  {assignment.responderAgency || "Emergency Agency"}
                </h3>

                <p>
                  <strong>Emergency ID:</strong>{" "}
                  {assignment.emergencyId}
                </p>

                <p>
                  <strong>Responder:</strong>{" "}
                  {assignment.responderName}
                </p>

                <p>
                  <strong>Priority:</strong>{" "}
                  {assignment.dispatchPriority}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {assignment.assignmentStatus}
                </p>

                <p>
                  <strong>Estimated Arrival:</strong>{" "}
                  {assignment.estimatedArrivalMinutes || 0} mins
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
  style={startButton}
  onClick={() => startResponse(assignment)}
>
  🚗 Start Response
</button>

<button
  style={arrivedButton}
  onClick={() => markArrived(assignment)}
>
  📍 Arrived
</button>
                  
<button
  style={backupButton}
  onClick={() => requestBackup(assignment)}
>
  🚑 Request Backup
</button>

<button
  style={completeButton}
  onClick={() => completeMission(assignment)}
>
  ✅ Mission Complete
</button>

<a
  href={`/responder-incident-report?emergencyId=${assignment.emergencyId}&assignmentId=${assignment.id}&responderId=${assignment.responderId}`}
  style={{
    textDecoration: "none",
  }}
>
  <button
    style={{
      padding: "10px 18px",
      background: "#7c3aed",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
    }}
  >
    📝 Incident Report
  </button>
</a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

const card = {
  background: "#0f172a",
  padding: "24px",
  borderRadius: "18px",
};

const assignmentCard = {
  marginTop: "18px",
  padding: "18px",
  borderRadius: "12px",
  background: "#111827",
};

const startButton = {
  padding: "10px 18px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const arrivedButton = {
  padding: "10px 18px",
  background: "#0891b2",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const backupButton = {
  padding: "10px 18px",
  background: "#d97706",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const completeButton = {
  padding: "10px 18px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

export default ResponderAssignments;
