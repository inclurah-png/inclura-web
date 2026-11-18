import React from "react";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, diagnostic: "" };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const message =
      error?.message ||
      error?.toString?.() ||
      "Unknown application rendering error";
    const component =
      errorInfo?.componentStack ||
      "Component details unavailable";

    console.error("Inclura application render failure:", error, errorInfo);
    this.setState({
      diagnostic: `${message}\n\nComponent trace:\n${component}`,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <main role="alert" aria-live="assertive" style={{ minHeight: "100vh", padding: "24px 16px", display: "grid", placeContent: "center", background: "#020617", color: "#fff", fontFamily: "Arial, sans-serif" }}>
          <section style={{ maxWidth: "620px", width: "100%", textAlign: "center" }}>
            <h1 style={{ color: "#38bdf8", fontSize: "28px", marginBottom: "16px" }}>Inclura could not finish loading</h1>
            <p style={{ lineHeight: 1.6, marginBottom: "18px" }}>A page component encountered an error. Your saved account information and content are not changed by this error screen.</p>
            <details style={{ textAlign: "left", background: "#0f172a", padding: "14px", borderRadius: "10px", marginBottom: "18px" }}>
              <summary style={{ cursor: "pointer", color: "#fbbf24", fontWeight: 700 }}>View error details for support</summary>
              <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontSize: "12px", color: "#cbd5e1", maxHeight: "260px", overflow: "auto" }}>{this.state.diagnostic || "Error details are being prepared."}</pre>
            </details>
            <button type="button" onClick={() => window.location.reload()} style={{ padding: "13px 22px", border: 0, borderRadius: "8px", background: "#d4af37", color: "#07111f", fontWeight: 700, fontSize: "16px", cursor: "pointer" }}>Try loading again</button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
