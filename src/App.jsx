import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}

function App() {
  return (
    <div
      style={{
        backgroundColor: "#020617",
        minHeight: "100vh",
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
