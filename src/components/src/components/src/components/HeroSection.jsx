export default function HeroSection() {
  return (
    <div
      style={{
        padding: "60px 24px",
        textAlign: "center",
        background: "#020617",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: "54px",
          marginBottom: "20px",
        }}
      >
        Explore the Inclura Ecosystem
      </h1>

      <p
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          fontSize: "20px",
          lineHeight: "1.8",
          color: "#cbd5e1",
        }}
      >
        Accessibility, creators, mentorship, careers,
        AI discovery, livestreams, marketplaces and
        global opportunities in one ecosystem.
      </p>

      <button
        style={{
          marginTop: "30px",
          padding: "16px 34px",
          background: "#38bdf8",
          color: "white",
          border: "none",
          borderRadius: "14px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Get Started
      </button>
    </div>
  );
}
