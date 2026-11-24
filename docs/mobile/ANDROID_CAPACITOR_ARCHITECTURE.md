# Inclura Android architecture decision

**Status:** Proposed implementation foundation; not yet installed or built.

## Decision

Add an Android application shell to the existing React/Vite application using **Capacitor 8**, rather than creating a second product, second account system, or second data store.

The Android package must load the same Inclura React application and use the existing Firebase project, existing IFSE services, and existing website routes. The native layer is an additive shell for Android-specific lifecycle, navigation, notifications, sharing, media, and device capabilities.

## Version and build baseline

As checked on 24 November 2026:

- Capacitor Core, Android, and CLI stable release: **8.6.2** (pin all three to the same exact version).
- Capacitor 8 requires Node.js 22 or newer.
- Capacitor 8 Android development requires Android Studio 2025.2.1 or newer and Android SDK API 24 or newer; its current Android target SDK matrix is API 36.
- The existing Inclura GitHub Actions workflows use Node.js 20. The Android build workflow must use Node.js 22; the web build/deploy workflow upgrade should be tested separately before it is changed.
- The existing Vite output directory is `dist`, and the root `index.html` has a `head` element, so the current web build meets Capacitor's basic web-project requirements.

Official references:
- https://capacitorjs.com/docs/getting-started
- https://capacitorjs.com/docs/getting-started/environment-setup
- https://capacitorjs.com/docs/android
- https://www.npmjs.com/package/@capacitor/core
- https://www.npmjs.com/package/@capacitor/android
- https://www.npmjs.com/package/@capacitor/cli

## Application behavior requirements

1. Bundle the existing `dist` output locally in the Android application. Do not point the release app at a separate hosted webview URL as a substitute for a real package.
2. Preserve the React Router route table and add verified Android App Links/deep links when the public domain is configured.
3. Preserve Firebase Auth identity, Firestore data, Storage uploads, and existing backend endpoints. No second login system or duplicate user records.
4. Keep the existing Inclura logo. Generate Android adaptive launcher/splash assets from the approved logo asset; do not replace it with a generic icon.
5. Use an accessible native-feeling navigation layout, but retain every website route in a searchable/all-features destination so less-used admin, creator, enterprise, verification, and IFSE functions are not hidden.
6. Add only the minimum native bridge code required. Do not add unrelated third-party SDKs or services.
7. Test password login, Google redirect login, passkey behavior, file/camera/media pickers, share sheet, back navigation, accessibility, and deep links on a real Android device before release.

## Notifications and emergency restrictions

- The web app currently registers web FCM tokens and the rules require `platform: 'web'` for both member and guest community-alert token records.
- Native Android push must use a separate Android token-registration path, with owner/guest identity and consent preserved. Do not reuse a web token, label an Android token as web, or weaken token ownership rules.
- Do not ship native emergency dispatch until the actual IFSE backend source/contract and authorization are reviewed. The current client dispatch engine conflicts with the repository's restrictive Firestore rules.
- No real SOS, SMS, email, or external recipient delivery may be used for tests. Use synthetic emergencies and isolated test-only notification delivery.

## Build and release stages

1. Capacitor configuration and Android project generation on an isolated feature branch.
2. GitHub Actions debug APK build and artifact; no production deployment.
3. Device smoke tests with a dedicated test account.
4. Native auth, deep links, native push, media permissions, and app lifecycle integration.
5. Performance/accessibility testing and full route/action parity sign-off.
6. Signed release build only after app identity, domain, Firebase Android app registration, privacy disclosures, and Play distribution requirements are confirmed.

**No Android project, dependency, Firebase setting, production route, or live service has been changed by this architecture decision.**
