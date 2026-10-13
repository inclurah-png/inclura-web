import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
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
      const postRef = doc(db, "posts", postId);
      const commentRef = doc(
        collection(db, "posts", postId, "comments")
      );

      await runTransaction(db, async (transaction) => {
        const postSnapshot = await transaction.get(postRef);

        if (!postSnapshot.exists()) {
          throw new Error("POST_NOT_FOUND");
        }

        transaction.set(commentRef, {
          text,
          userId: user.uid,
          userName:
            user.displayName ||
            user.email ||
            t("comments.defaultUser", {
              defaultValue: "Inclura user",
            }),
          createdAt: serverTimestamp(),
        });

        const currentCount =
          postSnapshot.data().commentCount || 0;

        transaction.update(postRef, {
          commentCount: currentCount + 1,
        });
      });

      setCommentText("");
    } catch (submitError) {
      console.error(
        "Inclura Comment Submit Error:",
        submitError
      );

      setError(
        t("comments.submitError", {
          defaultValue:
            "Unable to submit your comment. Please try again.",
        })
      );
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
