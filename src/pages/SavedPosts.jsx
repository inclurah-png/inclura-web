import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";

import { db, auth } from "../firebase";

function SavedPosts() {
  const [posts, setPosts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadSavedPosts();
  }, []);

  async function loadSavedPosts() {
    try {
      const user =
        auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const userSnap =
        await getDoc(
          doc(db, "users", user.uid)
        );

      const savedPostIds =
        userSnap.data()?.savedPosts || [];

      const postsSnap =
        await getDocs(
          collection(db, "posts")
        );

      const savedPosts =
        postsSnap.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((post) =>
            savedPostIds.includes(
              post.id
            )
          );

      setPosts(savedPosts);
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  }

  function getBadge(post) {
    if (!post?.verified)
      return null;

    switch (
      post?.badgeType
    ) {
      case "creator":
        return "🎥";

      case "organization":
        return "🏢";

      case "ngo":
        return "🤝";

      case "hospital":
        return "🏥";

      case "university":
        return "🎓";

      case "government":
        return "🏛️";

      default:
        return "✅";
    }
  }

  function getPremium(post) {
    if (!post?.premium)
      return null;

    switch (
      post?.premiumTier
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

  if (loading) {
    return (
      <div
        style={{
          background: "#020617",
          minHeight: "100vh",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Loading saved posts...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        padding: "24px",
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            marginBottom: "24px",
          }}
        >
          🔖 Saved Posts
        </h1>

        {posts.length === 0 ? (
          <div
            style={{
              background: "#0f172a",
              padding: "24px",
              borderRadius: "20px",
              textAlign: "center",
              color: "#94a3b8",
            }}
          >
            No saved posts yet.
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              style={{
                background: "#0f172a",
                padding: "24px",
                borderRadius: "20px",
                marginBottom: "20px",
              }}
            >
              {/* HEADER */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "16px",
                }}
              >
                {post.profilePhoto ? (
                  <img
                    src={
                      post.profilePhoto
                    }
                    alt="profile"
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius:
                        "50%",
                      objectFit:
                        "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius:
                        "50%",
                      background:
                        "#38bdf8",
                      display: "flex",
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
                    {post.userName?.charAt(
                      0
                    )}
                  </div>
                )}

                <div>
                  <h3
                    style={{
                      margin: 0,
                    }}
                  >
                    {post.userName ||
                      "Inclura User"}
                    {" "}
                    {getBadge(
                      post
                    )}
                    {" "}
                    {getPremium(
                      post
                    )}
                  </h3>

                  <div
                    style={{
                      color:
                        "#94a3b8",
                      fontSize:
                        "13px",
                      marginTop:
                        "4px",
                    }}
                  >
                    {post.category ||
                      "General"}
                  </div>
                </div>
              </div>

              {/* POST TEXT */}

              {post.text && (
                <p
                  style={{
                    marginTop: "12px",
                    lineHeight: "1.8",
                    fontSize: "15px",
                  }}
                >
                  {post.text}
                </p>
              )}

              {/* IMAGE */}

              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post"
                  style={{
                    width: "100%",
                    marginTop: "16px",
                    borderRadius:
                      "18px",
                  }}
                />
              )}

              {/* ACCESSIBILITY NEEDS */}

              {post
                .accessibilityNeeds
                ?.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap:
                      "wrap",
                    gap: "10px",
                    marginTop:
                      "16px",
                  }}
                >
                  {post.accessibilityNeeds.map(
                    (
                      need,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        style={{
                          background:
                            "#14532d",
                          padding:
                            "8px 12px",
                          borderRadius:
                            "12px",
                          fontSize:
                            "13px",
                        }}
                      >
                        ♿ {need}
                      </div>
                    )
                  )}
                </div>
              )}

              {/* ACCESSIBILITY TAGS */}

              {post.accessibilityTags &&
                post
                  .accessibilityTags
                  .length >
                  0 && (
                  <div
                    style={{
                      display:
                        "flex",
                      flexWrap:
                        "wrap",
                      gap: "10px",
                      marginTop:
                        "16px",
                    }}
                  >
                    {post.accessibilityTags.map(
                      (
                        tag,
                        index
                      ) => (
                        <div
                          key={
                            index
                          }
                          style={{
                            background:
                              "#1e3a8a",
                            padding:
                              "8px 12px",
                            borderRadius:
                              "12px",
                            fontSize:
                              "13px",
                          }}
                        >
                          {tag}
                        </div>
                      )
                    )}
                  </div>
                )}

              {/* STATS */}

              <div
                style={{
                  marginTop:
                    "18px",
                  display:
                    "flex",
                  gap: "16px",
                  color:
                    "#94a3b8",
                  fontSize:
                    "14px",
                }}
              >
                <span>
                  ❤️{" "}
                  {post.likes
                    ?.length ||
                    0}
                </span>

                <span>
                  💬{" "}
                  {post.comments
                    ?.length ||
                    0}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SavedPosts;
