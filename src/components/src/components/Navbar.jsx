function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 30px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Cloudflare_Logo.png/320px-Cloudflare_Logo.png"
          alt="Inclura Logo"
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
          }}
        />

        <h1
          style={{
            color: "#38bdf8",
            fontSize: "42px",
            margin: 0,
          }}
        >
          Inclura
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          gap: "15px",
        }}
      >
        <button
          style={{
            padding: "12px 24px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Login
        </button>

        <button
          style={{
            padding: "12px 24px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#38bdf8",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Navbar;
