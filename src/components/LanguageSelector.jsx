import { useTranslation } from "react-i18next";
import { useAccessibility } from "../context/AccessibilityProvider";
import { SUPPORTED_LANGUAGES } from "../config/languages";

function LanguageSelector({ onLanguageChange }) {
  const { i18n } = useTranslation();
  const { setLanguage } = useAccessibility();

  const currentLanguage =
    SUPPORTED_LANGUAGES.find(
      (language) =>
        language.code === i18n.resolvedLanguage ||
        language.code === i18n.language
    ) || SUPPORTED_LANGUAGES[0];

  async function changeLanguage(code) {
    setLanguage(code);

    if (typeof onLanguageChange === "function") {
      await onLanguageChange(code);
    }
  }

  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        maxWidth: "100%",
      }}
    >
      <span
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {i18n.t("language")}
      </span>

      <select
        aria-label={i18n.t("language")}
        value={currentLanguage.code}
        onChange={(event) => changeLanguage(event.target.value)}
        style={{
          minHeight: "44px",
          maxWidth: "100%",
          boxSizing: "border-box",
          background: "#0f172a",
          color: "white",
          border: "1px solid #64748b",
          borderRadius: "12px",
          padding: "10px 14px",
          cursor: "pointer",
          font: "inherit",
        }}
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <option
            key={language.code}
            value={language.code}
            lang={language.code}
            dir={language.direction}
          >
            {language.flag} {language.nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}

export default LanguageSelector;
