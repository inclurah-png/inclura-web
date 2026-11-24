# Inclura Android — Initial Navigation and Control Audit

**Baseline:** `main` at `e12ceb16da1be4e9e8723122270a6ca48a61a735`  
**Audited source:** `src/components/DashboardSidebar.jsx`, `src/components/MobileNav.jsx`, `src/components/Topbar.jsx`, `src/components/ReelsSection.jsx`  
**Status:** Source-level audit only. No device interaction or end-to-end functional certification has been performed.

## 1. Dashboard sidebar

The sidebar source contains 34 button elements, including logout. The following navigation destinations were identified:

| Icon in source | Destination | Access / notes |
|---|---|---|
| 🏠 | `/profile` | Dashboard/profile |
| 🔔 | `/notifications` | Notifications |
| 💬 | `/messages` | Messages |
| 🔗 | `/wallet` | Account activity |
| 🔗 | `/social-connections` | Social connections |
| 📱 | `/digital-services` | Digital services |
| 🔖 | `/saved-posts` | Saved posts |
| 🔍 | `/search` | Search |
| ⚙ | `/edit-profile` | Edit profile/settings |
| 🔐 | `/verification-center` | Verification |
| ♿ | `/accessibility` | Accessibility |
| 💼 | `/opportunities` | Opportunities |
| 🤝 | `/care-gigs` | Care gigs |
| 🎓 | `/mentor-hub` | Mentorship |
| 🛒 | `/marketplace` | Marketplace |
| 🎥 | `/reels-system` | Reels |
| ✨ | `/creator-monetization` | Creator monetisation |
| 📢 | `/advertiser-dashboard` | Advertiser role only |
| 📢 | `/ad-manager` | Advertiser role only |
| 🏢 | `/enterprise` | Enterprise role only |
| 🏢 | `/enterprise-ads` | Enterprise role only |
| 🏢 | `/enterprise-campaigns` | Enterprise role only |
| 🏢 | `/enterprise-analytics` | Enterprise role only |
| 📈 | `/creator-analytics` | Creator role only |
| 📊 | `/platform-analytics` | Admin role only |
| 💲 | `/pricing-manager` | Admin role only |
| 👥 | `/users-management` | Admin role only |
| 🚨 | `/reports-violations` | Admin role only |
| 📋 | `/verification-requests` | Admin role only |
| ✅ | `/verification-manager` | Admin role only |
| 📋 | `/ad-approval` | Admin role only |
| 👨‍💼 | `/admin` | Admin role only |
| 🚨 | `/sos` | Emergency feature; keep protected and safe |

The 34th button is logout (🚪). It calls Firebase `signOut` and navigates to `/login`.

The sidebar's role state is read from the signed-in user's Firestore profile. The Android app must preserve server/database-backed role checks and the route-level guards; hiding a menu item alone is not authorization.

## 2. Mobile navigation component

`src/components/MobileNav.jsx` currently displays five emoji buttons:

- 🏠 Home
- 🎥 Video
- ➕ Create
- 💬 Messages
- 👤 Profile

**Finding:** In the inspected component these buttons have no click handlers, route links, or accessibility labels. Treat this component as a visual placeholder. In Android, these five navigation destinations should be implemented as real actions and must not replace the full feature catalogue. A visible “Create” action should open a chooser for the existing creation capabilities rather than silently limiting users to one post type.

## 3. Topbar component

`src/components/Topbar.jsx` displays:
- Search input
- Language selector (English and Spanish options in this component)
- 🔔 Notifications button
- 💬 Messages button
- ➕ Add button
- Circular profile initial

**Findings from inspected source:**
- Search input has no submit/search handler in this component.
- Notifications, messages, and add buttons have no click handlers in this component.
- Profile initial is a non-interactive `div`, not a profile link/button.
- Language selector calls i18next `changeLanguage`; verify available translations and persistence elsewhere.

The Android implementation must wire these controls to existing routes/services and give icon-only controls accessible names. Do not copy inert controls as though they were functional.

## 4. Reels section

`src/components/ReelsSection.jsx` is currently a static descriptive panel. The dedicated `/reels-system` and `/create-reel` pages exist in the route inventory and need separate page-level audits. Do not treat the static panel as proof of working video playback or publishing.

## 5. Immediate implementation implications

1. Preserve the complete sidebar feature set, but present it in a mobile-friendly navigation drawer, searchable feature hub, and concise bottom navigation.
2. The bottom bar should expose a small set of frequent destinations; it must not become the only place where less frequent modules can be found.
3. Add a clearly discoverable “All features” area for the full route inventory, with role-aware visibility.
4. Every icon must have a label, accessible description, correct destination/action, loading/error state where applicable, and a permission check.
5. Use a consistent icon library/vector asset set rather than a mixture of decorative emoji and inconsistent symbols, while retaining recognizable meanings and all existing feature destinations.
6. Do not implement new feature actions until the existing page's current data/service contract has been inspected.

## 6. Remaining audit work

- Inspect page-level actions for every route, not just the shared navigation.
- Inspect authentication, route guards, and role checks.
- Verify all social feed, stories, comments, reactions, media, Reels, chat, notification, accessibility, payment, verification, creator, enterprise, admin, and IFSE actions.
- Inspect the logo file and brand assets.
- Verify Firebase Auth persistence, FCM token registration, web push assumptions, and native Android equivalents.
- Run the existing web production build and tests before and after Android integration.
