# Inclura Android Application — Feature and Icon Preservation Audit

**Status:** Initial repository baseline; functional verification still required.  
**Source repository:** `inclurah-png/inclura-web`  
**Baseline branch:** `main`  
**Baseline commit:** `e12ceb16da1be4e9e8723122270a6ca48a61a735`  
**Audit date:** 2026-11-24

## Non-negotiable product requirements

1. The Android application must use the existing Inclura identity, Firebase project, data model, authentication, media services, and authorized Inclura backends.
2. Do not create a second user database, duplicate account system, or disconnected social platform.
3. Preserve every existing website route, feature, icon, and working action. A mobile redesign may reorganize navigation, but it must not silently remove capabilities.
4. Audit each icon and control for its actual destination/action. An icon that is only decorative or currently inert must be recorded as a gap, not represented as a working feature.
5. Keep role-based access and protected routes. Admin, enterprise, advertiser, creator, responder, and member capabilities must not be exposed to unauthorized accounts.
6. Keep IFSE/SOS safeguards intact. No live emergency dispatch, SMS, or real recipient notification during development tests without explicit authorization.
7. Improve performance using measurable loading, navigation, media, and reliability tests. Do not claim superiority over other platforms without evidence.
8. Preserve the existing web application. Android packaging and native integrations must be additive and introduced through reviewed changes.

## Current repository baseline

- Frontend: React 18, Vite 5, React Router 6.
- Existing Firebase client: `src/firebase.js`.
- Firebase project ID: `inclura-prod-90734`.
- Authentication/profile state: `src/context/AuthContext.jsx`.
- Existing logo component: `src/components/Logo.jsx`, loading `/logo.png`; wordmark accent currently `#38bdf8`.
- Main route definitions: `src/App.jsx`.
- Shared dashboard navigation: `src/components/DashboardSidebar.jsx`.
- Existing responsive dashboard wrapper: `src/components/DashboardLayout.jsx`.
- Current `package.json` has no Capacitor dependencies or Android project yet.
- Existing web media upload path includes the authenticated IFSE backend media API; inspect and reuse its existing contract rather than creating a new media store.

## Route inventory from App.jsx

The current router contains 70 route declarations (including one repeated path and legacy redirects). The route declarations observed at the baseline are:

### Public, identity, and sharing
- `/`
- `/community-alerts`
- `/login`
- `/signup`
- `/identity/biometric-verification`
- `/forgot-password`
- `/verify-email`
- `/onboarding`
- `/share/:id`

### Social, profile, content, and communication
- `/post/:id`
- `/crosspost/:id`
- `/social-connections`
- `/profile`
- `/edit-profile`
- `/user/:userId`
- `/messages`
- `/notifications`
- `/saved-posts`
- `/search`
- `/reels-system`
- `/create-reel`

### Account, commerce, and opportunities
- `/wallet`
- `/digital-services`
- `/pay-topup` (legacy redirect)
- `/withdraw` (legacy redirect)
- `/transfer` (legacy redirect)
- `/transactions` (legacy redirect)
- `/marketplace`
- `/opportunities`
- `/care-gigs`
- `/care-gigs/request`
- `/mentor-hub`

### Accessibility and verification
- `/accessibility`
- `/verification-center`
- `/verification-application`
- `/verification-documents`
- `/verification-payment`
- `/verification-status`

### Creator, advertiser, enterprise, and premium
- `/creator-monetization`
- `/my-creator-activity`
- `/creator-analytics`
- `/creator-earnings`
- `/advertiser-dashboard`
- `/ad-manager`
- `/enterprise`
- `/enterprise-ads`
- `/enterprise-campaigns`
- `/enterprise-analytics`
- `/enterprise-partnership`
- `/corporate-partnership`
- `/government-partnership`
- `/premium-dashboard`
- `/premium-payment`

### Administration
- `/admin`
- `/verification-manager`
- `/verification-requests`
- `/ad-approval`
- `/users-management`
- `/reports-violations`
- `/pricing-manager`
- `/platform-analytics`
- `/admin/ifse-risk`

### IFSE emergency and responder
- `/sos-responder`
- `/responder-assignments` (declared twice; investigate duplicate)
- `/family-emergency-dashboard`
- `/family-emergency-timeline`
- `/family-emergency-map`
- `/family-emergency-notifications`
- `/sos`

**Note:** The route list is a code inventory, not proof that every route is currently reachable or fully functional. Route guards, role conditions, route elements, redirects, and page-level actions must be checked before app parity is certified.

