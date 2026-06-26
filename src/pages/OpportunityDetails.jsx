import { useEffect, useState } from "react";

import {
  useParams,
} from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import {
  db,
  auth,
} from "../firebase";

import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

function OpportunityDetails() {
  const { id } =
    useParams();

  const [job, setJob] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [applying, setApplying] =
    useState(false);

  useEffect(() => {
    loadOpportunity();
  }, []);

  async function loadOpportunity() {
    try {
      const snap =
        await getDoc(
          doc(
            db,
            "opportunities",
            id
          )
        );

      if (
        snap.exists()
      ) {
        setJob({
          id: snap.id,
          ...snap.data(),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function applyNow() {
    try {
      setApplying(true);

      const user =
        auth.currentUser;

      if (!user) {
        alert(
          "Please login first."
        );
        return;
      }

      await addDoc(
        collection(
          db,
          "applications"
        ),
        {
          opportunityId:
            job.id,

          recruiterId:
            job.recruiterId,

          applicantId:
            user.uid,

          applicantName:
            user.displayName ||
            "",

          applicantEmail:
            user.email,

          status:
            "pending",

          createdAt:
            serverTimestamp(),
        }
      );

      await updateDoc(
        doc(
          db,
          "opportunities",
          job.id
        ),
        {
          applications:
            increment(1),
        }
      );

      alert(
        "Application submitted successfully."
      );

      loadOpportunity();
    } catch (err) {
      console.error(err);

      alert(
        "Unable to submit application."
      );
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <h2
          style={{
            color: "white",
          }}
        >
          Loading...
        </h2>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout>
        <h2
          style={{
            color: "white",
          }}
        >
          Opportunity not found.
        </h2>
      </DashboardLayout>
    );
  }

  const card = {
    background:
      "#0f172a",
    padding: "24px",
    borderRadius: "20px",
    marginBottom: "20px",
    color: "white",
  };
  return (
    <DashboardLayout>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* Header */}

        <div style={card}>
          <h1>{job.title}</h1>

          <h3
            style={{
              color: "#38bdf8",
            }}
          >
            {job.company}
          </h3>

          <p>
            📍 {job.location}
          </p>

          <p>
            💼 {job.employmentType}
          </p>

          <p>
            💰 {job.salary}
          </p>

          <p>
            📅 Deadline:
            {" "}
            {job.deadline}
          </p>

          <p>
            👥 Applications:
            {" "}
            {job.applications || 0}
          </p>

          <p>
            ⭐ Recruiter Plan:
            {" "}
            {job.recruiterPlan}
          </p>
        </div>

        {/* Description */}

        <div style={card}>
          <h2>
            Opportunity Description
          </h2>

          <p
            style={{
              whiteSpace:
                "pre-wrap",
              lineHeight: "1.8",
            }}
          >
            {job.description}
          </p>
        </div>

        {/* Requirements */}

        <div style={card}>
          <h2>
            Requirements
          </h2>

          <p
            style={{
              whiteSpace:
                "pre-wrap",
              lineHeight: "1.8",
            }}
          >
            {job.requirements}
          </p>
        </div>

        {/* Recruiter */}

        <div style={card}>
          <h2>
            Recruiter Information
          </h2>

          <p>
            Organization:
            {" "}
            {job.company}
          </p>

          <p>
            Recruiter ID:
            {" "}
            {job.recruiterId}
          </p>

          <p>
            Status:
            {" "}
            {job.status}
          </p>
        </div>
        {/* Apply Button */}

        <div
          style={{
            ...card,
            textAlign: "center",
          }}
        >
          <button
            onClick={applyNow}
            disabled={
              applying ||
              job.status !== "active"
            }
            style={{
              width: "100%",
              padding: "18px",
              border: "none",
              borderRadius: "14px",
              background:
                "#38bdf8",
              color: "white",
              fontWeight: "700",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            {applying
              ? "Submitting Application..."
              : job.status !== "active"
              ? "Opportunity Closed"
              : "Apply Now"}
          </button>

          <p
            style={{
              color: "#94a3b8",
              marginTop: "18px",
            }}
          >
            By applying, your profile will be
            submitted directly to the recruiter
            for review.

            <br />

            Recruiters may contact successful
            applicants through their Inclura
            profile or registered email.
          </p>
        </div>

        {/* Notice */}

        <div
          style={{
            background: "#1e293b",
            padding: "18px",
            borderRadius: "16px",
            color: "#cbd5e1",
            marginBottom: "30px",
          }}
        >
          <h3>
            Important Notice
          </h3>

          <ul
            style={{
              lineHeight: "1.9",
            }}
          >
            <li>
              Never pay anyone to secure a job.
            </li>

            <li>
              Inclura only verifies recruiter
              identities; hiring decisions remain
              with recruiters.
            </li>

            <li>
              Report suspicious opportunities
              immediately.
            </li>

            <li>
              Applications cannot be edited after
              submission.
            </li>

            <li>
              Some opportunities may close before
              the deadline once positions are
              filled.
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default OpportunityDetails;
