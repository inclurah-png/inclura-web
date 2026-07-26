import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
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
import {
  getVerificationBadge,
  getPremiumBadge,
} from "../config/verificationTypes";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);

const [loading, setLoading] = useState(false);

const [hasMore, setHasMore] = useState(true);
  
  const [filteredPosts, setFilteredPosts] =
    useState([]);
  const [userLanguage, setUserLanguage] =
  useState("en");

  const navigate = useNavigate();
const POSTS_PER_PAGE = 15;

async function loadPosts(loadMore = false) {
  if (loading) return;

  setLoading(true);

  try {
    let q;

    if (loadMore && lastVisible) {
      q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(POSTS_PER_PAGE)
      );
    } else {
      q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(POSTS_PER_PAGE)
      );
    }

    const snapshot = await getDocs(q);

    const fetchedPosts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (snapshot.docs.length > 0) {
      setLastVisible(
        snapshot.docs[snapshot.docs.length - 1]
      );
    }

    if (snapshot.docs.length < POSTS_PER_PAGE) {
      setHasMore(false);
    }

    if (loadMore) {
  setPosts((prev) => {
    const existingIds = new Set(prev.map((p) => p.id));

    const newPosts = fetchedPosts.filter(
      (p) => !existingIds.has(p.id)
    );

    return [...prev, ...newPosts];
  });

  setFilteredPosts((prev) => {
    const existingIds = new Set(prev.map((p) => p.id));

    const newPosts = fetchedPosts.filter(
      (p) => !existingIds.has(p.id)
    );

    return [...prev, ...newPosts];
  });

} else {

  setPosts(fetchedPosts);

  setFilteredPosts(fetchedPosts);

}
} catch (error) {
  console.error(error);
} finally {
  setLoading(false);
}
}
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

  loadPosts(false);
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
    } catch (err) {
  console.error(err);

  alert(
    "Translation failed:\n" +
    err.message
  );
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
    
  const previousReaction =
    post.userReactions?.[user.uid];

  let reactions = {
  "👍": post.reactions?.["👍"] || 0,
  "❤️": post.reactions?.["❤️"] || 0,
  "😂": post.reactions?.["😂"] || 0,
  "😊": post.reactions?.["😊"] || 0,
  "😮": post.reactions?.["😮"] || 0,
  "😢": post.reactions?.["😢"] || 0,
  "👏": post.reactions?.["👏"] || 0,
  "👎": post.reactions?.["👎"] || 0,
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

  // Save the reaction on the post
  await updateDoc(postRef, {
    reactions,
    creatorScore,
    userReactions: {
      ...(post.userReactions || {}),
      [user.uid]: emoji,
    },
  });

  // Update the creator's total score
  const creatorRef = doc(
    db,
    "users",
    post.userId
  );

  await updateDoc(creatorRef, {
    creatorScore,
  });
}

async function translatePost(post) {
 console.log("🌍 Translate button clicked");
console.log("Language:", userLanguage);
console.log("Text:", post.text);
  
  try {
    // Don't translate if already translated
    if (post.translatedText?.[userLanguage]) {
      return;
    }

    console.log("Calling /translate...");
    const response = await fetch("/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: post.text,
        target: userLanguage,
      }),
    });

    const data = await response.json();
    console.log("Response status:", response.status);
    console.log("Response data:", data);
    
    if (!response.ok || data.error) {
      alert(data.error || "Translation failed.");
      return;
    }

    const translatedText = {
      ...(post.translatedText || {}),
      [userLanguage]: data.translatedText,
    };

    await updateDoc(
      doc(db, "posts", post.id),
      {
        translatedText,
      }
    );

    // Update Feed immediately
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              translatedText,
            }
          : p
      )
    );

    setFilteredPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              translatedText,
            }
          : p
      )
    );
  } catch (err) {
    console.error(err);
    alert("Translation failed.");
  }
}

function handleShare(postId) {
  const url =
    `${window.location.origin}/post/${postId}`;

  navigator.clipboard.writeText(url);

  alert("Post link copied!");
}

  function getBadge(post) {
  if (!post.verified) return null;

  return getVerificationBadge(post.badgeType);
  }

  function getPremium(post) {
  if (!post.premium) return null;

  return getPremiumBadge(post.premiumTier);
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
        {hasMore && (
  <div
    style={{
      textAlign: "center",
      marginTop: "24px",
      marginBottom: "20px",
    }}
  >
    <button
      onClick={() => loadPosts(true)}
      disabled={loading}
      style={{
        padding: "12px 24px",
        borderRadius: "14px",
        border: "none",
        background: "#2563eb",
        color: "#fff",
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Loading..." : "Load More Posts"}
    </button>
  </div>
)}
      </div>
    </div>
  );
}

export default Feed;
