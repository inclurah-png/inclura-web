import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  doc,
  getDoc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { auth, db } from "../firebase";
import { useAccessibility } from "../context/AccessibilityProvider";

import CommentBox from "../components/CommentBox";
import FollowButton from "../components/FollowButton";

import {
  translateText,
  saveTranslation,
} from "../translation/textTranslator";

function normalizePostLanguage(code = "") {
  const normalized = String(code)
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");

  if (
    normalized === "zh-tw" ||
    normalized === "zh-hant"
  ) {
    return "zh-TW";
  }

  return normalized || "en";
}

function getPostTranslation(
  post,
  language
) {
  if (!post?.translatedText) {
    return "";
  }

  const normalizedLanguage =
    normalizePostLanguage(
      language
    );

  const directTranslation =
    post.translatedText?.[
      normalizedLanguage
    ];

  if (
    typeof directTranslation ===
      "string" &&
    directTranslation.trim()
  ) {
    return directTranslation.trim();
  }

  if (
    normalizedLanguage ===
    "zh-TW"
  ) {
    const legacyTranslation =
      post.translatedText?.[
        "zh-tw"
      ];

    if (
      typeof legacyTranslation ===
        "string" &&
      legacyTranslation.trim()
    ) {
      return legacyTranslation.trim();
    }
  }

  return "";
}

function PostPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [post, setPost] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const { t, i18n } =
    useTranslation();
  const { reducedMotion } = useAccessibility();

  const [
    translatedText,
    setTranslatedText,
  ] = useState("");

  const [
    translatedLanguage,
    setTranslatedLanguage,
  ] = useState("");

  const [
    isTranslated,
    setIsTranslated,
  ] = useState(false);

  const [
    translating,
    setTranslating,
  ] = useState(false);

  const [
    reacting,
    setReacting,
  ] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        const ref = doc(
          db,
          "posts",
          id
        );

        const snap =
          await getDoc(ref);

        if (snap.exists()) {
          const loadedPost = {
            id: snap.id,
            ...snap.data(),
          };
          setPost(loadedPost);

          const currentUser = auth.currentUser;
          if (currentUser) {
            try {
              const userSnapshot = await getDoc(
                doc(db, "users", currentUser.uid)
              );
              const savedPosts = userSnapshot.exists()
                ? userSnapshot.data().savedPosts || []
                : [];
              setIsSaved(savedPosts.includes(loadedPost.id));
            } catch (saveStateError) {
              console.warn(
                "Unable to load saved-post state:",
                saveStateError
              );
            }
          }
        }
      } catch (error) {
        console.error(
          "Inclura Post Load Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

  /*
   * Keep the displayed translation synchronized
   * with the currently selected interface language.
   *
   * Changing language does not call the translation
   * service. It only uses a translation that already
   * exists on the loaded post.
   */
  useEffect(() => {
    const activeLanguage =
      normalizePostLanguage(
        i18n.language
      );

    setIsTranslated(false);
    setTranslatedText("");
    setTranslatedLanguage("");

    if (!post) {
      return;
    }

    const existingTranslation =
      getPostTranslation(
        post,
        activeLanguage
      );

    if (
      existingTranslation
    ) {
      setTranslatedText(
        existingTranslation
      );

      setTranslatedLanguage(
        activeLanguage
      );

      /*
       * This is important:
       * if a translation for the newly
       * selected language already exists,
       * display it immediately without
       * requiring a page refresh.
       */
      setIsTranslated(true);
    }
  }, [
    i18n.language,
    post,
  ]);

  async function translatePost() {
    if (
      !post?.text ||
      translating
    ) {
      return;
    }

    const targetLanguage =
      normalizePostLanguage(
        i18n.language
      );

    if (!targetLanguage) {
      return;
    }

    /*
     * If this exact language is already being
     * displayed, return to the original post.
     */
    if (
      isTranslated &&
      translatedLanguage ===
        targetLanguage
    ) {
      setIsTranslated(false);

      return;
    }

    /*
     * If the post already contains a translation
     * for the currently selected language, use it
     * immediately without another AI request.
     */
    const existingTranslation =
      getPostTranslation(
        post,
        targetLanguage
      );

    if (
      existingTranslation
    ) {
      setTranslatedText(
        existingTranslation
      );

      setTranslatedLanguage(
        targetLanguage
      );

      setIsTranslated(true);

      return;
    }

    setTranslating(true);

    try {
      /*
       * If the post already declares its original
       * language and it matches the current language,
       * no AI translation is required.
       */
      const originalLanguage =
        normalizePostLanguage(
          post.originalLanguage
        );

      if (
        post.originalLanguage &&
        originalLanguage ===
          targetLanguage
      ) {
        setTranslatedText(
          post.text
        );

        setTranslatedLanguage(
          targetLanguage
        );

        setIsTranslated(true);

        return;
      }

      /*
       * Use the real Inclura translation engine.
       *
       * This calls:
       * src/translation/textTranslator.js
       *
       * which then calls the secure:
       * /translate
       *
       * Cloudflare Pages Function.
       */
      const result =
        await translateText({
          sourceId:
            post.id,
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
          "Translation returned no translated text."
        );
      }

      const newTranslation =
        result.translatedText.trim();

      if (!newTranslation) {
        throw new Error(
          "Translation service returned empty text."
        );
      }

      /*
       * Save the translation to the central
       * Firestore translation cache.
       *
       * A cache failure must not prevent the
       * successful translation from appearing
       * on the page.
       */
      try {
        await saveTranslation({
          sourceId:
            post.id,
          sourceType:
            "post",
          originalLanguage:
            result.originalLanguage ||
            post.originalLanguage ||
            "",
          targetLanguage,
          translatedText:
            newTranslation,
          confidence:
            typeof result.confidence ===
            "number"
              ? result.confidence
              : 0,
        });
      } catch (
        cacheSaveError
      ) {
        console.error(
          "Inclura Translation Cache Save Error:",
          cacheSaveError
        );
      }

      /*
       * Preserve every existing translation and
       * add/update only the currently selected
       * language.
       */
      const updatedTranslatedText =
        {
          ...(post.translatedText ||
            {}),
          [targetLanguage]:
            newTranslation,
        };

      /*
       * Persist the translation directly on
       * the Firestore post.
       *
       * Unlike the previous version, a Firestore
       * persistence failure is not silently ignored.
       * We should not present the operation as fully
       * successful when the post could not be saved.
       */
      await updateDoc(
        doc(
          db,
          "posts",
          post.id
        ),
        {
          translatedText:
            updatedTranslatedText,
        }
      );

      /*
       * Update local PostPage state immediately.
       */
      setPost(
        (previousPost) => ({
          ...previousPost,
          translatedText:
            updatedTranslatedText,
        })
      );

      setTranslatedText(
        newTranslation
      );

      setTranslatedLanguage(
        targetLanguage
      );

      setIsTranslated(true);
    } catch (error) {
      console.error(
        "Inclura Post Translation Error:",
        error
      );

      setTranslatedText("");
      setTranslatedLanguage("");
      setIsTranslated(false);

      alert(
        error?.message ||
          "Translation failed. Please try again."
      );
    } finally {
      setTranslating(false);
    }
  }

  const reactions = [
    "👍",
    "❤️",
    "😂",
    "😊",
    "😮",
    "😢",
    "👏",
    "👎",
  ];

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

  function getBadge(post) {
    if (!post?.verified) {
      return null;
    }

    switch (post.badgeType) {
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
    if (!post?.premium) {
      return null;
    }

    switch (post.premiumTier) {
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

  function focusCommentInput() {
    if (typeof document === "undefined" || !post?.id) return;
    const input = document.getElementById(`comment-${post.id}`);
    if (!input) return;
    input.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    });
    input.focus();
  }

  async function toggleSavedPost() {
    const currentUser = auth.currentUser;
    if (!currentUser || !post?.id || saving) return;

    setSaving(true);
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnapshot = await getDoc(userRef);
      const savedPosts = userSnapshot.exists()
        ? userSnapshot.data().savedPosts || []
        : [];
      const alreadySaved = savedPosts.includes(post.id);

      await updateDoc(userRef, {
        savedPosts: alreadySaved
          ? arrayRemove(post.id)
          : arrayUnion(post.id),
      });

      setIsSaved(!alreadySaved);
    } catch (error) {
      console.error("Inclura Save Post Error:", error);
      alert(t("error", { defaultValue: "Unable to update saved posts." }));
    } finally {
      setSaving(false);
    }
  }

  async function react(emoji) {
    if (reacting) {
      return;
    }

    setReacting(true);

    try {
      const ref = doc(
        db,
        "posts",
        id
      );

      await updateDoc(
        ref,
        {
          [`reactions.${emoji}`]:
            increment(1),

          creatorScore:
            increment(
              scoreMap[emoji]
            ),
        }
      );

      const snap =
        await getDoc(ref);

      if (snap.exists()) {
        setPost({
          id: snap.id,
          ...snap.data(),
        });
      }
    } catch (error) {
      console.error(
        "Inclura Reaction Error:",
        error
      );
    } finally {
      setReacting(false);
    }
  }

  return (
    <div
      style={{
        maxWidth:
          "720px",
        margin:
          "0 auto",
        padding:
          "24px",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "10px 0 14px",
          marginBottom: "14px",
          background: "#020617",
          borderBottom: "1px solid #334155",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/profile")}
          aria-label="Return to Inclura dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            border: "2px solid #d4af37",
            borderRadius: "12px",
            padding: "12px 18px",
            background: "#064e3b",
            color: "#ffffff",
            fontWeight: "800",
            fontSize: "15px",
            cursor: "pointer",
            minHeight: "46px",
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
      {loading ? (
        <p>
          Loading...
        </p>
      ) : !post ? (
        <p>
          Post not found.
        </p>
      ) : (
        <>
          {/* HEADER */}

          <div
            style={{
              background:
                "#0f172a",
              borderRadius:
                "24px",
              padding:
                "24px",
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
              }}
            >
              <div>
                <h3
                  style={{
                    cursor:
                      "pointer",
                  }}
                  onClick={() =>
                    navigate(
                      `/user/${post.userId}`
                    )
                  }
                >
                  {
                    post.userName
                  }
                </h3>

                {post.role && (
                  <small>
                    {
                      post.role
                    }
                  </small>
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
                marginTop:
                  "16px",
              }}
            >
              <p>
                {isTranslated &&
                translatedText
                  ? translatedText
                  : post.text}
              </p>

              <button
                type="button"
                onClick={
                  translatePost
                }
                disabled={
                  translating
                }
                aria-label={
                  isTranslated
                    ? t(
                        "showOriginal"
                      )
                    : t(
                        "translatePost"
                      )
                }
              >
                {translating
                  ? t(
                      "translating"
                    )
                  : isTranslated
                  ? t(
                      "showOriginal"
                    )
                  : t(
                      "translatePost"
                    )}
              </button>

              {isTranslated && (
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
                  {
                    t(
                      "translated"
                    )
                  }{" "}
                  {
                    translatedLanguage
                  }
                </small>
              )}
            </div>

            {post.imageUrl && (
              <img
                src={
                  post.imageUrl
                }
                alt=""
                style={{
                  width:
                    "100%",
                  borderRadius:
                    "16px",
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

            {/* REACTIONS */}

            <div
              style={{
                display:
                  "flex",
                gap:
                  "10px",
                flexWrap:
                  "wrap",
                marginTop:
                  "18px",
              }}
            >
              {reactions.map(
                (emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => react(emoji)}
                    disabled={reacting}
                    aria-label={`React with ${emoji}`}
                    title={`React with ${emoji}`}
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

            {/* ACTIONS */}

            <div
              style={{
                display:
                  "flex",
                gap:
                  "16px",
                marginTop:
                  "20px",
              }}
            >
              <button
                type="button"
                onClick={focusCommentInput}
                aria-label={t("comment", { defaultValue: "Comment" })}
              >
                💬 {t("comment", { defaultValue: "Comment" })}
              </button>

              <button
                type="button"
                onClick={() => navigate(`/crosspost/${post.id}`)}
                aria-label={t("crossPost", { defaultValue: "Cross-post" })}
              >
                🔀 {t("crossPost", { defaultValue: "Cross-post" })}
              </button>

              <button
                type="button"
                onClick={toggleSavedPost}
                disabled={saving}
                aria-label={isSaved ? t("savedPosts", { defaultValue: "Saved posts" }) : t("save", { defaultValue: "Save" })}
                aria-pressed={isSaved}
              >
                📌 {saving ? t("loading") : isSaved ? t("savedPosts", { defaultValue: "Saved" }) : t("save", { defaultValue: "Save" })}
              </button>
            </div>
          </div>

          {/* COMMENTS */}

          <div id="post-comments">
            <CommentBox postId={post.id} />
          </div>
        </>
      )}
    </div>
  );
}

export default PostPage;
