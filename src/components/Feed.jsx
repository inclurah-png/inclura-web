import PostCard from "./PostCard";

function Feed() {
  return (
    <div
      style={{
        flex: 1,
        padding: "24px",
      }}
    >
      {/* Create Post */}
      <div
        style={{
          background: "#0f172a",
          padding: "20px",
          borderRadius: "20px",
          marginBottom: "24px",
        }}
      >
        <input
          placeholder="Share something with Inclura..."
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "14px",
            border: "none",
            background: "#1e293b",
            color: "white",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />

        <button
          style={{
            marginTop: "16px",
            background: "#38bdf8",
            border: "none",
            padding: "14px 22px",
            borderRadius: "14px",
            color: "white",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Post
        </button>
      </div>

      {/* Posts */}
      <PostCard
        name="Sarah Johnson"
        text="Accessibility should never be optional."
      />

      <PostCard
        name="David Inclura"
        text="Welcome to the future of inclusive social media."
      />
    </div>
  );
}

export default Feed;
