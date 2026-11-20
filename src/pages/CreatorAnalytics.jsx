import { useCallback, useEffect, useState } from "react";
import { auth } from "../firebase";
import DashboardLayout from "../components/DashboardLayout";

export default function CreatorAnalytics() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("permission-denied");
      const token = await user.getIdToken();
      const response = await fetch("https://inclura-ifse-backend.onrender.com/api/analytics/platform", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (response.status === 401 || response.status === 403) throw new Error("permission-denied");
      if (!response.ok) throw new Error("report-unavailable");
      const result = await response.json();
      if (!result.success || !result.report) throw new Error("report-unavailable");
      setReport(result.report);
    } catch (e) {
      console.error("Admin creator analytics load failed:", e);
      setError(e.message === "permission-denied"
        ? "Your account is not authorised to view private creator analytics."
        : "The secure creator analytics report is currently unavailable. No figures have been estimated.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAnalytics(); }, [loadAnalytics]);
  const metrics = [
    ["activeCreators", "Active creators"],
    ["verifiedCreators", "Verified creators"],
    ["qualifiedCreators", "Qualified creators"],
  ];

  return (
    <DashboardLayout>
      <main style={page}>
        <h1>📊 Creator Analytics</h1>
        <p style={muted}>Private administrator view of platform-wide creator performance indicators.</p>
        <div style={notice}><strong>Administrator only</strong><p style={{ margin: "6px 0 0" }}>This report is not available to creator accounts. Creators can view only their own activity through My Creator Activity.</p></div>
        <button type="button" onClick={loadAnalytics} disabled={loading} style={button}>{loading ? "Refreshing..." : "↻ Refresh report"}</button>
        {error && <div role="alert" style={errorStyle}>{error}</div>}
        {loading && <div style={card}>Loading secure creator report...</div>}
        {!loading && report && <section style={grid}>{metrics.map(([key, label]) => (
          <article key={key} style={card}>
            <div style={muted}>{label}</div>
            <strong style={value}>{report[key] === undefined || report[key] === null ? "Not recorded" : Number(report[key]).toLocaleString()}</strong>
          </article>
        ))}</section>}
        {!loading && !report && !error && <div style={card}>No creator report is available yet.</div>}
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
