import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import {
  doc,
  getDoc,
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase";

function CrossPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [message, setMessage] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [creatingRequest, setCreatingRequest] = useState(false);
  const [requestCreated, setRequestCreated] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [error, setError] = useState("");
  const [requestStats, setRequestStats] = useState([]);

  const platforms = [
    { id: "facebook", label: "Facebook", icon: "ⓕ" },
    { id: "instagram", label: "Instagram", icon: "◎" },
    { id: "x", label: "X / Twitter", icon: "𝕏" },
    { id: "linkedin", label: "LinkedIn", icon: "in" },
    { id: "reddit", label: "Reddit", icon: "●" },
    { id: "threads", label: "Threads", icon: "@" },
    { id: "whatsapp", label: "WhatsApp", icon: "◉" },
    { id: "telegram", label: "Telegram", icon: "➤" },
  ];

  useEffect(() => {
    async function loadPost() {
      try {
        const snap = await getDoc(doc(db, "posts", id));

        if (snap.exists()) {
          setPost({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error("Unable to load cross-post source:", err);
        setError("Unable to load this post.");
      } finally {
        setLoading(false);
      }
    }

    if (id) loadPost();
  }, [id]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return undefined;

    const requestsQuery = query(
      collection(db, "crossPostRequests"),
      where("creatorId", "==", uid)
    );

    return onSnapshot(
      requestsQuery,
      (snapshot) => {
        setRequestStats(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );
      },
      (err) => {
        console.error("Cross-post statistics listener failed:", err);
      }
    );
  }, []);

  const stats = useMemo(() => {
    const successful = requestStats.filter(
      (item) => item.status === "published" || item.status === "completed"
    );

    const activeReferrals = requestStats.reduce(
      (total, item) => total + Number(item.referralSignups || 0),
      0
    );

    const impressions = requestStats.reduce(
      (total, item) => total + Number(item.impressions || 0),
      0
    );

    const xp = requestStats.reduce(
      (total, item) => total + Number(item.creatorGrowth?.points || 0),
      0
    );

    return {
      total: requestStats.length,
      successful: successful.length,
      xp,
      referrals: activeReferrals,
      impressions,
    };
  }, [requestStats]);

  function togglePlatform(platformId) {
    setSelectedPlatforms((current) =>
      current.includes(platformId)
        ? current.filter((item) => item !== platformId)
        : [...current, platformId]
    );
  }

  async function createCrossPostRequest() {
    if (creatingRequest || requestCreated) return;

    setError("");

    const uid = auth.currentUser?.uid;
    if (!uid) {
      setError("Please sign in before creating a cross-post request.");
      return;
    }

    if (!post?.id) {
      setError("Post information is unavailable.");
      return;
    }

    if (selectedPlatforms.length === 0) {
      setError("Select at least one destination.");
      return;
    }

    setCreatingRequest(true);

    try {
      const requestRef = await addDoc(collection(db, "crossPostRequests"), {
        creatorId: uid,
        sourcePostId: post.id,
        sourcePostOwnerId: post.userId || "",
        platforms: selectedPlatforms,
        message: message.trim().slice(0, 1000),
        visibility,
        status: "pending",
        requestVersion: 2,
        security: {
          frontendCreated: true,
          backendRequired: true,
          clientPublishingAllowed: false,
          clientWatermarkProcessingAllowed: false,
        },
        watermark: {
          required: true,
          text: "Created on Inclura — The most accessible network.",
          status: "pending",
          processedBy: "authorized_backend",
        },
        publishing: {
          status: "pending",
          completed: false,
          processedBy: "authorized_backend",
        },
        creatorGrowth: {
          eligible: false,
          points: 0,
          awardedBy: "authorized_backend",
        },
        createdAt: serverTimestamp(),
      });

      setRequestId(requestRef.id);
      setRequestCreated(true);
    } catch (err) {
      console.error("Cross-post request failed:", err);
      setError("Unable to create the secure cross-post request. Please try again.");
    } finally {
      setCreatingRequest(false);
    }
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <p aria-live="polite">Loading cross-post…</p>
      </main>
    );
  }

  if (!post) {
    return (
      <main style={styles.page}>
        <button type="button" onClick={() => navigate(-1)} style={styles.backButton}>
          ← Back
        </button>
        <section style={styles.card}>
          <h1>Cross-Post</h1>
          <p>Post not found.</p>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <button type="button" onClick={() => navigate(-1)} style={styles.backButton}>
        ← Back
      </button>

      <header style={styles.header}>
        <span aria-hidden="true" style={styles.headerIcon}>📤</span>
        <div>
          <h1 style={styles.title}>Cross-Post</h1>
          <p style={styles.subtitle}>
            Share an Inclura post to selected external platforms through a controlled,
            secure workflow.
          </p>
        </div>
      </header>

      <section style={styles.steps} aria-label="Cross-post steps">
        {[
          ["1", "Choose destination"],
          ["2", "Add message"],
          ["3", "Preview"],
          ["4", "Confirm request"],
        ].map(([number, label]) => (
          <div key={number} style={styles.step}>
            <span style={styles.stepNumber}>{number}</span>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Original Inclura Post</h2>

        <div style={styles.postPreview}>
          <div style={styles.creator}>
            <div style={styles.avatar}>
              {post.userName?.charAt(0)?.toUpperCase() || "I"}
            </div>
            <strong>{post.userName || "Inclura Creator"}</strong>
          </div>

          {post.text && (
            <p style={styles.postText}>{post.text}</p>
          )}

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.imageAlt || "Inclura post image"}
              style={styles.media}
            />
          )}

          {post.videoUrl && (
            <video controls style={styles.media}>
              <source src={post.videoUrl} type="video/mp4" />
            </video>
          )}
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>1. Choose destination</h2>
        <p style={styles.helper}>
          Select one or more destinations. Inclura will create a secure publishing
          request; the browser will never receive external platform credentials.
        </p>

        <div style={styles.platformGrid}>
          {platforms.map((platform) => {
            const selected = selectedPlatforms.includes(platform.id);

            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => togglePlatform(platform.id)}
                aria-pressed={selected}
                style={{
                  ...styles.platformButton,
                  ...(selected ? styles.platformSelected : {}),
                }}
              >
                <span aria-hidden="true">{platform.icon}</span>
                <span>{platform.label}</span>
                {selected && <span aria-hidden="true">✓</span>}
              </button>
            );
          })}
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>2. Add optional message</h2>
        <label htmlFor="crosspost-message" style={styles.label}>
          Message or caption
        </label>
        <textarea
          id="crosspost-message"
          value={message}
          onChange={(event) => setMessage(event.target.value.slice(0, 1000))}
          placeholder="Add a short message for the external post…"
          maxLength={1000}
          rows={5}
          style={styles.textarea}
        />
        <div style={styles.counter}>{message.length}/1000</div>

        <label htmlFor="crosspost-visibility" style={styles.label}>
          Visibility
        </label>
        <select
          id="crosspost-visibility"
          value={visibility}
          onChange={(event) => setVisibility(event.target.value)}
          style={styles.select}
        >
          <option value="public">Public</option>
          <option value="followers">Followers / connections</option>
        </select>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>3. Preview</h2>

        <div style={styles.previewBox}>
          <div style={styles.previewHeader}>
            <span>Inclura Creator</span>
            <span>→ {selectedPlatforms.length || 0} destination(s)</span>
          </div>

          {message.trim() && (
            <p style={styles.messagePreview}>{message.trim()}</p>
          )}

          {post.text && (
            <p style={styles.postText}>{post.text}</p>
          )}

          <div style={styles.watermarkPreview}>
            <strong>Inclura watermark</strong>
            <span>Created on Inclura — The most accessible network.</span>
          </div>
        </div>

        <div style={styles.securityNotice}>
          <strong>🔐 Security</strong>
          <p>
            Inclura does not store external platform passwords or publish directly
            from the user's browser. Watermarking and external publishing are
            reserved for an authorized backend workflow.
          </p>
        </div>
      </section>

      {error && (
        <div role="alert" style={styles.error}>
          {error}
        </div>
      )}

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>4. Confirm cross-post request</h2>

        {!requestCreated ? (
          <>
            <p style={styles.helper}>
              {selectedPlatforms.length === 0
                ? "Select at least one destination before continuing."
                : "Review your selections, then create the secure request."}
            </p>

            <button
              type="button"
              onClick={createCrossPostRequest}
              disabled={creatingRequest || selectedPlatforms.length === 0}
              style={{
                ...styles.primaryButton,
                opacity:
                  creatingRequest || selectedPlatforms.length === 0 ? 0.6 : 1,
              }}
              aria-busy={creatingRequest}
            >
              {creatingRequest
                ? "Creating secure request…"
                : "Confirm & Prepare Cross-Post"}
            </button>
          </>
        ) : (
          <div style={styles.success} role="status">
            <strong>✓ Cross-post request created</strong>
            <p>
              Request <span style={styles.code}>{requestId}</span> is now pending
              secure backend processing.
            </p>
            <p style={styles.helper}>
              No external publication is claimed until the authorized publishing
              service confirms it.
            </p>
          </div>
        )}
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Cross-Post Activity</h2>

        <div style={styles.statsGrid}>
          <StatCard title="Requests" value={stats.total} />
          <StatCard title="Completed" value={stats.successful} />
          <StatCard title="XP From Sharing" value={stats.xp} />
          <StatCard title="Referral Signups" value={stats.referrals} />
          <StatCard title="Impressions" value={stats.impressions} />
        </div>
      </section>
    </main>
  );
}

