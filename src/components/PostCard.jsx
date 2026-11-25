import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function PostCard({
  postId,
  name,
  text,
  verified,
  badgeType,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getBadge = () => {
    if (!verified) return null;

    switch (badgeType) {
      case "creator": return "🎥";
      case "organization": return "🏢";
      case "ngo": return "🤝";
      case "hospital": return "🏥";
      case "university": return "🎓";
      case "government": return "🏛";
      default: return "✅";
    }
  };

  async function sharePost() {
    if (!postId || typeof window === "undefined") return;
    const url = `${window.location.origin}/share/${encodeURIComponent(postId)}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${name || "Inclura"} — Inclura post`,
          url,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        window.alert(t("shareLinkCopied", {
          defaultValue: "Post link copied.",
        }));
        return;
      }

      window.prompt(t("copyPostLink", {
        defaultValue: "Copy this post link:",
      }), url);
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error("Inclura post sharing failed:", error);
        window.alert(t("shareFailed", {
          defaultValue: "Unable to share this post right now.",
        }));
      }
    }
  }

  const openPost = () => {
    if (postId) navigate(`/post/${encodeURIComponent(postId)}`);
  };

  return (
    <article
      style={{
        background: "#0f172a",
        padding: "22px",
        borderRadius: "20px",
        marginBottom: "22px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        <h3 style={{ margin: 0 }}>{name}</h3>
        {verified && (
          <span
            aria-label={t("verified", { defaultValue: "Verified" })}
            style={{
              background: "#16a34a",
              color: "white",
              padding: "4px 10px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "700",
            }}
          >
            <span aria-hidden="true">{getBadge()}</span>{" "}
            {t("verified", { defaultValue: "Verified" })}
          </span>
        )}
      </div>

      <p
        style={{
          color: "#cbd5e1",
          lineHeight: "1.7",
          marginBottom: "18px",
        }}
      >
        {text}
      </p>

      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        <button
          type="button"
          style={btn}
          onClick={openPost}
          disabled={!postId}
          aria-label={t("reactToPost", { defaultValue: "Open post to react" })}
        >
          ❤️ {t("reactToPost", { defaultValue: "React" })}
        </button>

        <button
          type="button"
          style={btn}
          onClick={openPost}
          disabled={!postId}
          aria-label={t("comment", { defaultValue: "Comment" })}
        >
          💬 {t("comment", { defaultValue: "Comment" })}
        </button>

        <button
          type="button"
          style={btn}
          onClick={sharePost}
          disabled={!postId}
          aria-label={t("share", { defaultValue: "Share" })}
        >
          🔁 {t("share", { defaultValue: "Share" })}
        </button>
      </div>
    </article>
  );
}

const btn = {
  background: "#1e293b",
  border: "none",
  color: "white",
  padding: "10px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  minHeight: "44px",
};

export default PostCard;
