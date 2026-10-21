import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { isIP } from "node:net";
import { Redis } from "@upstash/redis";

const VERSION = "v1";
const PATH = "/api/contact";
const MAX_CLOCK_SKEW_SECONDS = 60;
const NONCE_TTL_SECONDS = 120;
const NONCE_PREFIX = "sonbol:contact:origin-nonce:v1:";
const base64Url = /^[A-Za-z0-9_-]+$/;
const keyIdPattern = /^[A-Za-z0-9_-]{1,32}$/;

export class ContactOriginAuthenticationError extends Error {
  constructor() {
    super("Contact origin authentication failed");
  }
}

export class ContactOriginAuthenticationUnavailableError extends Error {
  constructor() {
    super("Contact origin authentication is unavailable");
  }
}

export type ContactOriginAuthentication = (request: Request, rawBody: Uint8Array) => Promise<{ clientIp: string }>;
type KeyRing = Record<string, string>;
type ClaimNonce = (nonce: string) => Promise<boolean>;
export type OriginAuthDependencies = { now?: () => number; keyRing?: KeyRing; claimNonce?: ClaimNonce };

let redis: Redis | undefined;

function header(request: Request, name: string) {
  const value = request.headers.get(name);
  if (!value || value.includes(",")) throw new ContactOriginAuthenticationError();
  return value;
}

function bodyHash(rawBody: Uint8Array) {
  return createHash("sha256").update(rawBody).digest("base64url");
}

function canonical(method: string, pathname: string, timestamp: string, nonce: string, clientIp: string, hash: string) {
  return `${VERSION}\n${method}\n${pathname}\n${timestamp}\n${nonce}\n${clientIp}\n${hash}`;
}

function keyRingFromEnvironment(): KeyRing {
  const current = process.env.CONTACT_ORIGIN_HMAC_CURRENT;
  const currentId = process.env.CONTACT_ORIGIN_HMAC_CURRENT_KEY_ID;
  const previous = process.env.CONTACT_ORIGIN_HMAC_PREVIOUS;
  const previousId = process.env.CONTACT_ORIGIN_HMAC_PREVIOUS_KEY_ID;
  if (!current || !currentId || !keyIdPattern.test(currentId)) throw new ContactOriginAuthenticationUnavailableError();
  if (Boolean(previous) !== Boolean(previousId) || (previousId && !keyIdPattern.test(previousId))) {
    throw new ContactOriginAuthenticationUnavailableError();
  }
  if (previousId === currentId) throw new ContactOriginAuthenticationUnavailableError();
  const keys: KeyRing = { [currentId]: current };
  if (previous && previousId) keys[previousId] = previous;
  return keys;
}

function nonceStore() {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new ContactOriginAuthenticationUnavailableError();
  redis = new Redis({ url, token });
  return redis;
}

async function claimNonceInRedis(nonce: string) {
  try {
    const result = await nonceStore().set(`${NONCE_PREFIX}${nonce}`, "1", { nx: true, ex: NONCE_TTL_SECONDS });
    return result === "OK";
  } catch {
    throw new ContactOriginAuthenticationUnavailableError();
  }
}

export function signContactOriginRequest(secret: string, method: string, pathname: string, timestamp: string, nonce: string, clientIp: string, hash: string) {
  return createHmac("sha256", secret).update(canonical(method, pathname, timestamp, nonce, clientIp, hash)).digest("base64url");
}

export function hashContactOriginBody(rawBody: Uint8Array) {
  return bodyHash(rawBody);
}

export async function authenticateContactOrigin(request: Request, rawBody: Uint8Array, dependencies: OriginAuthDependencies = {}) {
  const url = new URL(request.url);
  if (request.method !== "POST" || url.pathname !== PATH || url.search) throw new ContactOriginAuthenticationError();

  const version = header(request, "x-sonbol-origin-version");
  const keyId = header(request, "x-sonbol-origin-key-id");
  const timestamp = header(request, "x-sonbol-origin-timestamp");
  const nonce = header(request, "x-sonbol-origin-nonce");
  const clientIp = header(request, "x-sonbol-client-ip");
  const suppliedHash = header(request, "x-sonbol-origin-body-sha256");
  const signature = header(request, "x-sonbol-origin-signature");
  if (
    version !== VERSION || !keyIdPattern.test(keyId) || !/^\d{10}$/.test(timestamp) ||
    !base64Url.test(nonce) || nonce.length < 22 || nonce.length > 128 || !isIP(clientIp) ||
    !base64Url.test(suppliedHash) || suppliedHash.length !== 43 || !base64Url.test(signature) || signature.length !== 43
  ) throw new ContactOriginAuthenticationError();

  const now = dependencies.now?.() ?? Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > MAX_CLOCK_SKEW_SECONDS) throw new ContactOriginAuthenticationError();
  const actualHash = bodyHash(rawBody);
  if (!timingSafeEqual(Buffer.from(actualHash), Buffer.from(suppliedHash))) throw new ContactOriginAuthenticationError();

  const keys = dependencies.keyRing ?? keyRingFromEnvironment();
  const secret = keys[keyId];
  if (!secret) throw new ContactOriginAuthenticationError();
  const expected = signContactOriginRequest(secret, request.method, url.pathname, timestamp, nonce, clientIp, actualHash);
  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) throw new ContactOriginAuthenticationError();

  const claimNonce = dependencies.claimNonce ?? claimNonceInRedis;
  let claimed: boolean;
  try {
    claimed = await claimNonce(nonce);
  } catch (error) {
    if (error instanceof ContactOriginAuthenticationUnavailableError) throw error;
    throw new ContactOriginAuthenticationUnavailableError();
  }
  if (!claimed) throw new ContactOriginAuthenticationError();
  return { clientIp };
}
