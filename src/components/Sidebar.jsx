function Sidebar() {
  const items = [
    "🏠 Home",
    "👥 Community",
    "💬 Messages",
    "🔔 Notifications",
    "🎥 Reels",
    "🧑‍🦽 Accessibility",
    "📄 Resume",
    "💼 Care Gigs",
    "♿ Accessibility ID",
    "🏅 Badges",
    "💳 Wallet",
    "⚙️ Settings",
  ];

  return (
    <div
      style={{
        width: "260px",
        padding: "24px",
        borderRight: "1px solid #1e293b",
        background: "#020617",
      }}
    >
      <h1
        style={{
          color: "#38bdf8",
          marginBottom: "40px",
          fontSize: "32px",
        }}
      >
        Inclura
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {items.map((item) => (
          <button
            key={item}
            style={{
              background: "#0f172a",
              border: "none",
              color: "white",
              padding: "16px",
              borderRadius: "16px",
              textAlign: "left",
              fontSize: "17px",
              cursor: "pointer",
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
