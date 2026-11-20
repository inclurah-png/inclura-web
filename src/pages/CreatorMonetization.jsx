import { useTranslation } from "react-i18next";
import DashboardLayout from "../components/DashboardLayout";

function CreatorMonetization() {
  const { t } = useTranslation();
  const opportunities = [
    t("creatorProfile"),
    t("creatorContent"),
    t("creatorBrands"),
    t("creatorAnalytics"),
  ];

  return (
    <DashboardLayout>
      <main style={page} aria-labelledby="creator-opportunities-title">
        <h1 id="creator-opportunities-title">{t("creatorOpportunitiesTitle")}</h1>
        <p style={intro}>{t("creatorOpportunitiesIntro")}</p>
        <section style={notice} aria-label={t("creatorBoundaryTitle")}>
          <strong>{t("creatorImportantBoundary")}</strong>
          <p style={{ marginBottom: 0 }}>{t("creatorImportantBoundaryText")}</p>
        </section>
        <section style={grid} aria-label={t("creatorToolsLabel")}>
          {opportunities.map((item, index) => (
            <article key={index} style={card}>
              <p style={muted}>{item}</p>
            </article>
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
const card = { background: "#0f172a", border: "1px solid #334155", borderRadius: "16px", padding: "20px" };
const muted = { color: "#cbd5e1", lineHeight: 1.65 };

export default CreatorMonetization;
