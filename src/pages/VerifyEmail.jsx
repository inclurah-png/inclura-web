import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { reload, sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "../firebase";
import LanguageSelector from "../components/LanguageSelector";

function VerifyEmail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(auth.currentUser?.email || "");
  const [message, setMessage] = useState(t("verificationPending"));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) navigate("/login", { replace: true });
    else setEmail(auth.currentUser.email || "");
  }, [navigate]);

  async function checkVerification() {
    if (!auth.currentUser) return navigate("/login");
    setBusy(true);
    try {
      await reload(auth.currentUser);
      if (auth.currentUser.emailVerified) {
        navigate("/onboarding", { replace: true });
      } else {
        setMessage(t("verificationNotYet"));
      }
    } catch (error) {
      setMessage(error.message || t("verificationCheckError"));
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    if (!auth.currentUser) return navigate("/login");
    setBusy(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setMessage(t("verificationEmailResent"));
    } catch (error) {
      setMessage(error.code === "auth/too-many-requests"
        ? t("verificationWait")
        : (error.message || t("verificationSendError")));
    } finally {
      setBusy(false);
    }
  }

  async function useAnotherAccount() {
    await signOut(auth);
    navigate("/login", { replace: true });
  }

  return (
    <main style={{ minHeight: "100vh", background: "#020617", color: "white", display: "grid", placeItems: "center", padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "fixed", top: "12px", right: "12px", zIndex: 10000 }}>
        <LanguageSelector />
      </div>

      <section style={{ width: "100%", maxWidth: "480px", background: "#0f172a", border: "1px solid #1e3a8a", borderRadius: "24px", padding: "28px", boxSizing: "border-box" }}>
        <div style={{ fontSize: "38px", marginBottom: "12px" }}>✉️</div>
        <h1 style={{ fontSize: "28px", margin: "0 0 12px" }}>{t("verifyEmail")}</h1>
        <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>{t("verifyEmailIntro")} <strong>{email}</strong>. {t("verificationProtection")}</p>
        <p role="status" aria-live="polite" style={{ background: "#172554", color: "#dbeafe", padding: "12px", borderRadius: "12px", lineHeight: 1.5 }}>{message}</p>
        <button onClick={checkVerification} disabled={busy} style={actionStyle}>{busy ? t("checking") : t("verifiedEmail")}</button>
        <button onClick={resend} disabled={busy} style={secondaryStyle}>{t("resendVerification")}</button>
        <button onClick={useAnotherAccount} disabled={busy} style={{ ...secondaryStyle, border: "none" }}>{t("useAnotherAccount")}</button>
        <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.5 }}>{t("verificationSpamHint")} <Link to="/login" style={{ color: "#5eead4" }}>{t("returnToSignIn")}</Link>.</p>
      </section>
    </main>
  );
}

const actionStyle = { width: "100%", padding: "15px", border: "none", borderRadius: "12px", background: "#0f766e", color: "white", fontWeight: "700", fontSize: "16px", margin: "8px 0", cursor: "pointer" };
const secondaryStyle = { width: "100%", padding: "13px", border: "1px solid #334155", borderRadius: "12px", background: "#1e293b", color: "white", fontWeight: "600", margin: "6px 0", cursor: "pointer" };

export default VerifyEmail;
