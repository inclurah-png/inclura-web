import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function SharedPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadSharedPost() {
      try {
        const snapshot = await getDoc(doc(db, "publicSharedPosts", id));
        if (!active) return;
        if (!snapshot.exists() || snapshot.data().active !== true) {
          setUnavailable(true);
          return;
        }
        const safeData = snapshot.data();
        setPost({
          id: snapshot.id,
          userName: safeData.userName || "Inclura member",
          text: safeData.text || "",
          imageUrl: safeData.imageUrl || "",
          videoUrl: safeData.videoUrl || "",
          imageAlt: safeData.imageAlt || "",
        });
      } catch (error) {
        console.error("Public Inclura post could not be loaded:", error);
        if (active) setUnavailable(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    if (id) loadSharedPost();
    else {
      setUnavailable(true);
      setLoading(false);
    }
    return () => { active = false; };
  }, [id]);

  const pageStyle = {
    minHeight: "100vh", boxSizing: "border-box", padding: "24px 14px",
    background: "#020617", color: "#f8fafc", fontFamily: "Arial, sans-serif"
  };
  const cardStyle = {
    maxWidth: "720px", margin: "28px auto", padding: "22px",
    borderRadius: "20px", background: "#0f172a",
    border: "1px solid #1e40af", lineHeight: 1.6
  };
  const linkStyle = {
    display: "inline-block", margin: "8px 10px 0 0", padding: "11px 16px",
    borderRadius: "10px", background: "#065f46", border: "1px solid #d4af37",
    color: "#fff", textDecoration: "none", fontWeight: 700
  };

  return (
    <main style={pageStyle}>
      <header style={{ maxWidth: "720px", margin: "0 auto", color: "#d4af37", fontWeight: 800, letterSpacing: "0.04em" }}>
        INCLURA · INCLUSION COMES FIRST
      </header>
      <section style={cardStyle} aria-live="polite">
        {loading ? (
          <p>Loading shared Inclura post…</p>
        ) : unavailable ? (
          <>
            <h1>This post is not publicly available</h1>
            <p>The creator has not enabled public sharing for this post, or the link has been revoked.</p>
            <Link to="/" style={linkStyle}>Visit Inclura</Link>
            <Link to="/signup" style={linkStyle}>Join Inclura</Link>
          </>
        ) : (
          <>
            <p style={{ color: "#86efac", fontWeight: 700 }}>Shared from Inclura</p>
            <h1 style={{ fontSize: "1.35rem" }}>{post.userName || "Inclura member"}</h1>
            {post.text && <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{post.text}</p>}
            {post.imageUrl && (
              <img src={post.imageUrl} alt={post.imageAlt || "Image shared from Inclura"}
                loading="lazy" style={{ display: "block", width: "100%", maxHeight: "640px",
                  objectFit: "contain", borderRadius: "14px", marginTop: "16px" }} />
            )}
            {post.videoUrl && (
              <video controls playsInline style={{ display: "block", width: "100%",
                maxHeight: "640px", borderRadius: "14px", marginTop: "16px" }}>
                <source src={post.videoUrl} type="video/mp4" />
                Your browser does not support this video.
              </video>
            )}
            <p style={{ color: "#cbd5e1", marginTop: "20px" }}>Discover more conversations and creators on Inclura.</p>
            <Link to="/signup" style={linkStyle}>Join Inclura</Link>
            <Link to="/login" style={linkStyle}>Sign in</Link>
          </>
        )}
      </section>
      <footer style={{ maxWidth: "720px", margin: "0 auto", color: "#94a3b8", fontSize: "13px" }}>
        Inclura displays only the limited content the creator explicitly approved for public sharing.
      </footer>
    </main>
  );
}

export default SharedPostPage;
