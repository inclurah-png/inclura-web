import { useTranslation } from "react-i18next";

function CommunityHighlights() {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="community-highlights-heading"
      style={{
        background: "#1e293b",
        padding: "18px",
        borderRadius: "18px",
        marginBottom: "16px",
      }}
    >
      <h2 id="community-highlights-heading">
        🌟 {t("communityHighlightsTitle")}
      </h2>
      <p>{t("communityHighlightsDescription")}</p>
    </section>
  );
}

export default CommunityHighlights;
