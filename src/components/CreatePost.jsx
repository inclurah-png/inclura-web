import { useState } from "react";

function CreatePost() {
  const [postText, setPostText] =
    useState("");

  const [category, setCategory] =
    useState("General");

  function handlePost() {
    if (!postText.trim()) {
      alert("Write something first.");
      return;
    }

    alert(
      "Post system connected. Firebase comes next."
    );

    setPostText("");
  }

  return (
    <div
      style={{
        background: "#0f172a",
        padding: "20px",
        borderRadius: "20px",
        marginBottom: "24px",
        color: "white",
      }}
    >
      <h3
        style={{
          marginBottom: "16px",
        }}
      >
        ✍ Create Post
      </h3>

      <textarea
        value={postText}
        onChange={(e) =>
          setPostText(e.target.value)
        }
        placeholder="Share something with the Inclura community..."
        style={{
          width: "100%",
          minHeight: "120px",
          borderRadius: "14px",
          border: "1px solid #334155",
          background: "#1e293b",
          color: "white",
          padding: "14px",
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "14px",
          flexWrap: "wrap",
        }}
      >
        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          style={{
            padding: "10px",
            borderRadius: "12px",
            border: "none",
          }}
        >
          <option>General</option>
          <option>Accessibility</option>
          <option>Care-Gig</option>
          <option>Opportunity</option>
          <option>Mentorship</option>
          <option>Marketplace</option>
        </select>

        <button
          style={actionBtn}
        >
          📷 Photo
        </button>

        <button
          style={actionBtn}
        >
          🎥 Video
        </button>

        <button
          style={actionBtn}
        >
          ♿ Accessibility Tag
        </button>
      </div>

      <button
        onClick={handlePost}
        style={{
          marginTop: "16px",
          background: "#38bdf8",
          border: "none",
          color: "white",
          padding: "12px 18px",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Post
      </button>
    </div>
  );
}

const actionBtn = {
  background: "#1e293b",
  border: "1px solid #334155",
  color: "white",
  padding: "10px 14px",
  borderRadius: "12px",
  cursor: "pointer",
};

export default CreatePost;
