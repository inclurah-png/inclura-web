import { useEffect } from "react";
import { synchronizeSatelliteQueue } from "./services/satelliteSyncEngine";

import IFSERiskPanel from "./pages/IFSERiskPanel.jsx";
import SOSResponderDashboard from "./pages/SOSResponderDashboard";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import CreatorRoute from "./components/CreatorRoute";
import AdvertiserRoute from "./components/AdvertiserRoute";
import EnterpriseRoute from "./components/EnterpriseRoute";
import AdminRoute from "./components/AdminRoute"; 

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Onboarding from "./pages/Onboarding";

import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import UserProfile from "./pages/UserProfile";

import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import SavedPosts from "./pages/SavedPosts";
import Search from "./pages/Search";

import Wallet from "./pages/Wallet";
import PayTopup from "./pages/PayTopup";
import Withdraw from "./pages/Withdraw";
import Transfer from "./pages/Transfer";
import Transactions from "./pages/Transactions";

import Marketplace from "./pages/Marketplace";
import ReelsSystem from "./pages/ReelsSystem";

import AccessibilityHub from "./pages/AccessibilityHub";
import OpportunitiesHub from "./pages/OpportunitiesHub";
import CareGigs from "./pages/CareGigs";
import MentorHub from "./pages/MentorHub";

import PostPage from "./pages/PostPage";
import CrossPost from "./pages/CrossPost";

import VerificationCenter from "./pages/VerificationCenter";
import VerificationApplication from "./pages/VerificationApplication";
import VerificationDocuments from "./pages/VerificationDocuments";
import VerificationPaymentEngine from "./pages/VerificationPaymentEngine";
import VerificationStatus from "./pages/VerificationStatus";

import CreatorMonetization from "./pages/CreatorMonetization";
import CreatorAnalytics from "./pages/CreatorAnalytics";
import CreatorEarnings from "./pages/CreatorEarnings";

import AdvertiserDashboard from "./pages/AdvertiserDashboard";
import AdManager from "./pages/AdManager";

import Enterprise from "./pages/Enterprise";
import EnterpriseAds from "./pages/EnterpriseAds";
import EnterpriseCampaignManager from "./pages/EnterpriseCampaignManager";
import EnterpriseAnalytics from "./pages/EnterpriseAnalytics";
import EnterprisePartnership from "./pages/EnterprisePartnership";
import CorporatePartnership from "./pages/CorporatePartnership";
import GovernmentPartnership from "./pages/GovernmentPartnership";

import PremiumDashboard from "./pages/PremiumDashboard";
import PremiumPayment from "./pages/PremiumPayment";

import AdminPanel from "./pages/AdminPanel";
import VerificationManager from "./pages/VerificationManager";
import VerificationRequestsManager from "./pages/VerificationRequestsManager";
import WalletMonitoring from "./pages/WalletMonitoring";
import AdApprovalQueue from "./pages/AdApprovalQueue";
import UsersManagement from "./pages/UsersManagement";
import ReportsAndViolations from "./pages/ReportsAndViolations";
import PricingManager from "./pages/PricingManager";
import PlatformAnalytics from "./pages/PlatformAnalytics";

import SOS from "./pages/SOS";
import IdentityBiometricVerification from "./pages/IdentityBiometricVerification";

