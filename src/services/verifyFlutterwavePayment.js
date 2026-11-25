import { auth } from "../firebase";

const IFSE_API_URL =
  import.meta.env.VITE_IFSE_API_URL ||
  "https://inclura-ifse-backend.onrender.com";

export async function verifyFlutterwavePayment(payload) {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in again before verifying payment.");

  const idToken = await user.getIdToken();
  const response = await fetch(`${IFSE_API_URL}/api/payments/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success !== true || result.verified !== true) {
    throw new Error(result.message || "The payment could not be verified.");
  }
  return result;
}
