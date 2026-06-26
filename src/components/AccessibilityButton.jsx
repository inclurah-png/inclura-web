import { useState } from "react";

import AccessibilityToolbar from "./AccessibilityToolbar";

function AccessibilityButton() {
  const [open, setOpen] =
    useState(false);

  return (
    <>
      <button
        aria-label="Accessibility"
        onClick={() =>
          setOpen(!open)
        }
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          background: "#2563eb",
          color: "white",
          fontSize: "28px",
          cursor: "pointer",
          boxShadow:
            "0 6px 18px rgba(0,0,0,.3)",
          zIndex: 9999,
        }}
      >
        ♿
      </button>

      {open && (
        <AccessibilityToolbar
          close={() =>
            setOpen(false)
          }
        />
      )}
    </>
  );
}

export default AccessibilityButton;
