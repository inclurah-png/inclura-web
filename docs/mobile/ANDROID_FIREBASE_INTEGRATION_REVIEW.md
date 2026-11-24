# Firebase and mobile integration review

**Status:** Initial source review only. These observations are not a penetration test, emulator test, or confirmation that deployed rules match the repository.

## Existing identity and service integration

- The web app uses the existing Firebase project through `src/firebase.js`.
- Authentication is shared through `AuthProvider` in `src/context/AuthContext.jsx`.
- Firestore and Storage rules are versioned in `firestore.rules` and `storage.rules`.
- The Android app should reuse the same Firebase project and account identity. Do not create a second user database or a second login system.
- Capacitor/native capabilities must be added around the existing React application, not by replacing its data model or bypassing its current authorization.

## Relevant rule observations

| Resource | Current repository rule | Android implementation implication |
|---|---|---|
| `users/{userId}` | A member can read their own private profile; listing is admin-claim-only. | Keep private profile data private. Never replace the own-document rule with broad user listing. |
| `memberDirectory/{memberId}` | Authenticated members can get/list deliberately selected directory records; writes are owner-only and restricted to an allowlist of fields. | Preserve this public-directory/private-profile separation. |
| `chats/{chatId}` and messages | Access is participant-scoped; creation requires verified membership and exactly two participants. | Keep participant checks and verified-member creation; do not weaken rules to simplify Android chat. |
| `notifications/{notificationId}` | Reads are restricted to the receiver; updates are limited to the read field. | Preserve receiver-only access and limited updates. |
| `stories/{storyId}` | Authenticated members can read; creation requires the authenticated user's ID and a constrained field set. | Keep authenticated access and owner attribution. |
| `sosReadiness/{userId}` | Owner-only; stores permission/readiness state and explicitly excludes coordinates. | Do not store GPS coordinates in readiness records. Preserve written-location fallback and explicit location action. |
| `fcmTokens/{tokenId}` | The current create rule explicitly requires `platform == 'web'`; token records are owner-scoped. | Native Android FCM registration cannot be added by merely calling `getToken`. It requires a deliberate platform-aware rule and backend review. Do not label Android tokens as web tokens. |
| Storage media | Rules include owner-scoped uploads for profile photos, posts, stories, chat media/files, voice notes, and verification documents with type/size checks. | Android picker/camera uploads must use the existing authorized paths and obey current content-type and size limits. |

## Required review before enabling native Android push

1. Inspect the IFSE notification backend's token lookup, platform assumptions, delivery behavior, and authorization.
2. Design an explicit allowlist for supported token platforms and preserve owner-only token management.
3. Ensure a user can revoke/disable their own Android token and that logout/device replacement is handled safely.
4. Keep web and Android token records distinct; do not overwrite web tokens.
5. Confirm duplicate notification prevention and deep-link routing for the Android app.
6. Run rule tests and backend tests before deploying any rule/backend change.

## IFSE/SOS safety boundary

- The SOS page's location-readiness flow is user initiated and offers a written-location fallback.
- The repository rules state that readiness records contain permission status only, not coordinates.
- The push test UI is explicitly labelled and asks for confirmation; it states no SMS, email, or real SOS will be sent.
- Never use production SOS recipients or external dispatch during development validation. Use isolated test accounts and device-only test notifications.
- Do not change responder/family/admin route policies until the backend's trusted role claims and IFSE authorization model have been inspected together.

## Outstanding verification

- Compare repository Firestore/Storage rules with the currently deployed rules; repository contents alone do not prove deployment state.
- Inspect all remaining collection rules and the IFSE backend before implementation.
- Execute Firestore emulator tests and existing backend tests.
- Review Android app signing, release configuration, notification permission UX, and data-safety disclosures before distribution.

**Scope:** This document records a static review of repository files. No rules, secrets, Firebase project settings, tokens, or live services were changed.


## Additional community-alert registration path

- `src/pages/CommunityAlerts.jsx` intentionally creates/uses a separately named Firebase app (`IncluraCommunityAlerts`) and a separate anonymous-auth instance. Its comment explicitly says guest alert registration must never sign a visitor into the primary Inclura authentication session.
- It writes to `communityAlertDevices/{guestUid}` only after the visitor enters an area, explicitly consents, and grants browser notification permission. It supports unsubscribe by deleting the server-side registration, revoking the local token where possible, and signing out the anonymous session.
- The corresponding Firestore rule requires an anonymous user to own the document and currently requires `platform == 'web'`.
- Therefore native Android community-alert registration also needs a separately reviewed native token path. Preserve the distinct anonymous guest identity and consent model; do not merge guest registrations into members' primary accounts or silently opt people into alerts.


## SOS push registration component review

- `src/components/SOSPushRegistration.jsx` requests permission after the member taps Enable, obtains a browser FCM token, and writes a `fcmTokens` document with `platform: 'web'`.
- Unlike the background restoration path in `src/App.jsx`, this component currently uses `addDoc` directly without first checking for an existing matching user/token pair. Repeated enable actions may create duplicate records.
- The Android implementation should use a shared, idempotent token-registration service and maintain a unique user/device/platform registration. Do not copy the web token flow unchanged into the native app.
- The component also exposes an explicitly user-triggered “Copy Firebase Test Token” action and warns users to keep the token private. Keep diagnostics opt-in and never log or expose registration tokens in routine UI, telemetry, or source control.
