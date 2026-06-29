import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { db, auth } from "../firebase";

import FollowButton from "./FollowButton";
import CommentBox from "./CommentBox";
import SearchBar from "./SearchBar";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] =
    useState([]);
  const [userLanguage, setUserLanguage] =
  useState("en");

  const navigate = useNavigate();

  useEffect(() => {
  async function loadLanguage() {
    const user = auth.currentUser;

    if (!user) return;

    const userSnap = await getDoc(
      doc(db, "users", user.uid)
    );

    if (userSnap.exists()) {
      setUserLanguage(
        userSnap.data()
          .preferredLanguage || "en"
      );
    }
  }
  
    loadLanguage();

  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc")
  );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {
        const fetchedPosts =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setPosts(fetchedPosts);
        setFilteredPosts(
          fetchedPosts
        );
      });

    return () => unsubscribe();
  }, []);

  async function savePost(post) {
    try {
      const user =
        auth.currentUser;

      if (!user) return;

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      const userSnap =
        await getDoc(userRef);

      const savedPosts =
userSnap.exists()
  ? userSnap.data().savedPosts || []
  : [];

      if (
        savedPosts.includes(
          post.id
        )
      ) {
        await updateDoc(userRef, {
          savedPosts:
            arrayRemove(
              post.id
            ),
        });

        alert(
          "Post removed"
        );
      } else {
        await updateDoc(userRef, {
          savedPosts:
            arrayUnion(
              post.id
            ),
        });

        alert("Post saved");
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async function reactToPost(postId, emoji) {
  const user = auth.currentUser;

  if (!user) return;

  const postRef = doc(db, "posts", postId);

  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) return;

  const post = postSnap.data();

  const scoreMap = {
    "❤️": 4,
    "👏": 3,
    "😊": 3,
    "👍": 2,
    "😂": 2,
    "😮": 2,
    "😢": 2,
    "👎": -3,
  };
async function translatePost(post) {
  if (
    userLanguage ===
    (post.language || "en")
  ) {
    alert(
      "This post is already in your language."
    );
    return;
  }

  alert(
    `Translation from ${
      post.language || "auto"
    } to ${userLanguage} will be connected in the next update.`
  );
}
    
  const previousReaction =
    post.userReactions?.[user.uid];

  let reactions = {
    ...(post.reactions || {}),
  };

  let creatorScore =
    post.creatorScore || 0;

  // Remove old reaction if user already reacted
  if (previousReaction) {
    reactions[previousReaction] =
      Math.max(
        0,
        (reactions[previousReaction] || 1) - 1
      );

    creatorScore -=
      scoreMap[previousReaction] || 0;
  }

  // Add new reaction
  reactions[emoji] =
    (reactions[emoji] || 0) + 1;

  creatorScore +=
    scoreMap[emoji] || 0;

  await updateDoc(postRef, {
    reactions,
    creatorScore,
    userReactions: {
      ...(post.userReactions || {}),
      [user.uid]: emoji,
    },
  });
}
async function translatePost(post) {
  alert(
    "Translation service will be connected in the next update."
  );
}
  
  function handleShare(postId) {
    const url =
      `${window.location.origin}/post/${postId}`;

    navigator.clipboard.writeText(
      url
    );

    alert("Post link copied!");
  }

  <button
  onClick={() =>
    handleShare(post.id)
  }
>
  🔗 Share
</button>
  
  function getBadge(post) {
    if (!post.verified)
      return null;

    switch (
      post.badgeType
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

  function getPremium(post) {
    if (!post.premium)
      return null;

    switch (
      post.premiumTier
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
    <div
      style={{
        padding: "24px",
        maxWidth: "720px",
        margin: "0 auto",
      }}
    >
      <SearchBar
        posts={posts}
        onResults={
          setFilteredPosts
        }
      />

      <div
        style={{
          marginTop: "24px",
        }}
      >
        {filteredPosts.length ===
        0 ? (
          <div
            style={{
              background:
                "#0f172a",
              padding: "24px",
              borderRadius:
                "20px",
              textAlign:
                "center",
            }}
          >
            No posts yet
          </div>
        ) : (
          filteredPosts.map(
            (post) => (
              <div
                key={post.id}
                style={{
                  background:
                    "#0f172a",
                  padding:
                    "24px",
                  borderRadius:
                    "24px",
                  marginBottom:
                    "20px",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    marginBottom:
                      "12px",
                  }}
                >
                  <div>
                    <h3
                      onClick={() =>
                        navigate(
                          `/user/${post.userId}`
                        )
                      }
                      style={{
                        cursor:
                          "pointer",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "8px",
                        margin:
                          0,
                      }}
                    >
                      {
                        post.userName
                      }

                      {post.verified && (
                        <span>
                          {getBadge(
                            post
                          )}
                        </span>
                      )}

                      {getPremium(
                        post
                      ) && (
                        <span>
                          {getPremium(
                            post
                          )}
                        </span>
                      )}
                    </h3>

                    {post.role && (
                      <div
                        style={{
                          fontSize:
                            "12px",
                          color:
                            "#94a3b8",
                          marginTop:
                            "4px",
                        }}
                      >
                        {
                          post.role
                        }
                      </div>
                    )}
                  </div>

                  <FollowButton
                    targetUserId={
                      post.userId
                    }
                  />
                </div>

                <p>
  {post.translatedText?.[
    userLanguage
  ] || post.text}
</p>

                <button
  <button
  onClick={() =>
    translatePost(post)
  }
  style={{
    marginTop: "10px",
    padding: "8px 14px",
    borderRadius: "12px",
    border: "none",
    background: "#334155",
    color: "white",
    cursor: "pointer",
  }}
>
  🌍 Translate
</button>
                
                {post.imageUrl && (
  <img
    src={post.imageUrl}
    alt="Post"
    style={{
      width: "100%",
      borderRadius: "16px",
    }}
  />
)}

{post.videoUrl && (
  <video
    controls
    style={{
      width: "100%",
      borderRadius: "16px",
      marginTop: "12px",
    }}
  >
    <source
      src={post.videoUrl}
      type="video/mp4"
    />
  </video>
)}

                <div
  style={{
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "16px",
  }}
>
  {[
    "👍",
    "❤️",
    "😂",
    "😊",
    "😮",
    "😢",
    "👏",
    "👎",
  ].map((emoji) => (
    <button
      key={emoji}
      onClick={() =>
        reactToPost(
          post.id,
          emoji
        )
      }
      style={{
        padding: "8px 12px",
        borderRadius: "20px",
        cursor: "pointer",
      }}
    >
      {emoji}{" "}
      {post.reactions?.[emoji] || 0}
    </button>
  ))}
</div>
                
                <div
                  style={{
                    display:
                      "flex",
                    gap: "12px",
                    marginTop:
                      "16px",
                  }}
                >
                  <button
  onClick={() =>
    navigate(
      `/post/${post.id}`
    )
  }
>
  💬 Comment
</button>

<button
  onClick={() =>
    navigate(
      `/crosspost/${post.id}`
    )
  }
>
  🔀 Cross-post
</button>

<button
  onClick={() =>
    savePost(post)
  }
>
  📌 Save
</button>
                  
                    <button
  onClick={() =>
    handleShare(post.id)
  }
>
  🔗 Share
</button>
                  
                </div>
                <CommentBox
                  postId={
                    post.id
                  }
                />
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default Feed;
