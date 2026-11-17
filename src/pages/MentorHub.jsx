import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { db } from "../firebase";

function MentorHub() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMentors() {
    setLoading(true);
    setError("");
    try {
      const snapshot = await getDocs(query(collection(db, "mentorDirectory"), limit(50)));
      setMentors(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch (loadError) {
      console.error("Inclura Mentor Hub Load Error:", loadError);
      setError("Unable to load mentor profiles right now. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadMentors(); }, []);

  const activeMentors = useMemo(() => mentors.filter((mentor) => mentor.verified === true), [mentors]);

  return (
    <DashboardLayout>
      <main style={page} aria-labelledby="mentor-title">
        <div style={header}>
          <div>
            <h1 id="mentor-title">🎓 Mentor Hub</h1>
            <p style={muted}>Find mentors who have chosen the Mentor account type. Only approved public profile fields are shown here.</p>
          </div>
          <div style={actions}>
            <button type="button" style={button} onClick={() => navigate("/edit-profile")}>🙋 Mentor Profile</button>
            <button type="button" style={secondaryButton} onClick={loadMentors} disabled={loading}>{loading ? "Refreshing..." : "↻ Refresh"}</button>
          </div>
        </div>

        {error && <div role="alert" style={errorBox}>{error}</div>}

        <section style={statsGrid}>
          <Stat label="Mentor accounts" value={mentors.length} />
          <Stat label="Verified mentors" value={activeMentors.length} />
        </section>

        {loading && !mentors.length && <div style={card} role="status">Loading mentor profiles...</div>}

        {!loading && !error && mentors.length === 0 && (
          <div style={card}>
            <h2>No mentor profiles found</h2>
            <p style={muted}>There are currently no accounts marked as Mentor.</p>
          </div>
        )}

        <div style={grid}>
          {mentors.map((mentor) => {
            const name = mentor.fullName || mentor.displayName || mentor.name ||
              [mentor.firstName, mentor.lastName].filter(Boolean).join(" ") || "Inclura Mentor";
            const expertise = mentor.mentorExpertise || mentor.expertise || mentor.profession ||
              mentor.occupation || "Mentorship and community support";

            return (
              <article key={mentor.id} style={card}>
                <div style={profileRow}>
                  {mentor.profilePhoto || mentor.photoURL ? (
                    <img src={mentor.profilePhoto || mentor.photoURL} alt="" style={avatar} />
                  ) : (
                    <div style={avatarFallback} aria-hidden="true">🎓</div>
                  )}
                  <div>
                    <h2 style={{ margin: 0, fontSize: "18px" }}>{name}</h2>
                    <div style={role}>{expertise}</div>
                    {mentor.verified && <div style={verified}>✓ Verified mentor</div>}
                  </div>
                </div>

                {mentor.location && <div style={role}>📍 {mentor.location}</div>}
                {mentor.bio && <p style={text}>{mentor.bio}</p>}

                {Array.isArray(mentor.accessibilityNeeds) && mentor.accessibilityNeeds.length > 0 && (
                  <div style={tags} aria-label="Mentor accessibility support">
                    {mentor.accessibilityNeeds.map((need) => <span key={need} style={tagStyle}>♿ {need}</span>)}
                  </div>
                )}

                <div style={actions}>
                  <button type="button" style={button} onClick={() => navigate(`/user/${mentor.id}`)}>View Mentor</button>
                  <button type="button" style={secondaryButton} onClick={() => navigate("/messages")}>Message</button>
                </div>
              </article>
            );
          })}
        </div>

        <section style={{ ...card, marginTop: "20px" }}>
          <h2>📅 Sessions</h2>
          <p style={muted}>
            Mentor profiles are connected. A booking/session system is not yet backed by an existing Firestore collection, so scheduling is not falsely presented as active.
          </p>
        </section>
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
const profileRow = { display: "flex", gap: "14px", alignItems: "center" };
const avatar = { width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover" };
const avatarFallback = { width: "56px", height: "56px", borderRadius: "50%", display: "grid", placeItems: "center", background: "#172554", fontSize: "26px" };
const role = { color: "#94a3b8", fontSize: "13px", marginTop: "4px" };
const verified = { color: "#86efac", fontSize: "12px", marginTop: "6px" };
const text = { color: "#e2e8f0", lineHeight: 1.6 };
const tags = { display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "10px" };
const tagStyle = { background: "#172554", border: "1px solid #1d4ed8", color: "#dbeafe", borderRadius: "999px", padding: "5px 9px", fontSize: "12px" };
const errorBox = { background: "#451a1a", border: "1px solid #991b1b", color: "#fecaca", borderRadius: "14px", padding: "14px", marginBottom: "18px" };

export default MentorHub;
