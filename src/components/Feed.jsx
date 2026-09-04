import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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

import {
  translateText,
  saveTranslation,
} from "../translation/textTranslator";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);

  const [loading, setLoading] = useState(false);

  const [hasMore, setHasMore] = useState(true);

  const [filteredPosts, setFilteredPosts] = useState([]);

  const [userLanguage, setUserLanguage] = useState("en");

  const [translatingPosts, setTranslatingPosts] = useState({});

  const navigate = useNavigate();

  const { i18n } = useTranslation();

  const POSTS_PER_PAGE = 15;

  /*
   * Keep Feed language synchronized with
   * the active application language.
   *
   * This is important because the previous
   * implementation only loaded the user's
   * preferred language once from Firestore.
   *
   * Now, when the user changes:
   *
   * English → Yoruba
   * Yoruba → Spanish
   * Spanish → Igbo
   *
   * the Feed immediately follows i18n.language.
   */
  useEffect(() => {
    const activeLanguage =
      String(i18n.language || "en")
        .trim()
        .toLowerCase();

    setUserLanguage(
      activeLanguage || "en"
    );
  }, [i18n.language]);

  /*
   * Load the initial Feed.
   */
  useEffect(() => {
    loadPosts(false);
  }, []);

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

      const fetchedPosts =
        snapshot.docs.map((postDoc) => ({
          id: postDoc.id,
          ...postDoc.data(),
        }));

      if (snapshot.docs.length > 0) {
        setLastVisible(
          snapshot.docs[
            snapshot.docs.length - 1
          ]
        );
      }

      if (
        snapshot.docs.length <
        POSTS_PER_PAGE
      ) {
        setHasMore(false);
      }

      if (loadMore) {
        setPosts((prev) => {
          const existingIds = new Set(
            prev.map((p) => p.id)
          );

          const newPosts =
            fetchedPosts.filter(
              (p) => !existingIds.has(p.id)
            );

          return [
            ...prev,
            ...newPosts,
          ];
        });

        setFilteredPosts((prev) => {
          const existingIds = new Set(
            prev.map((p) => p.id)
          );

          const newPosts =
            fetchedPosts.filter(
              (p) => !existingIds.has(p.id)
            );

          return [
            ...prev,
            ...newPosts,
          ];
        });
      } else {
        setPosts(fetchedPosts);
        setFilteredPosts(
          fetchedPosts
        );
      }
    } catch (error) {
      console.error(
        "Inclura Feed Load Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

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
          ? userSnap.data()
              .savedPosts || []
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

        alert("Post removed");
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
      console.error(
        "Inclura Save Post Error:",
        err
      );

      alert(
        "Unable to save post."
      );
    }
  }

  async function reactToPost(
    postId,
    emoji
  ) {
    const user =
      auth.currentUser;

    if (!user) return;

    try {
      const postRef = doc(
        db,
        "posts",
        postId
      );

      const postSnap =
        await getDoc(postRef);

      if (!postSnap.exists()) return;

      const post =
        postSnap.data();

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
        post.userReactions?.[
          user.uid
        ];

      const reactions = {
        "👍":
          post.reactions?.[
            "👍"
          ] || 0,
        "❤️":
          post.reactions?.[
            "❤️"
          ] || 0,
        "😂":
          post.reactions?.[
            "😂"
          ] || 0,
        "😊":
          post.reactions?.[
            "😊"
          ] || 0,
        "😮":
          post.reactions?.[
            "😮"
          ] || 0,
        "😢":
          post.reactions?.[
            "😢"
          ] || 0,
        "👏":
          post.reactions?.[
            "👏"
          ] || 0,
        "👎":
          post.reactions?.[
            "👎"
          ] || 0,
      };

      let creatorScore =
        post.creatorScore || 0;

      if (previousReaction) {
        reactions[
          previousReaction
        ] = Math.max(
          0,
          (
            reactions[
              previousReaction
            ] || 1
          ) - 1
        );

        creatorScore -=
          scoreMap[
            previousReaction
          ] || 0;
      }

      reactions[emoji] =
        (reactions[emoji] || 0) +
        1;

      creatorScore +=
        scoreMap[emoji] || 0;

      await updateDoc(postRef, {
        reactions,
        creatorScore,
        userReactions: {
          ...(post.userReactions ||
            {}),
          [user.uid]: emoji,
        },
      });

      const creatorRef = doc(
        db,
        "users",
        post.userId
      );

      await updateDoc(
        creatorRef,
        {
          creatorScore,
        }
      );

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                reactions,
                creatorScore,
                userReactions: {
                  ...(p.userReactions ||
                    {}),
                  [user.uid]: emoji,
                },
              }
            : p
        )
      );

      setFilteredPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                reactions,
                creatorScore,
                userReactions: {
                  ...(p.userReactions ||
                    {}),
                  [user.uid]: emoji,
                },
              }
            : p
        )
      );
    } catch (error) {
      console.error(
        "Inclura Reaction Error:",
        error
      );
    }
  }

  async function translatePost(post) {
    if (!post?.id || !post?.text) {
      return;
    }

    const postId = post.id;

    /*
     * Prevent duplicate requests for
     * this specific post.
     */
    if (translatingPosts[postId]) {
      return;
    }

    /*
     * Always read the current active
     * application language.
     */
    const targetLanguage =
      String(
        i18n.language ||
          userLanguage ||
          "en"
      )
        .trim()
        .toLowerCase();

    if (!targetLanguage) {
      return;
    }

    /*
     * If this post already has a translation
     * for the active language, nothing needs
     * to be sent to Gemini again.
     */
    if (
      post.translatedText?.[
        targetLanguage
      ]
    ) {
      return;
    }

    setTranslatingPosts((prev) => ({
      ...prev,
      [postId]: true,
    }));

    try {
      console.log(
        "🌍 Inclura Feed Translation:",
        {
          postId,
          targetLanguage,
        }
      );

      /*
       * Always translate from the original
       * post text.
       *
       * We do NOT translate:
       *
       * Spanish → Yoruba → Igbo
       *
       * Instead, if the original post is
       * English, every requested language
       * is generated directly from the
       * original English text.
       */
      const result =
        await translateText({
          sourceId: postId,
          sourceType: "post",
          text: post.text,
          targetLanguage,
        });

      if (
        !result?.translatedText ||
        typeof result.translatedText !==
          "string"
      ) {
        throw new Error(
          "Translation service returned no translated text."
        );
      }

      const translatedText =
        result.translatedText.trim();

      if (!translatedText) {
        throw new Error(
          "Translation service returned empty text."
        );
      }

      /*
       * Save to the central translation
       * collection for cache/reuse.
       */
      try {
        await saveTranslation({
          sourceId: postId,
          sourceType: "post",
          originalLanguage:
            result.originalLanguage ||
            "",
          targetLanguage,
          translatedText,
          confidence:
            result.confidence || 0,
        });
      } catch (cacheSaveError) {
        /*
         * Translation succeeded even if
         * the optional cache write fails.
         */
        console.error(
          "Inclura Translation Cache Save Error:",
          cacheSaveError
        );
      }

      const updatedTranslatedText = {
        ...(post.translatedText || {}),
        [targetLanguage]:
          translatedText,
      };

      /*
       * Persist the translation on the
       * post as well.
       */
      await updateDoc(
        doc(db, "posts", postId),
        {
          translatedText:
            updatedTranslatedText,
        }
      );

      /*
       * Immediately update the visible Feed.
       */
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                translatedText:
                  updatedTranslatedText,
              }
            : p
        )
      );

      setFilteredPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                translatedText:
                  updatedTranslatedText,
              }
            : p
        )
      );
    } catch (error) {
      console.error(
        "Inclura Feed Translation Error:",
        error
      );

      alert(
        error?.message ||
          "Translation failed. Please try again."
      );
    } finally {
      setTranslatingPosts((prev) => {
        const next = {
          ...prev,
        };

        delete next[postId];

        return next;
      });
    }
  }

  function handleShare(postId) {
    const url =
      `${window.location.origin}/post/${postId}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("Post link copied!");
      })
      .catch((error) => {
        console.error(
          "Inclura Share Error:",
          error
        );

        alert(
          "Unable to copy post link."
        );
      });
  }

  function getBadge(post) {
    if (!post.verified) return null;

    return getVerificationBadge(
      post.badgeType
    );
  }

  function getPremium(post) {
    if (!post.premium) return null;

    return getPremiumBadge(
      post.premiumTier
    );
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
            (post) => {
              const isTranslating =
                Boolean(
                  translatingPosts[
                    post.id
                  ]
                );

              const translated =
                post.translatedText?.[
                  userLanguage
                ];

              return (
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
                    {translated ||
                      post.text}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      translatePost(
                        post
                      )
                    }
                    disabled={
                      isTranslating
                    }
                    style={{
                      marginTop:
                        "10px",
                      padding:
                        "8px 14px",
                      borderRadius:
                        "12px",
                      border:
                        "none",
                      background:
                        isTranslating
                          ? "#475569"
                          : "#334155",
                      color:
                        "white",
                      cursor:
                        isTranslating
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {isTranslating
                      ? "🌍 Translating..."
                      : translated
                      ? "🌍 Translated"
                      : "🌍 Translate"}
                  </button>

                  {translated && (
                    <small
                      style={{
                        display:
                          "block",
                        marginTop:
                          "6px",
                        opacity:
                          0.7,
                      }}
                    >
                      Translated to{" "}
                      {
                        userLanguage
                      }
                    </small>
                  )}

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
                        marginTop:
                          "12px",
                      }}
                    />
                  )}

                  {post.videoUrl && (
                    <video
                      controls
                      style={{
                        width:
                          "100%",
                        borderRadius:
                          "16px",
                        marginTop:
                          "12px",
                      }}
                    >
                      <source
                        src={
                          post.videoUrl
                        }
                        type="video/mp4"
                      />
                    </video>
                  )}

                  <div
                    style={{
                      display:
                        "flex",
                      gap: "10px",
                      flexWrap:
                        "wrap",
                      marginTop:
                        "16px",
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
                    ].map(
                      (emoji) => (
                        <button
                          key={
                            emoji
                          }
                          type="button"
                          onClick={() =>
                            reactToPost(
                              post.id,
                              emoji
                            )
                          }
                          style={{
                            padding:
                              "8px 12px",
                            borderRadius:
                              "20px",
                            cursor:
                              "pointer",
                          }}
                        >
                          {
                            emoji
                          }{" "}
                          {post
                            .reactions?.[
                            emoji
                          ] ||
                            0}
                        </button>
                      )
                    )}
                  </div>

                  <div
                    style={{
                      display:
                        "flex",
                      gap: "12px",
                      marginTop:
                        "16px",
                      flexWrap:
                        "wrap",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/post/${post.id}`
                        )
                      }
                    >
                      💬 Comment
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/crosspost/${post.id}`
                        )
                      }
                    >
                      🔀 Cross-post
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        savePost(
                          post
                        )
                      }
                    >
                      📌 Save
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleShare(
                          post.id
                        )
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
              );
            }
          )
        )}

        {hasMore && (
          <div
            style={{
              textAlign:
                "center",
              marginTop:
                "24px",
              marginBottom:
                "20px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                loadPosts(true)
              }
              disabled={loading}
              style={{
                padding:
                  "12px 24px",
                borderRadius:
                  "14px",
                border:
                  "none",
                background:
                  "#2563eb",
                color:
                  "#fff",
                cursor:
                  loading
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {loading
                ? "Loading..."
                : "Load More Posts"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;
