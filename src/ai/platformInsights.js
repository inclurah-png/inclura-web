import { auth } from "../firebase";

const IFSE_API_URL =
  import.meta.env.VITE_IFSE_API_URL ||
  "https://inclura-ifse-backend.onrender.com";

// Executive reports are generated only by the trusted IFSE backend.
// Browser clients must never write platform-wide analytics documents.
export async function updatePlatformInsights() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Sign in with an authorized administrator account.");
  }

  const token = await user.getIdToken();
  const response = await fetch(`${IFSE_API_URL}/api/analytics/platform`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success !== true || !result.report) {
    throw new Error(
      result.message || "The executive analytics report could not be generated."
    );
  }

  return result.report;
}
