import { useEffect, useState } from "react";

import DashboardLayout from "../components/DashboardLayout";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  db,
  auth,
} from "../firebase";

function ApplicantManagement() {
  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      const recruiter =
        auth.currentUser;

      if (!recruiter) {
        return;
      }

      const q = query(
        collection(db, "applications"),
        where(
          "recruiterId",
          "==",
          recruiter.uid
        )
      );

      const snapshot =
        await getDocs(q);

      const data = [];

      snapshot.forEach((item) => {
        data.push({
          id: item.id,
          ...item.data(),
        });
      });

      setApplications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    id,
    status
  ) {
    try {
      await updateDoc(
        doc(
          db,
          "applications",
          id
        ),
        {
          status,
        }
      );

      setApplications((prev) =>
        prev.map((app) =>
          app.id === id
            ? {
                ...app,
                status,
              }
            : app
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        "Unable to update application."
      );
    }
  }

  const cardStyle = {
    background: "#0f172a",
    padding: "24px",
    borderRadius: "20px",
    marginBottom: "20px",
    color: "white",
  };
  return (
    <DashboardLayout>
      <div
        style={{
          color: "white",
        }}
      >
        <h1>
          👥 Applicant Management
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "30px",
          }}
        >
          Manage all applications
          submitted to your
          opportunities.
        </p>

        {loading ? (
          <div style={cardStyle}>
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div style={cardStyle}>
            No applications yet.
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              style={cardStyle}
            >
              <h2
                style={{
                  marginBottom: "10px",
                }}
              >
                {app.fullName}
              </h2>

              <p>
                📧 {app.email}
              </p>

              <p>
                📱 {app.phone}
              </p>

              <p>
                💼 Applied For:
                {" "}
                {app.jobTitle}
              </p>

              <p>
                📅 Applied:
                {" "}
                {app.createdAt
                  ?.seconds
                  ? new Date(
                      app.createdAt.seconds *
                        1000
                    ).toLocaleDateString()
                  : "Recently"}
              </p>

              <p>
                🟢 Current Status:
                {" "}
                <strong>
                  {app.status}
                </strong>
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() =>
                    updateStatus(
                      app.id,
                      "Pending"
                    )
                  }
                  style={statusButton}
                >
                  Pending
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      app.id,
                      "Shortlisted"
                    )
                  }
                  style={statusButton}
                >
                  Shortlist
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      app.id,
                      "Interview"
                    )
                  }
                  style={statusButton}
                >
                  Interview
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      app.id,
                      "Hired"
                    )
                  }
                  style={statusButton}
                >
                  Hire
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      app.id,
                      "Rejected"
                    )
                  }
                  style={{
                    ...statusButton,
                    background:
                      "#dc2626",
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

const statusButton = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  background: "#38bdf8",
  color: "white",
};

export default ApplicantManagement;
