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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <h1 style={{ color: "#38bdf8" }}>
          Inclura
        </h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <button>Login</button>
          <button>Sign Up</button>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        <h2>Welcome to Inclura</h2>

        <p>
          The inclusive social ecosystem.
        </p>
      </div>
    </div>
  );
}

export default App;
