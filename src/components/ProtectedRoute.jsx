import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait until Firebase has restored the session before redirecting.
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#020617",
          color: "#ffffff",
          fontSize: "16px",
        }}
      >
        Checking your session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Email/password accounts must verify ownership of their email before
  // entering member-only areas. Federated providers supply verified identity.
  const usesPasswordProvider = user.providerData?.some(
    (provider) => provider.providerId === "password"
  );
  if (usesPasswordProvider && !user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
}

export default ProtectedRoute;
