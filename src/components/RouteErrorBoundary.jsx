import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

class RouteErrorBoundaryInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "", componentTrace: "" };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const message =
      error?.message || "An unexpected page error occurred.";
    const componentTrace =
      errorInfo?.componentStack || "Component trace unavailable.";

    console.error("Inclura route rendering failure:", {
      path: this.props.path,
      error,
      errorInfo,
    });

    this.setState({ message, componentTrace });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main
        role="alert"
        aria-live="assertive"
        style={{
          minHeight: "100vh",
          boxSizing: "border-box",
          padding: "32px 18px",
          display: "grid",
          placeItems: "center",
          background: "#020617",
          color: "#fff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <section style={{ width: "100%", maxWidth: "560px", textAlign: "center" }}>
          <h1 style={{ color: "#38bdf8", fontSize: "26px" }}>
            This page needs attention
          </h1>
          <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
            This page did not load correctly. Your account and saved content
            remain untouched. You can return to Inclura without closing the app.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "22px",
            }}
          >
            <button
              type="button"
              onClick={this.props.onGoHome}
              style={{
                padding: "13px 18px",
                border: 0,
                borderRadius: "9px",
                background: "#d4af37",
                color: "#07111f",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Return to Inclura home
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                padding: "13px 18px",
                border: "1px solid #38bdf8",
                borderRadius: "9px",
                background: "#0f172a",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reload page
            </button>
          </div>
          <details
            style={{
              marginTop: "24px",
              padding: "12px",
              borderRadius: "9px",
              background: "#0f172a",
              textAlign: "left",
            }}
          >
            <summary style={{ cursor: "pointer", color: "#fbbf24" }}>
              Technical details
            </summary>
            <p style={{ overflowWrap: "anywhere", color: "#cbd5e1" }}>
              Page: {this.props.path}
            </p>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
                color: "#cbd5e1",
                fontSize: "12px",
              }}
            >
              {this.state.message}
              {"\n\n"}
              {this.state.componentTrace}
            </pre>
          </details>
        </section>
      </main>
    );
  }
}

export default function RouteErrorBoundary({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <RouteErrorBoundaryInner
      key={location.pathname}
      path={location.pathname}
      onGoHome={() => navigate("/", { replace: true })}
    >
      {children}
    </RouteErrorBoundaryInner>
  );
}
