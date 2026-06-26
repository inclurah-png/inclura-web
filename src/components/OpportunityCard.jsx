import { Link } from "react-router-dom";

function OpportunityCard({ opportunity }) {
  const cardStyle = {
    background: "#0f172a",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "20px",
    color: "white",
    transition: "0.3s",
    border: "1px solid #1e293b",
  };

  const badgeStyle = {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
    marginRight: "8px",
    marginBottom: "8px",
  };

  return (
    <div style={cardStyle}>
      {/* Top Row */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
            }}
          >
            {opportunity.title}
          </h2>

          <p
            style={{
              color: "#94a3b8",
              marginTop: "8px",
            }}
          >
            {opportunity.company}
          </p>
        </div>

        <div>
          {opportunity.featured && (
            <span
              style={{
                ...badgeStyle,
                background:
                  "#f59e0b",
                color: "white",
              }}
            >
              ⭐ Featured
            </span>
          )}

          {opportunity.recruiterPlan ===
            "business" && (
            <span
              style={{
                ...badgeStyle,
                background:
                  "#10b981",
                color: "white",
              }}
            >
              Business Recruiter
            </span>
          )}

          {opportunity.recruiterPlan ===
            "enterprise" && (
            <span
              style={{
                ...badgeStyle,
                background:
                  "#7c3aed",
                color: "white",
              }}
            >
              Enterprise Hiring
            </span>
          )}
        </div>
      </div>
{/* Details */}

      <div
        style={{
          marginTop: "20px",
          color: "#cbd5e1",
          lineHeight: "1.8",
        }}
      >
        <p>
          📍 <strong>Location:</strong>{" "}
          {opportunity.location}
        </p>

        <p>
          💼 <strong>Employment:</strong>{" "}
          {opportunity.employmentType}
        </p>

        <p>
          💰 <strong>Salary:</strong>{" "}
          {opportunity.salary}
        </p>

        <p>
          📅 <strong>Deadline:</strong>{" "}
          {opportunity.deadline}
        </p>

        <p>
          👥 <strong>Applications:</strong>{" "}
          {opportunity.applications || 0}
        </p>

        <p>
          🟢 <strong>Status:</strong>{" "}
          {opportunity.status}
        </p>
      </div>

      {/* Description Preview */}

      <div
        style={{
          marginTop: "18px",
          color: "#94a3b8",
        }}
      >
        {opportunity.description
          ?.substring(0, 180)}
        {opportunity.description
          ?.length > 180
          ? "..."
          : ""}
      </div>

      {/* Bottom Row */}

      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            color: "#38bdf8",
            fontWeight: "700",
          }}
        >
          Recruiter Plan:{" "}
          {opportunity.recruiterPlan}
        </span>
        <Link
          to={`/opportunity/${opportunity.id}`}
          style={{
            textDecoration: "none",
          }}
        >
          <button
            style={{
              padding: "12px 22px",
              border: "none",
              borderRadius: "12px",
              background: "#38bdf8",
              color: "white",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            View Opportunity
          </button>
        </Link>
      </div>

      {/* Footer */}

      <div
        style={{
          marginTop: "20px",
          paddingTop: "16px",
          borderTop: "1px solid #1e293b",
          color: "#64748b",
          fontSize: "13px",
        }}
      >
        Posted by{" "}
        <strong>
          {opportunity.company}
        </strong>

        {" • "}

        {opportunity.createdAt?.seconds
          ? new Date(
              opportunity.createdAt.seconds *
                1000
            ).toLocaleDateString()
          : "Recently"}
      </div>
    </div>
  );
}

export default OpportunityCard;
