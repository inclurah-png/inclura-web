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
    document.title = "Discover Inclura — A social world where everyone belongs";
    const description = "Connect across abilities, communicate across languages and build meaningful relationships on Inclura.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, []);

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
    minHeight: "100vh", boxSizing: "border-box", padding: "20px 14px 36px",
    background: "radial-gradient(circle at top, #123b35 0, #071b1a 38%, #020617 78%)",
    color: "#f8fafc", fontFamily: "Arial, sans-serif"
  };
  const shellStyle = { maxWidth: "920px", margin: "0 auto" };
  const cardStyle = {
    padding: "clamp(18px, 4vw, 30px)", borderRadius: "20px",
    background: "rgba(15, 23, 42, 0.96)", border: "1px solid rgba(212,175,55,.55)",
    lineHeight: 1.65, boxShadow: "0 18px 55px rgba(0,0,0,.25)"
  };
  const primaryLink = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    margin: "8px 10px 0 0", padding: "13px 19px", minHeight: "46px",
    boxSizing: "border-box", borderRadius: "12px", background: "#08745a",
    border: "1px solid #d4af37", color: "#fff", textDecoration: "none",
    fontWeight: 800
  };
  const secondaryLink = {
    ...primaryLink, background: "transparent", border: "1px solid #64748b"
  };
  const benefitStyle = {
    padding: "15px", borderRadius: "14px", background: "#102a2b",
    border: "1px solid #28504a"
  };

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <header style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "22px" }}>
          <Link to="/" aria-label="Inclura home" style={{ color: "#f5d76e", textDecoration: "none", fontWeight: 900, fontSize: "1.25rem", letterSpacing: ".08em" }}>
            INCLURA
          </Link>
          <span style={{ color: "#cbd5e1", fontSize: ".9rem" }}>INCLUSION COMES FIRST</span>
        </header>

        <section style={cardStyle} aria-live="polite">
          {loading ? (
            <p role="status">Loading shared Inclura post…</p>
          ) : unavailable ? (
            <>
              <p style={{ color: "#f5d76e", fontWeight: 800 }}>A COMMUNITY WHERE EVERYONE BELONGS</p>
              <h1>This shared post is not publicly available</h1>
              <p>The creator may have disabled public sharing or revoked this link. You can still discover Inclura and create your own account.</p>
              <Link to="/signup" style={primaryLink}>Join Inclura — Create a free account</Link>
              <Link to="/" style={secondaryLink}>Explore Inclura</Link>
            </>
          ) : (
            <>
              <div style={{ maxWidth: "760px", margin: "0 auto 24px", textAlign: "center" }}>
                <p style={{ color: "#86efac", fontWeight: 800, letterSpacing: ".06em", marginBottom: "8px" }}>YOU ARE VIEWING A POST SHARED FROM INCLURA</p>
                <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.25rem)", lineHeight: 1.12, margin: "8px 0 12px" }}>
                  A social world where <span style={{ color: "#f5d76e" }}>everyone belongs.</span>
                </h1>
                <p style={{ color: "#dbeafe", fontSize: "1.08rem", margin: "0 auto 12px", maxWidth: "680px" }}>
                  Connect across abilities. Communicate across languages. Share your ideas, discover people and build meaningful relationships.
                </p>
                <div>
                  <Link to="/signup" style={primaryLink}>Join Inclura — Create your free account</Link>
                  <Link to="/login" style={secondaryLink}>Already a member? Sign in</Link>
                </div>
                <p style={{ color: "#94a3b8", fontSize: ".82rem", marginTop: "10px" }}>People with and without disabilities are welcome. Your voice and participation matter.</p>
              </div>

              <article style={{ maxWidth: "760px", margin: "0 auto", padding: "18px", borderRadius: "16px", background: "#071522", border: "1px solid #334155" }}>
                <p style={{ color: "#86efac", fontWeight: 700, marginTop: 0 }}>Shared from Inclura</p>
                <h2 style={{ fontSize: "1.2rem", margin: "4px 0 10px" }}>{post.userName}</h2>
                {post.text && <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{post.text}</p>}
                {post.imageUrl && (
                  <img src={post.imageUrl} alt={post.imageAlt || "Image shared from Inclura"}
                    loading="lazy" style={{ display: "block", width: "100%", maxHeight: "680px",
                      objectFit: "contain", borderRadius: "14px", marginTop: "16px", background: "#020617" }} />
                )}
                {post.videoUrl && (
                  <video controls playsInline preload="metadata" style={{ display: "block", width: "100%",
                    maxHeight: "680px", borderRadius: "14px", marginTop: "16px", background: "#020617" }}>
                    <source src={post.videoUrl} type="video/mp4" />
                    Your browser does not support this video.
                  </video>
                )}
              </article>

              <section style={{ marginTop: "28px" }} aria-labelledby="why-inclura">
                <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 18px" }}>
                  <h2 id="why-inclura" style={{ color: "#f5d76e", fontSize: "1.7rem", marginBottom: "8px" }}>More than sharing. A place to belong.</h2>
                  <p style={{ color: "#cbd5e1", marginTop: 0 }}>Inclura is being built to make social participation more accessible, welcoming and meaningful for everyone.</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "12px" }}>
                  <div style={benefitStyle}>
                    <h3 style={{ color: "#86efac", margin: "0 0 6px" }}>Inclusion for everyone</h3>
                    <p style={{ margin: 0, color: "#dbeafe" }}>People with and without disabilities can connect, create and participate together.</p>
                  </div>
                  <div style={benefitStyle}>
                    <h3 style={{ color: "#86efac", margin: "0 0 6px" }}>Accessibility by design</h3>
                    <p style={{ margin: 0, color: "#dbeafe" }}>Accessibility options help reduce barriers and make participation easier for more people.</p>
                  </div>
                  <div style={benefitStyle}>
                    <h3 style={{ color: "#86efac", margin: "0 0 6px" }}>Connection across languages</h3>
                    <p style={{ margin: 0, color: "#dbeafe" }}>Explore a platform designed with support for ten languages and diverse communities.</p>
                  </div>
                  <div style={benefitStyle}>
                    <h3 style={{ color: "#86efac", margin: "0 0 6px" }}>Create and grow together</h3>
                    <p style={{ margin: 0, color: "#dbeafe" }}>Share your work, discover creators, find communities and build useful connections.</p>
                  </div>
                </div>
              </section>

              <section style={{ textAlign: "center", marginTop: "28px", padding: "22px 12px 4px", borderTop: "1px solid #334155" }}>
                <h2 style={{ fontSize: "1.65rem", margin: "0 0 8px" }}>Your place is here, too.</h2>
                <p style={{ color: "#cbd5e1", maxWidth: "620px", margin: "0 auto 10px" }}>Whether you are a creator, student, professional, business owner, family member or simply someone who values connection, come and be part of the community.</p>
                <Link to="/signup" style={primaryLink}>Join Inclura — Create your free account</Link>
                <Link to="/login" style={secondaryLink}>Sign in</Link>
              </section>
            </>
          )}
        </section>

        <footer style={{ textAlign: "center", color: "#94a3b8", fontSize: ".82rem", lineHeight: 1.6, marginTop: "16px" }}>
          Inclura displays only the limited content the creator approved for public sharing. Your privacy and choice matter.
        </footer>
      </div>
    </main>
  );
}

export default SharedPostPage;
