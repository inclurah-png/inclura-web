import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

function CommentBox({ postId }) {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!postId) {
      setComments([]);
      return undefined;
    }

    const commentsRef = collection(
      db,
      "posts",
      postId,
      "comments"
    );

    const commentsQuery = query(
      commentsRef,
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      commentsQuery,
      (snapshot) => {
        setComments(
          snapshot.docs.map((commentDoc) => ({
            id: commentDoc.id,
            ...commentDoc.data(),
          }))
        );
      },
      (listenerError) => {
        console.error(
          "Inclura Comment Load Error:",
          listenerError
        );

        setError(
          t("comments.loadError", {
            defaultValue: "Unable to load comments.",
          })
        );
      }
    );

    return unsubscribe;
  }, [postId, t]);

  async function handleComment(event) {
    event.preventDefault();

    const user = auth.currentUser;
    const text = commentText.trim();

    if (!user) {
      setError(
        t("comments.signInRequired", {
          defaultValue: "Please sign in to comment.",
        })
      );
      return;
    }

    if (!postId || !text) {
      return;
    }

    if (text.length > 2000) {
      setError(
        t("comments.tooLong", {
          defaultValue: "Comments cannot exceed 2,000 characters.",
        })
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * Create the comment as its own Firestore write.
       * Do not use a transaction here: a transaction requires read
       * access to the parent post, which can make an otherwise valid
       * comment fail when security rules allow comment creation but
       * restrict post reads/updates.
       */
      await addDoc(
        collection(db, "posts", postId, "comments"),
        {
          text,
          userId: user.uid,
          userName:
            user.displayName ||
            user.email ||
            t("comments.defaultUser", {
              defaultValue: "Inclura user",
            }),
          createdAt: serverTimestamp(),
        }
      );

      /*
       * Keep the post counter updated separately. If a rule or
       * temporary Firestore problem prevents the counter update,
       * the comment itself has already been saved successfully.
       */
      try {
        await updateDoc(doc(db, "posts", postId), {
          commentCount: increment(1),
        });
      } catch (countError) {
        console.warn(
          "Inclura Comment Count Update Warning:",
          countError
        );
      }

      setCommentText("");
    } catch (submitError) {
      console.error(
        "Inclura Comment Submit Error:",
        submitError
      );

      let message = t("comments.submitError", {
        defaultValue:
          "Unable to submit your comment. Please try again.",
      });

      if (
        submitError?.code === "permission-denied" ||
        submitError?.code === "PERMISSION_DENIED"
      ) {
        message = t("comments.permissionError", {
          defaultValue:
            "You do not have permission to post a comment. Please sign in again and try.",
        });
      } else if (submitError?.code === "unavailable") {
        message = t("comments.unavailableError", {
          defaultValue:
            "Comments are temporarily unavailable. Please try again.",
        });
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-label={t("comments.heading", {
      defaultValue: "Comments",
    })}>
      <h3>
        {t("comments.heading", {
          defaultValue: "Comments",
        })} ({comments.length})
      </h3>

      <form onSubmit={handleComment}>
        <label htmlFor={`comment-${postId}`}>
          {t("comments.inputLabel", {
            defaultValue: "Write a comment",
          })}
        </label>

        <textarea
          id={`comment-${postId}`}
          value={commentText}
          onChange={(event) => {
            setCommentText(event.target.value);
            if (error) setError("");
          }}
          placeholder={t("comments.placeholder", {
            defaultValue: "Write your comment...",
          })}
          maxLength={2000}
          rows={3}
          disabled={loading}
          required
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "12px",
            borderRadius: "10px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "white",
            resize: "vertical",
          }}
        />

        <button
          type="submit"
          disabled={loading || !commentText.trim()}
        >
          {loading
            ? t("comments.submitting", {
                defaultValue: "Submitting...",
              })
            : t("comments.submit", {
                defaultValue: "Comment",
              })}
        </button>
      </form>

      {error && (
        <p role="alert" style={{ color: "#f87171" }}>
          {error}
        </p>
      )}

      <div>
        {comments.map((comment) => (
          <article
            key={comment.id}
            style={{
              padding: "12px 0",
              borderBottom: "1px solid #334155",
            }}
          >
            <strong>
              {comment.userName ||
                t("comments.defaultUser", {
                  defaultValue: "Inclura user",
                })}
            </strong>

            <p style={{ whiteSpace: "pre-wrap" }}>
              {comment.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CommentBox;
