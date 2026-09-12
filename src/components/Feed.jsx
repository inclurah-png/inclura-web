import { useNavigate } from "react-router-dom";
import {
  useEffect,
  useState,
} from "react";
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

  const [translatingPosts, setTranslatingPosts] =
    useState({});

  /*
   * Accessibility state for Feed posts.
   */
  const [
    openAccessibilityPost,
    setOpenAccessibilityPost,
  ] = useState(null);

  const [
    largeTextPosts,
    setLargeTextPosts,
  ] = useState({});

  const [
    highContrastPosts,
    setHighContrastPosts,
  ] = useState({});

  const [
    textOnlyPosts,
    setTextOnlyPosts,
  ] = useState({});

  const [
    captionPosts,
    setCaptionPosts,
  ] = useState({});

  const [
    speakingPostId,
    setSpeakingPostId,
  ] = useState(null);

  const navigate = useNavigate();

  const { i18n, t } =
    useTranslation();

  const {
    accessibilityProfile,
    accessibilityNeeds,
    voiceEnabled,
    highContrast,
    reducedMotion,
  } = useAccessibility();

  const POSTS_PER_PAGE = 15;

  /*
   * Keep Feed language synchronized
   * with the active application language.
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
        typeof window !==
          "undefined" &&
        "speechSynthesis" in window
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

  async function savePost(post) {
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
          t(
            "feed.postRemoved",
            "Post removed"
          )
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
          t(
            "feed.postSaved",
            "Post saved"
          )
        );
      }
    } catch (err) {
      console.error(
        "Inclura Save Post Error:",
        err
      );

      alert(
        t(
          "feed.saveError",
          "Unable to save post."
        )
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
        (reactions[emoji] ||
          0) + 1;

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
            [user.uid]: emoji,
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
          t(
            "feed.translationFailed",
            "Translation failed. Please try again."
          )
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
   * Read an existing Feed post aloud.
   *
   * This is intentionally explicit.
   * We do NOT automatically read every
   * old Feed post merely because Voice
   * Guidance is enabled.
   */
  function readPostAloud(post) {
    if (
      !post ||
      typeof window ===
        "undefined" ||
      !(
        "speechSynthesis" in
        window
      )
    ) {
      return;
    }

    const translated =
      post.translatedText?.[
        userLanguage
      ];

    const text =
      String(
        translated ||
          post.text ||
          ""
      ).trim();

    if (!text) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    utterance.lang =
      getSpeechLanguage(
        userLanguage
      );

    utterance.rate = 0.9;

    utterance.pitch = 1;

    utterance.volume = 1;

    utterance.onstart = () => {
      setSpeakingPostId(
        post.id
      );
    };

    utterance.onend = () => {
      setSpeakingPostId(
        null
      );
    };

    utterance.onerror = () => {
      setSpeakingPostId(
        null
      );
    };

    window.speechSynthesis.speak(
      utterance
    );
  }

  function stopReading() {
    if (
      typeof window !==
        "undefined" &&
      "speechSynthesis" in
        window
    ) {
      window.speechSynthesis.cancel();
    }

    setSpeakingPostId(
      null
    );
  }

  function getSpeechLanguage(
    language
  ) {
    const languageMap = {
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

    return (
      languageMap[
        String(
          language || "en"
        ).toLowerCase()
      ] ||
      "en-US"
    );
  }

  function toggleLargeText(
    postId
  ) {
    setLargeTextPosts(
      (prev) => ({
        ...prev,
        [postId]:
          !prev[postId],
      })
    );
  }

  function toggleHighContrast(
    postId
  ) {
    setHighContrastPosts(
      (prev) => ({
        ...prev,
        [postId]:
          !prev[postId],
      })
    );
  }

  function toggleTextOnly(
    postId
  ) {
    setTextOnlyPosts(
      (prev) => ({
        ...prev,
        [postId]:
          !prev[postId],
      })
    );
  }

  function toggleCaptions(
    postId
  ) {
    setCaptionPosts(
      (prev) => ({
        ...prev,
        [postId]:
          !prev[postId],
      })
    );
  }

  function handleShare(
    postId
  ) {
    const url =
      `${window.location.origin}/post/${postId}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert(
          t(
            "feed.linkCopied",
            "Post link copied!"
          )
        );
      })
      .catch((error) => {
        console.error(
          "Inclura Share Error:",
          error
        );

        alert(
          t(
            "feed.shareError",
            "Unable to copy post link."
          )
        );
      });
  }

  function getBadge(post) {
    if (!post.verified) {
      return null;
    }

    return getVerificationBadge(
      post.badgeType
    );
  }

  function getPremium(post) {
    if (!post.premium) {
      return null;
    }

    return getPremiumBadge(
      post.premiumTier
    );
  }

  function getAccessibilityLabel() {
    if (
      accessibilityNeeds?.length >
      0
    ) {
      return t(
        "feed.accessibility",
        "Accessibility"
      );
    }

    return t(
      "feed.accessibility",
      "Accessibility"
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
            {t(
              "feed.noPosts",
              "No posts yet"
            )}
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

              const isAccessibilityOpen =
                openAccessibilityPost ===
                post.id;

              const isLargeText =
                Boolean(
                  largeTextPosts[
                    post.id
                  ]
                );

              const isPostHighContrast =
                Boolean(
                  highContrastPosts[
                    post.id
                  ]
                ) ||
                highContrast;

              const isTextOnly =
                Boolean(
                  textOnlyPosts[
                    post.id
                  ]
                );

              const hasCaptions =
                Boolean(
                  post.captionUrl ||
                    post.captionsUrl ||
                    post.subtitleUrl ||
                    post.subtitlesUrl ||
                    post.transcript ||
                    post.transcriptText
                );

              const showCaptions =
                Boolean(
                  captionPosts[
                    post.id
                  ]
                );

              const signLanguageUrl =
                post.signLanguageUrl ||
                post.signLanguageVideoUrl ||
                post.signLanguageMediaUrl ||
                null;

              const displayedText =
                translated ||
                post.text ||
                "";

              return (
                <div
                  key={post.id}
                  style={{
                    background:
                      isPostHighContrast
                        ? "#000000"
                        : "#0f172a",
                    color:
                      isPostHighContrast
                        ? "#ffffff"
                        : "inherit",
                    padding:
                      "24px",
                    borderRadius:
                      "24px",
                    marginBottom:
                      "20px",
                    transition:
                      reducedMotion
                        ? "none"
                        : "all 0.2s ease",
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
                      gap: "12px",
                    }}
                  >
                    <div>
                      <h3
                        onClick={() =>
                          navigate(
                            `/user/${post.userId}`
                          )
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(
                          event
                        ) => {
                          if (
                            event.key ===
                              "Enter" ||
                            event.key ===
                              " "
                          ) {
                            event.preventDefault();

                            navigate(
                              `/user/${post.userId}`
                            );
                          }
                        }}
                        aria-label={t(
                          "feed.openProfile",
                          "Open user profile"
                        )}
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
                          <span
                            aria-label={t(
                              "feed.verified",
                              "Verified"
                            )}
                          >
                            {getBadge(
                              post
                            )}
                          </span>
                        )}

                        {getPremium(
                          post
                        ) && (
                          <span
                            aria-label={t(
                              "feed.premium",
                              "Premium"
                            )}
                          >
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
                              isPostHighContrast
                                ? "#ffffff"
                                : "#94a3b8",
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

                  <div
                    style={{
                      display:
                        "flex",
                      gap: "8px",
                      flexWrap:
                        "wrap",
                      marginBottom:
                        "12px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setOpenAccessibilityPost(
                          isAccessibilityOpen
                            ? null
                            : post.id
                        );
                      }}
                      aria-expanded={
                        isAccessibilityOpen
                      }
                      aria-controls={`accessibility-${post.id}`}
                      aria-label={getAccessibilityLabel()}
                      style={{
                        padding:
                          "8px 12px",
                        borderRadius:
                          "12px",
                        border:
                          "1px solid #64748b",
                        background:
                          isAccessibilityOpen
                            ? "#2563eb"
                            : "#334155",
                        color:
                          "#ffffff",
                        cursor:
                          "pointer",
                        fontWeight:
                          "600",
                      }}
                    >
                      ♿{" "}
                      {getAccessibilityLabel()}
                    </button>
                  </div>

                  {isAccessibilityOpen && (
                    <div
                      id={`accessibility-${post.id}`}
                      role="region"
                      aria-label={t(
                        "feed.accessibilityOptions",
                        "Post accessibility options"
                      )}
                      style={{
                        background:
                          isPostHighContrast
                            ? "#111111"
                            : "#1e293b",
                        color:
                          "#ffffff",
                        border:
                          "1px solid #475569",
                        borderRadius:
                          "16px",
                        padding:
                          "16px",
                        marginBottom:
                          "16px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight:
                            "700",
                          marginBottom:
                            "12px",
                        }}
                      >
                        {t(
                          "feed.accessibilityForPost",
                          "Accessibility for this post"
                        )}
                      </div>

                      <div
                        style={{
                          display:
                            "flex",
                          gap: "10px",
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
                          aria-label={t(
                            "feed.readAloud",
                            "Read post aloud"
                          )}
                          style={{
                            padding:
                              "9px 12px",
                            borderRadius:
                              "12px",
                            border:
                              "none",
                            background:
                              "#2563eb",
                            color:
                              "#ffffff",
                            cursor:
                              "pointer",
                          }}
                        >
                          🔊{" "}
                          {t(
                            "feed.readAloud",
                            "Read aloud"
                          )}
                        </button>

                        {speakingPostId ===
                          post.id && (
                          <button
                            type="button"
                            onClick={
                              stopReading
                            }
                            aria-label={t(
                              "feed.stopReading",
                              "Stop reading"
                            )}
                            style={{
                              padding:
                                "9px 12px",
                              borderRadius:
                                "12px",
                              border:
                                "none",
                              background:
                                "#dc2626",
                              color:
                                "#ffffff",
                              cursor:
                                "pointer",
                            }}
                          >
                            ⏹{" "}
                            {t(
                              "feed.stopReading",
                              "Stop reading"
                            )}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            toggleLargeText(
                              post.id
                            )
                          }
                          aria-pressed={
                            isLargeText
                          }
                          aria-label={t(
                            "feed.largeText",
                            "Large text"
                          )}
                          style={{
                            padding:
                              "9px 12px",
                            borderRadius:
                              "12px",
                            border:
                              "none",
                            background:
                              isLargeText
                                ? "#16a34a"
                                : "#334155",
                            color:
                              "#ffffff",
                            cursor:
                              "pointer",
                          }}
                        >
                          🔎{" "}
                          {t(
                            "feed.largeText",
                            "Large text"
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleHighContrast(
                              post.id
                            )
                          }
                          aria-pressed={
                            isPostHighContrast
                          }
                          aria-label={t(
                            "feed.highContrast",
                            "High contrast"
                          )}
                          style={{
                            padding:
                              "9px 12px",
                            borderRadius:
                              "12px",
                            border:
                              "none",
                            background:
                              isPostHighContrast
                                ? "#ffffff"
                                : "#334155",
                            color:
                              isPostHighContrast
                                ? "#000000"
                                : "#ffffff",
                            cursor:
                              "pointer",
                          }}
                        >
                          ◐{" "}
                          {t(
                            "feed.highContrast",
                            "High contrast"
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleTextOnly(
                              post.id
                            )
                          }
                          aria-pressed={
                            isTextOnly
                          }
                          aria-label={t(
                            "feed.textOnly",
                            "Text only"
                          )}
                          style={{
                            padding:
                              "9px 12px",
                            borderRadius:
                              "12px",
                            border:
                              "none",
                            background:
                              isTextOnly
                                ? "#16a34a"
                                : "#334155",
                            color:
                              "#ffffff",
                            cursor:
                              "pointer",
                          }}
                        >
                          📝{" "}
                          {t(
                            "feed.textOnly",
                            "Text only"
                          )}
                        </button>

                        {hasCaptions && (
                          <button
                            type="button"
                            onClick={() =>
                              toggleCaptions(
                                post.id
                              )
                            }
                            aria-pressed={
                              showCaptions
                            }
                            aria-label={t(
                              "feed.captions",
                              "Captions and transcript"
                            )}
                            style={{
                              padding:
                                "9px 12px",
                              borderRadius:
                                "12px",
                              border:
                                "none",
                              background:
                                showCaptions
                                  ? "#16a34a"
                                  : "#334155",
                              color:
                                "#ffffff",
                              cursor:
                                "pointer",
                            }}
                          >
                            📝{" "}
                            {t(
                              "feed.captions",
                              "Captions"
                            )}
                          </button>
                        )}

                        {signLanguageUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              window.open(
                                signLanguageUrl,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                            aria-label={t(
                              "feed.signLanguage",
                              "Open sign language support"
                            )}
                            style={{
                              padding:
                                "9px 12px",
                              borderRadius:
                                "12px",
                              border:
                                "none",
                              background:
                                "#334155",
                              color:
                                "#ffffff",
                              cursor:
                                "pointer",
                            }}
                          >
                            🤟{" "}
                            {t(
                              "feed.signLanguage",
                              "Sign language"
                            )}
                          </button>
                        )}
                      </div>

                      <div
                        style={{
                          marginTop:
                            "14px",
                          fontSize:
                            "13px",
                          opacity:
                            0.85,
                        }}
                      >
                        {accessibilityProfile?.blindLowVision &&
                          t(
                            "feed.visualAccessibilityActive",
                            "Visual accessibility is active for your profile."
                          )}

                        {accessibilityProfile?.deaf &&
                          t(
                            "feed.hearingAccessibilityActive",
                            "Hearing accessibility is active for your profile."
                          )}

                        {accessibilityProfile?.wheelchair ||
                        accessibilityProfile?.motorImpaired
                          ? t(
                              "feed.motorAccessibilityActive",
                              "Motor accessibility is active for your profile."
                            )
                          : null}

                        {accessibilityProfile?.nonVerbal &&
                          t(
                            "feed.nonVerbalAccessibilityActive",
                            "Non-verbal accessibility is active for your profile."
                          )}

                        {accessibilityProfile?.neurodivergent &&
                          t(
                            "feed.neurodivergentAccessibilityActive",
                            "Neurodivergent accessibility is active for your profile."
                          )}

                        {!accessibilityProfile?.blindLowVision &&
                          !accessibilityProfile?.deaf &&
                          !accessibilityProfile?.wheelchair &&
                          !accessibilityProfile?.motorImpaired &&
                          !accessibilityProfile?.nonVerbal &&
                          !accessibilityProfile?.neurodivergent &&
                          t(
                            "feed.generalAccessibilityOptions",
                            "Accessibility options are available for this post."
                          )}
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      fontSize:
                        isLargeText
                          ? "1.35rem"
                          : undefined,
                      lineHeight:
                        isLargeText
                          ? 1.7
                          : 1.5,
                    }}
                  >
                    <p>
                      {
                        displayedText
                      }
                    </p>
                  </div>

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
                      ? `🌍 ${t(
                          "feed.translating",
                          "Translating..."
                        )}`
                      : translated
                      ? `🌍 ${t(
                          "feed.translated",
                          "Translated"
                        )}`
                      : `🌍 ${t(
                          "feed.translate",
                          "Translate"
                        )}`}
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
                      {t(
                        "feed.translatedTo",
                        "Translated to"
                      )}{" "}
                      {
                        userLanguage
                      }
                    </small>
                  )}

                  {!isTextOnly &&
                    post.imageUrl && (
                      <img
                        src={
                          post.imageUrl
                        }
                        alt={
                          post.imageAlt ||
                          t(
                            "feed.postImage",
                            "Post image"
                          )
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

                  {!isTextOnly &&
                    post.videoUrl && (
                      <div>
                        <video
                          controls
                          aria-label={t(
                            "feed.postVideo",
                            "Post video"
                          )}
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

                          {post.captionUrl && (
                            <track
                              kind="captions"
                              src={
                                post.captionUrl
                              }
                              srcLang={
                                userLanguage
                              }
                              label={t(
                                "feed.captions",
                                "Captions"
                              )}
                              default={
                                showCaptions
                              }
                            />
                          )}

                          {post.captionsUrl && (
                            <track
                              kind="captions"
                              src={
                                post.captionsUrl
                              }
                              srcLang={
                                userLanguage
                              }
                              label={t(
                                "feed.captions",
                                "Captions"
                              )}
                              default={
                                showCaptions
                              }
                            />
                          )}

                          {post.subtitleUrl && (
                            <track
                              kind="subtitles"
                              src={
                                post.subtitleUrl
                              }
                              srcLang={
                                userLanguage
                              }
                              label={t(
                                "feed.subtitles",
                                "Subtitles"
                              )}
                              default={
                                showCaptions
                              }
                            />
                          )}
                        </video>

                        {showCaptions &&
                          post.transcript && (
                            <div
                              role="region"
                              aria-label={t(
                                "feed.transcript",
                                "Video transcript"
                              )}
                              style={{
                                marginTop:
                                  "10px",
                                padding:
                                  "12px",
                                borderRadius:
                                  "12px",
                                background:
                                  isPostHighContrast
                                    ? "#ffffff"
                                    : "#0f172a",
                                color:
                                  isPostHighContrast
                                    ? "#000000"
                                    : "#ffffff",
                              }}
                            >
                              <strong>
                                {t(
                                  "feed.transcript",
                                  "Transcript"
                                )}
                              </strong>

                              <div
                                style={{
                                  marginTop:
                                    "6px",
                                }}
                              >
                                {
                                  post.transcript
                                }
                              </div>
                            </div>
                          )}

                        {showCaptions &&
                          post.transcriptText && (
                            <div
                              role="region"
                              aria-label={t(
                                "feed.transcript",
                                "Video transcript"
                              )}
                              style={{
                                marginTop:
                                  "10px",
                                padding:
                                  "12px",
                                borderRadius:
                                  "12px",
                                background:
                                  isPostHighContrast
                                    ? "#ffffff"
                                    : "#0f172a",
                                color:
                                  isPostHighContrast
                                    ? "#000000"
                                    : "#ffffff",
                              }}
                            >
                              <strong>
                                {t(
                                  "feed.transcript",
                                  "Transcript"
                                )}
                              </strong>

                              <div
                                style={{
                                  marginTop:
                                    "6px",
                                }}
                              >
                                {
                                  post.transcriptText
                                }
                              </div>
                            </div>
                          )}
                      </div>
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
                          aria-label={`${t(
                            "feed.reactWith",
                            "React with"
                          )} ${emoji}`}
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
                      💬{" "}
                      {t(
                        "feed.comment",
                        "Comment"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/crosspost/${post.id}`
                        )
                      }
                    >
                      🔀{" "}
                      {t(
                        "feed.crossPost",
                        "Cross-post"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        savePost(
                          post
                        )
                      }
                    >
                      📌{" "}
                      {t(
                        "feed.save",
                        "Save"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleShare(
                          post.id
                        )
                      }
                    >
                      🔗{" "}
                      {t(
                        "feed.share",
                        "Share"
                      )}
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
              disabled={
                loading
              }
              aria-label={t(
                "feed.loadMore",
                "Load more posts"
              )}
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
                ? t(
                    "feed.loading",
                    "Loading..."
                  )
                : t(
                    "feed.loadMore",
                    "Load More Posts"
                  )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;
