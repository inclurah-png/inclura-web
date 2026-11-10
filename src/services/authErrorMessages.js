// =======================================================
// Firebase Auth error messages
// =======================================================
//
// The login screens used to report failures with alert(), which blocks the
// page and is suppressed by the browser once the user dismisses a few of
// them - after that Sign In looks like it does nothing. These helpers turn
// an error code into a sentence the user can act on so it can be rendered
// inline instead.

const AUTH_ERROR_MESSAGES = {
  // Credentials
  "auth/invalid-credential":
    "That email and password do not match an account. Check the spelling, or reset your password. If you normally sign in with Google, use Continue with Google instead.",
  "auth/invalid-login-credentials":
    "That email and password do not match an account. Check the spelling, or reset your password.",
  "auth/wrong-password":
    "That password is incorrect. You can reset it below.",
  "auth/user-not-found":
    "There is no account with that email. Check the address, or create an account.",
  "auth/missing-password": "Enter your password.",
  "auth/invalid-email":
    "That email address is not valid.",
  "auth/user-disabled":
    "This account has been disabled. Contact support if you think that is a mistake.",
  "auth/email-already-in-use":
    "An account with that email already exists. Sign in instead, or reset the password.",
  "auth/weak-password":
    "Choose a stronger password (at least 6 characters).",

  // Provider / session
  "auth/operation-not-allowed":
    "Email and password sign-in is not enabled for this project. Contact support.",
  "auth/requires-recent-login":
    "For security, sign in again before making this change.",
  "auth/unauthorized-domain":
    "This site's address is not authorized for sign-in. Contact support.",
  "auth/account-exists-with-different-credential":
    "This email is already registered with a different sign-in method. Use that method, then link this one from your profile.",

  // Network / throttling
  "auth/network-request-failed":
    "Your browser could not reach the sign-in service. This is usually an ad-blocker, VPN, DNS filter or antivirus blocking identitytoolkit.googleapis.com. Allow it for this site (or open a private window with extensions off) and try again.",
  "auth/timeout":
    "The sign-in request timed out. Check your connection and try again.",
  "auth/too-many-requests":
    "Too many attempts. Wait a few minutes and try again, or reset your password.",

  // Popup / redirect (Google)
  "auth/popup-blocked":
    "Your browser blocked the sign-in window. Allow pop-ups for this site and try again.",
  "auth/popup-closed-by-user":
    "The sign-in window was closed before finishing.",
  "auth/cancelled-popup-request":
    "Another sign-in window was already open.",

  // Email action links
  "auth/invalid-action-code":
    "This link is invalid or has already been used. Request a new one.",
  "auth/expired-action-code":
    "This link has expired. Request a new one.",
};

const RETRYABLE_AUTH_ERRORS = [
  "auth/network-request-failed",
  "auth/timeout",
  "auth/too-many-requests",
];

// =======================================================
// Normalise any thrown value into { code, message, retryable }
// =======================================================

export function getAuthErrorInfo(error) {
  const code =
    error && typeof error === "object" && error.code
      ? String(error.code)
      : "unknown";

  const message =
    AUTH_ERROR_MESSAGES[code] ||
    (error instanceof Error && error.message) ||
    "Sign-in failed. Please try again.";

  return {
    code,
    message,
    retryable:
      RETRYABLE_AUTH_ERRORS.includes(code),
  };
}

export default getAuthErrorInfo;
