function Signup() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#0f172a",
          padding: "40px",
          borderRadius: "20px",
        }}
      >
        <h1
          style={{
            color: "white",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          Create Inclura Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          style={inputStyle}
        />

        <button style={buttonStyle}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "16px",
  marginBottom: "20px",
  borderRadius: "12px",
  border: "none",
  fontSize: "16px",
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "12px",
  border: "none",
  background: "#38bdf8",
  color: "white",
  fontSize: "18px",
  cursor: "pointer",
};

export default Signup;
