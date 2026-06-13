import { Routes, Route } from "react-router-dom";


import ProtectedRoute from "./components/ProtectedRoute";

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

function Home() {
return (
<> <Navbar /> <Hero /> <Feed />
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
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
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

