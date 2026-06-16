import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Onboarding from "./pages/Onboarding";

import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Messages from "./pages/Messages";
import SavedPosts from "./pages/SavedPosts";
import Search from "./pages/Search";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";
import AccessibilityHub from "./pages/AccessibilityHub";
import OpportunitiesHub from "./pages/OpportunitiesHub";
import CareGigs from "./pages/CareGigs";
import MentorHub from "./pages/MentorHub";
import Marketplace from "./pages/Marketplace";
import Wallet from "./pages/Wallet";
import PayTopup from "./pages/PayTopup";
import Enterprise from "./pages/Enterprise";
import SOS from "./pages/SOS";

function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
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
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/onboarding"
        element={<Onboarding />}
      />

      {/* PROTECTED ROUTES */}
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
  path="/accessibility"
  element={
    <ProtectedRoute>
      <AccessibilityHub />
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
  path="/opportunities"
  element={
    <ProtectedRoute>
      <OpportunitiesHub />
    </ProtectedRoute>
  }
/>

<Route
  path="/care-gigs"
  element={
    <ProtectedRoute>
      <CareGigs />
    </ProtectedRoute>
  }
/>

<Route
  path="/mentor-hub"
  element={
    <ProtectedRoute>
      <MentorHub />
    </ProtectedRoute>
  }
/>

<Route
  path="/marketplace"
  element={
    <ProtectedRoute>
      <Marketplace />
    </ProtectedRoute>
  }
/>

<Route
  path="/wallet"
  element={
    <ProtectedRoute>
      <Wallet />
    </ProtectedRoute>
  }
/>

<Route
  path="/pay-topup"
  element={
    <ProtectedRoute>
      <PayTopup />
    </ProtectedRoute>
  }
/>

<Route
  path="/enterprise"
  element={
    <ProtectedRoute>
      <Enterprise />
    </ProtectedRoute>
  }
/>

<Route
  path="/sos"
  element={
    <ProtectedRoute>
      <SOS />
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
  );
}

export default App;
