# Login: why it failed and what changed

## What was verified against the deployed app (2026-11-10)

| Check | Result |
|---|---|
| `https://inclura-web.pages.dev/`, `/login` | 200, login form renders |
| Email/password provider | **Enabled** — a throwaway signup succeeded (account deleted immediately) |
| API key | **Valid** — `accounts:signInWithPassword` returns a normal auth answer, and accepts requests from the site origin |
| Authorized domains | `localhost`, `inclura-prod-90734.firebaseapp.com`, `inclura-prod-90734.web.app`, `inclura-web.pages.dev` — all correct |
| CSP / blocking headers | None set |
| Service worker | None of the app's own; only SDK internals |
| Browser login attempt | Preflight 200, auth POST 400 — the request path works |

So the Firebase project is configured correctly. `auth/network-request-failed`
is raised only when the browser's request to `identitytoolkit.googleapis.com`
never completes: an ad-blocker/privacy extension, VPN, DNS filter, antivirus
HTTPS scanning, or being offline. That part has no code fix.

## What was wrong in the code

`src/pages/Login.jsx` reported every failure with `alert()`. That blocks the
page, and Chrome suppresses alerts once the user dismisses a few of them — after
that, **Sign In looks like it does nothing**, which matches "I can't log in"
with no explanation.

## What changed

- **`src/services/authErrorMessages.js`** — maps Firebase auth codes to
  actionable sentences, and flags the retryable ones
  (`network-request-failed`, `timeout`, `too-many-requests`).
- **`src/pages/Login.jsx`** — errors from email/password, Google and passkey
  sign-in now render in an inline `role="alert"` banner instead of an `alert()`.
  `auth/invalid-credential` adds a "Reset your password" link; retryable errors
  add "Try again".
- **`src/pages/ForgotPassword.jsx`** — reset success/failure is shown inline
  (including "check your spam folder" guidance) instead of `alert()`.
- **`src/pages/Signup.jsx`** — inline errors, and a failed Firestore profile
  write no longer reports signup as failed. `createUserWithEmailAndPassword`
  had already created the account at that point, so the old `catch` told the
  user signup failed when it had succeeded — then a retry hit
  `auth/email-already-in-use`. Profile errors are now logged and signup
  continues; the auth context already builds a profile from the auth user.

## Verified

- `npm run build` succeeds.
- In the browser on the login page: submitting an empty form shows
  "Please enter your email and password." inline and the page stays responsive;
  wrong credentials show the credential message with the reset link, no modal.
- In the browser on the signup page: a 3-character password shows "Choose a
  stronger password (at least 6 characters)." inline, the page stays responsive,
  and no account is created.

## Still yours to do

1. **Network:** allow `identitytoolkit.googleapis.com`,
   `securetoken.googleapis.com` and `*.googleapis.com` in the ad-blocker / VPN /
   DNS filter on the machine that fails, or try a private window with extensions
   off. Nothing in the app can bypass that block for email/password sign-in.
2. **Optional, deliberate:** `authDomain` is still
   `inclura-prod-90734.firebaseapp.com`. Moving it to
   `inclura-prod-90734.web.app` stops Google sign-in and reset links from
   depending on the hostname blocklists often refuse. It requires adding
   `https://inclura-prod-90734.web.app/__/auth/handler` to the Google provider's
   authorized redirect URIs first, or Google sign-in will fail with a redirect
   mismatch. Do not point `authDomain` at `inclura-web.pages.dev` without a
   `/__/auth/*` proxy — Pages returns the SPA shell for that path.
3. **Email templates:** Authentication → Templates → Customize action URL →
   keep it on whichever auth domain you settle on, so reset and verification
   links are minted there.
