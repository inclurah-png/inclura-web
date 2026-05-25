function Logo() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        I
      </div>

      <h1
        style={{
          color: "#38bdf8",
          fontSize: "32px",
          margin: 0,
        }}
      >
        Inclura
      </h1>
    </div>
  );
}

export default Logo;
