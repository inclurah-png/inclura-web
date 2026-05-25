import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

function App() {
  return (
    <div
      style={{
        backgroundColor: "#020617",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Navbar />

      <Hero />

      <section
        style={{
          padding: "60px 20px",
          color: "white",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "42px",
            marginBottom: "50px",
          }}
        >
          Explore Inclura
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {[
            "Livestreams",
            "Marketplace",
            "Mentorship",
            "Reels",
            "Accessibility",
            "Emergency Support",
          ].map((item) => (
            <div
              key={item}
              style={{
                background: "#0f172a",
                borderRadius: "20px",
                padding: "30px",
                border:
                  "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <h3
                style={{
                  fontSize: "24px",
                  marginBottom: "16px",
                }}
              >
                {item}
              </h3>

              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: "1.6",
                }}
              >
                Discover the future of inclusive
                digital experiences with Inclura.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
