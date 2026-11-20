import { useEffect, lazy, Suspense } from "react";
import { synchronizeSatelliteQueue } from "./services/satelliteSyncEngine";

const ResponderIncidentReport = lazy(() => import("./pages/ResponderIncidentReport"));
const FamilyEmergencyDashboard = lazy(() => import("./pages/FamilyEmergencyDashboard"));
const FamilyEmergencyTimeline = lazy(() => import("./pages/FamilyEmergencyTimeline"));
const FamilyEmergencyMap = lazy(() => import("./pages/FamilyEmergencyMap"));
const FamilyEmergencyNotifications = lazy(() => import("./pages/FamilyEmergencyNotifications"));
const IFSERiskPanel = lazy(() => import("./pages/IFSERiskPanel.jsx"));
const SOSResponderDashboard = lazy(() => import("./pages/SOSResponderDashboard"));
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import CreatorRoute from "./components/CreatorRoute";
import AdvertiserRoute from "./components/AdvertiserRoute";
import EnterpriseRoute from "./components/EnterpriseRoute";
import AdminRoute from "./components/AdminRoute";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Messages = lazy(() => import("./pages/Messages"));
const Notifications = lazy(() => import("./pages/Notifications"));
const SavedPosts = lazy(() => import("./pages/SavedPosts"));
const Search = lazy(() => import("./pages/Search"));
const Wallet = lazy(() => import("./pages/Wallet"));
const DigitalServices = lazy(() => import("./pages/DigitalServices"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const ReelsSystem = lazy(() => import("./pages/ReelsSystem"));
const CreateReelPage = lazy(() => import("./pages/CreateReelPage"));
const AccessibilityHub = lazy(() => import("./pages/AccessibilityHub"));
const OpportunitiesHub = lazy(() => import("./pages/OpportunitiesHub"));
const CareGigs = lazy(() => import("./pages/CareGigs"));
const CareRequestPage = lazy(() => import("./pages/CareRequestPage"));
const MentorHub = lazy(() => import("./pages/MentorHub"));
const PostPage = lazy(() => import("./pages/PostPage"));
const CrossPost = lazy(() => import("./pages/CrossPost"));
const VerificationCenter = lazy(() => import("./pages/VerificationCenter"));
const VerificationApplication = lazy(() => import("./pages/VerificationApplication"));
const VerificationDocuments = lazy(() => import("./pages/VerificationDocuments"));
const VerificationPaymentEngine = lazy(() => import("./pages/VerificationPaymentEngine"));
const VerificationStatus = lazy(() => import("./pages/VerificationStatus"));
const CreatorMonetization = lazy(() => import("./pages/CreatorMonetization"));
const CreatorAnalytics = lazy(() => import("./pages/CreatorAnalytics"));
const CreatorEarnings = lazy(() => import("./pages/CreatorEarnings"));
const AdvertiserDashboard = lazy(() => import("./pages/AdvertiserDashboard"));
const AdManager = lazy(() => import("./pages/AdManager"));
const Enterprise = lazy(() => import("./pages/Enterprise"));
const EnterpriseAds = lazy(() => import("./pages/EnterpriseAds"));
const EnterpriseCampaignManager = lazy(() => import("./pages/EnterpriseCampaignManager"));
const EnterpriseAnalytics = lazy(() => import("./pages/EnterpriseAnalytics"));
const EnterprisePartnership = lazy(() => import("./pages/EnterprisePartnership"));
const CorporatePartnership = lazy(() => import("./pages/CorporatePartnership"));
const GovernmentPartnership = lazy(() => import("./pages/GovernmentPartnership"));
const PremiumDashboard = lazy(() => import("./pages/PremiumDashboard"));
const PremiumPayment = lazy(() => import("./pages/PremiumPayment"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const VerificationManager = lazy(() => import("./pages/VerificationManager"));
const VerificationRequestsManager = lazy(() => import("./pages/VerificationRequestsManager"));
const AdApprovalQueue = lazy(() => import("./pages/AdApprovalQueue"));
const UsersManagement = lazy(() => import("./pages/UsersManagement"));
const ReportsAndViolations = lazy(() => import("./pages/ReportsAndViolations"));
const PricingManager = lazy(() => import("./pages/PricingManager"));
const PlatformAnalytics = lazy(() => import("./pages/PlatformAnalytics"));
const SOS = lazy(() => import("./pages/SOS"));
const BiometricsDemoPage = lazy(() => import("./pages/BiometricsDemoPage"));
const ResponderAssignments = lazy(() => import("./pages/ResponderAssignments"));
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
    <Suspense fallback={<main role="status" aria-live="polite" style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#020617", color: "#fff", fontSize: "18px" }}>Loading Inclura…</main>}>
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
            <BiometricsDemoPage />
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
        element={
          <ProtectedRoute>
            <PostPage />
          </ProtectedRoute>
        }
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
        path="/digital-services"
        element={
          <ProtectedRoute>
            <DigitalServices />
          </ProtectedRoute>
        }
      />

      {/* Legacy money-action URLs now return to the non-custodial account activity page. */}
      <Route path="/pay-topup" element={<Navigate to="/wallet" replace />} />
      <Route path="/withdraw" element={<Navigate to="/wallet" replace />} />
      <Route path="/transfer" element={<Navigate to="/wallet" replace />} />
      <Route path="/transactions" element={<Navigate to="/wallet" replace />} />

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
        path="/create-reel"
        element={
          <ProtectedRoute>
            <CreateReelPage />
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
  path="/care-gigs/request"
  element={
    <ProtectedRoute>
      <CareRequestPage />
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

      <Route
        path="/responder-assignments"
        element={
          <AdminRoute>
            <ResponderAssignments />
          </AdminRoute>
        }
      />

      <Route
        path="/responder-assignments"
        element={
          <AdminRoute>
            <ResponderAssignments />
          </AdminRoute>
        }
      />

      <Route
        path="/family-emergency-dashboard"
        element={
          <AdminRoute>
            <FamilyEmergencyDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/family-emergency-timeline"
        element={
          <AdminRoute>
            <FamilyEmergencyTimeline />
          </AdminRoute>
        }
      />

      <Route
        path="/family-emergency-map"
        element={
          <AdminRoute>
            <FamilyEmergencyMap />
          </AdminRoute>
        }
      />

      <Route
        path="/family-emergency-notifications"
        element={
          <AdminRoute>
            <FamilyEmergencyNotifications />
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
    </Suspense>
  );
}

export default App;
