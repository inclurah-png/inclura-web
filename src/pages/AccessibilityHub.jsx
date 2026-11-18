import { useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../components/DashboardLayout";
import AccessibilitySettings from "../components/AccessibilitySettings";

function AccessibilityHub() {
const { t } = useTranslation();
const [activeSection, setActiveSection] =
useState("settings");

const sections = [
{
id: "settings",
icon: "⚙️",
titleKey: "accessibilityDisplayLanguage",
descriptionKey: "accessibilityHubIntro",
},
{
id: "requests",
icon: "🆘",
titleKey: "accessibilityRequests",
descriptionKey: "accessibilityRequests",
statusKey: "notConnected",
},
{
id: "resources",
icon: "📚",
titleKey: "accessibilityResources",
descriptionKey: "accessibilityResources",
statusKey: "resourcesNotConnected",
},
{
id: "directory",
icon: "🏢",
titleKey: "accessibilityDirectory",
descriptionKey: "accessibilityDirectory",
statusKey: "directoryNotConnected",
},
{
id: "community",
icon: "🤝",
titleKey: "communitySupport",
descriptionKey: "communitySupport",
statusKey: "communityNotConnected",
},
{
id: "emergency",
icon: "🚨",
titleKey: "emergencyAccessibilityHelp",
descriptionKey: "emergencyAccessibilityHelp",
statusKey: "emergencyNotConnected",
},
];

const activeItem = sections.find(
(section) => section.id === activeSection
);

return (
<DashboardLayout>
<main style={styles.page}>
<header style={styles.header}>
<h1 style={styles.heading}>
♿ {t("accessibilityHubTitle")}
</h1>

      <p style={styles.intro}>
        {t("accessibilityHubIntro")}
      </p>
    </header>

    <nav
      aria-label={t("accessibilitySections")}
      style={styles.navigation}
    >
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => setActiveSection(section.id)}
          aria-current={
            activeSection === section.id
              ? "page"
              : undefined
          }
          style={{
            ...styles.card,
            ...(activeSection === section.id
              ? styles.activeCard
              : {}),
          }}
        >
          <span style={styles.cardTitle}>
            <span aria-hidden="true">
              {section.icon}
            </span>{" "}
            {section.title}
          </span>

          <span style={styles.cardDescription}>
            {section.description}
          </span>
        </button>
      ))}
    </nav>

    <section
      aria-live="polite"
      aria-labelledby="accessibility-section-heading"
      style={styles.content}
    >
      <h2 id="accessibility-section-heading">
        {t(activeItem?.titleKey || "accessibilityDisplayLanguage")}
      </h2>

      {activeSection === "settings" ? (
        <AccessibilitySettings />
      ) : (
        <div style={styles.notice}>
          <p>{t(activeItem?.descriptionKey || "accessibilityHubIntro")}</p>

          <p style={styles.status}>
            {t(activeItem?.statusKey || "notConnected")}
          </p>

          {activeSection === "emergency" && (
            <p>
              {t("emergencyDisclaimer")}
            </p>
          )}
        </div>
      )}
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

navigation: {
display: "grid",
gridTemplateColumns:
"repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
gap: "14px",
marginBottom: "28px",
},

card: {
display: "flex",
flexDirection: "column",
alignItems: "flex-start",
gap: "10px",
width: "100%",
minHeight: "120px",
padding: "20px",
border: "1px solid #334155",
borderRadius: "16px",
background: "#0f172a",
color: "white",
textAlign: "left",
cursor: "pointer",
font: "inherit",
},

activeCard: {
border: "2px solid #60a5fa",
background: "#172554",
},

cardTitle: {
fontWeight: 700,
lineHeight: 1.5,
},

cardDescription: {
color: "#cbd5e1",
fontSize: "14px",
lineHeight: 1.6,
},

content: {
border: "1px solid #334155",
borderRadius: "16px",
padding: "20px",
background: "#020617",
},

notice: {
padding: "16px",
borderRadius: "12px",
background: "#0f172a",
color: "#cbd5e1",
lineHeight: 1.7,
},

status: {
fontWeight: 700,
color: "#fbbf24",
},
};

export default AccessibilityHub;
