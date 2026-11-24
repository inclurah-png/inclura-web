# Inclura IFSE — TextBee Secretless Deployment Template

**Purpose:** deployment skeleton for the self-hosted TextBee instance. This file intentionally contains **no real credentials**.

**Pinned baseline:** TextBee v2.10.0. Re-verify the full release commit SHA immediately before deployment.

## Deployment variables

Set these only on the final server or protected deployment secret store.

### API

```env
# Database
MONGO_URI=mongodb://<app-user>:<strong-password>@textbee-db:27017/textbee?authSource=admin
MONGO_ROOT_USER=<unique-root-user>
MONGO_ROOT_PASS=<strong-unique-password>

# Authentication
JWT_SECRET=<generate-a-long-random-secret>

# Public dashboard
FRONTEND_URL=https://<final-textbee-host>

# Firebase Admin SDK
# Populate from the dedicated Inclura TextBee Gateway Firebase service-account
# credential. Never commit the JSON file or these values.
FIREBASE_PROJECT_ID=<firebase-project-id>
FIREBASE_CLIENT_EMAIL=<firebase-service-account-email>
FIREBASE_PRIVATE_KEY=<firebase-private-key>

# SMTP
MAIL_HOST=<smtp-host>
MAIL_PORT=<smtp-port>
MAIL_USER=<smtp-user>
MAIL_PASSWORD=<smtp-password>
MAIL_FROM=<verified-sender>

ADMIN_EMAIL=<project-admin-email>

# Queue
USE_SMS_QUEUE=true
REDIS_URL=redis://textbee-redis:6379
```

### Dashboard

```env
NEXT_PUBLIC_SITE_URL=https://<final-textbee-host>
NEXT_PUBLIC_API_BASE_URL=https://<final-textbee-host>/api/v1
NEXTAUTH_SECRET=<generate-a-different-long-random-secret>
NEXTAUTH_URL=https://<final-textbee-host>

MAIL_HOST=<smtp-host>
MAIL_PORT=<smtp-port>
MAIL_USER=<smtp-user>
MAIL_PASSWORD=<smtp-password>
MAIL_FROM=<verified-sender>
```

## Security rules

- Never commit actual `.env` files.
- Never commit the Firebase Admin SDK private key.
- Never commit `google-services.json` to the Inclura repository unless a reviewed private-build workflow explicitly requires it.
- Never put TextBee API keys in frontend `NEXT_PUBLIC_*` variables.
- Never put TextBee API keys in the Android source.
- Keep MongoDB and Redis private.
- Do not expose Mongo Express in production.
- Use HTTPS only for the public dashboard/API.
- Generate separate random secrets for MongoDB, TextBee JWT/authentication, dashboard authentication, and webhook signing.
- Keep `TEXTBEE_API_KEY`, `TEXTBEE_WEBHOOK_SECRET`, and `TEXTBEE_WEBHOOK_SUBSCRIPTION_ID` out of source control.
- Keep the Inclura TextBee device ID restricted to the approved gateway device.

## Inclura integration values

These belong in the **Inclura backend secret/configuration store**, not in this template:

```env
SMS_PROVIDER=textbee
TEXTBEE_BASE_URL=https://<final-textbee-host>
TEXTBEE_API_KEY=<server-secret>
TEXTBEE_DEVICE_ID=<approved-gateway-device-id>
TEXTBEE_WEBHOOK_SECRET=<server-secret>
TEXTBEE_WEBHOOK_SUBSCRIPTION_ID=<subscription-id>
SOS_SMS_ENABLED=false
```

Keep `SOS_SMS_ENABLED=false` until the production approval gates in
`docs/operations/TEXTBEE_DEPLOYMENT_AND_MIGRATION_CHECKLIST.md` have passed.

## Android build boundary

The self-hosted Android gateway is built later from the pinned TextBee source tree.

At build time only:

1. Set the production API base URL to the final HTTPS TextBee origin with `/api/v1/`.
2. Place the dedicated Firebase `google-services.json` in the documented production Android source location.
3. Build and sign a release APK with a project-controlled signing key.
4. Record the source revision and APK checksum.
5. Install only on the approved gateway phone.

The published TextBee APK is not used for this self-hosted deployment because it is configured for the hosted TextBee service.

## Production gate

This template does not activate SMS. Live SMS remains disabled until the server, Android gateway, webhook verification, recipient authorization, rate limiting, backups, monitoring, and staged acceptance tests have all passed and production SMS has been explicitly approved.
