import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function EnterpriseRoute({ children }) {
  const { user, userProfile, loading, profileLoading } = useAuth();

  if (loading || (user && profileLoading)) {
    return <div role="status" aria-live="polite" style={{ color: "white", textAlign: "center", padding: "40px" }}>Checking enterprise access…</div>;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (userProfile?.role !== "enterprise") return <Navigate to="/profile" replace />;
  return children;
}

export default EnterpriseRoute;
