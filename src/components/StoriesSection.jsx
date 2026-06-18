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

  useEffect(() => {
    const unsubscribe =
      onSnapshot(
        collection(
          db,
          "stories"
        ),
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
              );

          setStories(data);
        }
      );

    return () =>
      unsubscribe();
  }, []);

  return (
    <div
      style={{
        background: "#0f172a",
        color: "white",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px",
      }}
    >
      <h3>📸 Stories</h3>

      <CreateStory />

      <div
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          paddingTop: "10px",
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
                key={story.id}
                onClick={() =>
                  alert(
                    story.storyType ===
                      "text"
                      ? story.storyText
                      : "Story Viewer Coming Soon"
                  )
                }
                style={{
                  minWidth:
                    "90px",
                  height:
                    "140px",
                  background:
                    "#1e293b",
                  borderRadius:
                    "16px",
                  padding:
                    "10px",
                  cursor:
                    "pointer",
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  justifyContent:
                    "space-between",
                }}
              >
                <div
                  style={{
                    width:
                      "50px",
                    height:
                      "50px",
                    borderRadius:
                      "50%",
                    background:
                      "#38bdf8",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    fontWeight:
                      "700",
                    fontSize:
                      "20px",
                  }}
                >
                  {story.userName?.charAt(
                    0
                  )}
                </div>

                <div>
                  <div
                    style={{
                      fontSize:
                        "12px",
                      fontWeight:
                        "700",
                    }}
                  >
                    {
                      story.userName
                    }
                  </div>

                  {story.storyType ===
                    "text" && (
                    <div
                      style={{
                        fontSize:
                          "11px",
                        color:
                          "#cbd5e1",
                        marginTop:
                          "4px",
                        overflow:
                          "hidden",
                      }}
                    >
                      {story.storyText?.slice(
                        0,
                        40
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default StoriesSection;
