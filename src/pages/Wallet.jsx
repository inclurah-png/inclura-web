import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Activity, ExternalLink, ShieldCheck } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

function Wallet() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <main
        aria-label={t("accountActivity")}
        style={{ color: "white", maxWidth: "1000px", margin: "0 auto", paddingBottom: "24px" }}
      >
        <header style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "22px" }}>
          <Activity aria-hidden="true" size={30} />
          <div>
            <h1 style={{ margin: 0 }}>{t("accountActivity")}</h1>
            <p style={{ margin: "6px 0 0", color: "#cbd5e1" }}>{t("accountActivityIntro")}</p>
          </div>
        </header>

        <section style={cardStyle}>
          <ShieldCheck aria-hidden="true" size={26} />
          <div>
            <h2 style={{ margin: "0 0 8px", fontSize: "18px" }}>{t("accountActivityBoundaryTitle")}</h2>
            <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.65 }}>{t("accountActivityBoundary")}</p>
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: "0 0 8px", fontSize: "18px" }}>{t("digitalServicesTitle")}</h2>
          <p style={{ margin: "0 0 16px", color: "#cbd5e1", lineHeight: 1.65 }}>{t("digitalExternalNotice")}</p>
          <button type="button" onClick={() => navigate("/digital-services")} style={buttonStyle}>
            {t("digitalServicesTitle")} <ExternalLink aria-hidden="true" size={17} />
          </button>
        </section>
      </main>
    </DashboardLayout>
  );
}

const cardStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "14px",
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "18px",
  padding: "20px",
  marginBottom: "16px",
  lineHeight: 1.6,
};
const buttonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "9px",
  border: "none",
  borderRadius: "12px",
  padding: "12px 16px",
  background: "#d4af37",
  color: "#10251b",
  fontWeight: 800,
  cursor: "pointer",
};

export default Wallet;
