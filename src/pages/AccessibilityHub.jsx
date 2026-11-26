import { useTranslation } from "react-i18next";
import DashboardLayout from "../components/DashboardLayout";
import AccessibilitySettings from "../components/AccessibilitySettings";

function AccessibilityHub() {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <main style={styles.page}>
        <header style={styles.header}>
          <h1 style={styles.heading}>♿ {t("accessibilityHubTitle")}</h1>
          <p style={styles.intro}>{t("accessibilityHubIntro")}</p>
        </header>

        <section
          aria-labelledby="accessibility-settings-heading"
          style={styles.content}
        >
          <h2 id="accessibility-settings-heading">
            {t("accessibilityDisplayLanguage")}
          </h2>
          <AccessibilitySettings />
        </section>
      </main>
    </DashboardLayout>
  );
}

const styles = {
  page: {
    color: "white",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "20px",
  },
  header: {
    marginBottom: "24px",
  },
  heading: {
    margin: "0 0 12px",
    fontSize: "clamp(24px, 4vw, 32px)",
  },
  intro: {
    color: "#cbd5e1",
    lineHeight: 1.6,
    margin: 0,
  },
  content: {
    border: "1px solid #334155",
    borderRadius: "16px",
    padding: "20px",
    background: "#020617",
  },
};

export default AccessibilityHub;
