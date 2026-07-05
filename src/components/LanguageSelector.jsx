import { useTranslation } from "react-i18next";

import { useState } from "react";

import {
  SUPPORTED_LANGUAGES,
} from "../config/languages";

function LanguageSelector({
  onLanguageChange,
}) {

  const { i18n } =
    useTranslation();

  const [open, setOpen] =
    useState(false);

  const currentLanguage =
    SUPPORTED_LANGUAGES.find(
      (lang) =>
        lang.code ===
        i18n.language
    ) ||
    SUPPORTED_LANGUAGES[0];
  async function changeLanguage(
  code
) {

  await i18n.changeLanguage(
    code
  );

  localStorage.setItem(
    "inclura-language",
    code
  );

  if (
    typeof onLanguageChange ===
    "function"
  ) {

    await onLanguageChange(
      code
    );

  }

  setOpen(false);

}

return (

  <div
    style={{
      position: "relative",
      display: "inline-block",
    }}
  >

    <button
      onClick={() =>
        setOpen(!open)
      }
      style={{
        background: "#0f172a",
        color: "white",
        border:
          "1px solid #334155",
        borderRadius: "12px",
        padding: "12px 16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontWeight: "600",
      }}
    >

      <span>
        {currentLanguage.flag}
      </span>

      <span>
        {currentLanguage.nativeName}
      </span>

      <span>
        🌐
      </span>

    </button>

    {open && (

      <div
        style={{
          position: "absolute",
          top: "55px",
          right: 0,
          width: "260px",
          maxHeight: "320px",
          overflowY: "auto",
          background: "#0f172a",
          border:
            "1px solid #334155",
          borderRadius: "14px",
          boxShadow:
            "0 8px 24px rgba(0,0,0,.35)",
          zIndex: 1000,
        }}
      >
        {SUPPORTED_LANGUAGES.map(
          (language) => (

            <button
              key={language.code}

              onClick={() =>
                changeLanguage(
                  language.code
                )
              }

              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 18px",
                background:
                  i18n.language ===
                  language.code
                    ? "#1e3a8a"
                    : "transparent",
                color: "white",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "15px",
              }}
            >

              <span
                style={{
                  fontSize: "20px",
                }}
              >
                {language.flag}
              </span>

              <div>

                <div
                  style={{
                    fontWeight: "700",
                  }}
                >
                  {language.nativeName}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                  }}
                >
                  {language.name}
                </div>

              </div>

            </button>

          )
        )}

      </div>

    )}

  </div>

);

}

export default LanguageSelector;
