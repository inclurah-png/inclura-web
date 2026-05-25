import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

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
      <Navbar />
      <Hero />
    </div>
  );
}

export default App;
