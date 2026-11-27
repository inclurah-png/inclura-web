
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";

import {
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../firebase";

import {
  getAuthErrorInfo,
} from "../services/authErrorMessages";

function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] =
    useState("");

  const [notice, setNotice] =
    useState(null);

  async function handleReset() {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setNotice({
        kind: "error",
        message:
          t("enterEmailForAccount"),
      });
      return;
    }

    try {
      setNotice(null);

      await sendPasswordResetEmail(
        auth,
        cleanEmail
      );

      setNotice({
        kind: "success",
        message:
          t("passwordResetEmailSent"),
      });
    } catch (resetError) {
      console.error(
        "Password reset error:",
        resetError
      );

      setNotice({
        kind: "error",
        message:
          getAuthErrorInfo(
            resetError
          ).message,
      });
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#020617",
        color: "white",
      }}
    >
      <div style={{ position: "fixed", top: "12px", right: "12px", zIndex: 10000 }}>
        <LanguageSelector />
      </div>

      <div
        style={{
          width: "400px",
          background: "#0f172a",
          padding: "30px",
          borderRadius: "20px",
        }}
      >
        <h2>
          {t("resetPassword")}
        </h2>

        {notice && (
          <p
            role="alert"
            style={{
              marginTop: "16px",
              padding: "12px 14px",
              borderRadius: "10px",
              fontSize: "14px",
              lineHeight: "1.45",
              background:
                notice.kind === "success"
                  ? "#052e16"
                  : "#450a0a",
              border:
                notice.kind === "success"
                  ? "1px solid #166534"
                  : "1px solid #7f1d1d",
              color:
                notice.kind === "success"
                  ? "#bbf7d0"
                  : "#fecaca",
            }}
          >
            {notice.message}
          </p>
        )}

        <input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            borderRadius: "10px",
          }}
        />

        <button
          onClick={handleReset}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "10px",
            background: "#38bdf8",
            color: "white",
          }}
        >
          {t("sendResetLink")}
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
