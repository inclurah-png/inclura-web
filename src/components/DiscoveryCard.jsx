export default function DiscoveryCard({
  title,
  text,
  emoji,
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        padding: "24px",
        borderRadius: "20px",
        color: "white",
      }}
    >
      <div style={{ fontSize: "38px" }}>
        {emoji}
      </div>

      <h3>{title}</h3>

      <p style={{ color: "#cbd5e1" }}>
        {text}
      </p>
    </div>
  );
}

