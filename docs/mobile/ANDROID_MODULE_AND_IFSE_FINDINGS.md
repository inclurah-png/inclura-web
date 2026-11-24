# Additional module and IFSE source findings

**Status:** Static source inspection; further modules remain to be audited. No UI actions were executed and no emergency dispatch was triggered.

## Account, commerce, and enterprise modules

| Module | Source finding | Parity / remediation note |
|---|---|---|
| Account activity / wallet | `src/pages/Wallet.jsx` is an account-activity information page with a link to Digital Services. It does not implement a wallet balance, top-up, withdrawal, or transfer flow in this component. | Preserve the page's security boundary. Do not present it as a functioning custodial wallet. Keep payment/financial actions on explicitly authorized services. |
| Digital Services | `src/pages/DigitalServices.jsx` displays service categories (airtime, data, electricity, cable TV, internet, bills) and opens the existing external storefront `https://inclura.rechargewebsite.com`. The category tiles themselves are not action buttons. | Preserve the existing external checkout integration and clearly distinguish it from Inclura's account activity. Test Android external-link handling and return-to-app behavior. |
| Marketplace | `src/pages/Marketplace.jsx` loads `marketplaceListings`, supports search/category/equipment filters, content translation, refresh, and seller contact navigation. | Preserve filters, translation, listing data, and seller contact. Verify listing ownership and Firestore rules. |
| Opportunities | `src/pages/OpportunitiesHub.jsx` loads opportunities and has search/category controls. | Preserve discovery/filter behavior and inspect application actions and role constraints in the remaining review. |
| Care Gigs | `src/pages/CareGigs.jsx` loads care requests and contains interactive request-related UI. | Preserve the request workflow; audit its write paths and access boundaries before porting. |
| Mentor Hub | `src/pages/MentorHub.jsx` loads up to 50 mentor directory entries, supports expansion, and navigates to messages/profile. | Preserve discovery and contact navigation; keep mentor directory fields intentionally public only. |
| Enterprise pages | `src/pages/Enterprise.jsx` and `src/pages/EnterpriseAds.jsx` currently render static cards without action handlers in those components. | Treat these as presentation placeholders until connected workflows are verified; do not imply campaign creation, billing, or analytics are functional merely because cards are displayed. |

## IFSE / SOS source findings — high priority

### Responder dispatch

- `src/pages/SOSResponderDashboard.jsx` imports and calls `dispatchEmergency()` from `src/services/ifseDispatchEngine.js` when the “Assign Responder” button is pressed.
- This is a real state-changing dispatch path, not a harmless preview. **Do not click it during testing.**
- The current page loads open emergencies from Firestore and presents an assignment action. Its route is currently wrapped by `AdminRoute` in `src/App.jsx`; this must be reconciled with the intended responder/admin role policy and the IFSE backend authorization.
- The dispatch engine is a large module with Firestore writes and escalation integration. Its full authorization and external notification behavior must be reviewed before any Android integration or testing.

### Family emergency pages

- `src/pages/FamilyEmergencyDashboard.jsx` calls `loadDashboard()` from its effect, but the component defines `loadEmergencies()`, not `loadDashboard()`.
- The same file calls `setDashboard(data)`, while the declared state setter is `setEmergencies`.
- These are source-level runtime defects that need a controlled fix and regression test before treating the family dashboard as working.
- The family dashboard, timeline, map, and notifications routes are currently wrapped by `AdminRoute` in `src/App.jsx`. Their actual intended family-member access must be confirmed against trusted backend roles and rules before changing guards.
- The timeline, map, and notification components read records filtered by `visibleToFamily == true`; this client-side query filter is not a substitute for server-side authorization.

## Implementation rule

Do not “repair” IFSE by making client-side queries broader, adding a generic admin bypass, or calling dispatch endpoints from the Android client without the existing trusted authorization model. Correct the source defects, role mapping, and backend contract in isolated reviewed changes, then test only with synthetic records and non-delivery test channels.
