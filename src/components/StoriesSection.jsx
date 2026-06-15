import CreateStory from "./CreateStory";

function StoriesSection() {
  return (
    <div
      style={{
        background: "#0f172a",
        color: "white",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px",
      }}
    >
      <h3>📸 Stories</h3>

      <CreateStory />

      <div>
        Stories area ready
      </div>
    </div>
  );
}

export default StoriesSection;
