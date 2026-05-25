import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

function App() {
  return (
    <div
      style={{
        backgroundColor: "#020617",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <Hero />
    </div>
  );
}

export default App;
