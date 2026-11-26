import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdvertiserRoute({ children }) {
  const { user, userProfile, loading, profileLoading } = useAuth();

  if (loading || (user && profileLoading)) {
    return <div role="status" aria-live="polite" style={{ color: "white", textAlign: "center", padding: "40px" }}>Checking advertiser access…</div>;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (userProfile?.role !== "advertiser") return <Navigate to="/profile" replace />;
  return children;
}

export default AdvertiserRoute;
