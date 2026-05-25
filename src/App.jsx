import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import DiscoveryCard from "./components/DiscoveryCard";

function App() {
  return (
    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >
      <Navbar />

      <HeroSection />

      <div
        style={{
          padding: "30px 20px",
        }}
      >
        <h2
          style={{
            color: "white",
            marginBottom: "24px",
          }}
        >
          Discovery Categories
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <DiscoveryCard
            emoji="🎬"
            title="Trending Reels"
            text="Discover viral short-form creator content globally."
          />

          <DiscoveryCard
            emoji="📺"
            title="Educational Videos"
            text="Long-form learning and tutorials."
          />

          <DiscoveryCard
            emoji="🛒"
            title="Marketplace"
            text="Products, services and digital goods."
          />

          <DiscoveryCard
            emoji="🎓"
            title="Mentorship"
            text="Connect with mentors worldwide."
          />

          <DiscoveryCard
            emoji="🔴"
            title="Livestreams"
            text="Join live creator and accessibility sessions."
          />

          <DiscoveryCard
            emoji="🌍"
            title="Global Discovery"
            text="Explore multilingual communities."
          />
        </div>
      </div>
    </div>
  );
}

export default App;
