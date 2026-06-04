   function Onboarding() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "42px",
          marginBottom: "12px",
        }}
      >
        Welcome to Inclura 👋
      </h1>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "30px",
          lineHeight: "1.6",
        }}
      >
        Personalize your experience.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "40px",
        }}
      >
        <button style={tagStyle}>Accessibility</button>
        <button style={tagStyle}>Creators</button>
        <button style={tagStyle}>Technology</button>
        <button style={tagStyle}>Education</button>
        <button style={tagStyle}>Business</button>
        <button style={tagStyle}>Community</button>
      </div>

      <div
        style={{
          background: "#0f172a",
          padding: "24px",
          borderRadius: "24px",
          marginBottom: "32px",
        }}
      >
        <h2
          style={{
            marginBottom: "18px",
          }}
        >
          Accessibility Preferences
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <button style={prefStyle}>🔊 Audio</button>
          <button style={prefStyle}>🤟 Sign</button>
          <button style={prefStyle}>🔠 Large Text</button>
          <button style={prefStyle}>🌗 Contrast</button>
        </div>
      </div>

      <button
onClick={() => {
window.location.href = "/profile";
}}
style={{
width: "100%",
padding: "18px",
borderRadius: "18px",
border: "none",
background: "#38bdf8",
color: "white",
fontSize: "18px",
fontWeight: "700",
cursor: "pointer",
}}

>

Continue → 

      </button>
    </div>
  );
}

const tagStyle = {
  padding: "14px 20px",
  borderRadius: "40px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
  fontSize: "15px",
};

const prefStyle = {
  padding: "14px 18px",
  borderRadius: "18px",
  border: "1px solid #2563eb",
  background: "#1e3a8a",
  color: "white",
  fontSize: "15px",
};

export default Onboarding;   
