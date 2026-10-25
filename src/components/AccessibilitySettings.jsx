
import { useAccessibility } from "../context/AccessibilityProvider";

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

    accessibilityNeeds,

    saveStatus,
    saveMessage,
  } = useAccessibility();

  const row = {
    marginBottom: "20px",
  };

  const label = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "700",
  };

  const selectStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "white",
    boxSizing: "border-box",
  };

  const checkboxRow = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 0",
  };

  const normalizedNeeds = Array.isArray(accessibilityNeeds)
    ? accessibilityNeeds.map((need) =>
        String(need).toLowerCase()
      )
    : [];

  const hasNeed = (...keywords) =>
    normalizedNeeds.some((need) =>
      keywords.some((keyword) =>
        need.includes(keyword)
      )
    );

  const profileOptions = [
    {
      label: "Blind / Visual Impairment",
      checked: hasNeed(
        "blind",
        "visual",
        "low vision"
      ),
    },
    {
      label: "Deaf / Hearing Impairment",
      checked: hasNeed(
        "deaf",
        "hearing",
        "hard of hearing"
      ),
    },
    {
      label: "Wheelchair / Mobility Impairment",
      checked: hasNeed(
        "wheelchair",
        "mobility"
      ),
    },
    {
      label: "Speech Impairment / Non-Verbal",
      checked: hasNeed(
        "speech",
        "non-verbal",
        "nonverbal"
      ),
    },
    {
      label: "Dyslexia",
      checked: hasNeed("dyslexia"),
    },
    {
      label: "ADHD",
      checked: hasNeed("adhd"),
    },
    {
      label: "Autism / Neurodivergence",
      checked: hasNeed(
        "autism",
        "neurodivergent",
        "neurodivers"
      ),
    },
  ];

  const saveStatusStyle = {
    marginBottom: "22px",
    padding: "12px 14px",
    borderRadius: "10px",
    fontSize: "14px",
    lineHeight: "1.5",
    overflowWrap: "anywhere",
    background:
      saveStatus === "error"
        ? "#451a1a"
        : saveStatus === "saved"
        ? "#14352a"
        : "#1e293b",
    color:
      saveStatus === "error"
        ? "#fecaca"
        : saveStatus === "saved"
        ? "#bbf7d0"
        : "#cbd5e1",
    border:
      saveStatus === "error"
        ? "1px solid #991b1b"
        : saveStatus === "saved"
        ? "1px solid #166534"
        : "1px solid #334155",
  };

  return (
    <div
      style={{
        padding: "20px",
        color: "white",
      }}
    >
      {/* Save Status */}

      {saveMessage && (
        <div
          role="status"
          aria-live="polite"
          style={saveStatusStyle}
        >
          <strong>
            {saveStatus === "saving"
              ? "Saving…"
              : saveStatus === "saved"
              ? "Saved"
              : saveStatus === "error"
              ? "Save warning"
              : "Accessibility settings"}
          </strong>

          <div style={{ marginTop: "4px" }}>
            {saveMessage}
          </div>
        </div>
      )}

      {/* Language */}

      <div style={row}>
        <label
          htmlFor="accessibility-language"
          style={label}
        >
          🌍 Language
        </label>

        <select
          id="accessibility-language"
          value={language}
          onChange={(e) =>
            setLanguage(e.target.value)
          }
          style={selectStyle}
          aria-label="Select language"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="pt">Português</option>
          <option value="ar">العربية</option>
          <option value="zh">简体中文</option>
          <option value="zh-TW">繁體中文</option>
          <option value="ja">日本語</option>
          <option value="de">Deutsch</option>
          <option value="hi">हिन्दी</option>
          <option value="ru">Русский</option>
          <option value="it">Italiano</option>
          <option value="nl">Nederlands</option>
          <option value="sw">Kiswahili</option>
          <option value="yo">Yorùbá</option>
          <option value="ig">Igbo</option>
          <option value="ha">Hausa</option>
          <option value="pcm">Nigerian Pidgin</option>
          <option value="ko">한국어</option>
          <option value="vi">Tiếng Việt</option>
          <option value="th">ไทย</option>
          <option value="id">Bahasa Indonesia</option>
          <option value="ms">Bahasa Melayu</option>
          <option value="bn">বাংলা</option>
          <option value="tr">Türkçe</option>
        </select>
      </div>

      {/* Font Size */}

      <div style={row}>
        <label
          htmlFor="accessibility-font-scale"
          style={label}
        >
          🔍 Font Size
        </label>

        <input
          id="accessibility-font-scale"
          type="range"
          min="0.8"
          max="1.6"
          step="0.1"
          value={fontScale}
          onChange={(e) =>
            setFontScale(Number(e.target.value))
          }
          style={{ width: "100%" }}
          aria-label="Font size"
        />

        <p aria-live="polite">
          {fontScale.toFixed(1)}x
        </p>
      </div>

      {/* High Contrast */}

      <div style={row}>
        <label
          htmlFor="accessibility-high-contrast"
          style={label}
        >
          🌗 High Contrast
        </label>

        <input
          id="accessibility-high-contrast"
          type="checkbox"
          checked={highContrast}
          onChange={(e) =>
            setHighContrast(e.target.checked)
          }
          aria-label="High contrast"
        />
      </div>

      {/* Reduce Motion */}

      <div style={row}>
        <label
          htmlFor="accessibility-reduced-motion"
          style={label}
        >
          🎞 Reduce Motion
        </label>

        <input
          id="accessibility-reduced-motion"
          type="checkbox"
          checked={reducedMotion}
          onChange={(e) =>
            setReducedMotion(e.target.checked)
          }
          aria-label="Reduce motion"
        />
      </div>

      {/* Voice Guidance */}

      <div style={row}>
        <label
          htmlFor="accessibility-voice-guidance"
          style={label}
        >
          🔊 Voice Guidance
        </label>

        <input
          id="accessibility-voice-guidance"
          type="checkbox"
          checked={voiceEnabled}
          onChange={(e) =>
            setVoiceEnabled(e.target.checked)
          }
          aria-label="Voice guidance"
        />
      </div>

      <hr
        style={{
          border: "1px solid #334155",
          margin: "25px 0",
        }}
      />

      {/* Accessibility Profile */}

      <h3 style={{ marginBottom: "8px" }}>
        ♿ Accessibility Profile
      </h3>

      <p
        style={{
          color: "#94a3b8",
          fontSize: "14px",
          marginBottom: "18px",
          lineHeight: "1.5",
        }}
      >
        Your saved accessibility needs are shown below.
        These settings help Inclura personalize communication,
        media, navigation, translation, and accessibility features.
      </p>

      <div
        style={{
          display: "grid",
          gap: "4px",
        }}
      >
        {profileOptions.map((item) => (
          <label
            key={item.label}
            style={checkboxRow}
          >
            <input
              type="checkbox"
              checked={item.checked}
              disabled
              readOnly
              aria-label={item.label}
            />

            <span>{item.label}</span>
          </label>
        ))}
      </div>

      {/* Profile Source Notice */}

      <div
        style={{
          marginTop: "20px",
          padding: "14px",
          background: "#1e293b",
          borderRadius: "12px",
          fontSize: "14px",
          color: "#cbd5e1",
          lineHeight: "1.5",
        }}
      >
        <strong>Profile needs</strong>

        <p style={{ marginBottom: 0 }}>
          Accessibility needs are managed from your Inclura
          profile. This panel displays the needs currently
          saved to your account.
        </p>
      </div>

      {/* Accessibility Roadmap */}

      <div
        style={{
          marginTop: "16px",
          padding: "14px",
          background: "#172033",
          borderRadius: "12px",
          fontSize: "13px",
          color: "#94a3b8",
          lineHeight: "1.5",
        }}
      >
        <strong style={{ color: "#e2e8f0" }}>
          Inclura accessibility
        </strong>

        <p style={{ marginBottom: 0 }}>
          Your accessibility profile will guide features such
          as screen reader support, read-aloud, speech-to-text,
          text-to-speech, captions and transcripts, accessible
          media, sign-language communication, and Braille
          terminology. Availability depends on which features
          have been implemented and enabled.
        </p>
      </div>
    </div>
  );
}

export default AccessibilitySettings;
