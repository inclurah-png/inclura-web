import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

import { db, auth } from "../firebase";

import CommentBox from "../components/CommentBox";
import FollowButton from "../components/FollowButton";

function PostPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [post, setPost] = useState(null);

  const [loading, setLoading] = useState(true);

  const [reacting, setReacting] =
    useState(false);

useEffect(() => {
  async function loadPost() {
    const ref = doc(db, "posts", id);

    const snap = await getDoc(ref);

    if (snap.exists()) {
      setPost({
        id: snap.id,
        ...snap.data(),
      });
    }

    setLoading(false);
  }

  loadPost();
}, [id]);
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

  const ref = doc(db, "posts", id);

  await updateDoc(ref, {
    [`reactions.${emoji}`]: increment(1),
    creatorScore: increment(scoreMap[emoji]),
  });

  const snap = await getDoc(ref);

  setPost({
    id: snap.id,
    ...snap.data(),
  });

  setReacting(false);
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
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3
                style={{
                  cursor: "pointer",
                }}
                onClick={() =>
                  navigate(`/user/${post.userId}`)
                }
              >
                {post.userName}
              </h3>

              {post.role && (
                <small>{post.role}</small>
              )}
            </div>

            <FollowButton
              targetUserId={post.userId}
            />
          </div>

          <p
            style={{
              marginTop: "16px",
            }}
          >
            {post.text}
          </p>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt=""
              style={{
                width: "100%",
                borderRadius: "16px",
              }}
            />
          )}

          {post.videoUrl && (
            <video
              controls
              style={{
                width: "100%",
                borderRadius: "16px",
              }}
            >
              <source
                src={post.videoUrl}
                type="video/mp4"
              />
            </video>
          )}

          {/* REACTIONS */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "18px",
            }}
          >
            {reactions.map((emoji) => (
              <button
                key={emoji}
                onClick={() =>
                  react(emoji)
                }
              >
                {emoji}{" "}
                {post.reactions?.[
                  emoji
                ] || 0}
              </button>
            ))}
          </div>

          {/* ACTIONS */}

          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            <button>
              💬 Comment
            </button>

            <button
              onClick={() =>
                navigate(
                  `/crosspost/${post.id}`
                )
              }
            >
              🔀 Cross-post
            </button>

            <button>
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
