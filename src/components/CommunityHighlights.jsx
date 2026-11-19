import { useTranslation } from "react-i18next";

function CommunityHighlights() {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="community-highlights-heading"
      aria-describedby="community-highlights-description"
      style={{
        background: "#1e293b",
        padding: "18px",
        borderRadius: "18px",
        marginBottom: "16px",
      }}
    >
      <h2 id="community-highlights-heading">
        <span aria-hidden="true">🌟 </span>{t("communityHighlightsTitle")}
      </h2>
      <p id="community-highlights-description">
        {t("communityHighlightsDescription")}
      </p>
    </section>
  );
}

export default CommunityHighlights;
