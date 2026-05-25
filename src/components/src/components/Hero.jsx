function Hero() {
  return (
    <section
      style={{
        minHeight: "85vh",
        background: "#020617",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "900px" }}>
        <img
          src="/logo.png"
          alt="Inclura Logo"
          style={{
            width: "120px",
            marginBottom: "25px",
          }}
        />

        <h1
          style={{
            fontSize: "64px",
            fontWeight: "700",
            marginBottom: "20px",
            lineHeight: "1.1",
          }}
        >
          Welcome to Inclura
        </h1>

        <p
          style={{
            fontSize: "24px",
            color: "#cbd5e1",
            lineHeight: "1.7",
            marginBottom: "40px",
          }}
        >
          The inclusive social ecosystem for accessibility,
          creators, careers, mentorship, marketplaces,
          emergency support, and global connection.
        </p>

        <button
          style={{
            background: "#38bdf8",
            color: "white",
            border: "none",
            padding: "18px 42px",
            borderRadius: "14px",
            fontSize: "20px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Get Started
        </button>
      </div>
    </section>
  );
}

export default Hero;
