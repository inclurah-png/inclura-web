import { useNavigate } from "react-router-dom";

function DashboardSidebar() {
  const navigate = useNavigate();

  const itemStyle = {
    padding: "14px",
    borderRadius: "12px",
    cursor: "pointer",
    marginBottom: "10px",
    background: "#1e293b",
    color: "white",
    fontWeight: "600",
  };

  return (
    <div
      style={{
        width: "250px",
        background: "#0f172a",
        padding: "20px",
        borderRadius: "20px",
      }}
    >
      <h2
        style={{
          marginBottom: "24px",
        }}
      >
        Inclura
      </h2>

      <div
        style={itemStyle}
        onClick={() => navigate("/profile")}
      >
        🏠 Dashboard
      </div>

      <div
        style={itemStyle}
        onClick={() => navigate("/messages")}
      >
        💬 Messages
      </div>

      <div
        style={itemStyle}
        onClick={() => navigate("/notifications")}
      >
        🔔 Notifications
      </div>

      <div
        style={itemStyle}
        onClick={() => navigate("/saved-posts")}
      >
        🔖 Saved Posts
      </div>

      <div
        style={itemStyle}
        onClick={() => navigate("/search")}
      >
        🔍 Search
      </div>

      <div
        style={itemStyle}
        onClick={() => navigate("/edit-profile")}
      >
        ⚙ Edit Profile
      </div>
    </div>
  );
}

export default DashboardSidebar;
