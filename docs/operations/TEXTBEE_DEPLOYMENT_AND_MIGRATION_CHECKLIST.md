# Inclura IFSE — TextBee Deployment and Migration Checklist

**Status:** Preparation only; no TextBee server or live SMS route is deployed.
**Pinned baseline:** TextBee v2.10.0, upstream commit `4ecd70d` (verify the full commit SHA and release tag again immediately before building).
**SMS state:** `SOS_SMS_ENABLED=false`. This must not change during preparation.
**Companion security controls:** `TEXTBEE_SELF_HOSTING_SECURITY_RUNBOOK.md`.

## 1. Current readiness

| Item | State | Notes |
|---|---|---|
| Dedicated Firebase project | Prepared | Project: Inclura TextBee Gateway |
| Android app registration | Complete | Package: `com.vernu.sms` |
| Android Firebase config | Downloaded by project owner | Keep local/private; install only in the matching pinned Android source tree at build time |
| Firebase Admin SDK key | Generated and downloaded by project owner | Highly sensitive; do not send through chat, email, GitHub, screenshots, or source control |
| TextBee source baseline | Selected | v2.10.0 / commit prefix `4ecd70d`; re-verify full SHA and release integrity before build |
| Domain | Deferred | Owner intends to purchase after configuration work |
| Hosting/VPS | Deferred | No paid hosting to be provisioned yet |
| MongoDB and Redis | Not deployed | Must use persistent storage and private networking |
| SMTP | Not configured | Evaluate a genuinely free SMTP option and its limits; do not assume an API-email allowance automatically includes SMTP access |
| Android gateway APK | Not built | Requires final API domain, matching Firebase config, and a proper release signing key |
| Inclura adapter | Prepared in code | Server-side configuration only; no live TextBee credentials |
| Signed delivery webhook | Implemented in Inclura | Live TextBee subscription and end-to-end acceptance test remain outstanding |
| Production SMS | Disabled | No real recipient messages or emergency dispatch tests |

## 2. Deployment strategy — do not create a temporary production instance

Because the domain and paid hosting are intentionally deferred, the preferred approach is to prepare now and deploy directly to the final domain later. This avoids building an Android APK against a temporary hostname and then having to replace it.

The final domain will be selected by the owner. A possible naming pattern is `sms.<owned-domain>`; this is only an example and must not be treated as an existing hostname.

When the domain and host are purchased:
1. Create the DNS record for the chosen TextBee hostname.
2. Provision a supported Linux VPS with Docker Engine and Compose.
3. Configure the reverse proxy and obtain HTTPS before exposing the dashboard or API.
4. Deploy the pinned TextBee API, dashboard, MongoDB, and Redis.
5. Configure the Android production build against the final HTTPS API URL.
6. Build, sign, and install the dedicated gateway APK.
7. Configure Inclura's backend adapter and signed webhook using server-side secrets.
8. Run the staged acceptance tests before any production approval.

## 3. Hosting acceptance requirements

Do not select a host solely because it advertises a free web service. The selected host must support persistent Docker workloads and storage, stable outbound connectivity, backups, security updates, and sufficient memory/disk for the complete stack.

Compare providers on:
- Total first-year and renewal cost, billing currency, taxes, and payment method requirements.
- VPS region and network reliability for the gateway phone and intended recipients.
- CPU, RAM, SSD capacity, bandwidth, snapshot/backup charges, and support.
- Docker Compose support, firewall controls, static/public IP, and recovery options.
- Ability to keep MongoDB and Redis private and expose only the reverse proxy.
- Data export and server replacement options.

Do not claim that a free tier is production-suitable until persistent storage, background process limits, sleep/scale-to-zero behaviour, network restrictions, backup capability, and terms have been verified.

## 4. Service layout and network policy

Use the upstream Compose stack for the pinned revision, after reviewing its exact configuration. Expected components are:
- TextBee API (internal application port 3001).
- TextBee dashboard (internal application port 3000).
- MongoDB.
- Redis.
- Optional Mongo Express: **omit/disable in production**.

