import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
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
                  <button style={acceptButton}>
                    ✅ Accept Emergency
                  </button>

                  <button style={rejectButton}>
                    ❌ Reject
                  </button>
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

const acceptButton = {
  padding: "10px 18px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const rejectButton = {
  padding: "10px 18px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

export default ResponderAssignments;
