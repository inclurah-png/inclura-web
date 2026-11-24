# Inclura Android — Route Guard Review Findings

**Baseline:** `main` at `e12ceb16da1be4e9e8723122270a6ca48a61a735`  
**Source:** `src/App.jsx` and the existing route guard components  
**Status:** Source-level review; role intent requires confirmation against existing IFSE service contracts.

## Current route guard patterns

- `ProtectedRoute`: waits for Firebase auth restoration, redirects signed-out users to login, and requires email verification for password-provider accounts.
- `CreatorRoute`: checks `users/{uid}.role === "creator"`.
- `AdvertiserRoute`: checks `users/{uid}.role === "advertiser"`.
- `EnterpriseRoute`: checks `users/{uid}.role === "enterprise"`.
- `AdminRoute`: checks `users/{uid}.role === "admin"`.

## Route access mapping observed in App.jsx

- Most signed-in member features use `ProtectedRoute`.
- Creator earnings uses `CreatorRoute`.
- Advertiser dashboard and ad manager use `AdvertiserRoute`.
- Enterprise, enterprise ads, campaigns and analytics use `EnterpriseRoute`.
- Admin, verification management, ad approval, user management, reports, pricing, platform analytics and IFSE risk panel use `AdminRoute`.
- Creator analytics is currently wrapped in `AdminRoute`, not `CreatorRoute`. Confirm whether this is intentional before reproducing access in Android.
- SOS responder dashboard, responder assignments, and family emergency dashboard/timeline/map/notifications routes are currently wrapped in `AdminRoute`. Confirm the intended responder/family role model against the existing IFSE backend before reproducing access.
- `/responder-assignments` is declared twice in `App.jsx`. Investigate and consolidate only after confirming no route behaviour depends on the duplicate.
- `/sos` uses `ProtectedRoute`.

## Security requirements for Android

Client-side route wrappers are navigation/presentation guards; they do not replace Firestore security rules or backend authorization. The Android app must not weaken existing server/database access controls or rely solely on hiding menu icons.

Preserve the existing role checks and fail-closed behaviour until a deliberate access-policy review is completed. Confirm each privileged route's backend/Firestore authorization. Any change to creator, advertiser, enterprise, admin, responder, or family access must be based on the current service contract and an explicit security review.

No access-control code has been changed in this audit.
