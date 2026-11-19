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

  const topics = [
    t("communityTagAccessibility"),
    t("communityTagInclusion"),
    t("communityTagAI"),
    t("communityTagCreators"),
  ];

  const suggestedPeople = ["Jane Doe", "Michael Smith", "Sophia Lee"];

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
          <span aria-hidden="true">🔥 </span>{t("communityTrending")}
        </h3>
        <ul aria-label={t("communityTrending")} style={listStyle}>
          {topics.map((topic) => (
            <li key={topic} style={listItemStyle}>{topic}</li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="suggested-connections-heading"
        style={{ ...panel, marginBottom: 0 }}
      >
        <h3 id="suggested-connections-heading" style={{ marginTop: 0, marginBottom: "14px" }}>
          <span aria-hidden="true">🤝 </span>{t("communitySuggestedConnections")}
        </h3>
        <ul aria-label={t("communitySuggestedConnections")} style={listStyle}>
          {suggestedPeople.map((person) => (
            <li key={person} style={listItemStyle}>
              <span aria-hidden="true">👤 </span>{person}
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

const listStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const listItemStyle = {
  padding: "7px 0",
  lineHeight: 1.5,
};

export default Rightbar;
