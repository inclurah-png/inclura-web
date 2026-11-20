import { useTranslation } from "react-i18next";
import DashboardLayout from "../components/DashboardLayout";

function CreatorEarnings() {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <main style={page} aria-labelledby="creator-activity-title">
        <h1 id="creator-activity-title">{t("creatorActivityTitle")}</h1>
        <section style={card}>
          <h2 style={{ marginTop: 0 }}>{t("creatorBoundaryTitle")}</h2>
          <p style={muted}>{t("creatorBoundaryText")}</p>
          <p style={muted}>{t("creatorActivityIntro")}</p>
        </section>
      </main>
    </DashboardLayout>
  );
}

const page = { color: "white", maxWidth: "1000px", margin: "0 auto" };
const card = {
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "18px",
  padding: "22px",
  lineHeight: 1.7,
};
const muted = { color: "#cbd5e1", lineHeight: 1.7 };

export default CreatorEarnings;
