import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import {
  getVerificationBadge,
  getPremiumBadge,
  getVerificationMetadata,
} from "../config/verificationTypes";

function StoryViewer({
story,
onClose,
}) {
const { t } = useTranslation();
const dialogRef = useRef(null);
const closeButtonRef = useRef(null);

useEffect(() => {
  if (!story) return undefined;

  const previousFocus = document.activeElement;
  closeButtonRef.current?.focus();

  function handleDialogKeys(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = dialogRef.current?.querySelectorAll(
      'button, a[href], input, select, textarea, video[controls], [tabindex]:not([tabindex="-1"])'
    );
    const items = Array.from(focusable || []).filter(
      (element) => !element.hasAttribute("disabled")
    );
    if (!items.length) {
      event.preventDefault();
      return;
    }

    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  window.addEventListener("keydown", handleDialogKeys);
  return () => {
    window.removeEventListener("keydown", handleDialogKeys);
    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  };
}, [story, onClose]);

if (!story) return null;

const badge =
  story.verified
    ? getVerificationBadge(story.badgeType)
    : null;

const premiumBadge =
  story.premium
    ? getPremiumBadge(
        story.premiumTier
      )
    : null;

const verificationMeta =
  story.verified
    ? getVerificationMetadata(story.badgeType)
    : null;

const isHighContrast =
story.accessibility
?.highContrast;

const isLargeText =
story.accessibility
?.largeText;

return (
<div
onClick={onClose}
style={{
position: "fixed",
inset: 0,
background:
"rgba(0,0,0,0.95)",
zIndex: 9999,
display: "flex",
justifyContent:
"center",
alignItems:
"center",
padding: "20px",
}}
>
<div
ref={dialogRef}
role="dialog"
aria-modal="true"
aria-label={t("stories")}
onClick={(e) =>
e.stopPropagation()
}
style={{
width: "100%",
maxWidth: "500px",
background:
isHighContrast
? "#000"
: "#0f172a",
color:
isHighContrast
? "#fff"
: "white",
borderRadius: "24px",
padding: "24px",
}}
>
<div
style={{
display: "flex",
justifyContent:
"space-between",
alignItems:
"center",
marginBottom:
"20px",
}}
>
  <div>
  <h3
    style={{
      margin: 0,
    }}
  >
    {story.userName}
  </h3>

  {story.verified && (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        marginTop: "8px",
      }}
    >
      <span
        style={{
          background: "#16a34a",
          padding: "4px 10px",
          borderRadius: "999px",
          fontSize: "12px",
        }}
      >
        {badge}
      </span>

      {verificationMeta && (
        <span
          style={{
            background: "#1e293b",
            color: "#38bdf8",
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: "12px",
          }}
        >
          🛡️ {t("statsTrustLevel")} {verificationMeta.trustLevel}
        </span>
      )}
    </div>
  )}

  {story.premium && (
    <div
      style={{
        marginTop: "8px",
        color: "#facc15",
      }}
    >
      {premiumBadge}
    </div>
  )}
</div>

<button
  ref={closeButtonRef}
  type="button"
  onClick={onClose}
  style={{
    background: "#38bdf8",
    border: "none",
    color: "white",
    padding: "10px 16px",
    minHeight: "44px",
    borderRadius: "12px",
    cursor: "pointer",
  }}
>
  {t("close")}
</button>
  
  </div>

    {story.storyType ===
      "text" && (
      <div
        style={{
          fontSize:
            isLargeText
              ? "30px"
              : "22px",
          fontWeight:
            "700",
          textAlign:
            "center",
          lineHeight:
            "1.6",
        }}
      >
        {
          story.storyText
        }
      </div>
    )}

    {story.storyType ===
      "voice" && (
      <div
        style={{
          textAlign:
            "center",
        }}
      >
        <h2>
          🎤 {t("voiceStory")}
        </h2>

        <p>
          {
            story.storyText
          }
        </p>

        <p
          style={{
            color:
              "#94a3b8",
          }}
        >
          {t("voiceStoryUnavailable")}
        </p>
      </div>
    )}

    {story.storyType === "image" && story.storyUrl && (
      <img
        src={story.storyUrl}
        alt={t("storyImageAlt")}
        style={{
          width: "100%",
          maxHeight: "70vh",
          objectFit: "contain",
          borderRadius: "16px",
        }}
      />
    )}

    {story.storyType === "video" && story.storyUrl && (
      <video
        src={story.storyUrl}
        controls
        playsInline
        aria-label={t("videoStory")}
        style={{
          width: "100%",
          maxHeight: "70vh",
          borderRadius: "16px",
          background: "#000",
        }}
      />
    )}

    <div
      style={{
        marginTop:
          "24px",
        borderTop:
          "1px solid #334155",
        paddingTop:
          "12px",
      }}
    >
      <div>
        Views:
        {" "}
        {story.views
          ?.length ||
          0}
      </div>

      {story.accessibility
        ?.highContrast && (
        <div>
          🎨 {t("highContrast")}
        </div>
      )}

      {story.accessibility
        ?.largeText && (
        <div>
          🔠 {t("largeText")}
        </div>
      )}
    </div>
  </div>
</div>

);
}

export default StoryViewer;
