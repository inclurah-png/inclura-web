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

useEffect(() => {
const unsubscribe =
onSnapshot(
collection(db, "stories"),
(snapshot) => {
const now = Date.now();

      const data =
        snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (story) =>
              story.expiresAt > now
          )
          .slice(0, 12);

      setStories(data);
    }
  );

return () => unsubscribe();

}, []);

return (
<>
<div
style={{
background: "#0f172a",
color: "white",
padding: "20px",
borderRadius: "16px",
marginBottom: "20px",
}}
>
<h3
style={{
marginBottom: "16px",
}}
>
📸 Stories
</h3>

    <CreateStory />

    <div
      style={{
        display: "flex",
        gap: "14px",
        overflowX: "auto",
        paddingTop: "12px",
        scrollbarWidth: "none",
      }}
    >
      {stories.length === 0 ? (
        <div
          style={{
            color: "#94a3b8",
          }}
        >
          No active stories
        </div>
      ) : (
        stories.map((story) => (
          <div
            key={story.id}
            onClick={() =>
              setSelectedStory(
                story
              )
            }
            style={{
              minWidth: "85px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                border:
                  "3px solid #38bdf8",
                background:
                  "#1e293b",
                display: "flex",
                justifyContent:
                  "center",
                alignItems:
                  "center",
                margin: "0 auto",
                fontSize: "24px",
                fontWeight: "700",
                color: "white",
                overflow:
                  "hidden",
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
                story.userName?.charAt(
                  0
                )
              )}
            </div>

            <p
              style={{
                fontSize: "11px",
                marginTop: "6px",
                color: "white",
                overflow:
                  "hidden",
                textOverflow:
                  "ellipsis",
                whiteSpace:
                  "nowrap",
              }}
            >
              {story.userName}
            </p>
          </div>
        ))
      )}
    </div>
  </div>

  {selectedStory && (
    <div
      onClick={() =>
        setSelectedStory(null)
      }
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,0.95)",
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        zIndex: 9999,
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          background:
            "#0f172a",
          borderRadius:
            "20px",
          padding: "24px",
          color: "white",
          textAlign:
            "center",
        }}
      >
        <h3>
          {
            selectedStory.userName
          }
        </h3>

        {selectedStory.storyType ===
          "text" && (
          <div
            style={{
              fontSize: "24px",
              fontWeight:
                "700",
              marginTop:
                "30px",
              marginBottom:
                "30px",
            }}
          >
            {
              selectedStory.storyText
            }
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

        {selectedStory.storyType ===
          "video" && (
          <div>
            🎥 Video Story
            (Storage Upgrade
            Required)
          </div>
        )}

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
            border: "none",
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
