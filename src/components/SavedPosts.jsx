
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

      if (!user) return;

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
              <h3>
                {post.userName ||
                  "Inclura User"}
              </h3>

              {post.text && (
                <p
                  style={{
                    marginTop: "12px",
                    lineHeight: "1.8",
                  }}
                >
                  {post.text}
                </p>
              )}

              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post"
                  style={{
                    width: "100%",
                    marginTop: "16px",
                    borderRadius: "18px",
                  }}
                />
              )}

              {post.accessibilityTags &&
                post.accessibilityTags
                  .length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginTop: "16px",
                    }}
                  >
                    {post.accessibilityTags.map(
                      (
                        tag,
                        index
                      ) => (
                        <div
                          key={index}
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SavedPosts;
