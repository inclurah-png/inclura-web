import { useState, useEffect } from "react";

import DashboardLayout from "../components/DashboardLayout";
import OpportunityCard from "../components/OpportunityCard";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";

function OpportunitiesHub() {
  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [opportunities, setOpportunities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const categories = [
    "All",
    "Remote",
    "Enterprise",
    "Internship",
    "Volunteer",
    "Scholarship",
    "Grant",
    "Competition",
    "Freelance",
    "Full Time",
    "Part Time",
  ];

  useEffect(() => {
    loadOpportunities();
  }, []);

  async function loadOpportunities() {
    try {
      const q = query(
        collection(db, "opportunities"),
        orderBy("createdAt", "desc")
      );

      const snapshot =
        await getDocs(q);

      const jobs = [];

      snapshot.forEach((doc) => {
        jobs.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setOpportunities(jobs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredJobs =
    opportunities.filter((job) => {
      const keyword =
        search.toLowerCase();

      const matchesSearch =
        job.title
          ?.toLowerCase()
          .includes(keyword) ||
        job.company
          ?.toLowerCase()
          .includes(keyword) ||
        job.location
          ?.toLowerCase()
          .includes(keyword);

      if (category === "All")
        return matchesSearch;

      return (
        matchesSearch &&
        (
          job.employmentType ||
          ""
        )
          .toLowerCase()
          .includes(
            category.toLowerCase()
          )
      );
    });

  const featured =
    filteredJobs.filter(
      (job) => job.featured
    );
  return (
    <DashboardLayout>
      <div
        style={{
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "34px",
          }}
        >
          💼 Opportunities Hub
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "24px",
          }}
        >
          Discover jobs, internships,
          grants, scholarships,
          competitions and freelance
          opportunities.
        </p>

        {/* Search */}

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <input
            type="text"
            placeholder="Search opportunities..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            style={{
              flex: 1,
              minWidth: "240px",
              padding: "14px",
              borderRadius: "12px",
              border:
                "1px solid #334155",
              background: "#1e293b",
              color: "white",
            }}
          />

          <button
            style={{
              padding: "14px 24px",
              border: "none",
              borderRadius: "12px",
              background: "#38bdf8",
              color: "white",
              fontWeight: "700",
            }}
          >
            🔍 Search
          </button>
        </div>

        {/* Categories */}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "30px",
          }}
        >
          {categories.map((item) => (
            <button
              key={item}
              onClick={() =>
                setCategory(item)
              }
              style={{
                padding:
                  "10px 18px",
                borderRadius:
                  "999px",
                border: "none",
                cursor: "pointer",
                fontWeight: "700",
                background:
                  category === item
                    ? "#38bdf8"
                    : "#1e293b",
                color: "white",
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Featured */}

        {featured.length >
          0 && (
          <>
            <h2
              style={{
                marginBottom:
                  "20px",
              }}
            >
              ⭐ Featured
              Opportunities
            </h2>

            {featured.map(
              (job) => (
                <OpportunityCard
                  key={job.id}
                  opportunity={
                    job
                  }
                />
              )
            )}
          </>
        )}

        <h2
          style={{
            marginTop: "40px",
            marginBottom: "20px",
          }}
        >
          🆕 Latest
          Opportunities
        </h2>
        {loading ? (
          <div
            style={{
              background: "#0f172a",
              padding: "40px",
              borderRadius: "18px",
              textAlign: "center",
            }}
          >
            Loading opportunities...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div
            style={{
              background: "#0f172a",
              padding: "40px",
              borderRadius: "18px",
              textAlign: "center",
              color: "#94a3b8",
            }}
          >
            No opportunities found.
          </div>
        ) : (
          filteredJobs.map((job) => (
            <OpportunityCard
              key={job.id}
              opportunity={job}
            />
          ))
        )}

        {/* Footer */}

        <div
          style={{
            marginTop: "50px",
            padding: "24px",
            borderRadius: "18px",
            background: "#0f172a",
            color: "#94a3b8",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              color: "white",
            }}
          >
            Opportunity Tips
          </h3>

          <p>
            • Keep your Inclura profile updated.
          </p>

          <p>
            • Upload your latest resume.
          </p>

          <p>
            • Apply early before deadlines.
          </p>

          <p>
            • Never pay anyone for a job opportunity.
          </p>

          <p>
            • Verified recruiters display their
            subscription badges for transparency.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default OpportunitiesHub;