function App() {
  useEffect(() => {

  window.addEventListener(

    "online",

    synchronizeSatelliteQueue

  );

  return () =>

    window.removeEventListener(

      "online",

      synchronizeSatelliteQueue

    );

}, []);
  
  return (
    <Routes>

      {/* ========================= */}
      {/* PUBLIC ROUTES */}
      {/* ========================= */}

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
    path="/identity/biometric-verification"
    element={
        <ProtectedRoute>
            <IdentityBiometricVerification />
        </ProtectedRoute>
    }
/>

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/onboarding"
        element={<Onboarding />}
      />

      <Route
        path="/post/:id"
        element={<PostPage />}
      />

      <Route
        path="/crosspost/:id"
        element={<CrossPost />}
      />

      {/* ========================= */}
      {/* USER ROUTES */}
      {/* ========================= */}

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
        path="/user/:userId"
        element={
          <ProtectedRoute>
            <UserProfile />
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

      <Route
        path="/marketplace"
        element={
          <ProtectedRoute>
            <Marketplace />
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
        path="/mentor-hub"
        element={
          <ProtectedRoute>
            <MentorHub />
          </ProtectedRoute>
        }
      />
            {/* ========================= */}
      {/* VERIFICATION SYSTEM */}
      {/* ========================= */}

      <Route
        path="/verification-center"
        element={
          <ProtectedRoute>
            <VerificationCenter />
          </ProtectedRoute>
        }
      />

      <Route
        path="/verification-application"
        element={
          <ProtectedRoute>
            <VerificationApplication />
          </ProtectedRoute>
        }
      />

      <Route
        path="/verification-documents"
        element={
          <ProtectedRoute>
            <VerificationDocuments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/verification-payment"
        element={
          <ProtectedRoute>
            <VerificationPaymentEngine />
          </ProtectedRoute>
        }
      />

      <Route
        path="/verification-status"
        element={
          <ProtectedRoute>
            <VerificationStatus />
          </ProtectedRoute>
        }
      />

      <Route
        path="/enterprise-partnership"
        element={
          <ProtectedRoute>
            <EnterprisePartnership />
          </ProtectedRoute>
        }
      />

      <Route
        path="/corporate-partnership"
        element={
          <ProtectedRoute>
            <CorporatePartnership />
          </ProtectedRoute>
        }
      />

      <Route
        path="/government-partnership"
        element={
          <ProtectedRoute>
            <GovernmentPartnership />
          </ProtectedRoute>
        }
      />

      {/* ========================= */}
      {/* CREATOR */}
      {/* ========================= */}

      <Route
        path="/creator-monetization"
        element={
          <CreatorRoute>
            <CreatorMonetization />
          </CreatorRoute>
        }
      />

      <Route
        path="/creator-analytics"
        element={
          <CreatorRoute>
            <CreatorAnalytics />
          </CreatorRoute>
        }
      />

      <Route
        path="/creator-earnings"
        element={
          <CreatorRoute>
            <CreatorEarnings />
          </CreatorRoute>
        }
      />

      {/* ========================= */}
      {/* ADVERTISER */}
      {/* ========================= */}

      <Route
        path="/advertiser-dashboard"
        element={
          <AdvertiserRoute>
            <AdvertiserDashboard />
          </AdvertiserRoute>
        }
      />

      <Route
        path="/ad-manager"
        element={
          <AdvertiserRoute>
            <AdManager />
          </AdvertiserRoute>
        }
      />
            {/* ========================= */}
      {/* ENTERPRISE */}
      {/* ========================= */}

      <Route
        path="/enterprise"
        element={
          <EnterpriseRoute>
            <Enterprise />
          </EnterpriseRoute>
        }
      />

      <Route
        path="/enterprise-ads"
        element={
          <EnterpriseRoute>
            <EnterpriseAds />
          </EnterpriseRoute>
        }
      />

      <Route
        path="/enterprise-campaigns"
        element={
          <EnterpriseRoute>
            <EnterpriseCampaignManager />
          </EnterpriseRoute>
        }
      />

      <Route
        path="/enterprise-analytics"
        element={
          <EnterpriseRoute>
            <EnterpriseAnalytics />
          </EnterpriseRoute>
        }
      />

      {/* ========================= */}
      {/* PREMIUM */}
      {/* ========================= */}

      <Route
        path="/premium-dashboard"
        element={
          <ProtectedRoute>
            <PremiumDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/premium-payment"
        element={
          <ProtectedRoute>
            <PremiumPayment />
          </ProtectedRoute>
        }
      />

      {/* ========================= */}
      {/* ADMIN */}
      {/* ========================= */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        }
      />

      <Route
        path="/verification-manager"
        element={
          <AdminRoute>
            <VerificationManager />
          </AdminRoute>
        }
      />

      <Route
        path="/verification-requests"
        element={
          <AdminRoute>
            <VerificationRequestsManager />
          </AdminRoute>
        }
      />

      <Route
        path="/wallet-monitoring"
        element={
          <AdminRoute>
            <WalletMonitoring />
          </AdminRoute>
        }
      />

      <Route
        path="/ad-approval"
        element={
          <AdminRoute>
            <AdApprovalQueue />
          </AdminRoute>
        }
      />

      <Route
        path="/users-management"
        element={
          <AdminRoute>
            <UsersManagement />
          </AdminRoute>
        }
      />

      <Route
        path="/reports-violations"
        element={
          <AdminRoute>
            <ReportsAndViolations />
          </AdminRoute>
        }
      />

      <Route
        path="/pricing-manager"
        element={
          <AdminRoute>
            <PricingManager />
          </AdminRoute>
        }
      />

      <Route
        path="/platform-analytics"
        element={
          <AdminRoute>
            <PlatformAnalytics />
          </AdminRoute>
        }
      />

      <Route
  path="/admin/ifse-risk"
  element={
    <AdminRoute>
      <IFSERiskPanel />
    </AdminRoute>
  }
/>

 <Route
  path="/sos-responder"
  element={
    <AdminRoute>
      <SOSResponderDashboard />
    </AdminRoute>
  }
/>

      {/* ========================= */}
      {/* SOS */}
      {/* ========================= */}

      <Route
        path="/sos"
        element={
          <ProtectedRoute>
            <SOS />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
