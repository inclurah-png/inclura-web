# Inclura IFSE — TextBee Self-Hosting and Security Runbook

**Status:** Preparation only. No TextBee infrastructure is deployed by this document.
**SMS production state:** Disabled. Do not change `SOS_SMS_ENABLED` to `true` as part of setup.
**Purpose:** Define the controlled process for evaluating and later deploying a self-hosted TextBee SMS gateway as a supplementary IFSE notification channel.

## 1. Architecture and trust boundaries

TextBee is a separate, independently operated service. It is not embedded in Inclura and must not receive access to Inclura's Firebase project, member database, SOS database, responder records, trusted-contact records, or administrative credentials.

The intended message path is:

1. An authenticated, registered Inclura member creates an SOS through the existing IFSE workflow.
2. Inclura's backend validates the SOS and its authorised recipients.
3. Inclura's backend sends a minimal SMS request to the configured self-hosted TextBee HTTPS API.
4. TextBee queues the request and wakes the specifically pinned Android gateway device.
5. The Android phone submits the SMS through its SIM and mobile carrier.
6. TextBee status events may later be used to update the Inclura audit trail, but only after a separately reviewed, authenticated webhook receiver has been implemented and tested.

TextBee must not initiate SOS incidents, choose emergency responders, access IFSE administration, or receive broad Inclura data. External agencies must not install software, SDKs, gadgets, plugins, or tracking/control systems inside Inclura.

## 2. Hosting is deferred

Do not purchase or provision a VPS, domain, database, SMTP plan, or other paid infrastructure during this preparation stage. The user has authorised paying for hosting after the wider setup is complete, not spending now.

Before any hosting purchase, compare a small VPS and its renewal price, bandwidth, backups, storage, region, support, and ability to run Docker Compose. Include the cost of a domain and any paid SMTP service if a genuine free option is not sufficient. Self-hosting does not make carrier SMS free: the SIM provider's outgoing SMS charges still apply.

The TextBee self-hosting guide currently lists Docker, MongoDB, Redis, a Firebase Cloud Messaging project, a domain with HTTPS, SMTP, and a separately built Android app as prerequisites. Confirm current upstream requirements and pinned-version compatibility at deployment time.

## 3. Upstream source and supply-chain controls

Before deployment:

- Select and record an exact upstream TextBee Git commit or signed release tag. Do not deploy an unpinned moving `main` branch.
- Review the source changes, Docker images, build scripts, and dependency licence notices for the selected revision.
- Preserve the upstream AGPL-3.0 licence and copyright notices.
- Keep any TextBee modifications in a separate, clearly marked fork. If a modified TextBee program is offered for remote network interaction, meet AGPL-3.0 section 13 by making the corresponding source available to those users. If a modified Android app is distributed, meet the applicable source and notice obligations.
- Keep Inclura's adapter independently authored and communicating with TextBee only through its documented HTTPS API. Do not copy TextBee source into Inclura.
- Record the exact upstream revision, local patch list, image digests, build instructions, and licence inventory in the deployment record.

This is an engineering compliance runbook, not legal advice. Obtain qualified legal review if the distribution or modification model changes.

## 4. Network exposure and server hardening

The deployment must use a supported Linux server with security updates enabled and a restrictive host firewall.

- Expose only HTTPS through a maintained reverse proxy (Caddy or Nginx) on TCP 443; redirect HTTP to HTTPS.
- Do not expose MongoDB, Redis, Mongo Express, Docker management, SSH password login, or internal API/dashboard ports publicly.
- Bind database and Redis services to the private Docker network or loopback only. Remove public host port mappings where possible; otherwise explicitly firewall them.
- Disable Mongo Express in production. If a database administration interface is ever required, keep it private and use a temporary, authenticated administrative tunnel.
- Use unique, long random database passwords and application secrets. Do not reuse Inclura credentials.
- Use TLS certificates with automatic renewal and monitor expiry.
- Restrict SSH to key-based access and trusted administration sources. Keep the operating system, Docker engine, reverse proxy, and TextBee images patched.
- Configure automated encrypted backups of MongoDB and the necessary configuration. Keep backups outside the VPS, restrict access, and test restoration before go-live.
- Monitor disk capacity, memory, CPU, service health, backup age, certificate expiry, and gateway connectivity.
- Do not place Firebase service-account JSON, SMTP credentials, MongoDB passwords, TextBee API keys, or webhook signing secrets in GitHub, frontend code, Android source, issue comments, or logs.

## 5. TextBee service configuration

At deployment time, configure the API and dashboard using the exact variable names in the selected upstream revision. The current upstream guide describes:

- API: MongoDB connection, long random JWT secret, dashboard URL, Firebase service-account credentials, SMTP configuration, and Redis URL/queue configuration.
- Dashboard: public site URL, API base URL, authentication secret, authentication URL, and SMTP settings.
- Android: a production build configured for the self-hosted API domain and the matching Firebase project configuration.

Use a dedicated Firebase project for TextBee's Android push wake-up function. Do not reuse Inclura's production Firebase project or service account. Restrict the service account to the permissions TextBee actually requires.

Build the Android application from the pinned TextBee source for the self-hosted API domain. Do not install the public hosted TextBee APK and assume it will talk to the self-hosted server. Configure a proper release signing key; do not distribute a release signed with a debug key. Keep the signing key offline or in a dedicated secure secret store.

Create a dedicated TextBee account and one API key for the Inclura backend integration. Revoke and rotate keys after suspected exposure or staff/administrator changes.

## 6. Inclura adapter configuration

The Inclura adapter accepts TextBee only when the provider is explicitly selected and the backend has all required values:

