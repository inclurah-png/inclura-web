import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";

const PLATFORMS = [
  { id: "facebook", name: "Facebook", icon: "ⓕ", description: "Connect an eligible Facebook Page through Meta authorization." },
  { id: "instagram", name: "Instagram", icon: "◎", description: "Connect an eligible professional Instagram account through official Meta authorization." },
  { id: "linkedin", name: "LinkedIn", icon: "in", description: "Connect your LinkedIn member or organization through OAuth." },
  { id: "x", name: "X", icon: "𝕏", description: "Connect your X account through official OAuth authorization." },
  { id: "reddit", name: "Reddit", icon: "●", description: "Connect your Reddit account through official OAuth authorization." },
  { id: "threads", name: "Threads", icon: "@", description: "Connect an eligible Threads account through official Meta authorization." },
  { id: "telegram", name: "Telegram", icon: "➤", description: "Connect an authorized Telegram destination for publishing." },
  { id: "whatsapp", name: "WhatsApp", icon: "◉", description: "Connect only when the official WhatsApp publishing workflow is configured." },
];

function SocialConnections() {
  const navigate = useNavigate();
  const [connections, setConnections] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return undefined;

    const q = query(
      collection(db, "socialConnections"),
      where("userId", "==", uid)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const next = {};
        snapshot.docs.forEach((item) => {
          next[item.data().platform] = { id: item.id, ...item.data() };
        });
        setConnections(next);
      },
      (listenerError) => {
        console.error("Social connections listener failed:", listenerError);
        setError("Unable to load your social connections right now.");
      }
    );
  }, []);

  function statusFor(platformId) {
    const connection = connections[platformId];
    if (!connection) return "not_connected";
    return connection.status || "pending";
  }

  function statusLabel(status) {
    if (status === "connected") return "Connected";
    if (status === "pending") return "Connection pending";
    if (status === "expired") return "Authorization expired";
    if (status === "revoked") return "Authorization revoked";
    if (status === "error") return "Connection needs attention";
    return "Not connected";
  }

  return (
    <main style={styles.page}>
      <button type="button" onClick={() => navigate(-1)} style={styles.backButton}>
        ← Back
      </button>

      <header style={styles.header}>
        <span aria-hidden="true" style={styles.headerIcon}>🔗</span>
        <div>
          <h1 style={styles.title}>Social Connections</h1>
          <p style={styles.subtitle}>
            Connect your own social accounts so your Inclura cross-posts can be
            published only through authorization you control.
          </p>
        </div>
      </header>

      <section style={styles.notice}>
        <strong>Your accounts stay separate</strong>
        <p style={{ margin: "8px 0 0" }}>
          Each Inclura user connects their own social account. Inclura does not
          ask for or store social-media passwords. Publishing will use official
          authorization and the permissions granted by the account owner.
        </p>
      </section>

      {error && (
        <div role="alert" style={styles.error}>
          {error}
        </div>
      )}

      <section style={styles.grid} aria-label="Social account connections">
        {PLATFORMS.map((platform) => {
          const status = statusFor(platform.id);
          const connected = status === "connected";

          return (
            <article key={platform.id} style={styles.card}>
              <div style={styles.icon}>{platform.icon}</div>
              <div style={{ flex: 1 }}>
                <h2 style={styles.platformName}>{platform.name}</h2>
                <p style={styles.description}>{platform.description}</p>

                <span
                  style={{
                    ...styles.status,
                    ...(connected ? styles.statusConnected : {}),
                  }}
                >
                  {statusLabel(status)}
                </span>
              </div>

              <button
                type="button"
                disabled
                title="Official OAuth connection will be enabled when this platform's publishing service is configured."
                style={styles.connectButton}
              >
                {connected ? "Connected" : "Connect"}
              </button>
            </article>
          );
        })}
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>How cross-posting will work</h2>
        <ol style={styles.list}>
          <li>You connect a platform using its official authorization screen.</li>
          <li>Inclura stores only the secure connection record needed for publishing.</li>
          <li>You choose destinations when creating a Cross-Post request.</li>
          <li>Inclura's authorized backend publishes to each selected destination.</li>
          <li>Inclura records the real response as Published, Failed, or Awaiting authorization.</li>
        </ol>
        <p style={styles.boundary}>
          A prepared watermark is not the same as publication. External publication
          will be marked successful only after the authorized platform service confirms it.
        </p>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "24px",
    boxSizing: "border-box",
    color: "#0f172a",
  },
  backButton: {
    border: "none",
    background: "transparent",
    color: "#0f766e",
    fontWeight: "700",
    cursor: "pointer",
    padding: "8px 0",
  },
  header: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    maxWidth: "1000px",
    margin: "18px auto",
  },
  headerIcon: {
    fontSize: "30px",
  },
  title: {
    margin: 0,
    fontSize: "30px",
  },
  subtitle: {
    margin: "8px 0 0",
    color: "#475569",
    lineHeight: 1.6,
  },
  notice: {
    maxWidth: "1000px",
    margin: "0 auto 18px",
    padding: "16px",
    borderRadius: "16px",
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#065f46",
    lineHeight: 1.55,
  },
  error: {
    maxWidth: "1000px",
    margin: "0 auto 18px",
    padding: "12px 14px",
    borderRadius: "12px",
    background: "#fef2f2",
    color: "#991b1b",
  },
  grid: {
    maxWidth: "1000px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "14px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "18px",
    boxSizing: "border-box",
  },
  icon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "#0f172a",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    fontWeight: "800",
    fontSize: "18px",
    marginBottom: "12px",
  },
  platformName: {
    margin: 0,
    fontSize: "19px",
  },
  description: {
    color: "#64748b",
    lineHeight: 1.5,
    minHeight: "48px",
    margin: "7px 0 12px",
  },
  status: {
    display: "inline-block",
    fontSize: "12px",
    fontWeight: "700",
    padding: "6px 9px",
    borderRadius: "999px",
    background: "#f1f5f9",
    color: "#475569",
  },
  statusConnected: {
    background: "#dcfce7",
    color: "#166534",
  },
  connectButton: {
    marginTop: "16px",
    width: "100%",
    border: "none",
    borderRadius: "10px",
    padding: "11px 14px",
    background: "#cbd5e1",
    color: "#475569",
    fontWeight: "800",
    cursor: "not-allowed",
  },
  sectionTitle: {
    marginTop: 0,
  },
  list: {
    lineHeight: 1.8,
    paddingLeft: "22px",
    color: "#334155",
  },
  boundary: {
    marginBottom: 0,
    padding: "12px",
    borderRadius: "12px",
    background: "#fffbeb",
    color: "#92400e",
    lineHeight: 1.5,
  },
};

export default SocialConnections;
