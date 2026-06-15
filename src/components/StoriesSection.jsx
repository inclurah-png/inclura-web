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

  <div
    style={{
      display: "flex",
      gap: "12px",
      overflowX: "auto",
    }}
  >
    {demoStories.map((story) => (
      <div
        key={story.id}
        style={{
          minWidth: "90px",
          height: "140px",
          background: "#1e293b",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "10px",
        }}
      >
        {story.name}
      </div>
    ))}
  </div>
</div>
  );
}

export default StoriesSection;
