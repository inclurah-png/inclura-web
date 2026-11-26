import { useAccessibility } from "../context/AccessibilityProvider";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../config/languages";

const LANGUAGE_OPTIONS = SUPPORTED_LANGUAGES.map((language) => ({ value: language.code, label: language.nativeName }));

const PROFILE_OPTIONS = [
  { key: "blind", labelKey: "blindness" },
  { key: "lowVision", labelKey: "lowVision" },
  { key: "deaf", labelKey: "deafness" },
  { key: "hardOfHearing", labelKey: "hardOfHearing" },
  { key: "wheelchair", labelKey: "wheelchairUser" },
  { key: "motorImpaired", labelKey: "mobilityImpairment" },
  { key: "speechImpairment", labelKey: "speechImpairment" },
  { key: "dyslexia", labelKey: "dyslexia" },
  { key: "adhd", labelKey: "adhd" },
  { key: "autism", labelKey: "autism" },
  { key: "colorBlind", labelKey: "colorBlindSupport" },
  { key: "screenReader", labelKey: "screenReader" },
  { key: "braille", labelKey: "braille" },
  { key: "voiceNavigation", labelKey: "voiceNavigation" },
  { key: "keyboardNavigation", labelKey: "keyboardNavigation" },
  { key: "captions", labelKey: "captions" },
  { key: "signLanguage", labelKey: "signLanguage" },
];

function SettingRow({ label, description, children, controlId }) {
  return (
    <div
      style={{
        padding: "12px 0",
        borderBottom: "1px solid #334155",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {controlId ? (
            <label
              htmlFor={controlId}
              style={{
                minHeight: "44px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                color: "inherit",
              }}
            >
              {label}
              {description && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#cbd5e1",
                    marginTop: "4px",
                    lineHeight: 1.5,
                    fontWeight: 400,
                  }}
                >
                  {description}
                </span>
              )}
            </label>
          ) : (
            <>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "inherit" }}>
                {label}
              </div>
              {description && (
                <div style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "4px", lineHeight: 1.5 }}>
                  {description}
                </div>
              )}
            </>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

