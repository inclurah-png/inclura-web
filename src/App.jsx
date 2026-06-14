import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import StoriesSection from "./components/StoriesSection";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Feed from "./components/Feed";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Messages from "./pages/Messages";
import SavedPosts from "./pages/SavedPosts";
import Search from "./pages/Search";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";
import ForgotPassword from "./pages/ForgotPassword";

const stories = [
  { name: "You" },
  { name: "Ade" },
  { name: "Tolu" },
  { name: "Mary" },
  { name: "David" },
  { name: "Grace" },
  { name: "Amina" },
  { name: "John" },
  { name: "Sarah" },
  { name: "Emeka" },
  { name: "Bola" },
  { name: "Femi" },
  { name: "Ngozi" },
  { name: "Paul" },
];

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
      }}
    >
      <Routes>
        <Route
  path="/"
  element={
    <>
      <Navbar />
      <Hero />
      <Feed />
    </>
  }
/>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
  path="/forgot-password"
  element={<ForgotPassword />}
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
  path="/profile"
  element={<Profile />}
/>
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
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

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/:userId"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
