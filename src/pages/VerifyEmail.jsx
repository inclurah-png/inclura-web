import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { reload, sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "../firebase";

function VerifyEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(auth.currentUser?.email || "");
  const [message, setMessage] = useState("Check your inbox and verify your email address before entering Inclura.");
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
        setMessage("Your email is not verified yet. Open the verification link in your inbox, then check again.");
      }
    } catch (error) {
      setMessage(error.message || "We could not check verification yet. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    if (!auth.currentUser) return navigate("/login");
    setBusy(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setMessage("A new verification email has been sent. Check your inbox and spam folder.");
    } catch (error) {
      setMessage(error.code === "auth/too-many-requests"
        ? "For security, please wait before requesting another email."
        : (error.message || "We could not send the email. Please try again later."));
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
      <section style={{ width: "100%", maxWidth: "480px", background: "#0f172a", border: "1px solid #1e3a8a", borderRadius: "24px", padding: "28px", boxSizing: "border-box" }}>
        <div style={{ fontSize: "38px", marginBottom: "12px" }}>✉️</div>
        <h1 style={{ fontSize: "28px", margin: "0 0 12px" }}>Verify your email</h1>
        <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>We sent a verification link to <strong>{email}</strong>. This helps protect members from impersonation and throwaway email accounts.</p>
        <p role="status" aria-live="polite" style={{ background: "#172554", color: "#dbeafe", padding: "12px", borderRadius: "12px", lineHeight: 1.5 }}>{message}</p>
        <button onClick={checkVerification} disabled={busy} style={actionStyle}>{busy ? "Checking…" : "I have verified my email"}</button>
        <button onClick={resend} disabled={busy} style={secondaryStyle}>Resend verification email</button>
        <button onClick={useAnotherAccount} disabled={busy} style={{ ...secondaryStyle, border: "none" }}>Use another account</button>
        <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.5 }}>If you do not see the message, check your spam or junk folder. You can also <Link to="/login" style={{ color: "#5eead4" }}>return to sign in</Link>.</p>
      </section>
    </main>
  );
}

const actionStyle = { width: "100%", padding: "15px", border: "none", borderRadius: "12px", background: "#0f766e", color: "white", fontWeight: "700", fontSize: "16px", margin: "8px 0", cursor: "pointer" };
const secondaryStyle = { width: "100%", padding: "13px", border: "1px solid #334155", borderRadius: "12px", background: "#1e293b", color: "white", fontWeight: "600", margin: "6px 0", cursor: "pointer" };

export default VerifyEmail;