Network policy:
- Public ingress: HTTPS through Caddy or Nginx only.
- Redirect plain HTTP to HTTPS.
- Keep MongoDB, Redis, Mongo Express, Docker socket/API, and internal service ports off public interfaces.
- Prefer private Docker networking with no public host-port mappings for database/queue services.
- Apply host firewall rules as defence in depth.
- Restrict administrative SSH to key-based access and trusted sources.
- Use unique credentials for TextBee; never reuse Inclura secrets.

## 5. Secret handling

The owner has downloaded two Firebase files. Their contents must not be pasted into this repository or conversation.

At final deployment:
- Transfer the Admin SDK credential directly into a protected server-side secret mechanism using a secure local workflow. Do not commit it or place it in a public build context.
- Place `google-services.json` only in the exact Android source-tree location required by the pinned upstream build variant, and ensure it is excluded from source control if the repository's policy requires it.
- Use separate random secrets for MongoDB, TextBee JWT/authentication, dashboard authentication, Inclura API key, and webhook signing.
- Keep the TextBee API key and webhook signing secret separate.
- Never expose credentials in frontend `NEXT_PUBLIC_*` variables, Android resources, CI logs, issue trackers, screenshots, or diagnostics.
- Restrict access to the VPS secret store and rotate credentials after suspected exposure.
- Keep an encrypted offline backup of necessary deployment secrets with access controlled by the owner.

Firebase service-account credentials are powerful project credentials. Grant only the permissions required by the pinned TextBee server and review Google's current IAM guidance before production use.

## 6. Database and queue persistence

Before first live use:
- Use unique MongoDB root/application credentials and authenticated connections.
- Keep MongoDB and Redis private to the deployment network.
- Configure persistent volumes for MongoDB and Redis.
- Configure Redis persistence appropriate to the queue's recovery requirements; verify the exact Redis settings used by the pinned release.
- Schedule encrypted MongoDB backups outside the VPS and restrict backup access.
- Define retention periods for message records and operational logs.
- Perform a clean restore test onto an isolated staging instance before production.
- Document how to pause message processing safely during maintenance or migration.

Redis queue state may not be interchangeable with a database backup. Document and test queue draining/recovery rather than assuming a MongoDB restore recovers pending jobs.

## 7. SMTP and email verification

TextBee requires outgoing email for account verification and account notices. Before selecting an SMTP provider:
- Verify that it provides actual SMTP credentials/relay access, not only an HTTP email API.
- Confirm free-tier daily/monthly limits, recipient restrictions, domain verification, sender requirements, and deliverability policies.
- Do not assume the existing Inclura Resend account's allowance is available to TextBee until SMTP compatibility, account separation, limits, and terms are verified.
- Use a dedicated sender identity and protect SMTP credentials as server secrets.
- Test verification and password-reset messages only to project-controlled addresses.

Do not allow the TextBee dashboard to send SMS until the administrator account email is verified and the gateway is configured.

## 8. Android gateway build and handover

The public TextBee APK is configured for the hosted TextBee service and must not be assumed to connect to a self-hosted server.

After the final domain is active:
1. Check out the exact pinned TextBee revision.
2. Verify the Android production API base URL points to the final HTTPS API origin and correct `/api/v1/` path.
3. Place the dedicated Firebase `google-services.json` in the documented production variant location.
4. Review every domain replacement and confirm no hosted-service endpoint remains unintentionally.
5. Create a proper release signing key; do not distribute a debug-signed build.
6. Build the production APK and record its source revision and checksum.
7. Install it on the dedicated Android gateway phone.
8. Enrol only the approved device and record its device ID securely.
9. Apply the required SMS, phone-state, notification and background/battery permissions.
10. Verify phone power, data connectivity, SIM registration, SMS balance, and device heartbeat.

The gateway phone must remain powered and online. Android background restrictions, network outages, SIM failure, carrier filtering, and insufficient SMS balance can delay or prevent sending.

## 9. Inclura integration and delivery lifecycle

Configure the Inclura IFSE backend only after the self-hosted TextBee API is reachable over HTTPS:
- `SMS_PROVIDER=textbee`
- `TEXTBEE_BASE_URL`: final HTTPS origin owned by the project.
- `TEXTBEE_API_KEY`: protected server-side secret.
- `TEXTBEE_DEVICE_ID`: the explicitly approved gateway device.
- `SOS_SMS_ENABLED=false` until all production approval criteria pass.

