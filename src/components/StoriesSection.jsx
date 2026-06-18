import { useEffect, useState } from "react";

import {
collection,
onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

import CreateStory from "./CreateStory";

function StoriesSection() {
const [stories, setStories] =
useState([]);

const [selectedStory, setSelectedStory] =
useState(null);

const [seenStories, setSeenStories] =
useState([]);

useEffect(() => {
const unsubscribe =
onSnapshot(
collection(db, "stories"),
(snapshot) => {
const now =
Date.now();

      const data =
        snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (story) =>
              story.expiresAt >
              now
          )
          .slice(0, 12);

      setStories(data);
    }
  );

return () =>
  unsubscribe();

}, []);

function openStory(story) {
setSelectedStory(story);

if (
  !seenStories.includes(
    story.id
  )
) {
  setSeenStories([
    ...seenStories,
    story.id,
  ]);
}

}

function getBadge(story) {
if (!story.verified)
return null;

switch (
  story.badgeType
) {
  case "creator":
    return "🎥";

  case "organization":
    return "🏢";

  case "ngo":
    return "🤝";

  case "hospital":
    return "🏥";

  case "government":
    return "🏛️";

  default:
    return "✅";
}

}

function getPremium(story) {
if (!story.premium)
return null;

switch (
  story.premiumTier
) {
  case "silver":
    return "🥈";

  case "gold":
    return "🥇";

  case "platinum":
    return "💎";

  case "enterprise":
    return "🏆";

  default:
    return "⭐";
}

}

return (
<>
<div
style={{
background:
"#0f172a",
color: "white",
padding: "20px",
borderRadius:
"16px",
marginBottom:
"20px",
}}
>
<h3>
📸 Stories
</h3>

    <CreateStory />

    <div
      style={{
        display:
          "flex",
        gap: "14px",
        overflowX:
          "auto",
        paddingTop:
          "12px",
      }}
    >
      {stories.length ===
      0 ? (
        <div>
          No active stories
        </div>
      ) : (
        stories.map(
          (story) => (
            <div
              key={
                story.id
              }
              onClick={() =>
                openStory(
                  story
                )
              }
              style={{
                minWidth:
                  "90px",
                textAlign:
                  "center",
                cursor:
                  "pointer",
              }}
            >
              <div
                style={{
                  width:
                    "72px",
                  height:
                    "72px",
                  borderRadius:
                    "50%",
                  border: seenStories.includes(
                    story.id
                  )
                    ? "3px solid #64748b"
                    : "3px solid #38bdf8",
                  background:
                    "#1e293b",
                  display:
                    "flex",
                  justifyContent:
                    "center",
                  alignItems:
                    "center",
                  margin:
                    "0 auto",
                  overflow:
                    "hidden",
                  position:
                    "relative",
                }}
              >
                {story.storyType ===
                  "image" &&
                story.storyUrl ? (
                  <img
                    src={
                      story.storyUrl
                    }
                    alt="story"
                    style={{
                      width:
                        "100%",
                      height:
                        "100%",
                      objectFit:
                        "cover",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize:
                        "24px",
                      fontWeight:
                        "700",
                    }}
                  >
                    {story.userName?.charAt(
                      0
                    )}
                  </span>
                )}
              </div>

              <div
                style={{
                  marginTop:
                    "4px",
                  fontSize:
                    "11px",
                }}
              >
                {
                  story.userName
                }
              </div>

              <div>
                {getBadge(
                  story
                )}
                {" "}
                {getPremium(
                  story
                )}
              </div>
            </div>
          )
        )
      )}
    </div>
  </div>

  {selectedStory && (
    <div
      onClick={() =>
        setSelectedStory(
          null
        )
      }
      style={{
        position:
          "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,0.95)",
        display:
          "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        zIndex: 9999,
        padding:
          "20px",
      }}
    >
      <div
        style={{
          maxWidth:
            "500px",
          width: "100%",
          background:
            selectedStory
              ?.accessibility
              ?.highContrast
              ? "#000"
              : "#0f172a",
          color:
            "white",
          borderRadius:
            "20px",
          padding:
            "24px",
          textAlign:
            "center",
        }}
      >
        <h3>
          {
            selectedStory.userName
          }
          {" "}
          {getBadge(
            selectedStory
          )}
          {" "}
          {getPremium(
            selectedStory
          )}
        </h3>

        {selectedStory
          ?.accessibility
          ?.screenReader && (
          <div
            style={{
              color:
                "#38bdf8",
              marginBottom:
                "10px",
            }}
          >
            🔊 Screen Reader
            Supported
          </div>
        )}

        {selectedStory.storyType ===
          "text" && (
          <div
            style={{
              fontSize:
                selectedStory
                  ?.accessibility
                  ?.largeText
                  ? "34px"
                  : "24px",
              fontWeight:
                "700",
              marginTop:
                "20px",
              marginBottom:
                "20px",
            }}
          >
            {
              selectedStory.storyText
            }
          </div>
        )}

        {selectedStory.storyType ===
          "voice" && (
          <div>
            🎤 Voice Story
          </div>
        )}

        {selectedStory.storyType ===
          "image" &&
          selectedStory.storyUrl && (
            <img
              src={
                selectedStory.storyUrl
              }
              alt="story"
              style={{
                width:
                  "100%",
                borderRadius:
                  "16px",
              }}
            />
          )}

        <div
          style={{
            marginTop:
              "12px",
            color:
              "#94a3b8",
          }}
        >
          👁️ Views:
          {" "}
          {selectedStory
            ?.views
            ?.length ||
            0}
        </div>

        <button
          onClick={() =>
            setSelectedStory(
              null
            )
          }
          style={{
            marginTop:
              "20px",
            background:
              "#38bdf8",
            border:
              "none",
            color:
              "white",
            padding:
              "12px 20px",
            borderRadius:
              "12px",
            cursor:
              "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  )}
</>

);
}

export default StoriesSection;
