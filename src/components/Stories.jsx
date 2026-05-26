function Stories() {
  const stories = [
    "👩 Sarah",
    "🧑 David",
    "👨 Michael",
    "👩 Sophia",
    "🧑 Alex",
    "👩 Emma",
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "18px",
        overflowX: "auto",
        marginBottom: "28px",
        paddingBottom: "10px",
      }}
    >
      {stories.map((story) => (
        <div
          key={story}
          style={{
            minWidth: "90px",
            height: "140px",
            borderRadius: "22px",
            background:
              "linear-gradient(180deg, #38bdf8, #1e293b)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: "14px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          }}
        >
          {story}
        </div>
      ))}
    </div>
  );
}

export default Stories;
