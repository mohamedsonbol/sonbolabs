import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const WINDOW = "10 m";
const LIMIT = 5;

export type ContactRateLimitDecision =
  | { allowed: true }
  | { allowed: false; retryAfter: number };

export type ContactRateLimitCheck = (request: Request) => Promise<ContactRateLimitDecision>;

export class ContactRateLimitConfigurationError extends Error {
  constructor() {
    super("Contact rate limiting is not configured");
  }
}

let limiter: Ratelimit | undefined;

function getLimiter() {
  if (limiter) return limiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new ContactRateLimitConfigurationError();

  limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(LIMIT, WINDOW),
    prefix: "sonbol:contact:v1",
    analytics: false,
  });
  return limiter;
}

function requestIdentity(request: Request) {
  // This header is accepted only after the origin is locked to Cloudflare in Hostinger.
  // Do not enable it until the accompanying deployment checklist is complete.
  if (process.env.CONTACT_RATE_LIMIT_TRUSTED_PROXY !== "cloudflare") {
    throw new ContactRateLimitConfigurationError();
  }

  const connectingIp = request.headers.get("cf-connecting-ip");
  if (!connectingIp || connectingIp.includes(",")) {
    throw new ContactRateLimitConfigurationError();
  }

  return connectingIp;
}

export const checkContactRateLimit: ContactRateLimitCheck = async (request) => {
  const result = await getLimiter().limit(requestIdentity(request));
  if (result.success) return { allowed: true };
  return { allowed: false, retryAfter: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)) };
};
