import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import AccessibilityToolbar from "./AccessibilityToolbar";

function AccessibilityButton() {
  const { t } = useTranslation();
  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        aria-label={open ? t("close", { defaultValue: "Close accessibility settings" }) : t("accessibilityHub", { defaultValue: "Open accessibility settings" })}
        aria-expanded={open}
        aria-controls={open ? "inclura-accessibility-toolbar" : undefined}
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
        <span aria-hidden="true">♿</span>
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
