function MobileNav() {
  const items = [
    "🏠",
    "🎥",
    "➕",
    "💬",
    "👤",
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        width: "100%",
        background: "#020617",
        borderTop: "1px solid #1e293b",
        display: "flex",
        justifyContent: "space-around",
        padding: "14px 0",
        zIndex: "999",
      }}
    >
      {items.map((item) => (
        <button
          key={item}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default MobileNav;
