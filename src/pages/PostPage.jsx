import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  doc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

import { db } from "../firebase";

import CommentBox from "../components/CommentBox";
import FollowButton from "../components/FollowButton";

import {
  translateText,
  saveTranslation,
} from "../translation/textTranslator";

function PostPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [post, setPost] = useState(null);

  const [loading, setLoading] = useState(true);

  const { t, i18n } = useTranslation();

  const [translatedText, setTranslatedText] =
    useState("");

  const [translatedLanguage, setTranslatedLanguage] =
    useState("");

  const [isTranslated, setIsTranslated] =
    useState(false);

  const [translating, setTranslating] =
    useState(false);

  const [reacting, setReacting] =
    useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        const ref = doc(db, "posts", id);

        const snap = await getDoc(ref);

        if (snap.exists()) {
          setPost({
            id: snap.id,
            ...snap.data(),
          });
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
   * We deliberately do not automatically call the
   * translation service here. The user still controls
   * translation with the Translate button.
   */
  useEffect(() => {
    const activeLanguage =
      String(i18n.language || "en")
        .trim()
        .toLowerCase();

    setIsTranslated(false);
    setTranslatedText("");
    setTranslatedLanguage("");

    if (
      !post ||
      !activeLanguage
    ) {
      return;
    }

    const existingTranslation =
      post.translatedText?.[
        activeLanguage
      ];

    if (
      typeof existingTranslation ===
        "string" &&
      existingTranslation.trim()
    ) {
      setTranslatedText(
        existingTranslation.trim()
      );

      setTranslatedLanguage(
        activeLanguage
      );
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
      String(
        i18n.language || "en"
      )
        .trim()
        .toLowerCase();

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
      post.translatedText?.[
        targetLanguage
      ];

    if (
      typeof existingTranslation ===
        "string" &&
      existingTranslation.trim()
    ) {
      setTranslatedText(
        existingTranslation.trim()
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
      if (
        post.originalLanguage &&
        String(
          post.originalLanguage
        )
          .trim()
          .toLowerCase() ===
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
          sourceId: post.id,
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
       * If this fails, the translation itself
       * still remains usable.
       */
      try {
        await saveTranslation({
          sourceId: post.id,
          sourceType: "post",
          originalLanguage:
            result.originalLanguage ||
            post.originalLanguage ||
            "",
          targetLanguage,
          translatedText:
            newTranslation,
          confidence:
            result.confidence || 0,
        });
      } catch (cacheSaveError) {
        console.error(
          "Inclura Translation Cache Save Error:",
          cacheSaveError
        );
      }

      /*
       * Persist the translation directly on
       * the post as well, matching Feed.jsx.
       */
      const updatedTranslatedText = {
        ...(post.translatedText || {}),
        [targetLanguage]:
          newTranslation,
      };

      try {
        await updateDoc(
          doc(db, "posts", post.id),
          {
            translatedText:
              updatedTranslatedText,
          }
        );
      } catch (postUpdateError) {
        console.error(
          "Inclura Post Translation Persistence Error:",
          postUpdateError
        );
      }

      /*
       * Update local PostPage state immediately.
       */
      setPost((previousPost) => ({
        ...previousPost,
        translatedText:
          updatedTranslatedText,
      }));

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
    if (!post?.verified) return null;

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
    if (!post?.premium) return null;

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

  async function react(emoji) {
    if (reacting) return;

    setReacting(true);

    try {
      const ref = doc(
        db,
        "posts",
        id
      );

      await updateDoc(ref, {
        [`reactions.${emoji}`]:
          increment(1),

        creatorScore:
          increment(
            scoreMap[emoji]
          ),
      });

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
        maxWidth: "720px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      {loading ? (
        <p>Loading...</p>
      ) : !post ? (
        <p>Post not found.</p>
      ) : (
        <>
          {/* HEADER */}

          <div
            style={{
              background: "#0f172a",
              borderRadius: "24px",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
              }}
            >
              <div>
                <h3
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    navigate(
                      `/user/${post.userId}`
                    )
                  }
                >
                  {post.userName}
                </h3>

                {post.role && (
                  <small>
                    {post.role}
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
                marginTop: "16px",
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
                    ? t("showOriginal")
                    : t("translatePost")
                }
              >
                {translating
                  ? t("translating")
                  : isTranslated
                  ? t("showOriginal")
                  : t("translatePost")}
              </button>

              {isTranslated && (
                <small
                  style={{
                    display:
                      "block",
                    marginTop:
                      "6px",
                    opacity: 0.7,
                  }}
                >
                  {t("translated")}{" "}
                  {translatedLanguage}
                </small>
              )}
            </div>

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt=""
                style={{
                  width: "100%",
                  borderRadius:
                    "16px",
                }}
              />
            )}

            {post.videoUrl && (
              <video
                controls
                style={{
                  width: "100%",
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
                display: "flex",
                gap: "10px",
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
                    onClick={() =>
                      react(
                        emoji
                      )
                    }
                    disabled={
                      reacting
                    }
                  >
                    {emoji}{" "}
                    {post
                      .reactions?.[
                      emoji
                    ] || 0}
                  </button>
                )
              )}
            </div>

            {/* ACTIONS */}

            <div
              style={{
                display: "flex",
                gap: "16px",
                marginTop:
                  "20px",
              }}
            >
              <button
                type="button"
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
              >
                📌 Save
              </button>
            </div>
          </div>

          {/* COMMENTS */}

          <CommentBox
            postId={post.id}
          />
        </>
      )}
    </div>
  );
}

export default PostPage;