Configure the TextBee webhook to call Inclura's implemented endpoint:
`POST /api/integrations/textbee/webhook`.

Before enabling the subscription, verify the exact v2.10.0 webhook signature/header format, event names, subscription ID, and device ID against both the upstream deployment and Inclura receiver. Use a separate webhook signing secret. Test signature validation, timestamp expiry, altered body, replay, duplicate event, unknown batch, mismatched recipient, and invalid status transition.

Provider acceptance, gateway dispatch, carrier send, and recipient delivery are distinct states. Do not report a message as delivered merely because the API accepted it or the phone accepted a send request.

## 10. Migration and host replacement procedure

The preferred initial deployment is directly on the final host/domain. If a temporary staging host is used, it must contain test-only data and must never send real emergency messages.

For a later host replacement:
1. Freeze new TextBee sends and pause/drain the queue using the documented safe procedure.
2. Record current TextBee and Android versions, configuration names, image digests, DNS values, and device identity. Do not export secrets into the migration report.
3. Create an encrypted MongoDB backup and verify its checksum.
4. Back up required configuration and persistent data securely. Treat Redis queue state separately and document pending jobs.
5. Provision the replacement host with the same pinned release and equivalent network isolation.
6. Restore MongoDB to the new private database and restore only the required persistent configuration.
7. Recreate secrets from the owner's secure source; do not copy secrets through GitHub or chat.
8. Verify API/dashboard health, user login, device registration, webhook subscription, and database integrity in staging.
9. If the public domain changes, rebuild and re-sign the Android gateway against the new domain; if it remains unchanged, verify DNS/TLS cutover and gateway reconnection.
10. Update the Inclura backend's protected TextBee origin/device configuration only after validation.
11. Run authorised test-recipient acceptance tests, confirm the signed receipt lifecycle, then resume the queue.
12. Keep the old host isolated and read-only until backup integrity and the new host are confirmed; then securely retire old secrets and data according to retention policy.

Do not run two active gateways against the same device identity or allow both old and new instances to send concurrently during cutover.

## 11. Acceptance gates before production

- [ ] Exact upstream release/tag and full commit SHA verified.
- [ ] Licence notices and AGPL-3.0 obligations reviewed.
- [ ] Final domain, HTTPS, DNS and certificate renewal verified.
- [ ] Public scan confirms MongoDB/Redis/internal ports are not exposed.
- [ ] Unique secrets installed server-side; no secret in Git history or build artifacts.
- [ ] MongoDB/Redis persistence and encrypted backup/restore tested.
- [ ] SMTP relay and verification tested within a verified free/paid allowance.
- [ ] Dashboard administrator security reviewed.
- [ ] Android APK built from the pinned revision, properly signed, and connected to the final domain.
- [ ] Only the approved gateway device is enrolled and healthy.
- [ ] Inclura adapter rejects wrong host, HTTP, missing credentials/device ID, timeout, malformed response and duplicate request safely.
- [ ] Webhook signatures, freshness, idempotency, event mapping and known-message matching all pass.
- [ ] SMS content minimisation, recipient authorization, rate limits and audit logging pass.
- [ ] Carrier SMS charges and SIM/network limitations are understood.
- [ ] Backups, monitoring, incident response and outage procedures are operational.
- [ ] User gives separate explicit approval for production SMS activation.

## 12. Cost and scope guardrails

- No hosting or domain purchase during preparation.
- Prefer free/open-source components where they meet security and reliability requirements.
- Do not treat carrier SMS as free; carrier/SIM charges remain separate.
- Do not introduce paid SMTP or another paid service without comparing a suitable free option and explaining any limitations.
- Do not deploy a public test server merely to make the setup appear complete.
- No live SMS, real SOS, real Trusted Contact notifications, or production dispatch during acceptance testing.
- Keep Inclura's SMS switch OFF until explicit production approval.

## 13. Official references

- TextBee self-hosting: https://textbee.dev/docs/self-hosting
- TextBee source and licence: https://github.com/textbee/textbee
- TextBee FAQ/device operation: https://textbee.dev/docs/faq
- Firebase Cloud Messaging: https://firebase.google.com/docs/cloud-messaging
- GNU AGPL-3.0: https://www.gnu.org/licenses/agpl-3.0.html
