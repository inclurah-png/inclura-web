import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import DashboardLayout from "../components/DashboardLayout";
import { db } from "../firebase";

function EnterpriseCampaignManager() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCampaigns() {
    setLoading(true);
    setError("");
    try {
      const snapshot = await getDocs(collection(db, "enterpriseCampaigns"));
      setCampaigns(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch (loadError) {
      console.error("Enterprise campaigns load failed:", loadError);
      setError("Campaign records could not be loaded. Check your enterprise permissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCampaigns(); }, []);

  const active = campaigns.filter((campaign) => campaign.status === "active").length;
  const completed = campaigns.filter((campaign) => campaign.status === "completed").length;
  const paused = campaigns.filter((campaign) => campaign.status === "paused").length;

  return (
    <DashboardLayout>
      <main style={{ color: "white", maxWidth: "1100px", margin: "0 auto" }}>
        <h1>🏢 Enterprise Campaign Manager</h1>
        <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
          Connected campaign workspace. This page reads existing authorized campaign
          records and does not alter campaign budgets.
        </p>

        <div style={toolbar}>
          <button type="button" onClick={loadCampaigns} disabled={loading} style={buttonStyle}>
            {loading ? "Loading..." : "↻ Refresh campaigns"}
          </button>
          <span style={summary}>Active: {active} · Completed: {completed} · Paused: {paused}</span>
        </div>

        {error && <div style={errorStyle} role="alert">{error}</div>}

        {!loading && !error && campaigns.length === 0 && (
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>No campaigns yet</h2>
            <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
              No enterprise campaign records are currently available to this account.
            </p>
          </div>
        )}

        <section style={gridStyle} aria-label="Enterprise campaigns">
          {campaigns.map((campaign) => (
            <article key={campaign.id} style={cardStyle}>
              <h2 style={{ fontSize: "18px", marginTop: 0 }}>
                {campaign.title || campaign.name || "Untitled campaign"}
              </h2>
              <div style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                <div>Status: <strong style={{ color: "white" }}>{campaign.status || "unknown"}</strong></div>
                <div>Type: {campaign.type || campaign.category || "—"}</div>
                <div>Budget: {typeof campaign.budget === "number" ? campaign.budget.toLocaleString() : "—"}</div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </DashboardLayout>
  );
}

const toolbar = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  flexWrap: "wrap",
  margin: "18px 0",
};
const summary = { color: "#cbd5e1", fontSize: "14px" };
const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "14px",
};
const cardStyle = {
  background: "#0f172a",
  border: "1px solid #334155",
  padding: "20px",
  borderRadius: "16px",
};
const buttonStyle = {
  border: "1px solid #d4af37",
  background: "#064e3b",
  color: "white",
  borderRadius: "10px",
  padding: "10px 14px",
  fontWeight: "700",
  cursor: "pointer",
};
const errorStyle = {
  background: "#451a1a",
  border: "1px solid #991b1b",
  color: "#fecaca",
  borderRadius: "12px",
  padding: "14px",
  marginBottom: "16px",
};

export default EnterpriseCampaignManager;
