import { Link } from "react-router-dom";
import Logo from "../components/Logo";

function AboutInclura() {
  return (
    <main style={{ minHeight: "100vh", background: "#020617", color: "white", padding: "32px 24px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Logo />
        <section style={{ marginTop: "48px", background: "#0f172a", border: "1px solid #334155", borderRadius: "20px", padding: "28px" }}>
          <h1>About Inclura</h1>
          <p style={{ color: "#cbd5e1", lineHeight: 1.8 }}>
            Inclura brings accessibility, opportunity, communication, safety, verified identity,
            and community services together in one connected environment.
          </p>
          <div style={{ display: "grid", gap: "12px", marginTop: "24px" }}>
            <p>♿ Accessibility and inclusive participation</p>
            <p>💼 Opportunities, jobs, care and mentorship</p>
            <p>🛒 Marketplace and digital services</p>
            <p>🚨 Safety and SOS support with IFSE integration</p>
            <p>💬 Community communication, stories and messaging</p>
          </div>
          <Link to="/signup" style={{ color: "#38bdf8", fontWeight: 700 }}>
            Create an Inclura account →
          </Link>
        </section>
      </div>
    </main>
  );
}

export default AboutInclura;
