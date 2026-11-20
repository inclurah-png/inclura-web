import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import DashboardLayout from "../components/DashboardLayout";
import { auth, db } from "../firebase";

function CreatorAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadStats() {
    const uid = auth.currentUser?.uid;
    if (!uid) { setError("Please sign in to view creator analytics."); setLoading(false); return; }
    setLoading(true); setError("");
    try {
      const [userSnap, postsSnap] = await Promise.all([
        getDocs(query(collection(db, "users"), where("__name__", "==", uid))),
        getDocs(query(collection(db, "posts"), where("userId", "==", uid))),
      ]);
      const user = userSnap.docs[0]?.data() || {};
      const posts = postsSnap.docs.map((d) => d.data());
      const likes = posts.reduce((n,p) => n + Number(p.likesCount ?? (Array.isArray(p.likes) ? p.likes.length : 0)), 0);
      const comments = posts.reduce((n,p) => n + Number(p.commentsCount ?? 0), 0);
      const shares = posts.reduce((n,p) => n + Number(p.sharesCount ?? 0), 0);
      setStats({
        followers: user.followersCount ?? (Array.isArray(user.followers) ? user.followers.length : 0),
        profileViews: user.profileViews ?? 0,
        reelViews: user.reelViews ?? 0,
        likes, comments, shares,
        sponsoredPosts: user.sponsoredPostsCount ?? 0,
        engagement: user.engagementRate ?? 0,
      });
    } catch (e) {
      console.error("Creator analytics load failed:", e);
      setError("Creator analytics could not be loaded.");
    } finally { setLoading(false); }
  }

  useEffect(() => { loadStats(); }, []);
  const labels=[["followers","👥 Followers"],["profileViews","👁 Profile Views"],["reelViews","🎥 Reel Views"],["likes","❤️ Likes"],["comments","💬 Comments"],["shares","🔁 Shares"],["sponsoredPosts","📢 Sponsored Posts"],["engagement","📊 Engagement Rate"]];
  return (
    <DashboardLayout>
      <main style={page}>
        <h1>📈 Creator Analytics</h1>
        <p style={muted}>Your creator metrics calculated from your current Inclura profile and publications.</p>
        <button type="button" onClick={loadStats} disabled={loading} style={button}>{loading ? "Refreshing..." : "↻ Refresh analytics"}</button>
        {error && <div style={errorStyle}>{error}</div>}
        {loading && <div style={card}>Loading creator analytics...</div>}
        {!loading && stats && <section style={grid}>{labels.map(([key,label])=><article key={key} style={card}><div style={muted}>{label}</div><strong style={{fontSize:25,display:"block",marginTop:8}}>{key==="engagement" ? Number(stats[key]).toFixed(1) + "%" : Number(stats[key]).toLocaleString()}</strong></article>)}</section>}
      </main>
    </DashboardLayout>
  );
}
const page={color:"white",maxWidth:"1100px",margin:"0 auto"};
const muted={color:"#cbd5e1",lineHeight:1.6};
const grid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14};
const card={background:"#0f172a",border:"1px solid #334155",padding:20,borderRadius:16};
const button={border:"1px solid #d4af37",background:"#064e3b",color:"white",borderRadius:10,padding:"10px 14px",fontWeight:700,cursor:"pointer",margin:"10px 0 18px"};
const errorStyle={background:"#451a1a",border:"1px solid #991b1b",color:"#fecaca",borderRadius:12,padding:14,margin:"10px 0 16px"};
export default CreatorAnalytics;