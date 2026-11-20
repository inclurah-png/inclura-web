import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

function CreatorMonetization() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const opportunities = [
    { label: t("creatorProfile"), icon: "👤", destination: "/edit-profile" },
    { label: t("creatorContent"), icon: "🎬", destination: "/reels-system" },
    { label: t("creatorBrands"), icon: "🔎", destination: "/search" },
    { label: t("creatorActivityTitle"), icon: "📊", destination: "/my-creator-activity" },
  ];

  return (
    <DashboardLayout>
      <main style={page} aria-labelledby="creator-opportunities-title">
        <h1 id="creator-opportunities-title">{t("creatorOpportunitiesTitle")}</h1>
        <p style={intro}>{t("creatorOpportunitiesIntro")}</p>
        <section style={notice} aria-label={t("creatorBoundaryTitle")}>
          <strong>{t("creatorBoundaryTitle")}</strong>
          <p style={{ marginBottom: 0 }}>{t("creatorImportantBoundaryText")}</p>
        </section>
        <section style={grid} aria-label={t("creatorToolsLabel")}>
          {opportunities.map((item) => (
            <button
              key={item.destination}
              type="button"
              onClick={() => navigate(item.destination)}
              aria-label={item.label}
              style={cardButton}
            >
              <span aria-hidden="true" style={iconStyle}>{item.icon}</span>
              <span style={muted}>{item.label}</span>
              <span aria-hidden="true" style={openStyle}>→</span>
            </button>
          ))}
        </section>
      </main>
    </DashboardLayout>
  );
}

const page = { color: "white", maxWidth: "1100px", margin: "0 auto" };
const intro = { color: "#cbd5e1", lineHeight: 1.7 };
const notice = { background: "#0f172a", border: "1px solid #d4af37", borderRadius: "16px", padding: "18px", margin: "18px 0", lineHeight: 1.7 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))", gap: "14px" };
const cardButton = { background: "#0f172a", border: "1px solid #334155", borderRadius: "16px", padding: "20px", color: "white", display: "flex", alignItems: "center", gap: "12px", textAlign: "left", width: "100%", minHeight: "100px", cursor: "pointer", font: "inherit" };
const iconStyle = { fontSize: "25px" };
const openStyle = { marginLeft: "auto", color: "#d4af37", fontSize: "22px" };
const muted = { color: "#cbd5e1", lineHeight: 1.65 };

export default CreatorMonetization;
