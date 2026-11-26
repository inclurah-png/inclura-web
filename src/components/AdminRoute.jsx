import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const [checkingClaim, setCheckingClaim] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAdminClaim() {
      setCheckingClaim(true);
      setIsAdmin(false);

      if (!user) {
        if (active) setCheckingClaim(false);
        return;
      }

      try {
        // Admin access is based only on the server-issued Firebase custom claim.
        // Force refresh so revoked/changed privileges are not left in a stale token.
        const tokenResult = await user.getIdTokenResult(true);
        if (active) setIsAdmin(tokenResult.claims.admin === true);
      } catch (error) {
        console.warn("Administrator claim verification failed:", error);
        if (active) setIsAdmin(false);
      } finally {
        if (active) setCheckingClaim(false);
      }
    }

    if (!loading) checkAdminClaim();

    return () => { active = false; };
  }, [user, loading]);

  if (loading || checkingClaim) {
    return <div role="status" aria-live="polite" style={{ color: "white", textAlign: "center", padding: "40px" }}>Checking administrator access…</div>;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/profile" replace />;
  return children;
}

export default AdminRoute;
