import AccessibilitySettings from "./AccessibilitySettings";

function AccessibilityToolbar({ close }) {
  return (
    <div
      style={{
        position: "fixed",
        right: "20px",
        bottom: "95px",
        width: "340px",
        maxHeight: "75vh",
        overflowY: "auto",
        background: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "18px",
        boxShadow:
          "0 12px 35px rgba(0,0,0,.35)",
        color: "white",
        zIndex: 9999,
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px",
          borderBottom:
            "1px solid #334155",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "20px",
          }}
        >
          ♿ Accessibility
        </h2>

        <button
          onClick={close}
          aria-label="Close accessibility panel"
          style={{
            border: "none",
            background: "transparent",
            color: "white",
            fontSize: "22px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      {/* Settings */}

      <AccessibilitySettings />
    </div>
  );
}

export default AccessibilityToolbar;
