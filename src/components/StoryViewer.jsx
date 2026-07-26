import { useEffect } from "react";

import {
  getVerificationBadge,
  getPremiumBadge,
  getVerificationMetadata,
} from "../config/verificationTypes";

import {
  migrateVerificationId,
} from "../config/verificationMigration";

function StoryViewer({
story,
onClose,
}) {
useEffect(() => {
function handleEsc(e) {
if (e.key === "Escape") {
onClose();
}
}

window.addEventListener(
  "keydown",
  handleEsc
);

return () =>
  window.removeEventListener(
    "keydown",
    handleEsc
  );

}, [onClose]);

if (!story) return null;

const migratedType =
  migrateVerificationId(
    story.badgeType
  );

const badge =
  story.verified
    ? getVerificationBadge(
        migratedType
      )
    : null;

const premiumBadge =
  story.premium
    ? getPremiumBadge(
        story.premiumTier
      )
    : null;

const verificationMeta =
  story.verified
    ? getVerificationMetadata(
        migratedType
      )
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
          🛡️ Trust Level {verificationMeta.trustLevel}
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
  onClick={onClose}
  style={{
    background: "#38bdf8",
    border: "none",
    color: "white",
    padding: "10px 16px",
    borderRadius: "12px",
    cursor: "pointer",
  }}
>
  Close
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
          🎤 Voice
          Story
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
          Voice
          playback
          will be
          enabled
          when
          audio
          uploads are
          activated.
        </p>
      </div>
    )}

    {story.storyType ===
      "image" &&
      story.storyUrl && (
        <img
          src={
            story.storyUrl
          }
          alt="Story"
          style={{
            width:
              "100%",
            borderRadius:
              "16px",
          }}
        />
      )}

    {story.storyType ===
      "video" && (
      <div
        style={{
          textAlign:
            "center",
        }}
      >
        🎥 Video
        Story
        <br />
        Storage
        upgrade
        required
      </div>
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
        ?.screenReader && (
        <div>
          🔊 Screen
          Reader
          Enabled
        </div>
      )}

      {story.accessibility
        ?.textOnly && (
        <div>
          📄 Text
          Only
        </div>
      )}

      {story.accessibility
        ?.highContrast && (
        <div>
          🎨 High
          Contrast
        </div>
      )}

      {story.accessibility
        ?.largeText && (
        <div>
          🔠 Large
          Text
        </div>
      )}
    </div>
  </div>
</div>

);
}

export default StoryViewer;
