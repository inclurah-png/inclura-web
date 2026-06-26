import { useState } from "react";

import DashboardLayout from "../components/DashboardLayout";

import {
  auth,
  db,
} from "../firebase";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

function PostOpportunity() {
  const [title, setTitle] =
    useState("");

  const [company, setCompany] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [type, setType] =
    useState("Full Time");

  const [salary, setSalary] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [requirements, setRequirements] =
    useState("");

  const [deadline, setDeadline] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function submitOpportunity() {
    try {
      setLoading(true);

      const user =
        auth.currentUser;

      if (!user) {
        alert(
          "Please login."
        );
        return;
      }

      const userRef =
        doc(
          db,
          "users",
          user.uid
        );

      const userSnap =
        await getDoc(
          userRef
        );

      if (
        !userSnap.exists()
      ) {
        alert(
          "Recruiter account not found."
        );
        return;
      }

      const recruiter =
        userSnap.data()
          .recruiter;

      if (
        !recruiter
      ) {
        alert(
          "Recruiter subscription required."
        );
        return;
      }

      if (
        recruiter.status !==
        "active"
      ) {
        alert(
          "Subscription inactive."
        );
        return;
      }

      const expiry =
        recruiter.expiresAt?.toDate();

      if (
        expiry &&
        expiry <
          new Date()
      ) {
        alert(
          "Subscription expired."
        );
        return;
      }

      const jobsQuery =
        query(
          collection(
            db,
            "opportunities"
          ),
          where(
            "recruiterId",
            "==",
            user.uid
          ),
          where(
            "status",
            "==",
            "active"
          )
        );

      const jobs =
        await getDocs(
          jobsQuery
        );

      let maxJobs =
        Infinity;

      if (
        recruiter.plan ===
        "starter"
      ) {
        maxJobs = 5;
      }

      if (
        recruiter.plan ===
        "business"
      ) {
        maxJobs = 15;
      }

      if (
        jobs.size >=
        maxJobs
      ) {
        alert(
          `Your ${recruiter.plan} plan has reached its posting limit.`
        );
        return;
        }
      await addDoc(
        collection(
          db,
          "opportunities"
        ),
        {
          recruiterId:
            user.uid,

          recruiterPlan:
            recruiter.plan,

          recruiterName:
            user.displayName ||
            company,

          title,

          company,

          location,

          employmentType:
            type,

          salary,

          description,

          requirements,

          deadline,

          status:
            "active",

          applications:
            0,

          featured:
            recruiter.plan !==
            "starter",

          analyticsEnabled:
            recruiter.plan !==
            "starter",

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        }
      );

      await updateDoc(
        userRef,
        {
          "recruiter.activeJobs":
            recruiter.activeJobs +
            1,
        }
      );

      alert(
        "Opportunity posted successfully."
      );

      setTitle("");
      setCompany("");
      setLocation("");
      setSalary("");
      setDescription("");
      setRequirements("");
      setDeadline("");
    } catch (error) {
      console.error(error);

      alert(
        "Unable to post opportunity."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "14px",
    marginBottom: "16px",
    borderRadius: "12px",
    border:
      "1px solid #334155",
    background:
      "#1e293b",
    color: "white",
  };

  return (
    <DashboardLayout>
      <div
        style={{
          maxWidth: "850px",
          margin: "0 auto",
          color: "white",
        }}
      >
        <h1>
          Post Opportunity
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom:
              "25px",
          }}
        >
          Create a new
          opportunity for
          qualified
          applicants.
        </p>

        <input
          placeholder="Opportunity Title"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          placeholder="Company / Organization"
          value={company}
          onChange={(e) =>
            setCompany(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) =>
            setLocation(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <select
          value={type}
          onChange={(e) =>
            setType(
              e.target.value
            )
          }
          style={inputStyle}
        >
          <option>
            Full Time
          </option>

          <option>
            Part Time
          </option>

          <option>
            Contract
          </option>

          <option>
            Internship
          </option>

          <option>
            Volunteer
          </option>

          <option>
            Remote
          </option>
        </select>

        <input
          placeholder="Salary"
          value={salary}
          onChange={(e) =>
            setSalary(
              e.target.value
            )
          }
          style={inputStyle}
        />
        <textarea
          placeholder="Opportunity Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          rows={6}
          style={inputStyle}
        />

        <textarea
          placeholder="Requirements"
          value={requirements}
          onChange={(e) =>
            setRequirements(
              e.target.value
            )
          }
          rows={6}
          style={inputStyle}
        />

        <label
          style={{
            color: "#94a3b8",
          }}
        >
          Application Deadline
        </label>

        <input
          type="date"
          value={deadline}
          onChange={(e) =>
            setDeadline(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <div
          style={{
            background: "#0f172a",
            padding: "20px",
            borderRadius: "16px",
            marginTop: "20px",
          }}
        >
          <h3>
            Recruiter Posting Rules
          </h3>

          <ul
            style={{
              color: "#94a3b8",
              lineHeight: "1.9",
            }}
          >
            <li>
              Starter Recruiter:
              Maximum 5 active
              opportunities.
            </li>

            <li>
              Business Recruiter:
              Maximum 15 active
              opportunities.
            </li>

            <li>
              Enterprise Recruiter:
              Unlimited active
              opportunities.
            </li>

            <li>
              Expired subscriptions
              cannot post new
              opportunities.
            </li>

            <li>
              Opportunities are
              reviewed automatically
              by Inclura moderation.
            </li>
          </ul>
        </div>

        <button
          onClick={
            submitOpportunity
          }
          disabled={loading}
          style={{
            marginTop: "30px",
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            border: "none",
            background: "#38bdf8",
            color: "white",
            fontWeight: "700",
            fontSize: "17px",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Posting Opportunity..."
            : "Publish Opportunity"}
        </button>
      </div>
    </DashboardLayout>
  );
}

export default PostOpportunity;