function AccessibilitySettings() {
  const { t } = useTranslation();
  const {
    language,
    setLanguage,
    fontScale,
    setFontScale,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    voiceEnabled,
    setVoiceEnabled,
    effectiveVoiceEnabled,
    speaking,
    speechSupported,
    speakText,
    stopSpeaking,
    accessibilityProfile,
    setAccessibilityProfile,
    saveStatus,
    saveMessage,
  } = useAccessibility();

  const selectStyle = {
    width: "100%",
    boxSizing: "border-box",
    marginTop: "8px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #64748b",
    background: highContrast ? "#000000" : "#1e293b",
    color: "#ffffff",
    fontSize: "14px",
  };

  const checkboxStyle = {
    width: "24px",
    height: "24px",
    flexShrink: 0,
    cursor: "pointer",
    accentColor: "#38bdf8",
  };

  return (
    <div
      style={{
        padding: "16px",
        background: highContrast ? "#000000" : "#0f172a",
        color: "#ffffff",
      }}
    >
      <section aria-labelledby="accessibility-display-heading">
        <h3
          id="accessibility-display-heading"
          style={{ fontSize: "16px", margin: "0 0 8px" }}
        >
          {t("accessibilityDisplayLanguage")}
        </h3>

        <div style={{ padding: "12px 0" }}>
          <label
            htmlFor="accessibility-language"
            style={{ fontSize: "14px", fontWeight: 600 }}
          >
            {t("preferredLanguage")}
          </label>

          <select
            id="accessibility-language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            style={selectStyle}
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} lang={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <SettingRow
          label={t("textSize")}
          description={`Current scale: ${Math.round(fontScale * 100)}%`}
        >
          <span style={{ fontSize: "13px", whiteSpace: "nowrap" }}>
            {Math.round(fontScale * 100)}%
          </span>
        </SettingRow>

        <input
          type="range"
          aria-label={t("textSize")}
          min="0.8"
          max="1.6"
          step="0.1"
          value={fontScale}
          onChange={(event) => setFontScale(Number(event.target.value))}
          style={{ width: "100%", margin: "12px 0" }}
        />

        <SettingRow
          controlId="inclura-high-contrast"
          label={t("highContrast")}
          description={t("highContrastDesc")}
        >
          <input
            id="inclura-high-contrast"
            type="checkbox"
            aria-label={t("highContrast")}
            checked={highContrast}
            onChange={(event) => setHighContrast(event.target.checked)}
            style={checkboxStyle}
          />
        </SettingRow>

        <SettingRow
          controlId="inclura-reduced-motion"
          label={t("reduceMotion")}
          description={t("reduceMotionDesc")}
        >
          <input
            id="inclura-reduced-motion"
            type="checkbox"
            aria-label={t("reduceMotion")}
            checked={reducedMotion}
            onChange={(event) => setReducedMotion(event.target.checked)}
            style={checkboxStyle}
          />
        </SettingRow>
      </section>

      <section
        aria-labelledby="accessibility-voice-heading"
        style={{ marginTop: "24px" }}
      >
        <h3
          id="accessibility-voice-heading"
          style={{ fontSize: "16px", margin: "0 0 8px" }}
        >
          {t("voiceGuidance")}
        </h3>

        <SettingRow
          controlId="inclura-voice-guidance"
          label={t("enableVoiceGuidance")}
          description={t("voiceGuidanceDesc")}
        >
          <input
            id="inclura-voice-guidance"
            type="checkbox"
            aria-label={t("enableVoiceGuidance")}
            checked={voiceEnabled}
            onChange={(event) => setVoiceEnabled(event.target.checked)}
            style={checkboxStyle}
          />
        </SettingRow>

        {effectiveVoiceEnabled && (
          <p style={{ fontSize: "12px", color: "#cbd5e1" }}>{t("voiceGuidanceActive")}</p>
        )}

        {speechSupported ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "12px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                speakText(
                  t("voiceGuidance"),
                  { language }
                )
              }
              style={buttonStyle}
            >
              {t("testVoice")}
            </button>

            {speaking && (
              <button
                type="button"
                onClick={stopSpeaking}
                style={buttonStyle}
              >
                {t("stopSpeaking")}
              </button>
            )}
          </div>
        ) : (
          <p style={{ fontSize: "12px", color: "#cbd5e1" }}>
            {t("speechUnsupported")}
          </p>
        )}
      </section>

      <section
        aria-labelledby="accessibility-profile-heading"
        style={{ marginTop: "24px" }}
      >
        <h3
          id="accessibility-profile-heading"
          style={{ fontSize: "16px", margin: "0 0 8px" }}
        >
          {t("accessibilityProfile")}
        </h3>

        <p style={{ fontSize: "12px", color: "#cbd5e1" }}>
          {t("accessibilityProfileDesc")}
        </p>
        <p style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: 1.5, marginTop: "8px" }}>
          {t("accessibilityProfileLimitations")}
        </p>

        {PROFILE_OPTIONS.map((option) => (
          <SettingRow key={option.key} controlId={`inclura-accessibility-${option.key}`} label={t(option.labelKey)}>
            <input
              id={`inclura-accessibility-${option.key}`}
              type="checkbox"
              aria-label={t(option.labelKey)}
              checked={Boolean(accessibilityProfile[option.key])}
              onChange={(event) => {
                void setAccessibilityProfile({
                  [option.key]: event.target.checked,
                });
              }}
              style={checkboxStyle}
            />
          </SettingRow>
        ))}
      </section>

      <div
        role="status"
        aria-live="polite"
        style={{
          marginTop: "20px",
          padding: "12px",
          borderRadius: "8px",
          background: highContrast ? "#111111" : "#1e293b",
          border: "1px solid #475569",
          fontSize: "12px",
          overflowWrap: "anywhere",
        }}
      >
        {saveStatus === "saving"
          ? t("savingAccessibility")
          : saveMessage ||
            t("accessibilitySavedFallback")}
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "9px 12px",
  borderRadius: "8px",
  border: "1px solid #64748b",
  background: "#1e293b",
  color: "#ffffff",
  cursor: "pointer",
  fontSize: "13px",
};

export default AccessibilitySettings;
