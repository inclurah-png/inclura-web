# Android page and interaction audit — first pass

**Status:** In progress. This is a source-code inspection, not a live-device test. A route or handler existing in source does not prove its full end-to-end behavior.

## Verified architecture facts

- The application is a React 18 / Vite single-page application using React Router and Firebase.
- `src/main.jsx` mounts `BrowserRouter`, `AuthProvider`, `AccessibilityProvider`, and error boundaries.
- `firebase.json` rewrites unknown Hosting paths to `/index.html`, supporting SPA route refreshes on Firebase Hosting.
- `src/App.jsx` registers an auth-state listener and restores browser FCM registration only after notification permission was previously granted. It stores device tokens in Firestore with `platform: "web"`.
- `public/firebase-messaging-sw.js` handles notification clicks and initializes Firebase Messaging. The Android implementation must not accidentally register a web token as an Android token or create duplicate notification delivery.
- `package.json` currently has no Capacitor packages or Android native project.

## Confirmed page/component observations

| Area | Source inspection | Android parity requirement |
|---|---|---|
| Mobile navigation | `src/components/MobileNav.jsx` renders five emoji buttons but has no destinations, click handlers, or accessible labels. | Replace with accessible, working navigation; retain all destinations elsewhere in a full feature hub/drawer. |
| Top bar | `src/components/Topbar.jsx` search input has no submit handler; notification, message, and add buttons have no handlers; profile initial is a non-interactive div. Language selector changes i18next language. | Wire all actions to existing routes/actions, make profile interactive, and preserve language selection. |
| Sidebar | `src/components/DashboardSidebar.jsx` contains working route navigation and role-conditional advertiser, enterprise, creator/admin destinations; logout calls Firebase sign-out. | Preserve every destination and role condition; do not use UI visibility as authorization. |
| Feed | `src/components/Feed.jsx` includes post loading, save, reactions, translation, accessibility actions, read-aloud, and sharing logic. | Preserve each action and test Firestore/backend behavior, permissions, media, and accessibility on Android. |
| Post creation | `src/components/CreatePost.jsx` supports text, category, image/video selection, accessibility tags, and post submission. | Preserve media upload and post metadata; test Android picker/camera paths and upload failures. |
| Stories | `src/components/StoriesSection.jsx`, `CreateStory.jsx`, and `StoryViewer.jsx` provide story display/viewing and text-story creation. The create component has image/video functions explicitly named as coming-soon placeholders. | Do not advertise image/video story creation as complete until implemented and tested; preserve existing text-story behavior and story viewer. |
| Messages | `src/pages/Messages.jsx` has user loading, new conversation flow, and chat selection; `src/components/ChatWindow.jsx` contains message sending, translation, emoji, image/video/document uploads, voice recording, speech-to-text, and text-to-speech functions. | Preserve all communication modes, attachments, typing/conversation updates, and user access boundaries. Verify device microphone/media permissions are asked only at point of use. |
| Notifications | `src/pages/Notifications.jsx` subscribes to notifications and has a mark-as-read action. | Preserve live updates and read state; test notification deep links and Android notification permissions. |
| Reels | `src/pages/ReelsSystem.jsx` loads reels and includes like, comment navigation, save, share, refresh, and create navigation. `src/pages/CreateReelPage.jsx` wraps the shared `CreatePost` component rather than implementing a separate reel editor in that file. | Verify the actual video publishing pipeline and playback experience before treating this as a complete dedicated editor. |
| Search | `src/pages/Search.jsx` publishes the signed-in user's own directory profile, reads `memberDirectory`, filters names, and navigates to user profiles. | Preserve directory search while reviewing Firestore rules and ensuring only intentionally public profile fields are readable. |
| Accessibility | `src/pages/AccessibilityHub.jsx` selects sections and renders `AccessibilitySettings`; `AccessibilityProvider.jsx` is a substantial shared runtime integration. | Keep accessibility settings and runtime behavior across all Android screens; test screen reader, text scaling, language, and assistive features. |
| Verification | `src/pages/VerificationCenter.jsx` is a large page with status, summary, timeline, badge/certificate, alerts, and quick-action sections. | Preserve all verification workflows; verify payment and document handling through their existing secure services. |
| SOS / IFSE | `src/pages/SOS.jsx` includes explicit user-initiated location readiness, a written-location fallback, and a clearly labelled push-only test flow requiring confirmation. It also imports trusted contacts, live location, responders, community assistance, monitoring, analytics, and history modules. | Preserve fail-safe behavior and authorization. Never use real SOS dispatch, SMS, email, or external recipients in development tests. Keep test notifications device-only and clearly labelled. Verify role policy with IFSE backend before changing route guards. |

## Issues to resolve before native implementation

1. **Placeholder navigation:** MobileNav and several Topbar controls are currently inert. Treat them as defects to repair, not as working features to reproduce.
2. **Story media gaps:** image/video story creation functions are explicitly placeholders.
3. **Dedicated reel creation:** the route delegates to shared post creation. Confirm whether current post video uploads meet the intended reel workflow.
4. **Push token platform separation:** web FCM registration currently records `platform: "web"`. Add Android token registration as a separate platform-aware path; never overwrite or mislabel web tokens.
5. **Permission and privacy review:** check Firestore rules and backend authorization for every user directory, message, notification, media, creator, advertiser, enterprise, admin, and IFSE data path. Client route guards alone are insufficient.
6. **Route guard review:** keep the findings in `ANDROID_ROUTE_GUARD_REVIEW.md` unresolved until product/IFSE authorization intent and server-side enforcement are confirmed.
7. **Build and device validation:** run the existing web build and automated checks, then add Android build/device tests before considering a release.

## Scope boundary

No application source, Firebase configuration, secrets, live hosting settings, or production services were changed as part of this audit. This document records observations from the current `main` source and must be updated as the remaining page-by-page audit proceeds.


## Additional route-family inspection

- The current `src/App.jsx` contains 66 lazy-loaded page modules, 70 route declarations, and 69 unique route paths; `/responder-assignments` is declared twice.
- Identity routes include password login/signup, Google sign-in/up, passkey login, email verification, password reset, and onboarding. Profile editing includes photo upload and accessibility preferences.
- Post detail includes reactions and translation; saved posts and social connections have separate routes. Cross-posting is a substantial workflow with platform selection, request creation, processing, retry/status components, and persistent records. Keep each platform's existing connection state and permissions unchanged during the Android foundation work.
- Creator monetization/activity/earnings and advertiser/enterprise dashboards are not uniformly complete: some routes are navigation shells or static display cards, while other modules contain Firestore reads/actions. The Android feature matrix must distinguish implemented, partial, and placeholder behavior rather than counting every route as a complete feature.
- Verification includes application, document submission, payment, status/history, and admin review routes. Premium payment uses the existing Flutterwave integration. These payment paths need provider and app-distribution policy review before any store release; do not silently replace them with a different payment system.
- Responder assignment includes state-changing actions to start response, mark arrival, request backup, and complete a mission. These must only be exercised with synthetic test data and a test-only backend authorization path.

## Existing validation status

- The repository's pull-request CI workflow ran successfully on the source snapshot at commit `010bd61d816e83ff4f2aed9993a8ac73627f2494`: frontend Vite build, backend syntax/notification-provider/webhook tests, and Firestore rules emulator validation all passed.
- The subsequent audit commits changed documentation only; application source was unchanged from that validated source snapshot.
- `package.json` exposes `dev`, `build`, and `preview` scripts; it does not define a dedicated frontend unit-test or lint script. The existing CI's build and rule/backend checks are useful baseline gates but do not constitute full UI or Android device testing.
