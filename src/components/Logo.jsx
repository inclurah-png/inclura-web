function Logo() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <img
        src="/logo.png"
        alt="Inclura Logo"
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "14px",
        }}
      />

      <h1
        style={{
          color: "#38bdf8",
          fontSize: "42px",
          fontWeight: "700",
          margin: 0,
        }}
      >
        Inclura
      </h1>
    </div>
  );
}

export default Logo;
