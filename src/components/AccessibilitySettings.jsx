import { useAccessibility } from "../context/AccessibilityProvider";

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "yo", label: "Yoruba" },
  { value: "ig", label: "Igbo" },
  { value: "ha", label: "Hausa" },
  { value: "pcm", label: "Nigerian Pidgin" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
  { value: "pt", label: "Portuguese" },
  { value: "sw", label: "Swahili" },
  { value: "ar", label: "Arabic" },
  { value: "zh", label: "Chinese (Simplified)" },
  { value: "zh-TW", label: "Chinese (Traditional)" },
  { value: "ja", label: "Japanese" },
  { value: "de", label: "German" },
  { value: "hi", label: "Hindi" },
  { value: "ru", label: "Russian" },
  { value: "it", label: "Italian" },
  { value: "nl", label: "Dutch" },
  { value: "ko", label: "Korean" },
  { value: "vi", label: "Vietnamese" },
  { value: "th", label: "Thai" },
  { value: "id", label: "Indonesian" },
  { value: "ms", label: "Malay" },
  { value: "bn", label: "Bengali" },
  { value: "tr", label: "Turkish" },
];

const PROFILE_OPTIONS = [
  { key: "blind", label: "Blindness" },
  { key: "lowVision", label: "Low vision" },
  { key: "deaf", label: "Deafness" },
  { key: "hardOfHearing", label: "Hard of hearing" },
  { key: "wheelchair", label: "Wheelchair user" },
  { key: "motorImpaired", label: "Mobility impairment" },
  { key: "speechImpairment", label: "Speech impairment" },
  { key: "dyslexia", label: "Dyslexia" },
  { key: "adhd", label: "ADHD" },
  { key: "autism", label: "Autism" },
];

function SettingRow({ label, description, children }) {
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
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "inherit",
            }}
          >
            {label}
          </div>

          {description && (
            <div
              style={{
                fontSize: "12px",
                color: "#cbd5e1",
                marginTop: "4px",
                lineHeight: 1.5,
              }}
            >
              {description}
            </div>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}

function AccessibilitySettings() {
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
    width: "20px",
    height: "20px",
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
        fontSize: `${fontScale}rem`,
      }}
    >
      <section aria-labelledby="accessibility-display-heading">
        <h3
          id="accessibility-display-heading"
          style={{ fontSize: "16px", margin: "0 0 8px" }}
        >
          Display and language
        </h3>

        <div style={{ padding: "12px 0" }}>
          <label
            htmlFor="accessibility-language"
            style={{ fontSize: "14px", fontWeight: 600 }}
          >
            Preferred language
          </label>

          <select
            id="accessibility-language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            style={selectStyle}
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <SettingRow
          label="Text size"
          description={`Current scale: ${Math.round(fontScale * 100)}%`}
        >
          <span style={{ fontSize: "13px", whiteSpace: "nowrap" }}>
            {Math.round(fontScale * 100)}%
          </span>
        </SettingRow>

        <input
          type="range"
          aria-label="Text size"
          min="0.8"
          max="1.6"
          step="0.1"
          value={fontScale}
          onChange={(event) => setFontScale(Number(event.target.value))}
          style={{ width: "100%", margin: "12px 0" }}
        />

        <SettingRow
          label="High contrast"
          description="Use a dark background and bright text."
        >
          <input
            type="checkbox"
            aria-label="Enable high contrast"
            checked={highContrast}
            onChange={(event) => setHighContrast(event.target.checked)}
            style={checkboxStyle}
          />
        </SettingRow>

        <SettingRow
          label="Reduce motion"
          description="Reduce animated transitions where supported."
        >
          <input
            type="checkbox"
            aria-label="Enable reduced motion"
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
          Voice guidance
        </h3>

        <SettingRow
          label="Enable voice guidance"
          description="Enable spoken guidance for supported features."
        >
          <input
            type="checkbox"
            aria-label="Enable voice guidance"
            checked={voiceEnabled}
            onChange={(event) => setVoiceEnabled(event.target.checked)}
            style={checkboxStyle}
          />
        </SettingRow>

        {effectiveVoiceEnabled && (
          <p style={{ fontSize: "12px", color: "#cbd5e1" }}>
            Voice guidance is active because it is enabled or your
            accessibility profile indicates that it may be helpful.
          </p>
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
                  "Welcome to Inclura accessibility settings.",
                  { language }
                )
              }
              style={buttonStyle}
            >
              Test voice
            </button>

            {speaking && (
              <button
                type="button"
                onClick={stopSpeaking}
                style={buttonStyle}
              >
                Stop speaking
              </button>
            )}
          </div>
        ) : (
          <p style={{ fontSize: "12px", color: "#cbd5e1" }}>
            Speech synthesis is not supported by this browser.
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
          Accessibility profile
        </h3>

        <p style={{ fontSize: "12px", color: "#cbd5e1" }}>
          Select any needs you want Inclura to take into account.
        </p>

        {PROFILE_OPTIONS.map((option) => (
          <SettingRow key={option.key} label={option.label}>
            <input
              type="checkbox"
              aria-label={option.label}
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
          ? "Saving accessibility settings…"
          : saveMessage ||
            "Changes take effect immediately. Save status will appear here."}
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
