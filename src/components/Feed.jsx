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

import {
  useAccessibility,
} from "../context/AccessibilityProvider";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [lastVisible, setLastVisible] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [hasMore, setHasMore] =
    useState(true);

  const [filteredPosts, setFilteredPosts] =
    useState([]);

  const [userLanguage, setUserLanguage] =
    useState("en");

  const [
    translatingPosts,
    setTranslatingPosts,
  ] = useState({});

  /*
   * Accessibility state
   *
   * The user's selected accessibility
   * needs come from Edit Profile through
   * AuthContext -> AccessibilityProvider.
   */
  const {
    accessibilityNeeds,
    accessibilityProfile,
    voiceEnabled,
    fontScale,
    highContrast,
    setFontScale,
    setHighContrast,
  } = useAccessibility();

  /*
   * Track which post has its accessibility
   * menu open.
   */
  const [
    accessibilityPostId,
    setAccessibilityPostId,
  ] = useState(null);

  /*
   * Per-post temporary accessibility
   * presentation settings.
   *
   * These affect how the post is displayed
   * without changing the user's permanent
   * Edit Profile choices.
   */
  const [
    postAccessibility,
    setPostAccessibility,
  ] = useState({});

  const navigate = useNavigate();

  const { i18n } =
    useTranslation();

  const POSTS_PER_PAGE = 15;

  /*
   * Keep Feed language synchronized with
   * the active application language.
   */
  useEffect(() => {
    const activeLanguage =
      String(
        i18n.language || "en"
      )
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

  /*
   * Stop speech when Feed unmounts.
   */
  useEffect(() => {
    return () => {
      if (
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  async function loadPosts(
    loadMore = false
  ) {
    if (loading) return;

    setLoading(true);

    try {
      let q;

      if (
        loadMore &&
        lastVisible
      ) {
        q = query(
          collection(
            db,
            "posts"
          ),
          orderBy(
            "createdAt",
            "desc"
          ),
          startAfter(
            lastVisible
          ),
          limit(
            POSTS_PER_PAGE
          )
        );
      } else {
        q = query(
          collection(
            db,
            "posts"
          ),
          orderBy(
            "createdAt",
            "desc"
          ),
          limit(
            POSTS_PER_PAGE
          )
        );
      }

      const snapshot =
        await getDocs(q);

      const fetchedPosts =
        snapshot.docs.map(
          (postDoc) => ({
            id: postDoc.id,
            ...postDoc.data(),
          })
        );

      if (
        snapshot.docs.length >
        0
      ) {
        setLastVisible(
          snapshot.docs[
            snapshot.docs.length -
              1
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
          const existingIds =
            new Set(
              prev.map(
                (p) => p.id
              )
            );

          const newPosts =
            fetchedPosts.filter(
              (p) =>
                !existingIds.has(
                  p.id
                )
            );

          return [
            ...prev,
            ...newPosts,
          ];
        });

        setFilteredPosts(
          (prev) => {
            const existingIds =
              new Set(
                prev.map(
                  (p) => p.id
                )
              );

            const newPosts =
              fetchedPosts.filter(
                (p) =>
                  !existingIds.has(
                    p.id
                  )
              );

            return [
              ...prev,
              ...newPosts,
            ];
          }
        );
      } else {
        setPosts(
          fetchedPosts
        );

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

  async function savePost(
    post
  ) {
    try {
      const user =
        auth.currentUser;

      if (!user) return;

      const userRef =
        doc(
          db,
          "users",
          user.uid
        );

      const userSnap =
        await getDoc(
          userRef
        );

      const savedPosts =
        userSnap.exists()
          ? userSnap
              .data()
              .savedPosts ||
            []
          : [];

      if (
        savedPosts.includes(
          post.id
        )
      ) {
        await updateDoc(
          userRef,
          {
            savedPosts:
              arrayRemove(
                post.id
              ),
          }
        );

        alert(
          "Post removed"
        );
      } else {
        await updateDoc(
          userRef,
          {
            savedPosts:
              arrayUnion(
                post.id
              ),
          }
        );

        alert(
          "Post saved"
        );
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
      const postRef =
        doc(
          db,
          "posts",
          postId
        );

      const postSnap =
        await getDoc(
          postRef
        );

      if (
        !postSnap.exists()
      ) {
        return;
      }

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
        post.creatorScore ||
        0;

      if (
        previousReaction
      ) {
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
        (
          reactions[
            emoji
          ] || 0
        ) + 1;

      creatorScore +=
        scoreMap[emoji] || 0;

      await updateDoc(
        postRef,
        {
          reactions,
          creatorScore,
          userReactions: {
            ...(post.userReactions ||
              {}),
            [user.uid]:
              emoji,
          },
        }
      );

      const creatorRef =
        doc(
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
                  [user.uid]:
                    emoji,
                },
              }
            : p
        )
      );

      setFilteredPosts(
        (prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  reactions,
                  creatorScore,
                  userReactions: {
                    ...(p.userReactions ||
                      {}),
                    [user.uid]:
                      emoji,
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

  async function translatePost(
    post
  ) {
    if (
      !post?.id ||
      !post?.text
    ) {
      return;
    }

    const postId =
      post.id;

    if (
      translatingPosts[
        postId
      ]
    ) {
      return;
    }

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

    if (
      post.translatedText?.[
        targetLanguage
      ]
    ) {
      return;
    }

    setTranslatingPosts(
      (prev) => ({
        ...prev,
        [postId]: true,
      })
    );

    try {
      console.log(
        "🌍 Inclura Feed Translation:",
        {
          postId,
          targetLanguage,
        }
      );

      const result =
        await translateText({
          sourceId:
            postId,
          sourceType:
            "post",
          text:
            post.text,
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

      try {
        await saveTranslation({
          sourceId:
            postId,
          sourceType:
            "post",
          originalLanguage:
            result.originalLanguage ||
            "",
          targetLanguage,
          translatedText,
          confidence:
            result.confidence ||
            0,
        });
      } catch (
        cacheSaveError
      ) {
        console.error(
          "Inclura Translation Cache Save Error:",
          cacheSaveError
        );
      }

      const updatedTranslatedText =
        {
          ...(post.translatedText ||
            {}),
          [targetLanguage]:
            translatedText,
        };

      await updateDoc(
        doc(
          db,
          "posts",
          postId
        ),
        {
          translatedText:
            updatedTranslatedText,
        }
      );

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

      setFilteredPosts(
        (prev) =>
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
      setTranslatingPosts(
        (prev) => {
          const next = {
            ...prev,
          };

          delete next[
            postId
          ];

          return next;
        }
      );
    }
  }

  /*
   * Return the temporary accessibility
   * settings for a particular post.
   */
  function getPostAccessibility(
    postId
  ) {
    return (
      postAccessibility[
        postId
      ] || {
        largeText: false,
        highContrast: false,
        textOnly: false,
      }
    );
  }

  /*
   * Update a temporary accessibility
   * setting for one post.
   */
  function togglePostAccessibility(
    postId,
    setting
  ) {
    setPostAccessibility(
      (prev) => {
        const current =
          prev[postId] || {
            largeText: false,
            highContrast: false,
            textOnly: false,
          };

        return {
          ...prev,
          [postId]: {
            ...current,
            [setting]:
              !current[
                setting
              ],
          },
        };
      }
    );
  }

  /*
   * Read a post aloud using the
   * Android/browser speech engine.
   *
   * A direct user click starts the speech,
   * which is important because Android
   * browsers may block unsolicited speech.
   */
  function readPostAloud(
    post
  ) {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    if (
      !window.speechSynthesis
    ) {
      alert(
        "Voice guidance is not available in this browser."
      );

      return;
    }

    const text =
      post.translatedText?.[
        userLanguage
      ] ||
      post.text ||
      "";

    if (!text.trim()) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    /*
     * Map common Inclura language
     * codes to speech language codes.
     */
    const speechLanguageMap =
      {
        en: "en-US",
        es: "es-ES",
        fr: "fr-FR",
        pt: "pt-PT",
        ar: "ar-SA",
        zh: "zh-CN",
        "zh-tw": "zh-TW",
        ja: "ja-JP",
        de: "de-DE",
        hi: "hi-IN",
        ru: "ru-RU",
        it: "it-IT",
        nl: "nl-NL",
        sw: "sw-KE",
        yo: "yo-NG",
        ig: "ig-NG",
        ha: "ha-NG",
        pcm: "en-NG",
        ko: "ko-KR",
        vi: "vi-VN",
        th: "th-TH",
        id: "id-ID",
        ms: "ms-MY",
        bn: "bn-BD",
        tr: "tr-TR",
      };

    utterance.lang =
      speechLanguageMap[
        userLanguage
      ] ||
      userLanguage ||
      "en-US";

    utterance.rate =
      0.9;

    utterance.pitch =
      1;

    utterance.volume =
      1;

    window.speechSynthesis.speak(
      utterance
    );
  }

  /*
   * Stop all current speech.
   */
  function stopReading() {
    if (
      typeof window !==
        "undefined" &&
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }
  }

  /*
   * Open the central Accessibility
   * Settings page.
   */
  function openAccessibilitySettings() {
    navigate(
      "/accessibility"
    );
  }

  function handleShare(
    postId
  ) {
    const url =
      `${window.location.origin}/post/${postId}`;

    if (
      navigator.clipboard
    ) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert(
            "Post link copied!"
          );
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

      return;
    }

    alert(
      "Sharing is not available in this browser."
    );
  }

  function getBadge(
    post
  ) {
    if (!post.verified) {
      return null;
    }

    return getVerificationBadge(
      post.badgeType
    );
  }

  function getPremium(
    post
  ) {
    if (!post.premium) {
      return null;
    }

    return getPremiumBadge(
      post.premiumTier
    );
  }

  /*
   * Whether the current profile has
   * visual accessibility needs.
   */
  const visualImpairmentEnabled =
    Boolean(
      accessibilityProfile
        ?.blindLowVision
    );

  /*
   * Whether the current profile has
   * hearing-related needs.
   */
  const hearingNeedEnabled =
    Boolean(
      accessibilityProfile
        ?.deaf
    );

  /*
   * Whether the current profile has
   * mobility-related needs.
   */
  const mobilityNeedEnabled =
    Boolean(
      accessibilityProfile
        ?.wheelchair ||
        accessibilityProfile
          ?.motorImpaired
    );

  /*
   * Whether the current profile has
   * neurodivergent needs.
   */
  const neurodivergentEnabled =
    Boolean(
      accessibilityProfile
        ?.neurodivergent
    );

  return (
    <div
      style={{
        padding:
          "24px",
        maxWidth:
          "720px",
        margin:
          "0 auto",
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
          marginTop:
            "24px",
        }}
      >
        {filteredPosts.length ===
        0 ? (
          <div
            style={{
              background:
                "#0f172a",
              padding:
                "24px",
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
                post
                  .translatedText?.[
                  userLanguage
                ];

              const currentAccessibility =
                getPostAccessibility(
                  post.id
                );

              const accessibilityOpen =
                accessibilityPostId ===
                post.id;

              const displayedText =
                translated ||
                post.text ||
                "";

              const postFontSize =
                currentAccessibility.largeText
                  ? `${Math.max(
                      fontScale,
                      1.35
                    )}rem`
                  : `${fontScale}rem`;

              return (
                <div
                  key={
                    post.id
                  }
                  style={{
                    background:
                      currentAccessibility.highContrast ||
                      highContrast
                        ? "#000000"
                        : "#0f172a",
                    color:
                      currentAccessibility.highContrast ||
                      highContrast
                        ? "#ffffff"
                        : "inherit",
                    padding:
                      "24px",
                    borderRadius:
                      "24px",
                    marginBottom:
                      "20px",
                    border:
                      accessibilityOpen
                        ? "2px solid #38bdf8"
                        : "1px solid rgba(148,163,184,0.12)",
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
                          gap:
                            "8px",
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

                  {!currentAccessibility.textOnly && (
                    <>
                      {post.imageUrl && (
                        <img
                          src={
                            post.imageUrl
                          }
                          alt={
                            `Image shared by ${
                              post.userName ||
                              "user"
                            }`
                          }
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
                          aria-label={
                            `Video shared by ${
                              post.userName ||
                              "user"
                            }`
                          }
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
                    </>
                  )}

                  <p
                    style={{
                      fontSize:
                        postFontSize,
                      lineHeight:
                        "1.7",
                      marginTop:
                        "14px",
                    }}
                  >
                    {displayedText}
                  </p>

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
                    aria-label={
                      isTranslating
                        ? "Translating post"
                        : translated
                        ? `Post translated to ${userLanguage}`
                        : "Translate this post"
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

                  {/*
                   * ==================================================
                   * PER-POST ACCESSIBILITY CONTROL
                   * ==================================================
                   *
                   * This appears under EVERY post,
                   * including old posts loaded from Firestore.
                   */}
                  <div
                    style={{
                      marginTop:
                        "14px",
                      borderTop:
                        "1px solid rgba(148,163,184,0.18)",
                      paddingTop:
                        "14px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setAccessibilityPostId(
                          accessibilityOpen
                            ? null
                            : post.id
                        )
                      }
                      aria-expanded={
                        accessibilityOpen
                      }
                      aria-controls={`post-accessibility-${post.id}`}
                      style={{
                        width:
                          "100%",
                        padding:
                          "11px 14px",
                        borderRadius:
                          "12px",
                        border:
                          "1px solid #38bdf8",
                        background:
                          accessibilityOpen
                            ? "#0369a1"
                            : "#172554",
                        color:
                          "#ffffff",
                        fontWeight:
                          "600",
                        cursor:
                          "pointer",
                        textAlign:
                          "left",
                      }}
                    >
                      ♿{" "}
                      {accessibilityOpen
                        ? "Close Accessibility"
                        : "Accessibility Needs & Controls"}
                    </button>

                    {accessibilityOpen && (
                      <div
                        id={`post-accessibility-${post.id}`}
                        style={{
                          marginTop:
                            "12px",
                          padding:
                            "16px",
                          borderRadius:
                            "16px",
                          background:
                            highContrast
                              ? "#111111"
                              : "#111827",
                          border:
                            "1px solid rgba(56,189,248,0.35)",
                        }}
                      >
                        <div
                          style={{
                            fontWeight:
                              "700",
                            marginBottom:
                              "10px",
                          }}
                        >
                          Accessibility for this post
                        </div>

                        <div
                          style={{
                            fontSize:
                              "13px",
                            lineHeight:
                              "1.6",
                            marginBottom:
                              "14px",
                            color:
                              "#cbd5e1",
                          }}
                        >
                          Your accessibility needs selected in
                          Edit Profile:
                        </div>

                        {accessibilityNeeds &&
                        accessibilityNeeds.length >
                          0 ? (
                          <div
                            style={{
                              display:
                                "flex",
                              gap:
                                "8px",
                              flexWrap:
                                "wrap",
                              marginBottom:
                                "14px",
                            }}
                          >
                            {accessibilityNeeds.map(
                              (
                                need,
                                index
                              ) => (
                                <span
                                  key={`${post.id}-need-${index}`}
                                  style={{
                                    padding:
                                      "7px 10px",
                                    borderRadius:
                                      "999px",
                                    background:
                                      "#1e3a8a",
                                    color:
                                      "#ffffff",
                                    fontSize:
                                      "12px",
                                  }}
                                >
                                  ♿{" "}
                                  {
                                    need
                                  }
                                </span>
                              )
                            )}
                          </div>
                        ) : (
                          <div
                            style={{
                              padding:
                                "10px",
                              borderRadius:
                                "10px",
                              background:
                                "#1e293b",
                              color:
                                "#cbd5e1",
                              marginBottom:
                                "14px",
                              fontSize:
                                "13px",
                            }}
                          >
                            No specific accessibility need is
                            currently selected in Edit Profile.
                          </div>
                        )}

                        {visualImpairmentEnabled && (
                          <div
                            style={{
                              padding:
                                "10px",
                              borderRadius:
                                "10px",
                              background:
                                "#172554",
                              marginBottom:
                                "12px",
                              color:
                                "#dbeafe",
                              fontSize:
                                "13px",
                            }}
                          >
                            👁️ Visual impairment support is
                            active for your profile.
                          </div>
                        )}

                        {hearingNeedEnabled && (
                          <div
                            style={{
                              padding:
                                "10px",
                              borderRadius:
                                "10px",
                              background:
                                "#172554",
                              marginBottom:
                                "12px",
                              color:
                                "#dbeafe",
                              fontSize:
                                "13px",
                            }}
                          >
                            👂 Hearing accessibility support is
                            active for your profile.
                          </div>
                        )}

                        {mobilityNeedEnabled && (
                          <div
                            style={{
                              padding:
                                "10px",
                              borderRadius:
                                "10px",
                              background:
                                "#172554",
                              marginBottom:
                                "12px",
                              color:
                                "#dbeafe",
                              fontSize:
                                "13px",
                            }}
                          >
                            ♿ Mobility accessibility support is
                            active for your profile.
                          </div>
                        )}

                        {neurodivergentEnabled && (
                          <div
                            style={{
                              padding:
                                "10px",
                              borderRadius:
                                "10px",
                              background:
                                "#172554",
                              marginBottom:
                                "12px",
                              color:
                                "#dbeafe",
                              fontSize:
                                "13px",
                            }}
                          >
                            🧠 Neurodivergent accessibility
                            support is active for your profile.
                          </div>
                        )}

                        <div
                          style={{
                            display:
                              "flex",
                            gap:
                              "8px",
                            flexWrap:
                              "wrap",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              readPostAloud(
                                post
                              )
                            }
                            aria-label="Read this post aloud"
                            style={{
                              padding:
                                "10px 12px",
                              borderRadius:
                                "10px",
                              border:
                                "none",
                              background:
                                "#2563eb",
                              color:
                                "#ffffff",
                              cursor:
                                "pointer",
                              fontWeight:
                                "600",
                            }}
                          >
                            🔊 Read Aloud
                          </button>

                          <button
                            type="button"
                            onClick={
                              stopReading
                            }
                            aria-label="Stop reading"
                            style={{
                              padding:
                                "10px 12px",
                              borderRadius:
                                "10px",
                              border:
                                "none",
                              background:
                                "#7f1d1d",
                              color:
                                "#ffffff",
                              cursor:
                                "pointer",
                            }}
                          >
                            ⏹️ Stop
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              togglePostAccessibility(
                                post.id,
                                "largeText"
                              )
                            }
                            aria-pressed={
                              currentAccessibility.largeText
                            }
                            style={{
                              padding:
                                "10px 12px",
                              borderRadius:
                                "10px",
                              border:
                                currentAccessibility.largeText
                                  ? "2px solid #38bdf8"
                                  : "none",
                              background:
                                "#334155",
                              color:
                                "#ffffff",
                              cursor:
                                "pointer",
                            }}
                          >
                            🔤{" "}
                            {currentAccessibility.largeText
                              ? "Normal Text"
                              : "Large Text"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              togglePostAccessibility(
                                post.id,
                                "highContrast"
                              )
                            }
                            aria-pressed={
                              currentAccessibility.highContrast
                            }
                            style={{
                              padding:
                                "10px 12px",
                              borderRadius:
                                "10px",
                              border:
                                currentAccessibility.highContrast
                                  ? "2px solid #38bdf8"
                                  : "none",
                              background:
                                "#334155",
                              color:
                                "#ffffff",
                              cursor:
                                "pointer",
                            }}
                          >
                            ◐{" "}
                            {currentAccessibility.highContrast
                              ? "Normal Contrast"
                              : "High Contrast"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              togglePostAccessibility(
                                post.id,
                                "textOnly"
                              )
                            }
                            aria-pressed={
                              currentAccessibility.textOnly
                            }
                            style={{
                              padding:
                                "10px 12px",
                              borderRadius:
                                "10px",
                              border:
                                currentAccessibility.textOnly
                                  ? "2px solid #38bdf8"
                                  : "none",
                              background:
                                "#334155",
                              color:
                                "#ffffff",
                              cursor:
                                "pointer",
                            }}
                          >
                            📝{" "}
                            {currentAccessibility.textOnly
                              ? "Show Media"
                              : "Text Only"}
                          </button>

                          <button
                            type="button"
                            onClick={
                              openAccessibilitySettings
                            }
                            aria-label="Open Accessibility Settings"
                            style={{
                              padding:
                                "10px 12px",
                              borderRadius:
                                "10px",
                              border:
                                "none",
                              background:
                                "#0f766e",
                              color:
                                "#ffffff",
                              cursor:
                                "pointer",
                            }}
                          >
                            ⚙️ Accessibility Settings
                          </button>
                        </div>

                        {voiceEnabled && (
                          <div
                            style={{
                              marginTop:
                                "12px",
                              fontSize:
                                "12px",
                              color:
                                "#7dd3fc",
                            }}
                          >
                            🔊 Voice Guidance is currently
                            enabled in Accessibility Settings.
                            Use "Read Aloud" above to read this
                            existing post.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display:
                        "flex",
                      gap:
                        "10px",
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
                          aria-label={`React ${emoji} to this post`}
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
                          {
                            post
                              .reactions?.[
                              emoji
                            ] ||
                            0
                          }
                        </button>
                      )
                    )}
                  </div>

                  <div
                    style={{
                      display:
                        "flex",
                      gap:
                        "12px",
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
                loadPosts(
                  true
                )
              }
              disabled={
                loading
              }
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