## Existing shared navigation inventory

The current dashboard sidebar contains navigation for:
- Dashboard/profile
- Notifications
- Messages
- Account activity/wallet
- Social connections
- Digital services
- Saved posts
- Search
- Edit profile
- Verification centre
- Accessibility hub
- Opportunities
- Care gigs
- Mentor hub
- Marketplace
- Reels
- Creator monetisation
- Advertiser dashboard and ad manager (role-gated)
- Enterprise, enterprise ads, campaigns and analytics (role-gated)
- Creator analytics (role-gated)
- Platform analytics, pricing, user management, reports, verification management, ad approval and admin (role-gated)
- SOS

Role-specific menu rendering and route guards must be preserved. Complete the rest of the sidebar source audit before finalising the icon matrix.

## Early UI/functionality findings requiring verification

These are audit leads, not assumptions about all app screens:

- `src/components/MobileNav.jsx` currently renders five emoji buttons (home, video, add, messages, profile) without click handlers. They are visual controls, not yet functional navigation in that component.
- `src/components/Topbar.jsx` currently renders search, language, notification, message, add, and profile controls. At least the notification/message/add/profile controls shown in the inspected source have no navigation/action handlers; search input is not connected in that component.
- `src/components/ReelsSection.jsx` currently renders a static promotional section. The dedicated Reels page and create-reel route must be audited separately.
- The logo component loads `/logo.png`; verify that asset exists in the public build and use the exact same asset in Android launcher/splash assets after inspecting it.
- Existing route declarations and sidebar destinations must be cross-checked for dead links, missing routes, duplicates, and mismatched access control.

## Feature areas to audit screen-by-screen

- Authentication, registration, email verification, password recovery, onboarding, biometric flows
- Feed, create post, text/image/video posts, stories, reactions, comments, saves, sharing, cross-posting
- Search, member discovery, follows, connections, public/member profiles
- Messages, attachments, voice notes/recording, translation, read-aloud/accessibility controls
- Notifications and push registration
- Reels viewing and creation
- Wallet/account activity and payment-related pages (including existing redirects and actual non-custodial semantics)
- Digital services, marketplace, opportunities, care gigs, mentorship
- Accessibility settings and assistive features
- Verification application, documents, payments, status, and administration
- Creator tools, monetisation, analytics, earnings, advertiser tools, enterprise and partnerships
- Premium features
- Admin moderation, reports, pricing, users, analytics
- IFSE family emergency features, SOS, responder tools, trusted contacts, emergency timelines/maps/notifications, risk controls
- Community alerts and opt-in behaviour
- Language/localisation and all visible icon-only controls

## Android architecture decision gate

The existing app is React/Vite. Capacitor is the initial candidate for packaging the existing app as Android while retaining shared UI and existing services. Before implementation, verify:
- current Vite output/build and router deep-link behaviour;
- Firebase Auth persistence and supported sign-in flows on Android;
- FCM native token registration, notification channels, and token lifecycle;
- camera, gallery, microphone, file attachment, location and biometric permission needs;
- Android back navigation, app links/deep links, offline/error states;
- media upload and playback performance on real Android devices;
- secure storage requirements and absence of secrets in the client bundle;
- build/signing/release workflow and minimum supported Android version.

Do not add a native plugin or request a device permission until a mapped feature requires it and its privacy/security implications have been reviewed.

## Acceptance criteria for feature parity

- Every existing route is classified: public/member/creator/advertiser/enterprise/admin/responder; route guard and expected behaviour documented.
- Every visible icon/button is recorded with label, location, destination/action, access rule, and working/inert status.
- Every existing capability is assigned to an Android screen or an explicitly documented device-appropriate interaction.
- No feature is removed without an explicit product decision.
- Existing Firebase identity and data remain canonical; a user can use the same account on web and Android.
- Native notifications and deep links resolve to the correct authenticated Inclura screen.
- No unauthorized role can reach privileged pages through direct navigation.
- SOS safety tests remain dry-run only unless separately authorized.
- Android and web builds pass, and core flows are exercised on a real Android device before release.

## Next audit tasks

1. Complete the full sidebar, topbar, feed, story, media, chat, and notification action inventory.
2. Inspect all route guards and page-level controls, including all role-gated areas.
3. Verify the logo asset and existing Firebase/backend configuration without exposing secrets.
4. Create a route-to-screen and icon-to-action matrix.
5. Only then introduce Capacitor and Android-specific code on this feature branch.
