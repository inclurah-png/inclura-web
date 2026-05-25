function App() {
  return (
    <div
      style={{
        backgroundColor: "#020617",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <h1 style={{ color: "#38bdf8" }}>Inclura</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Login
          </button>

          <button
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#38bdf8",
              color: "white",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Hero */}
      <div
        style={{
          textAlign: "center",
          marginTop: "120px",
          padding: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "64px",
            marginBottom: "20px",
          }}
        >
          Welcome to Inclura
        </h2>

        <p
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            fontSize: "24px",
            lineHeight: "1.6",
            color: "#cbd5e1",
          }}
        >
          The inclusive social ecosystem for accessibility, creators,
          mentorship, marketplaces, careers, emergency support, and global
          connection.
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
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;
