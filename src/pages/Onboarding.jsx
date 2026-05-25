function Onboarding() {
const interests = [
"Accessibility",
"Creators",
"Technology",
"Jobs",
"Education",
"Music",
"Sports",
"Business",
"Gaming",
"AI",
"Health",
"Community",
];

return (
<div
style={{
minHeight: "100vh",
background: "#020617",
color: "white",
fontFamily: "Arial, sans-serif",
padding: "24px",
}}
>
{/* Header */}
<div style={{ marginBottom: "30px" }}>
<h1
style={{
fontSize: "40px",
fontWeight: "800",
marginBottom: "10px",
}}
>
Welcome to Inclura 👋 </h1>

```
    <p
      style={{
        color: "#94a3b8",
        fontSize: "18px",
        lineHeight: "1.6",
      }}
    >
      Choose your interests so we can personalize your experience.
    </p>
  </div>

  {/* Interests */}
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "14px",
      marginBottom: "40px",
    }}
  >
    {interests.map((item) => (
      <button
        key={item}
        style={{
          padding: "14px 22px",
          borderRadius: "40px",
          border: "1px solid #334155",
          background: "#0f172a",
          color: "white",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        {item}
      </button>
    ))}
  </div>

  {/* Accessibility Preferences */}
  <div
    style={{
      background: "#0f172a",
      borderRadius: "24px",
      padding: "22px",
      marginBottom: "36px",
      border: "1px solid #1e293b",
    }}
  >
    <h2
      style={{
        marginBottom: "18px",
        fontSize: "24px",
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
      {[
        "🔊 Audio Assistance",
        "🤟 Sign Language",
        "🔠 Large Text",
        "🌗 High Contrast",
        "🦽 Mobility Support",
      ].map((item) => (
        <button
          key={item}
          style={{
            padding: "14px 18px",
            borderRadius: "18px",
            border: "1px solid #2563eb",
            background: "#1e3a8a",
            color: "white",
            fontSize: "15px",
          }}
        >
          {item}
        </button>
      ))}
    </div>
  </div>

  {/* Continue Button */}
  <button
    style={{
      width: "100%",
      padding: "20px",
      borderRadius: "20px",
      border: "none",
      background: "#38bdf8",
      color: "white",
      fontSize: "20px",
      fontWeight: "700",
      cursor: "pointer",
      boxShadow: "0 8px 20px rgba(56,189,248,0.3)",
    }}
  >
    Continue →
  </button>
</div>
```

);
}

export default Onboarding;
