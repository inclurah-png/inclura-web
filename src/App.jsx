import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Onboarding from "./pages/Onboarding";

import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import VerificationCenter from "./pages/VerificationCenter";

import Messages from "./pages/Messages";
import AdManager from "./pages/AdManager";
import EnterpriseAds from "./pages/EnterpriseAds";
import AdminPanel from "./pages/AdminPanel";
import VerificationRequestsManager from "./pages/VerificationRequestsManager";
import VerificationManager from "./pages/VerificationManager";
import AdApprovalQueue from "./pages/AdApprovalQueue";
import WalletMonitoring from "./pages/WalletMonitoring";
import UsersManagement from "./pages/UsersManagement";
import ReportsAndViolations from "./pages/ReportsAndViolations";
import SavedPosts from "./pages/SavedPosts";
import Search from "./pages/Search";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";
import AccessibilityHub from "./pages/AccessibilityHub";
import OpportunitiesHub from "./pages/OpportunitiesHub";
import CareGigs from "./pages/CareGigs";
import CreatorEarnings from "./pages/CreatorEarnings";
import MentorHub from "./pages/MentorHub";
import Marketplace from "./pages/Marketplace";
import Wallet from "./pages/Wallet";
import ReelsSystem from "./pages/ReelsSystem";
import AdvertiserDashboard from "./pages/AdvertiserDashboard";
import CreatorMonetization from "./pages/CreatorMonetization";
import CreatorAnalytics from "./pages/CreatorAnalytics";
import EnterpriseCampaignManager from "./pages/EnterpriseCampaignManager";
import EnterpriseAnalytics from "./pages/EnterpriseAnalytics";
import PlatformAnalytics from "./pages/PlatformAnalytics";
import PremiumDashboard from "./pages/PremiumDashboard";
import PricingManager from "./pages/PricingManager";
import PayTopup from "./pages/PayTopup";
import Withdraw from "./pages/Withdraw";
import Transfer from "./pages/Transfer";
import Transactions from "./pages/Transactions";
import Enterprise from "./pages/Enterprise";
import SOS from "./pages/SOS";

function App() {
return (
<Routes>

  {/* PUBLIC ROUTES */}
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route
    path="/forgot-password"
    element={<ForgotPassword />}
  />
  <Route
    path="/onboarding"
    element={<Onboarding />}
  />

  {/* MAIN DASHBOARD */}
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
  path="/verification-center"
  element={
    <ProtectedRoute>
      <VerificationCenter />
    </ProtectedRoute>
  }
/>

  <
  <Route
    path="/messages"
    element={
      <ProtectedRoute>
        <Messages />
      </ProtectedRoute>
    }
  />

  <Route
  path="/ad-manager"
  element={
    <ProtectedRoute>
      <AdManager />
    </ProtectedRoute>
  }
/>

  <Route
  path="/enterprise-ads"
  element={
    <ProtectedRoute>
      <EnterpriseAds />
    </ProtectedRoute>
  }
/>

  <Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminPanel />
    </ProtectedRoute>
  }
/>

  <Route
  path="/verification-requests"
  element={
    <ProtectedRoute>
      <VerificationRequestsManager />
    </ProtectedRoute>
  }
/>
  
  <Route
  path="/verification-manager"
  element={
    <ProtectedRoute>
      <VerificationManager />
    </ProtectedRoute>
  }
/>

  <Route
  path="/ad-approval"
  element={
    <ProtectedRoute>
      <AdApprovalQueue />
    </ProtectedRoute>
  }
/>

  <Route
  path="/wallet-monitoring"
  element={
    <ProtectedRoute>
      <WalletMonitoring />
    </ProtectedRoute>
  }
/>

  <Route
  path="/users-management"
  element={
    <ProtectedRoute>
      <UsersManagement />
    </ProtectedRoute>
  }
/>

  <Route
  path="/reports-violations"
  element={
    <ProtectedRoute>
      <ReportsAndViolations />
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

  {/* HUBS */}
  <Route
    path="/accessibility"
    element={
      <ProtectedRoute>
        <AccessibilityHub />
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
  path="/creator-earnings"
  element={
    <ProtectedRoute>
      <CreatorEarnings />
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

  {/* WALLET */}
  <Route
    path="/wallet"
    element={
      <ProtectedRoute>
        <Wallet />
      </ProtectedRoute>
    }
  />

  <Route
  path="/reels-system"
  element={
    <ProtectedRoute>
      <ReelsSystem />
    </ProtectedRoute>
  }
/>
  
  <Route
  path="/advertiser-dashboard"
  element={
    <ProtectedRoute>
      <AdvertiserDashboard />
    </ProtectedRoute>
  }
/>

  <Route
  path="/creator-monetization"
  element={
    <ProtectedRoute>
      <CreatorMonetization />
    </ProtectedRoute>
  }
/>

  <Route
  path="/creator-analytics"
  element={
    <ProtectedRoute>
      <CreatorAnalytics />
    </ProtectedRoute>
  }
/>
  
  <Route
  path="/enterprise-campaigns"
  element={
    <ProtectedRoute>
      <EnterpriseCampaignManager />
    </ProtectedRoute>
  }
/>

  <Route
  path="/enterprise-analytics"
  element={
    <ProtectedRoute>
      <EnterpriseAnalytics />
    </ProtectedRoute>
  }
/>
  
  <Route
  path="/platform-analytics"
  element={
    <ProtectedRoute>
      <PlatformAnalytics />
    </ProtectedRoute>
  }
/>

  <Route
  path="/premium-dashboard"
  element={
    <ProtectedRoute>
      <PremiumDashboard />
    </ProtectedRoute>
  }
/>
  
  <Route
  path="/pricing-manager"
  element={
    <ProtectedRoute>
      <PricingManager />
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
  path="/withdraw"
  element={
    <ProtectedRoute>
      <Withdraw />
    </ProtectedRoute>
  }
/>

<Route
  path="/transfer"
  element={
    <ProtectedRoute>
      <Transfer />
    </ProtectedRoute>
  }
/>

<Route
  path="/transactions"
  element={
    <ProtectedRoute>
      <Transactions />
    </ProtectedRoute>
  }
/>
  
  {/* ENTERPRISE */}
  <Route
    path="/enterprise"
    element={
      <ProtectedRoute>
        <Enterprise />
      </ProtectedRoute>
    }
  />

  {/* SOS */}
  <Route
    path="/sos"
    element={
      <ProtectedRoute>
        <SOS />
      </ProtectedRoute>
    }
  />

  {/* USER PROFILE */}
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
