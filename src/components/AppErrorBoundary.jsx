import React from "react";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Inclura application render failure:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main role="alert" aria-live="assertive" style={{ minHeight: "100vh", padding: "32px 20px", display: "grid", placeContent: "center", background: "#020617", color: "#fff", fontFamily: "Arial, sans-serif" }}>
          <section style={{ maxWidth: "520px", textAlign: "center" }}>
            <h1 style={{ color: "#38bdf8", fontSize: "30px", marginBottom: "16px" }}>Inclura could not finish loading</h1>
            <p style={{ lineHeight: 1.6, marginBottom: "22px" }}>The page encountered an unexpected startup error. Your account and saved content have not been changed by this message.</p>
            <button type="button" onClick={() => window.location.reload()} style={{ padding: "13px 22px", border: 0, borderRadius: "8px", background: "#d4af37", color: "#07111f", fontWeight: 700, fontSize: "16px", cursor: "pointer" }}>Try loading again</button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
