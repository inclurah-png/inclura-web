import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { db } from "../firebase";

function ReelsSystem() {
  const navigate = useNavigate();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReels() {
    setLoading(true);
    setError("");
    try {
      const snapshot = await getDocs(query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(50)));
      setReels(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
        .filter((post) => typeof post.videoUrl === "string" && post.videoUrl.trim()));
    } catch (loadError) {
      console.error("Inclura Reels Load Error:", loadError);
      setError("Unable to load video posts right now. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadReels(); }, []);

  const stats = useMemo(() => {
    let likes = 0, comments = 0;
    reels.forEach((reel) => {
      likes += Object.values(reel.reactions || {}).reduce((sum, value) => sum + (Number(value) || 0), 0);
      comments += Number(reel.commentCount || 0);
    });
    return { videos: reels.length, likes, comments };
  }, [reels]);

  return (
    <DashboardLayout>
      <main style={page} aria-labelledby="reels-title">
        <div style={header}>
          <div>
            <h1 id="reels-title">🎥 Inclura Reels</h1>
            <p style={muted}>Published Inclura video posts are shown here as the Reels feed.</p>
          </div>
          <div style={actions}>
            <button type="button" style={button} onClick={() => navigate("/profile")}>🎬 Create Reel</button>
            <button type="button" style={secondaryButton} onClick={loadReels} disabled={loading}>{loading ? "Refreshing..." : "↻ Refresh"}</button>
          </div>
        </div>

        <section style={statsGrid} aria-label="Reels statistics">
          <Stat label="Video posts" value={stats.videos} />
          <Stat label="Reactions" value={stats.likes} />
          <Stat label="Comments" value={stats.comments} />
        </section>

        {error && <div role="alert" style={errorBox}>{error}</div>}
        {loading && !reels.length && <div style={card} role="status">Loading Inclura video posts...</div>}

        {!loading && !error && reels.length === 0 && (
          <div style={card}>
            <h2>No Reels yet</h2>
            <p style={muted}>There are no published video posts yet. Use Create Reel to publish through the existing post system.</p>
            <button type="button" style={button} onClick={() => navigate("/profile")}>🎬 Create the first Reel</button>
          </div>
        )}

        <div style={grid}>
          {reels.map((reel) => {
            const author = reel.userName || "Inclura user";
            const reactions = Object.values(reel.reactions || {}).reduce((sum, value) => sum + (Number(value) || 0), 0);
            return (
              <article key={reel.id} style={card}>
                <div style={authorRow}>
                  <div><strong>{author}</strong>{reel.role && <div style={role}>{reel.role}</div>}</div>
                  {reel.verified && <span>✓ Verified</span>}
                </div>
                <video controls preload="metadata" aria-label={`Video post by ${author}`} style={video}>
                  <source src={reel.videoUrl} type="video/mp4" />
                </video>
                {reel.text && <p style={text}>{reel.text}</p>}
                {Array.isArray(reel.accessibilityTags) && reel.accessibilityTags.length > 0 && (
                  <div style={tags} aria-label="Accessibility features">
                    {reel.accessibilityTags.map((tag) => <span key={tag} style={tagStyle}>♿ {tag}</span>)}
                  </div>
                )}
                <div style={meta}>
                  <span>❤️ {reactions}</span>
                  <span>💬 {Number(reel.commentCount || 0)}</span>
                  <button type="button" style={linkButton} onClick={() => navigate(`/post/${reel.id}`)}>Open publication</button>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </DashboardLayout>
  );
}

function Stat({ label, value }) {
  return <div style={statCard}><strong style={{ fontSize: "24px" }}>{value}</strong><span style={muted}>{label}</span></div>;
}

const page = { color: "white", maxWidth: "1100px" };
const muted = { color: "#cbd5e1", lineHeight: 1.6 };
const header = { display: "flex", justifyContent: "space-between", gap: "18px", flexWrap: "wrap", alignItems: "center" };
const actions = { display: "flex", gap: "10px", flexWrap: "wrap" };
const button = { background: "#0f766e", color: "white", border: "1px solid #14b8a6", borderRadius: "12px", padding: "11px 16px", fontWeight: "700", cursor: "pointer" };
const secondaryButton = { background: "#1e293b", color: "white", border: "1px solid #475569", borderRadius: "12px", padding: "11px 16px", cursor: "pointer" };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "12px", margin: "20px 0" };
const statCard = { background: "#0f172a", border: "1px solid #334155", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "6px" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "18px" };
const card = { background: "#0f172a", border: "1px solid #334155", borderRadius: "18px", padding: "18px" };
const authorRow = { display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start", marginBottom: "12px" };
const role = { color: "#94a3b8", fontSize: "12px", marginTop: "4px" };
const video = { width: "100%", maxHeight: "520px", background: "#020617", borderRadius: "14px" };
const text = { color: "#e2e8f0", lineHeight: 1.6 };
const tags = { display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "10px" };
const tagStyle = { background: "#172554", border: "1px solid #1d4ed8", color: "#dbeafe", borderRadius: "999px", padding: "5px 9px", fontSize: "12px" };
const meta = { display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap", marginTop: "14px", color: "#cbd5e1" };
const linkButton = { background: "transparent", border: "none", color: "#7dd3fc", padding: 0, cursor: "pointer", fontWeight: "700" };
const errorBox = { background: "#451a1a", border: "1px solid #991b1b", color: "#fecaca", borderRadius: "14px", padding: "14px", marginBottom: "18px" };

export default ReelsSystem;
