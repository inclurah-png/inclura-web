import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import SavedPosts from "./pages/SavedPosts";
function Home() {
return (
<> <Navbar /> <Hero />
</>
);
}

function App() {
return (
<div
style={{
minHeight: "100vh",
}}
> <Routes>
<Route
path="/"
element={<Home />}
/>


    <Route
      path="/login"
      element={<Login />}
    />

    <Route
      path="/signup"
      element={<Signup />}
    />

    <Route
      path="/onboarding"
      element={<Onboarding />}
    />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    
    <Route
path="/saved-posts"
element={
<ProtectedRoute>
<SavedPosts />
</ProtectedRoute>
}
/>
  </Routes>
</div>


);
}

export default App;
