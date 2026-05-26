import Stories from "./Stories";
import MediaPost from "./MediaPost";

function Feed() {
  return (
    <div
      style={{
        flex: 1,
        padding: "24px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      {/* Stories */}
      <Stories />

      {/* Create Post */}
      <div
        style={{
          background: "#0f172a",
          padding: "22px",
          borderRadius: "24px",
          marginBottom: "28px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        }}
      >
        <input
          placeholder="Share something with Inclura..."
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "16px",
            border: "none",
            background: "#1e293b",
            color: "white",
            fontSize: "16px",
            outline: "none",
            marginBottom: "18px",
            boxSizing: "border-box",
          }}
        />

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button style={actionBtn}>📷 Photo</button>

            <button style={actionBtn}>🎥 Reel</button>

            <button style={actionBtn}>♿ Accessibility</button>

            <button style={actionBtn}>🔁 Cross-post</button>
          </div>

          <button
            style={{
              background: "#38bdf8",
              border: "none",
              padding: "14px 24px",
              borderRadius: "14px",
              color: "white",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Post
          </button>
        </div>
      </div>

      {/* Feed Posts */}
      <MediaPost
        name="Sarah Johnson"
        handle="sarahj"
        time="2h"
        text="Accessibility should never be optional. Inclusive design benefits everyone."
      />

      <MediaPost
        name="Inclura Team"
        handle="inclura"
        time="5h"
        text="Welcome to the future of accessibility-first social networking."
      />

      <MediaPost
        name="David Smith"
        handle="davidsmith"
        time="1d"
        text="Creators with disabilities deserve equal opportunities online."
      />
    </div>
  );
}

const actionBtn = {
  background: "#1e293b",
  border: "none",
  color: "white",
  padding: "12px 16px",
  borderRadius: "12px",
  cursor: "pointer",
};

export default Feed;
