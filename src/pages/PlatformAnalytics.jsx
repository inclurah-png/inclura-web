import { useCallback, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { BarChart3, RefreshCw, Users, Activity, Crown, BadgeCheck, Award, Building2, Wallet, ShoppingBag, Handshake, ShieldCheck } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { db } from "../firebase";

const metrics = [
  { key: "totalUsers", label: "Total members", icon: Users, tone: "#38bdf8" },
  { key: "activeCreators", label: "Active members", icon: Activity, tone: "#34d399" },
  { key: "premiumUsers", label: "Premium members", icon: Crown, tone: "#fbbf24" },
  { key: "verifiedCreators", label: "Verified creators", icon: BadgeCheck, tone: "#2dd4bf" },
  { key: "qualifiedCreators", label: "Qualified creators", icon: Award, tone: "#a78bfa" },
  { key: "activeEnterpriseCampaigns", label: "Active enterprise campaigns", icon: Building2, tone: "#60a5fa" },
  { key: "totalEnterpriseCampaignBudget", label: "Enterprise campaign budget", icon: Wallet, tone: "#fbbf24", currency: true },
  { key: "marketplaceRevenue", label: "Marketplace sales recorded", icon: ShoppingBag, tone: "#34d399", currency: true },
  { key: "totalMarketplaceListings", label: "Marketplace listings", icon: ShoppingBag, tone: "#38bdf8" },
  { key: "completedMarketplaceOrders", label: "Completed orders", icon: Handshake, tone: "#2dd4bf" },
];

function formatMetric(value, currency = false) {
  if (value === undefined || value === null || !Number.isFinite(Number(value))) return "Not recorded";
  const formatted = Number(value).toLocaleString();
  return currency ? `₦${formatted}` : formatted;
}

function formatDate(value) {
  if (!value) return "Not yet generated";
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? "Not yet generated" : date.toLocaleString();
}

export default function PlatformAnalytics() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Generate the latest report through the IFSE backend. The backend
      // verifies the Firebase ID token and the administrator role before
      // reading platform-wide records or writing the executive report.
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("permission-denied");
      const token = await currentUser.getIdToken();
      const response = await fetch("https://inclura-ifse-backend.onrender.com/api/analytics/platform", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (response.ok) {
        const result = await response.json();
        if (!result.success || !result.report) throw new Error("Analytics generation failed.");
        setReport(result.report);
        return;
      }

      if (response.status === 403 || response.status === 401) {
        throw new Error("permission-denied");
      }

      // Keep existing report readable if the backend is temporarily waking
      // or deploying; Firestore rules still restrict this read to admins.
      const snapshot = await getDoc(doc(db, "executiveReports", "current"));
      if (snapshot.exists()) {
        setReport(snapshot.data());
      } else {
        setReport(null);
        setError("The executive analytics report has not been generated yet. No figures are being invented or estimated.");
      }
    } catch (loadError) {
      console.error("Platform analytics load failed:", loadError);
      setError((loadError?.code === "permission-denied" || loadError?.message === "permission-denied")
        ? "Your account is not authorised to view executive analytics. An Inclura administrator must assign the secure admin permission to your account."
        : "We could not retrieve the analytics report. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadReport(); }, [loadReport]);

  const hasHealth = report && (report.platformHealth || report.overallHealthScore !== undefined);

  return (
    <DashboardLayout>
      <main style={styles.page}>
        <header style={styles.header}>
          <div style={styles.headingIcon}><BarChart3 size={25} /></div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={styles.eyebrow}>INCLURA • EXECUTIVE CENTRE</div>
            <h1 style={styles.title}>Platform Analytics</h1>
            <p style={styles.subtitle}>A clear view of platform activity and recorded business performance.</p>
          </div>
          <button type="button" onClick={loadReport} disabled={loading} style={styles.refresh}>
            <RefreshCw size={16} style={loading ? { animation: "inclura-spin 1s linear infinite" } : undefined} />
            {loading ? "Refreshing" : "Refresh"}
          </button>
        </header>

        <section style={styles.statusBar}>
          <span style={styles.statusDot} />
          <span>Executive report</span>
          <span style={styles.statusDivider}>•</span>
          <span>Last generated: {formatDate(report?.generatedAt)}</span>
        </section>

        {error && (
          <div role="alert" style={styles.notice}>
            <ShieldCheck size={21} style={{ flexShrink: 0, marginTop: 2 }} />
            <div><strong>Analytics report unavailable</strong><p style={{ margin: "5px 0 0", lineHeight: 1.5 }}>{error}</p></div>
          </div>
        )}

        {loading && !report && <div style={styles.loading}>Loading executive figures…</div>}

        {hasHealth && (
          <section style={styles.healthGrid} aria-label="Platform health summary">
            <article style={styles.healthCard}>
              <span style={styles.cardLabel}>Platform health</span>
              <strong style={styles.healthValue}>{report.platformHealth || "Not recorded"}</strong>
              <span style={styles.cardHint}>Based on the latest generated report</span>
            </article>
            <article style={styles.healthCard}>
              <span style={styles.cardLabel}>Overall health score</span>
              <strong style={styles.healthValue}>{report.overallHealthScore ?? "Not recorded"}{report.overallHealthScore !== undefined ? "/100" : ""}</strong>
              <span style={styles.cardHint}>Reported score, not a live calculation</span>
            </article>
          </section>
        )}

        <div style={styles.sectionHeading}>
          <div><h2 style={styles.sectionTitle}>Platform overview</h2><p style={styles.sectionSub}>Figures available in the executive report</p></div>
          <span style={styles.privateTag}><ShieldCheck size={14} /> Admin only</span>
        </div>

        <section style={styles.metricGrid} aria-label="Platform metrics">
          {metrics.map(({ key, label, icon: Icon, tone, currency }) => {
            const value = report ? formatMetric(report[key], currency) : "—";
            return (
              <article key={key} style={styles.metricCard}>
                <div style={{ ...styles.metricIcon, color: tone, background: `${tone}18` }}><Icon size={19} /></div>
                <div style={styles.metricLabel}>{label}</div>
                <strong style={styles.metricValue}>{value}</strong>
              </article>
            );
          })}
        </section>
        <p style={styles.footnote}>Only values present in Inclura's executive report are displayed. A dash or “Not recorded” means the corresponding metric has not yet been supplied by its data source.</p>
      </main>
      <style>{`@keyframes inclura-spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}

const styles = {
  page: { width: "100%", maxWidth: 1180, margin: "0 auto", padding: "clamp(16px, 3vw, 30px)", color: "#f8fafc", boxSizing: "border-box" },
  header: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 22 },
  headingIcon: { width: 52, height: 52, borderRadius: 16, display: "grid", placeItems: "center", color: "#facc15", background: "linear-gradient(135deg,#064e3b,#0f766e)", border: "1px solid #2c8068", flexShrink: 0 },
  eyebrow: { color: "#a3b9b1", fontSize: 10, fontWeight: 800, letterSpacing: "1.5px", marginBottom: 5 },
  title: { fontSize: "clamp(23px, 4vw, 31px)", lineHeight: 1.15, margin: 0, fontWeight: 800 },
  subtitle: { color: "#aab8c8", margin: "7px 0 0", fontSize: 14, lineHeight: 1.5 },
  refresh: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, border: "1px solid #b8952e", background: "#07543f", color: "#fff", borderRadius: 11, padding: "11px 15px", fontWeight: 750, cursor: "pointer" },
  statusBar: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 9, background: "#0c1f20", border: "1px solid #1d4540", borderRadius: 12, padding: "12px 15px", color: "#b8cbc7", fontSize: 12, marginBottom: 22 },
  statusDot: { width: 8, height: 8, borderRadius: 20, background: "#34d399", boxShadow: "0 0 0 4px #34d39920" },
  statusDivider: { color: "#55736d" },
  notice: { display: "flex", gap: 12, alignItems: "flex-start", background: "#302515", border: "1px solid #856b31", color: "#f6df9b", borderRadius: 13, padding: 16, marginBottom: 22, fontSize: 13 },
  loading: { color: "#cbd5e1", padding: "18px 0" },
  healthGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, marginBottom: 28 },
  healthCard: { background: "linear-gradient(135deg,#102d2a,#102334)", border: "1px solid #28564d", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 8, minHeight: 118 },
  cardLabel: { color: "#a9c1ba", fontSize: 13 },
  healthValue: { fontSize: 25, color: "#facc15" },
  cardHint: { color: "#8da5a0", fontSize: 11 },
  sectionHeading: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 14 },
  sectionTitle: { fontSize: 18, margin: 0, fontWeight: 750 },
  sectionSub: { color: "#94a3b8", fontSize: 12, margin: "5px 0 0" },
  privateTag: { display: "inline-flex", alignItems: "center", gap: 6, color: "#b8d8ca", border: "1px solid #28564d", background: "#102d2a", borderRadius: 20, padding: "6px 10px", fontSize: 11, fontWeight: 700 },
  metricGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,210px),1fr))", gap: 13 },
  metricCard: { background: "#101d2d", border: "1px solid #26384c", borderRadius: 15, padding: 17, minHeight: 125, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 9, boxShadow: "0 5px 18px #00000012" },
  metricIcon: { width: 36, height: 36, borderRadius: 11, display: "grid", placeItems: "center" },
  metricLabel: { color: "#b8c5d4", fontSize: 12, lineHeight: 1.4 },
  metricValue: { color: "#fff", fontSize: 22, lineHeight: 1.2, overflowWrap: "anywhere" },
  footnote: { color: "#8091a4", fontSize: 11, lineHeight: 1.6, marginTop: 18 },
};
