import crypto from "crypto";
import { queryOne } from "./neonDb";

const fallbackBuckets = new Map();

function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function hashIdentity(value) {
  const salt =
    process.env.RATE_LIMIT_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    "vdn-v2-rate-limit";
  return crypto.createHash("sha256").update(`${salt}:${value}`).digest("hex");
}

function fallbackRateLimit(key, limit, windowSeconds) {
  const now = Date.now();
  const current = fallbackBuckets.get(key);

  if (!current || current.expiresAt <= now) {
    fallbackBuckets.set(key, { count: 1, expiresAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: Math.max(0, limit - 1) };
  }

  current.count += 1;
  fallbackBuckets.set(key, current);
  return {
    allowed: current.count <= limit,
    remaining: Math.max(0, limit - current.count),
  };
}

export async function enforceRateLimit(request, {
  scope,
  limit = 8,
  windowSeconds = 600,
} = {}) {
  const identity = hashIdentity(clientIp(request));
  const bucket = Math.floor(Date.now() / (windowSeconds * 1000));
  const key = `${scope || "public"}:${identity}:${bucket}`;

  try {
    const row = await queryOne(
      `insert into request_rate_limits (bucket_key, request_count, expires_at)
       values ($1, 1, now() + ($2 * interval '1 second'))
       on conflict (bucket_key)
       do update set request_count = request_rate_limits.request_count + 1
       returning request_count`,
      [key, windowSeconds]
    );

    const count = Number(row?.request_count || 0);
    return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
  } catch (error) {
    console.warn("Database rate limiting niet beschikbaar; tijdelijke fallback actief:", error.message);
    return fallbackRateLimit(key, limit, windowSeconds);
  }
}

export function isLikelyBotSubmission(body = {}) {
  return Boolean(
    String(body?._website || "").trim() ||
    String(body?._company_website || "").trim()
  );
}

export function publicError(error, fallback = "Er ging iets mis. Probeer het later opnieuw.") {
  const status = Number(error?.status) || 500;
  if (status >= 400 && status < 500 && typeof error?.message === "string") {
    return error.message;
  }
  return fallback;
}

export function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "")
  );
}
