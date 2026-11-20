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
  limit,
} from "firebase/firestore";

import { auth, db } from "../firebase";

const INCLURA_WATERMARK = "INCLURA — Inclusion comes first. Connect across languages. Create with purpose. Be seen, heard and included. Built for accessibility and meaningful connection, with support for 10 languages.";

function CrossPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [message, setMessage] = useState("One post can travel further. One community can make the difference.\n\nInclura brings social connection, accessibility, inclusion, trusted identity, creator opportunities, community support and everyday digital services together in one place.\n\nDiscover Inclura — a social network built around inclusion, accessibility and meaningful connection. Connect. Create. Participate. Grow. Join the Inclura community.");
  const [visibility, setVisibility] = useState("public");
  const [creatingRequest, setCreatingRequest] = useState(false);
  const [requestCreated, setRequestCreated] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [watermarkStatus, setWatermarkStatus] = useState("");
  const [watermarkedMediaUrl, setWatermarkedMediaUrl] = useState("");
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
          const sourcePost = { id: snap.id, ...snap.data() };
          if (!auth.currentUser || sourcePost.userId !== auth.currentUser.uid) {
            setError("You can only cross-post content that you created.");
            setPost(null);
          } else {
            setPost(sourcePost);
          }
        } else {
          setError("This source post could not be found.");
        }
      } catch (err) {
        console.error("Unable to load cross-post source:", err);
        setError("Unable to load this post.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadPost();
    } else {
      setError("This cross-post link is missing its source post ID.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return undefined;

    const requestsQuery = query(
      collection(db, "crossPostRequests"),
      where("creatorId", "==", uid),
      limit(25)
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

  const stats = useMemo(() => ({
    requests: requestStats.length,
    pending: requestStats.filter((item) => item.status === "pending").length,
  }), [requestStats]);

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

    const hasImage = Boolean(post.imageUrl);
    const hasVideo = Boolean(post.videoUrl);
    if (hasImage && hasVideo) {
      setError("This cross-post flow currently supports text-only posts or one media file at a time. Please use a post with either one image or one video.");
      return;
    }
    const hasMedia = hasImage || hasVideo;

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
          required: hasMedia,
          text: INCLURA_WATERMARK,
          brand: "Inclura",
          positioning: "Inclusion comes first",
          languagesSupported: 10,
          status: hasMedia ? "pending" : "not_required",
          processedBy: hasMedia ? "authorized_backend" : "not_applicable",
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

      if (!hasMedia) {
        // Text-only posts do not need a media watermark or Cloudinary processing.
        setWatermarkStatus("not_required");
      } else {
        setWatermarkStatus("processing");
        try {
          const idToken = await auth.currentUser.getIdToken();
          const processingResponse = await fetch(
            "https://inclura-ifse-backend.onrender.com/api/media/prepare-crosspost",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
              },
              body: JSON.stringify({ requestId: requestRef.id }),
            }
          );
          const processingResult = await processingResponse.json().catch(() => ({}));

          if (!processingResponse.ok || processingResult.success !== true) {
            throw new Error(processingResult.message || "Watermark processing could not be confirmed.");
          }

          setWatermarkStatus("completed");
          setWatermarkedMediaUrl(processingResult.watermark?.secureUrl || "");
        } catch (processingError) {
          console.error("Cross-post watermark processing was not confirmed:", processingError);
          setWatermarkStatus("unconfirmed");
        }
      }
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

          {post.imageUrl || post.videoUrl ? (
            <div style={styles.watermarkPreview}>
              <strong>🌍 INCLURA — INCLUSION COMES FIRST</strong>
              <span>Connect across languages. Create with purpose. Be seen, heard and included.</span>
              <span>Built for accessibility and meaningful connection, with support for 10 languages.</span>
              <span>Preview only; the permanent watermark is applied to the separate media copy.</span>
            </div>
          ) : (
            <p style={styles.helper}>
              Text-only post: no media watermark is needed. The original text will be included in the cross-post request.
            </p>
          )}
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
              Request <span style={styles.code}>{requestId}</span> has been created.
            </p>
            {watermarkStatus === "not_required" && (
              <p style={styles.helper}>✓ Text-only cross-post request is ready. No image or video watermark is needed.</p>
            )}
            {watermarkStatus === "processing" && (
              <p style={styles.helper}>Inclura is creating the permanent watermark copy…</p>
            )}
            {watermarkStatus === "completed" && (
              <div>
                <p style={styles.helper}>✓ Permanent watermark copy prepared successfully. Your original Inclura post remains unchanged.</p>
                {watermarkedMediaUrl && (
                  <a href={watermarkedMediaUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#86efac", overflowWrap: "anywhere" }}>
                    View watermarked copy
                  </a>
                )}
              </div>
            )}
            {watermarkStatus === "unconfirmed" && (
              <p style={{ ...styles.helper, color: "#fca5a5" }}>
                Watermark processing was not confirmed. Do not share this copy yet. Your original post remains unchanged.
              </p>
            )}
            <p style={styles.helper}>
              This prepares the media only; it does not publish automatically to external platforms.
            </p>
          </div>
        )}
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Cross-Post Activity</h2>

        <div style={styles.statsGrid}>
          <StatCard title="Recent requests" value={stats.requests} />
          <StatCard title="Awaiting secure processing" value={stats.pending} />
        </div>
        <p style={styles.helper}>
          These figures count requests only. A post is counted as published only
          after an authorized external publishing service confirms publication.
        </p>
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
    background: "linear-gradient(135deg, #064e3b, #0f172a)",
    border: "1px solid #d4af37",
    color: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    lineHeight: 1.5,
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
