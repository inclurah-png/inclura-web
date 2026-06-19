import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";

import { db, auth } from "../firebase";

import FollowButton from "./FollowButton";
import CommentBox from "./CommentBox";
import SearchBar from "./SearchBar";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] =
    useState([]);

  const navigate = useNavigate();

  useEffect(() => {
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
        userSnap.data()
          ?.savedPosts || [];

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

  async function toggleLike(
    postId,
    likes = []
  ) {
    const user =
      auth.currentUser;

    if (!user) return;

    const postRef = doc(
      db,
      "posts",
      postId
    );

    const alreadyLiked =
      likes.includes(user.uid);

    if (alreadyLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(
          user.uid
        ),
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(
          user.uid
        ),
      });
    }
  }

  function handleShare(postId) {
    const url =
      `${window.location.origin}/post/${postId}`;

    navigator.clipboard.writeText(
      url
    );

    alert("Post link copied!");
  }

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
                  {post.text}
                </p>

                {post.imageUrl && (
                  <img
                    src={
                      post.imageUrl
                    }
                    alt="Post"
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
                    display:
                      "flex",
                    gap: "12px",
                    marginTop:
                      "16px",
                  }}
                >
                  <button
                    onClick={() =>
                      toggleLike(
                        post.id,
                        post.likes ||
                          []
                      )
                    }
                  >
                    ❤️{" "}
                    {post.likes
                      ?.length ||
                      0}
                  </button>

                  <button
                    onClick={() =>
                      handleShare(
                        post.id
                      )
                    }
                  >
                    🔁 Share
                  </button>

                  <button
                    onClick={() =>
                      savePost(
                        post
                      )
                    }
                  >
                    🔖 Save
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
