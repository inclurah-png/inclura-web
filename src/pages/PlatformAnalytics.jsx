import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import DashboardLayout from "../components/DashboardLayout";
import { db } from "../firebase";

const metrics = [
  ["totalUsers", "👥 Total Users"],
  ["activeCreators", "🟢 Active Users"],
  ["premiumUsers", "⭐ Premium Users"],
  ["verifiedCreators", "✅ Verified Creators"],
  ["qualifiedCreators", "🏆 Qualified Creators"],
  ["activeEnterpriseCampaigns", "🏢 Active Enterprise Campaigns"],
  ["totalEnterpriseCampaignBudget", "💰 Enterprise Campaign Budget"],
  ["marketplaceRevenue", "🛒 Marketplace Sales"],
  ["totalMarketplaceListings", "📦 Marketplace Listings"],
  ["completedMarketplaceOrders", "🤝 Completed Marketplace Orders"],
];

function formatMetric(key, value) {
  if (value === undefined || value === null) return "—";
  if (key.toLowerCase().includes("budget") || key.toLowerCase().includes("revenue")) {
    return Number(value).toLocaleString();
  }
  return Number(value).toLocaleString();
}

function PlatformAnalytics() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReport() {
    setLoading(true);
    setError("");
    try {
      const snapshot = await getDoc(doc(db, "executiveReports", "current"));
      if (snapshot.exists()) setReport(snapshot.data());
      else setError("No platform analytics report has been generated yet.");
    } catch (loadError) {
      console.error("Platform analytics load failed:", loadError);
      setError("Analytics could not be loaded. Check administrator permissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadReport(); }, []);

  return (
    <DashboardLayout>
      <main style={{ color: "white", maxWidth: "1100px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "8px" }}>📊 Platform Analytics</h1>
        <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
          Live figures from Inclura's existing executive analytics record.
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "18px 0" }}>
          <button type="button" onClick={loadReport} disabled={loading} style={buttonStyle}>
            {loading ? "Refreshing..." : "↻ Refresh analytics"}
          </button>
          {report?.generatedAt && (
            <span style={timestampStyle}>
              Last generated: {report.generatedAt.toDate ? report.generatedAt.toDate().toLocaleString() : "Available"}
            </span>
          )}
        </div>

        {error && <div style={errorStyle} role="alert">{error}</div>}

        {!loading && report && (
          <>
            <section style={healthCard}>
              <div>
                <div style={{ color: "#94a3b8", fontSize: "13px" }}>Platform health</div>
                <strong style={{ fontSize: "26px" }}>{report.platformHealth || "—"}</strong>
              </div>
              <div>
                <div style={{ color: "#94a3b8", fontSize: "13px" }}>Health score</div>
                <strong style={{ fontSize: "26px" }}>{report.overallHealthScore ?? "—"}/100</strong>
              </div>
            </section>

            <section style={gridStyle} aria-label="Platform metrics">
              {metrics.map(([key, label]) => (
                <article key={key} style={cardStyle}>
                  <div style={{ color: "#cbd5e1", fontSize: "14px" }}>{label}</div>
                  <strong style={{ display: "block", marginTop: "10px", fontSize: "25px" }}>
                    {formatMetric(key, report[key])}
                  </strong>
                </article>
              ))}
            </section>
          </>
        )}
      </main>
    </DashboardLayout>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
};
const cardStyle = {
  background: "#0f172a",
  border: "1px solid #334155",
  padding: "20px",
  borderRadius: "16px",
};
const healthCard = {
  ...cardStyle,
  display: "flex",
  justifyContent: "space-between",
  gap: "24px",
  flexWrap: "wrap",
  marginBottom: "14px",
  borderColor: "#166534",
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
const timestampStyle = { alignSelf: "center", color: "#94a3b8", fontSize: "12px" };
const errorStyle = {
  background: "#451a1a",
  border: "1px solid #991b1b",
  color: "#fecaca",
  borderRadius: "12px",
  padding: "14px",
  marginBottom: "16px",
};

export default PlatformAnalytics;
