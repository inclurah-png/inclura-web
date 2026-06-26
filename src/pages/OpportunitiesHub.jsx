import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

function OpportunitiesHub() {
  const [search, setSearch] = useState("");

  const categories = [
    "Remote Jobs",
    "Enterprise Jobs",
    "Internships",
    "Volunteer",
    "Scholarships",
    "Grants",
    "Competitions",
    "Freelance",
  ];

  return (
    <DashboardLayout>
      <div style={page}>

        <h1 style={title}>
          💼 Opportunities Hub
        </h1>

        <p style={subtitle}>
          Discover jobs, internships, grants,
          scholarships, competitions and career opportunities.
        </p>

        {/* Search */}

        <div style={searchBox}>
          <input
            type="text"
            placeholder="Search opportunities..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={searchInput}
          />

          <button style={searchButton}>
            🔍 Search
          </button>
        </div>

        {/* Quick Actions */}

        <div style={grid}>

          <div style={actionCard}>
            📄
            <h3>Upload Resume</h3>

            <p>
              Prepare your resume for
              opportunity applications.
            </p>
          </div>

          <div style={actionCard}>
            ❤️
            <h3>Saved Opportunities</h3>

            <p>
              Access opportunities
              you've saved.
            </p>
          </div>

          <div style={actionCard}>
            📨
            <h3>My Applications</h3>

            <p>
              Track submitted
              applications.
            </p>
          </div>

          <div style={actionCard}>
            🤖
            <h3>AI Job Match</h3>

            <p>
              AI recommendations
              based on your profile.
            </p>
          </div>

        </div>

        {/* Categories */}

        <h2 style={sectionTitle}>
          Browse Categories
        </h2>

        <div style={categoryGrid}>
          {categories.map((item) => (
            <div
              key={item}
              style={categoryCard}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Featured */}

        <h2 style={sectionTitle}>
          ⭐ Featured Opportunities
        </h2>

        <div style={opportunityCard}>
          <h3>
            Senior Frontend Developer
          </h3>

          <p>
            Remote • Full-Time
          </p>

          <p>
            Enterprise Partner
          </p>

          <button style={button}>
            View Details
          </button>
        </div>

        <div style={opportunityCard}>
          <h3>
            Community Volunteer
          </h3>

          <p>
            Lagos • Volunteer
          </p>

          <p>
            NGO Partner
          </p>

          <button style={button}>
            View Details
          </button>
        </div>

        {/* Latest */}

        <h2 style={sectionTitle}>
          🆕 Latest Opportunities
        </h2>

        <div style={emptyCard}>
          Live opportunities from
          Firestore will appear here
          after we connect the database.
        </div>

      </div>
    </DashboardLayout>
  );
}

const page = {
  color: "white",
};

const title = {
  fontSize: "34px",
  marginBottom: "8px",
};

const subtitle = {
  color: "#94a3b8",
  marginBottom: "30px",
};

const sectionTitle = {
  marginTop: "35px",
  marginBottom: "16px",
};

const searchBox = {
  display: "flex",
  gap: "12px",
  marginBottom: "25px",
  flexWrap: "wrap",
};

const searchInput = {
  flex: 1,
  minWidth: "220px",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "white",
};

const searchButton = {
  padding: "14px 24px",
  border: "none",
  borderRadius: "12px",
  background: "#38bdf8",
  color: "white",
  cursor: "pointer",
  fontWeight: "700",
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px",
};

const actionCard = {
  background: "#0f172a",
  padding: "24px",
  borderRadius: "18px",
};

const categoryGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(170px,1fr))",
  gap: "16px",
};

const categoryCard = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "16px",
  textAlign: "center",
  cursor: "pointer",
  fontWeight: "600",
};

const opportunityCard = {
  background: "#0f172a",
  padding: "24px",
  borderRadius: "18px",
  marginBottom: "18px",
};

const emptyCard = {
  background: "#0f172a",
  padding: "30px",
  borderRadius: "18px",
  textAlign: "center",
  color: "#94a3b8",
};

const button = {
  marginTop: "15px",
  padding: "12px 20px",
  border: "none",
  borderRadius: "10px",
  background: "#38bdf8",
  color: "white",
  cursor: "pointer",
  fontWeight: "700",
};

export default OpportunitiesHub;
