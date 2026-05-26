import Avatar from "./Avatar";

function MediaPost({
  name,
  handle,
  time,
  text,
  image,
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: "24px",
        padding: "22px",
        marginBottom: "24px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      }}
    >
      {/* Top */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "18px",
        }}
      >
        <Avatar letter={name[0]} />

        <div>
          <h3
            style={{
              margin: "0",
            }}
          >
            {name}
          </h3>

          <p
            style={{
              margin: "4px 0 0 0",
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            @{handle} • {time}
          </p>
        </div>
      </div>

      {/* Text */}
      <p
        style={{
          lineHeight: "1.8",
          color: "#e2e8f0",
          marginBottom: "18px",
        }}
      >
        {text}
      </p>

      {/* Media */}
      <div
        style={{
          height: "260px",
          borderRadius: "20px",
          background:
            image ||
            "linear-gradient(135deg, #38bdf8, #1e293b)",
          marginBottom: "18px",
        }}
      />

      {/* Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "#94a3b8",
        }}
      >
        <button style={btn}>❤️ 124</button>

        <button style={btn}>💬 32</button>

        <button style={btn}>🔁 18</button>

        <button style={btn}>📤 Share</button>
      </div>
    </div>
  );
}

const btn = {
  background: "transparent",
  border: "none",
  color: "#94a3b8",
  cursor: "pointer",
  fontSize: "15px",
};

export default MediaPost;
