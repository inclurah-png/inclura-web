import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

import CreateStory from "./CreateStory";
import StoryViewer from "./StoryViewer";

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
    if (!story?.verified)
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
    if (!story?.premium)
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
              No active
              stories
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
                      border:
                        seenStories.includes(
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

      <StoryViewer
        story={
          selectedStory
        }
        onClose={() =>
          setSelectedStory(
            null
          )
        }
      />
    </>
  );
}

export default StoriesSection;
