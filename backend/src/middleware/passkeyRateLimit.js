// =======================================================
// Inclura IFSE — Passkey Authentication Rate Limiting
// =======================================================
// This lightweight per-process limiter protects public WebAuthn
// challenge endpoints from bursts. For multi-instance deployments,
// enforce an additional shared limit at the edge or with shared storage.

const WINDOW_MS = 5 * 60 * 1000;
const MAX_ENTRIES = 10000;
const buckets = new Map();

function clientKey(req) {
  // Express req.ip respects the configured trusted proxy hop.
  return String(req.ip || req.socket?.remoteAddress || "unknown");
}

function createPasskeyRateLimiter({ limit, windowMs = WINDOW_MS, scope }) {
  return function passkeyRateLimit(req, res, next) {
    const now = Date.now();
    const key = `${scope}:${clientKey(req)}`;
    let bucket = buckets.get(key);

    if (!bucket || now - bucket.startedAt >= windowMs) {
      bucket = { startedAt: now, count: 0 };
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    // Bound memory if an attacker rotates source addresses.
    if (buckets.size > MAX_ENTRIES) {
      for (const [entryKey, entry] of buckets) {
        if (now - entry.startedAt >= windowMs) buckets.delete(entryKey);
        if (buckets.size <= MAX_ENTRIES) break;
      }
      if (buckets.size > MAX_ENTRIES) {
        const oldestKey = buckets.keys().next().value;
        if (oldestKey) buckets.delete(oldestKey);
      }
    }

    const remainingMs = Math.max(0, windowMs - (now - bucket.startedAt));
    res.setHeader("Cache-Control", "no-store");

    if (bucket.count > limit) {
      res.setHeader("Retry-After", String(Math.max(1, Math.ceil(remainingMs / 1000))));
      return res.status(429).json({
        success: false,
        authenticated: false,
        message: "Too many passkey attempts. Please wait before trying again.",
      });
    }

    res.setHeader("RateLimit-Limit", String(limit));
    res.setHeader("RateLimit-Remaining", String(Math.max(0, limit - bucket.count)));
    res.setHeader("RateLimit-Reset", String(Math.ceil((bucket.startedAt + windowMs) / 1000)));
    return next();
  };
}

export const limitPasskeyOptions = createPasskeyRateLimiter({
  scope: "passkey-options",
  limit: 10,
});

export const limitPasskeyVerification = createPasskeyRateLimiter({
  scope: "passkey-verification",
  limit: 10,
});