function StatCard({ title, value }) {
  return (
    <article style={styles.statCard} aria-label={title}>
      <strong style={styles.statValue}>{value}</strong>
      <span style={styles.statTitle}>{title}</span>
    </article>
  );
}

const styles = {
  page: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "24px 16px 60px",
    color: "#fff",
  },
  backButton: {
    background: "transparent",
    border: "1px solid #475569",
    color: "#fff",
    borderRadius: "10px",
    padding: "9px 14px",
    cursor: "pointer",
    marginBottom: "18px",
  },
  header: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    marginBottom: "22px",
  },
  headerIcon: { fontSize: "32px" },
  title: { margin: 0, fontSize: "30px" },
  subtitle: { margin: "8px 0 0", color: "#cbd5e1", lineHeight: 1.5 },
  steps: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
    gap: "10px",
    marginBottom: "18px",
  },
  step: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "14px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    fontSize: "13px",
  },
  stepNumber: {
    display: "inline-flex",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    background: "#166534",
    fontWeight: 800,
  },
  card: {
    background: "#0f172a",
    borderRadius: "20px",
    padding: "20px",
    marginTop: "18px",
    border: "1px solid #1e293b",
  },
  sectionTitle: { marginTop: 0, marginBottom: "12px" },
  helper: { color: "#cbd5e1", lineHeight: 1.5, fontSize: "14px" },
  postPreview: {
    background: "#1e293b",
    borderRadius: "16px",
    padding: "16px",
  },
  creator: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#166534",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
  },
  postText: { whiteSpace: "pre-wrap", lineHeight: 1.55 },
  media: {
    width: "100%",
    maxHeight: "520px",
    objectFit: "contain",
    borderRadius: "14px",
    marginTop: "10px",
  },
  platformGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
    gap: "10px",
  },
  platformButton: {
    minHeight: "56px",
    borderRadius: "14px",
    border: "1px solid #475569",
    background: "#1e293b",
    color: "#fff",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },
  platformSelected: {
    border: "2px solid #22c55e",
    background: "#14532d",
  },
  label: {
    display: "block",
    fontWeight: 700,
    margin: "18px 0 8px",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "12px",
    border: "1px solid #475569",
    background: "#020617",
    color: "#fff",
    padding: "12px",
    resize: "vertical",
    font: "inherit",
  },
  counter: {
    textAlign: "right",
    color: "#94a3b8",
    fontSize: "12px",
    marginTop: "5px",
  },
  select: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "12px",
    border: "1px solid #475569",
    background: "#020617",
    color: "#fff",
    padding: "12px",
    font: "inherit",
  },
  previewBox: {
    background: "#1e293b",
    borderRadius: "16px",
    padding: "18px",
  },
  previewHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    color: "#cbd5e1",
    fontSize: "13px",
  },
  messagePreview: {
    background: "#334155",
    borderRadius: "12px",
    padding: "12px",
    lineHeight: 1.5,
  },
  watermarkPreview: {
    marginTop: "16px",
    padding: "14px",
    borderRadius: "12px",
    background: "#334155",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  securityNotice: {
    marginTop: "14px",
    padding: "14px",
    borderRadius: "12px",
    background: "#052e16",
    border: "1px solid #166534",
    lineHeight: 1.5,
  },
  error: {
    marginTop: "18px",
    padding: "14px",
    borderRadius: "12px",
    background: "#450a0a",
    border: "1px solid #991b1b",
    color: "#fecaca",
  },
  success: {
    padding: "16px",
    borderRadius: "14px",
    background: "#052e16",
    border: "1px solid #166534",
    lineHeight: 1.5,
  },
  code: { fontFamily: "monospace" },
  primaryButton: {
    width: "100%",
    padding: "15px",
    borderRadius: "13px",
    border: "none",
    background: "#22c55e",
    color: "#fff",
    fontWeight: 800,
    fontSize: "16px",
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
    gap: "10px",
  },
  statCard: {
    background: "#1e293b",
    borderRadius: "14px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  statValue: { fontSize: "24px" },
  statTitle: { color: "#cbd5e1", fontSize: "13px" },
};

export default CrossPost;