- `SMS_PROVIDER=textbee`
- `TEXTBEE_BASE_URL=https://<owned-hostname>` (the self-hosted HTTPS origin)
- `TEXTBEE_API_KEY=<server-side secret>`
- `TEXTBEE_DEVICE_ID=<approved gateway device id>`
- `SOS_SMS_ENABLED=false` until the separate production approval gate is completed.

Set these only in the IFSE backend's secret/environment manager, never in the frontend or mobile client. The API key must never appear in responses, logs, diagnostics, screenshots, or public repository files.

The adapter pins each message to the configured device. This is deliberate: it avoids silent selection of another enrolled phone. It also means the configured phone is a single point of failure. Do not describe the SMS path as resilient or guaranteed until a separately designed and tested failover arrangement exists.

The current adapter treats a valid TextBee batch response as **provider accepted / queued**, not sent or delivered. This distinction must remain in diagnostics, incident timelines, and administrator views.

## 7. SMS privacy and abuse controls

SMS is a supplementary route, not the source of truth for an SOS. Push and email remain separate channels, and provider acceptance must never be described as device delivery.

Before production, implement and verify all of the following:

- Send only the minimum emergency information needed by the intended recipient.
- Do not put detailed medical information, full narratives, identity documents, trusted-contact lists, responder details, or sensitive member profile data in SMS.
- Prefer an incident reference and a short instruction to open Inclura through an authenticated route. Do not put an unauthenticated sensitive incident page or bearer credential in the SMS.
- Validate and normalise recipient numbers; enforce authorised recipient sources and consent/relationship rules.
- Apply per-incident idempotency, recipient deduplication, rate limits, abuse detection, and replay protection.
- Prevent arbitrary clients from calling the provider directly. Only the authenticated IFSE backend may send.
- Avoid logging message bodies, API keys, full provider response bodies, or unnecessary phone numbers.
- Make all provider failures visible as failures or unknown outcomes. Never convert a timeout into a delivery success.

## 8. Delivery receipt integration is a separate prerequisite

The currently merged Inclura TextBee adapter sends SMS and records queue acceptance. It does **not** yet implement a TextBee delivery webhook receiver. Do not claim that Inclura can currently receive or verify TextBee delivery callbacks.

Before enabling any production SMS, implement a separate change that:

1. Receives only the required TextBee event types (at minimum sent, delivered, and failed).
2. Verifies the timestamped `X-Textbee-Signature` HMAC-SHA256 against the exact raw request body, using constant-time comparison.
3. Rejects missing, invalid, or stale signatures (more than five minutes from the signed timestamp).
4. Uses the webhook idempotency key / event identifier to make retries harmless.
5. Confirms the batch/message ID belongs to a known Inclura notification attempt before updating its status.
6. Stores only the minimum status metadata and timestamps; does not trust arbitrary recipient, message, or emergency IDs supplied by an unverified event.
7. Maps states accurately: queued/pending, dispatched, sent (carrier accepted), delivered (recipient handset receipt), failed, and unknown.
8. Does not allow a webhook to create an SOS, change its owner, change dispatch assignments, or authorise a responder.

The signing secret must be separate from the TextBee API key and stored only in the IFSE backend secret manager. Do not configure a live webhook until this receiver has passed tests for valid signatures, invalid signatures, timestamp skew, duplicate delivery, altered bodies, unknown batch IDs, and replay attempts.

## 9. Staged acceptance tests — no real emergency recipients

Use a staging environment and test-only numbers/devices owned or explicitly authorised by the project. Do not use real Trusted Contacts, emergency recipients, agency endpoints, or production SOS records.

Required gates:

- **Infrastructure:** HTTPS works; database and Redis ports are unreachable from the public internet; backups restore successfully.
- **Identity:** dashboard accounts are restricted; MFA is enabled where supported; API keys can be revoked and rotated.
- **Device:** only the approved Android gateway is enrolled; permissions and battery/background operation are checked; loss of internet, power, SIM, and SMS balance is detected as an operational risk.
- **Adapter:** wrong host, HTTP URL, missing key, missing device ID, rejected request, malformed response, timeout, and duplicate request all fail safely.
- **Privacy:** SMS contains only the approved minimal template; logs contain no secrets or message bodies.
- **Webhook:** all signature, replay, idempotency, ownership, and status-transition tests pass.
- **Operations:** alerting, backups, patching, incident response, and gateway outage procedures are documented.
- **Cost:** test the actual SIM network's SMS rates and any destination-country charges. Never assume that a TextBee free/self-hosted software tier covers carrier SMS.

## 10. Production approval gate

Production activation requires a separate explicit approval after the following are all true:

- Hosting and domain are selected and secured.
- The pinned TextBee stack and custom Android app are built and reviewed.
- The dedicated Firebase and SMTP configuration are verified.
- Network isolation, backups, monitoring, and recovery tests pass.
- Inclura's delivery webhook receiver is implemented and security-tested.
- Message minimisation, recipient consent, idempotency, throttling, and audit controls pass.
- Actual carrier costs and gateway availability risks are understood.
- A controlled test to an authorised test recipient confirms the full status lifecycle without involving a real SOS.
- The user explicitly approves enabling SMS.

Until then, keep `SOS_SMS_ENABLED=false`, do not create production secrets, and do not send real SMS.

## 11. Upstream references

- TextBee self-hosting guide: https://textbee.dev/docs/self-hosting
- TextBee API keys and authentication: https://textbee.dev/docs/getting-started/api-keys
- TextBee delivery status: https://textbee.dev/docs/sending-sms/delivery-status
- TextBee webhooks and signature verification: https://textbee.dev/docs/webhooks
- TextBee API reference: https://textbee.dev/docs/api-reference
- TextBee source repository: https://github.com/textbee/textbee
- GNU AGPL-3.0: https://www.gnu.org/licenses/agpl-3.0.html
