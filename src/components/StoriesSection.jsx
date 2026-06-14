import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

import CreateStory from "./CreateStory";

function StoriesSection() {
  const [stories, setStories] =
    useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "stories"),
      orderBy(
        "createdAt",
        "desc"
      )
    );

    const unsubscribe =
      onSnapshot(
        q,
        (snapshot) => {
          const loadedStories =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            );

          setStories(
            loadedStories
          );
        }
      );

    return () =>
      unsubscribe();
    
  }, []);
console.log(
  "Stories Loaded:",
  stories
);

return (
  return (
    <div
      style={{
        background:
          "#1e293b",
        padding: "18px",
        borderRadius:
          "18px",
        marginBottom:
          "16px",
      }}
    >
      <h2>
        📸 Stories
      </h2>
      
<p
  style={{
    color: "white",
    marginBottom: "10px",
  }}
>
  Stories Count: {stories.length}
</p>
      
      <CreateStory />

      <div
        style={{
          display: "flex",
          gap: "12px",
          overflowX:
            "auto",
          paddingTop:
            "10px",
        }}
      >
        {stories
          .slice(0, 14)
          .map(
            (
              story
            ) => (
              <div
                key={
                  story.id
                }
                style={{
                  minWidth:
                    "90px",
                  height:
                    "150px",
                  borderRadius:
                    "16px",
                  overflow:
                    "hidden",
                  position:
                    "relative",
                  border:
                    "3px solid #38bdf8",
                  cursor:
                    "pointer",
                }}
              >
                <img
src={story.mediaUrl || story.imageUrl}
  alt={story.userName}
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }}
/>

                <div
                  style={{
                    position:
                      "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding:
                      "8px",
                    background:
                      "rgba(0,0,0,0.5)",
                    color:
                      "white",
                    fontSize:
                      "12px",
                    textAlign:
                      "center",
                  }}
                >
                  {story.userName}
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
}

export default StoriesSection;
