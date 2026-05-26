function PostCard({ name, text }) {
  return (
    <div
      style={{
        background: "#0f172a",
        padding: "22px",
        borderRadius: "20px",
        marginBottom: "22px",
      }}
    >
      <h3
        style={{
          marginBottom: "12px",
        }}
      >
        {name}
      </h3>

      <p
        style={{
          color: "#cbd5e1",
          lineHeight: "1.7",
          marginBottom: "18px",
        }}
      >
        {text}
      </p>

      <div
        style={{
          display: "flex",
          gap: "14px",
        }}
      >
        <button style={btn}>❤️ Like</button>
        <button style={btn}>💬 Comment</button>
        <button style={btn}>🔁 Share</button>
      </div>
    </div>
  );
}

const btn = {
  background: "#1e293b",
  border: "none",
  color: "white",
  padding: "10px 16px",
  borderRadius: "12px",
  cursor: "pointer",
};

export default PostCard;
