import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../components/DashboardLayout";
import { auth, db } from "../firebase";

export default function MyCreatorActivity() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadStats() {
    const uid = auth.currentUser?.uid;
    if (!uid) { setError(t("creatorActivityIntro")); setLoading(false); return; }
    setLoading(true);
    setError("");
    try {
      // Read only the signed-in member's own profile and publications.
      const [userSnap, postsSnap] = await Promise.all([
        getDoc(doc(db, "users", uid)),
        getDocs(query(collection(db, "posts"), where("userId", "==", uid))),
      ]);
      const user = userSnap.exists() ? userSnap.data() : {};
      const posts = postsSnap.docs.map((d) => d.data());
      const total = (field, fallback) => posts.reduce((n, p) => n + Number(p[field] ?? fallback(p) ?? 0), 0);
      setStats({
        posts: posts.length,
        followers: user.followersCount ?? (Array.isArray(user.followers) ? user.followers.length : 0),
        profileViews: Number(user.profileViews ?? 0),
        reelViews: Number(user.reelViews ?? 0),
        likes: total("likesCount", p => Array.isArray(p.likes) ? p.likes.length : 0),
        comments: total("commentsCount", () => 0),
        shares: total("sharesCount", () => 0),
      });
    } catch (e) {
      console.error("My creator activity load failed:", e);
      setError("Your activity could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadStats(); }, []);
  const labels = [
    ["posts", "📝 Posts"],
    ["followers", "👥 Followers"],
    ["profileViews", "👁 Profile Views"],
    ["reelViews", "🎥 Reel Views"],
    ["likes", "❤️ Likes"],
    ["comments", "💬 Comments"],
    ["shares", "🔁 Shares"],
  ];

  return (
    <DashboardLayout>
      <main style={page}>
        <h1>{t("creatorActivityTitle") || "My Creator Activity"}</h1>
        <p style={muted}>{t("creatorActivityIntro")}</p>
        <section style={notice}>
          <strong>{t("creatorBoundaryTitle")}</strong>
          <p style={{ margin: "6px 0 0" }}>{t("creatorBoundaryText")}</p>
          <p style={{ margin: "6px 0 0" }}>You can view only your own activity. Other creators' private analytics are not shown here.</p>
        </section>
        <button type="button" onClick={loadStats} disabled={loading} style={button}>{loading ? "Refreshing..." : "↻ Refresh activity"}</button>
        {error && <div role="alert" style={errorStyle}>{error}</div>}
        {loading && <div style={card}>Loading your activity...</div>}
        {!loading && stats && (
          <section style={grid} aria-label="Your creator activity">
            {labels.map(([key, label]) => (
              <article key={key} style={card}>
                <div style={muted}>{label}</div>
                <strong style={value}>{Number(stats[key]).toLocaleString()}</strong>
              </article>
            ))}
          </section>
        )}
      </main>
    </DashboardLayout>
  );
}

const page = { color: "white", maxWidth: "1100px", margin: "0 auto" };
const muted = { color: "#cbd5e1", lineHeight: 1.6 };
const notice = { background: "#0f172a", border: "1px solid #d4af37", borderRadius: 16, padding: 18, margin: "18px 0", lineHeight: 1.6 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 };
const card = { background: "#0f172a", border: "1px solid #334155", padding: 20, borderRadius: 16 };
const value = { fontSize: 25, display: "block", marginTop: 8 };
const button = { border: "1px solid #d4af37", background: "#064e3b", color: "white", borderRadius: 10, padding: "10px 14px", fontWeight: 700, cursor: "pointer", margin: "10px 0 18px" };
const errorStyle = { background: "#451a1a", border: "1px solid #991b1b", color: "#fecaca", borderRadius: 12, padding: 14, margin: "10px 0 16px" };
