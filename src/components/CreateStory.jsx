function CreateStory() {
  function handleFile(e) {
    const file = e.target.files[0];

    if (!file) return;

    alert(`Selected: ${file.name}`);
  }

  return (
    <label
      style={{
        background: "#38bdf8",
        color: "white",
        padding: "12px 18px",
        borderRadius: "12px",
        cursor: "pointer",
        display: "inline-block",
        marginBottom: "16px",
      }}
    >
      + Add Story

      <input
        type="file"
        accept="image/*"
        hidden
        onChange={handleFile}
      />
    </label>
  );
}

export default CreateStory;
