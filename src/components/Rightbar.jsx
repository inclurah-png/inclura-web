import { useTranslation } from "react-i18next";
import ProfileCard from "./ProfileCard";

function Rightbar() {
  const { t } = useTranslation();

  return (
    <aside
      aria-label={t("communitySidebarLabel")}
      style={{
        width: "100%",\n        maxWidth: "100%",\n        boxSizing: "border-box",
        padding: "24px",
        borderTop: "1px solid #1e293b",\n        borderLeft: "none",
        background: "#020617",
      }}
    >
      <ProfileCard />

      <section
        aria-labelledby="trending-heading"
        style={{
          background: "#0f172a",
          padding: "20px",
          borderRadius: "20px",
          marginBottom: "24px",
        }}
      >
        <h3 id="trending-heading" style={{ marginBottom: "16px" }}>
          {t("communityTrending")}
        </h3>
        <p>#Accessibility</p>
        <p>#Inclusion</p>
        <p>#AI</p>
        <p>#Creators</p>
      </section>

      <section
        aria-labelledby="suggested-connections-heading"
        style={{
          background: "#0f172a",
          padding: "20px",
          borderRadius: "20px",
        }}
      >
        <h3 id="suggested-connections-heading" style={{ marginBottom: "16px" }}>
          {t("communitySuggestedConnections")}
        </h3>
        <ul aria-label={t("communitySuggestedConnections")} style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li><p>👤 Jane Doe</p></li>
          <li><p>👤 Michael Smith</p></li>
          <li><p>👤 Sophia Lee</p></li>
        </ul>
      </section>
    </aside>
  );
}

export default Rightbar;
