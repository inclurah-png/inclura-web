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
  };
  return (
    <div
      style={{
        padding: "20px",
        color: "white",
      }}
    >
      {/* Language */}

      <div style={row}>
        <label style={label}>
          🌍 Language
        </label>

        <select
          value={language}
          onChange={(e) =>
            setLanguage(
              e.target.value
            )
          }
          style={selectStyle}
        >
          <option value="en">
            English
          </option>

          <option value="fr">
            Français
          </option>

          <option value="es">
            Español
          </option>

          <option value="ar">
            العربية
          </option>

          <option value="yo">
            Yoruba
          </option>

          <option value="ig">
            Igbo
          </option>

          <option value="ha">
            Hausa
          </option>
        </select>
      </div>

      {/* Font Size */}

      <div style={row}>
        <label style={label}>
          🔍 Font Size
        </label>

        <input
          type="range"
          min="0.8"
          max="1.6"
          step="0.1"
          value={fontScale}
          onChange={(e) =>
            setFontScale(
              Number(
                e.target.value
              )
            )
          }
          style={{
            width: "100%",
          }}
        />

        <p>
          {fontScale.toFixed(1)}x
        </p>
      </div>

      {/* High Contrast */}

      <div style={row}>
        <label style={label}>
          🌗 High Contrast
        </label>

        <input
          type="checkbox"
          checked={highContrast}
          onChange={(e) =>
            setHighContrast(
              e.target.checked
            )
          }
        />
      </div>

      {/* Reduce Motion */}

      <div style={row}>
        <label style={label}>
          🎞 Reduce Motion
        </label>

        <input
          type="checkbox"
          checked={reducedMotion}
          onChange={(e) =>
            setReducedMotion(
              e.target.checked
            )
          }
        />
      </div>

      {/* Voice Guidance */}

      <div style={row}>
        <label style={label}>
          🔊 Voice Guidance
        </label>

        <input
          type="checkbox"
          checked={voiceEnabled}
          onChange={(e) =>
            setVoiceEnabled(
              e.target.checked
            )
          }
        />
        </div>
      <hr
        style={{
          border: "1px solid #334155",
          margin: "25px 0",
        }}
      />

      <h3
        style={{
          marginBottom: "16px",
        }}
      >
        ♿ Accessibility Profile
      </h3>

      <p
        style={{
          color: "#94a3b8",
          fontSize: "14px",
          marginBottom: "18px",
        }}
      >
        These options will later synchronize with
        your Inclura profile to personalize your
        experience.
      </p>

      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >
        {[
          "Blind",
          "Low Vision",
          "Deaf",
          "Hard of Hearing",
          "Wheelchair",
          "Dyslexia",
          "ADHD",
          "Autism",
        ].map((item) => (
          <label
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <input
              type="checkbox"
              disabled
            />

            {item}
          </label>
        ))}
      </div>

      <div
        style={{
          marginTop: "24px",
          padding: "14px",
          background: "#1e293b",
          borderRadius: "12px",
          fontSize: "14px",
          color: "#94a3b8",
        }}
      >
        🚧 Profile synchronization, AI assistance,
        captions, OCR, multilingual translation,
        and voice navigation will be connected in
        later phases.
      </div>
    </div>
  );
}

export default AccessibilitySettings;
        
