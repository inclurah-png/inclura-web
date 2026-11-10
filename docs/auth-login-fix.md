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

## What changed

- **`src/services/authErrorMessages.js`** — maps Firebase auth codes to
  actionable sentences and flags the retryable ones.
- **`src/pages/Login.jsx`** — email/password, Google and passkey errors render
  in one inline `role="alert"` banner. Invalid credentials offer the reset
  route; retryable errors offer a retry.
- **`src/pages/Signup.jsx`** — a failed Firestore profile write no longer
  reports signup as failed after the account was created.
- **`src/pages/ForgotPassword.jsx`** — inline reset feedback.
- **`src/firebase.js`** — `authDomain` reads `VITE_FIREBASE_AUTH_DOMAIN`, with
  `inclura-prod-90734.firebaseapp.com` as the default.

## Still yours to do

### A. `auth/network-request-failed` — a local block, no code fix

On the machine that fails, run this in the browser console on the login page:

```js
fetch("https://identitytoolkit.googleapis.com/", { mode: "no-cors" })
  .then(() => console.log("reachable — Firebase Auth is not blocked"))
  .catch((e) => console.error("blocked", e));
```

- `reachable` → the network is fine; the failure is the password itself.
- `blocked` → something local drops the request: an ad-blocker/privacy
  extension (try a private window with extensions off), a VPN or DNS filter
  (Pi-hole, NextDNS, AdGuard), antivirus HTTPS scanning, or a corporate
  proxy. Allow `identitytoolkit.googleapis.com`, `securetoken.googleapis.com`
  and `*.googleapis.com`. Phone on mobile data with Wi-Fi off splits "my
  machine" from "my network".

No application code can bypass a blocked host for email/password sign-in.

### B. `authDomain` — switch it with a setting, not code

Do these **in this order**, or Google sign-in fails with a redirect mismatch:

1. **Google Cloud Console → APIs & Services → Credentials →** the OAuth 2.0
   Client ID used by Firebase (ends in `apps.googleusercontent.com`). Under
   **Authorized redirect URIs** add
   `https://inclura-prod-90734.web.app/__/auth/handler`, save, wait a few
   minutes.
2. **Firebase Console → Authentication → Settings → Authorized domains** —
   `inclura-prod-90734.web.app` is already listed; nothing to do.
3. **Cloudflare Pages → Settings → Environment variables** — add
   `VITE_FIREBASE_AUTH_DOMAIN` = `inclura-prod-90734.web.app` for Production,
   then trigger a deployment (Vite inlines env values at build time).
4. **Verify:** the Google popup URL must start with
   `https://inclura-prod-90734.web.app/__/auth/handler`, and a reset email link
   must use that host instead of `firebaseapp.com`.

Revert by deleting the variable and redeploying. Do **not** use
`inclura-web.pages.dev` without a `/__/auth/*` proxy — Pages returns the SPA
shell for unknown paths, so the auth handler would not exist there.

### C. Email templates

**Firebase Console → Authentication → Templates →** each template →
**Customize action URL** → `https://inclura-prod-90734.web.app/__/auth/action`.
