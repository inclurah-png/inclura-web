
import { Routes, Route, Link } from "react-router-dom";

function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "30px",
        fontFamily: "Arial"
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "80px"
        }}
      >
        <h1 style={{ color: "#38bdf8" }}>
          Inclura
        </h1>

        <div
          style={{
            display: "flex",
            gap: "15px"
          }}
        >
          <Link to="/login">
            <button
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Login
            </button>
          </Link>

          <Link to="/signup">
            <button
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                background: "#38bdf8",
                color: "white",
                cursor: "pointer"
              }}
            >
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      <section
        style={{
          textAlign: "center",
          marginTop: "100px"
        }}
      >
        <h1
          style={{
            fontSize: "55px",
            marginBottom: "20px"
          }}
        >
          Welcome to Inclura
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "#cbd5e1",
            maxWidth: "700px",
            margin: "0 auto"
          }}
        >
          The inclusive social ecosystem for
          accessibility, careers, creators,
          marketplaces, mentorship, emergency
          support, and global connection.
        </p>

        <div
          style={{
            marginTop: "40px"
          }}
        >
          <Link to="/signup">
            <button
              style={{
                padding: "16px 35px",
                borderRadius: "14px",
                border: "none",
                background: "#38bdf8",
                color: "white",
                fontSize: "18px",
                cursor: "pointer"
              }}
            >
              Get Started
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#020617",
        color: "white"
      }}
    >
      <h1>Login Page</h1>
    </div>
  );
}

function SignupPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#020617",
        color: "white"
      }}
    >
      <h1>Signup Page</h1>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/signup"
        element={<SignupPage />}
      />
    </Routes>
  );
}
