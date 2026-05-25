function Hero() {
  return (
    <section
      style={{
        textAlign: "center",
        padding: "120px 20px",
        background: "#020617",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: "64px",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        Welcome to Inclura
      </h1>

      <p
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          fontSize: "24px",
          lineHeight: "1.7",
          color: "#cbd5e1",
        }}
      >
        The inclusive social ecosystem for accessibility, creators,
        mentorship, careers, emergency support, marketplaces,
        and global connection.
      </p>

      <button
        style={{
          marginTop: "40px",
          padding: "18px 40px",
          fontSize: "20px",
          borderRadius: "14px",
          border: "none",
          backgroundColor: "#38bdf8",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Get Started
      </button>
    </section>
  );
}

export default Hero;
