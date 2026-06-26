import { useNavigate } from "react-router-dom";

function OpportunityCard({
  id,
  title,
  company,
  location,
  type,
  category,
  salary,
  deadline,
  featured,
}) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: "20px",
        padding: "22px",
        marginBottom: "18px",
        border:
          featured
            ? "2px solid #38bdf8"
            : "1px solid #1e293b",
      }}
    >
      {featured && (
        <div
          style={{
            display: "inline-block",
            background: "#38bdf8",
            color: "white",
            padding: "4px 12px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "700",
            marginBottom: "12px",
          }}
        >
          ⭐ Featured
        </div>
      )}

      <h2
        style={{
          color: "white",
          marginBottom: "10px",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "8px",
        }}
      >
        🏢 {company}
      </p>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "8px",
        }}
      >
        📍 {location}
      </p>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "8px",
        }}
      >
        💼 {type}
      </p>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "8px",
        }}
      >
        🗂 {category}
      </p>

      {salary && (
        <p
          style={{
            color: "#22c55e",
            fontWeight: "700",
            marginBottom: "8px",
          }}
        >
          💰 {salary}
        </p>
      )}

      {deadline && (
        <p
          style={{
            color: "#facc15",
            marginBottom: "18px",
          }}
        >
          ⏳ Deadline: {deadline}
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() =>
            navigate(`/opportunity/${id}`)
          }
          style={{
            padding: "12px 18px",
            border: "none",
            borderRadius: "12px",
            background: "#38bdf8",
            color: "white",
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          View Details
        </button>

        <button
          style={{
            padding: "12px 18px",
            border: "none",
            borderRadius: "12px",
            background: "#1e293b",
            color: "white",
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          ❤️ Save
        </button>

        <button
          style={{
            padding: "12px 18px",
            border: "none",
            borderRadius: "12px",
            background: "#16a34a",
            color: "white",
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export default OpportunityCard;
