import { useTranslation } from "react-i18next";

function Rightbar() {
  const { t } = useTranslation();

  const panel = {
    background: "#0f172a",
    padding: "20px",
    borderRadius: "20px",
    marginBottom: "16px",
    border: "1px solid #1e293b",
    color: "white",
  };

  return (
    <aside
      aria-label={t("communitySidebarLabel")}
      style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        padding: "0",
        marginBottom: "24px",
        background: "transparent",
      }}
    >
      <section aria-labelledby="trending-heading" style={panel}>
        <h3 id="trending-heading" style={{ marginTop: 0, marginBottom: "14px" }}>
          🔥 {t("communityTrending")}
        </h3>
        <p>#Accessibility</p>
        <p>#Inclusion</p>
        <p>#AI</p>
        <p style={{ marginBottom: 0 }}>#Creators</p>
      </section>

      <section aria-labelledby="suggested-connections-heading" style={{ ...panel, marginBottom: 0 }}>
        <h3 id="suggested-connections-heading" style={{ marginTop: 0, marginBottom: "14px" }}>
          🤝 {t("communitySuggestedConnections")}
        </h3>
        <ul
          aria-label={t("communitySuggestedConnections")}
          style={{ listStyle: "none", padding: 0, margin: 0 }}
        >
          <li><p>👤 Jane Doe</p></li>
          <li><p>👤 Michael Smith</p></li>
          <li><p style={{ marginBottom: 0 }}>👤 Sophia Lee</p></li>
        </ul>
      </section>
    </aside>
  );
}

export default Rightbar;
