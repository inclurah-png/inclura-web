import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import AccessibilitySettings from "../components/AccessibilitySettings";

function AccessibilityHub() {
const [activeSection, setActiveSection] =
useState("settings");

const sections = [
{
id: "settings",
icon: "⚙️",
title: "Accessibility Settings",
description:
"Adjust language, text size, contrast, motion, and voice guidance.",
},
{
id: "requests",
icon: "🆘",
title: "Accessibility Requests",
description:
"A dedicated place for accessibility assistance requests.",
status: "Not yet connected",
},
{
id: "resources",
icon: "📚",
title: "Accessibility Resources",
description:
"A future collection of guides and practical accessibility resources.",
status: "Resources not yet connected",
},
{
id: "directory",
icon: "🏢",
title: "Accessibility Directory",
description:
"A future directory of accessible services and organizations.",
status: "Directory not yet connected",
},
{
id: "community",
icon: "🤝",
title: "Community Support",
description:
"A future space for accessibility-focused community support.",
status: "Community feature not yet connected",
},
{
id: "emergency",
icon: "🚨",
title: "Emergency Accessibility Help",
description:
"Emergency assistance needs a verified contact and dispatch workflow before it can be activated.",
status: "Emergency workflow not yet connected",
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
♿ Accessibility Hub
</h1>

      <p style={styles.intro}>
        Explore accessibility settings and support
        services designed to make Inclura easier to use.
      </p>
    </header>

    <nav
      aria-label="Accessibility Hub sections"
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
        {activeItem?.title}
      </h2>

      {activeSection === "settings" ? (
        <AccessibilitySettings />
      ) : (
        <div style={styles.notice}>
          <p>{activeItem?.description}</p>

          <p style={styles.status}>
            {activeItem?.status}
          </p>

          {activeSection === "emergency" && (
            <p>
              If someone is in immediate danger,
              contact the appropriate local emergency
              service directly. This Inclura section
              does not dispatch emergency assistance.
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
