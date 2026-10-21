const PUBLIC_HOST = "sonbolabs.exceptionalgrp.com";
const PATH = "/api/contact";
const VERSION = "v1";
const MAX_BODY_BYTES = 16 * 1024;

class ContactBodyTooLargeError extends Error {}

export type ContactOriginWorkerEnv = {
  CONTACT_ORIGIN_HMAC_CURRENT: string;
  CONTACT_ORIGIN_HMAC_CURRENT_KEY_ID: string;
};

type Fetch = (request: Request) => Promise<Response>;

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

async function sha256(rawBody: Uint8Array) {
  const bytes = rawBody.buffer.slice(rawBody.byteOffset, rawBody.byteOffset + rawBody.byteLength) as ArrayBuffer;
  return base64Url(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)));
}

async function hmac(secret: string, canonical: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(canonical))));
}

function nonce() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

function validClientIp(value: string | null): value is string {
  return Boolean(value && !value.includes(",") && value.length <= 45 && /^[0-9A-Fa-f:.]+$/.test(value));
}

async function readBodyWithinLimit(request: Request) {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) throw new ContactBodyTooLargeError();
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > MAX_BODY_BYTES) throw new ContactBodyTooLargeError();
    chunks.push(value);
  }
  const rawBody = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { rawBody.set(chunk, offset); offset += chunk.byteLength; }
  return rawBody;
}

export async function handleContactWorkerRequest(request: Request, env: ContactOriginWorkerEnv, fetchImpl: Fetch = fetch) {
  try {
    const publicUrl = new URL(request.url);
    if (request.method !== "POST" || publicUrl.hostname !== PUBLIC_HOST || publicUrl.pathname !== PATH || publicUrl.search) {
      return new Response("Not found", { status: 404 });
    }
    const contentType = request.headers.get("content-type");
    const clientIp = request.headers.get("cf-connecting-ip");
    if (!contentType?.toLowerCase().startsWith("application/json") || !validClientIp(clientIp)) {
      return new Response(JSON.stringify({ error: "Invalid form submission." }), { status: 400, headers: { "content-type": "application/json" } });
    }

    const rawBody = await readBodyWithinLimit(request);

    const timestamp = String(Math.floor(Date.now() / 1000));
    const requestNonce = nonce();
    const hash = await sha256(rawBody);
    const canonical = `${VERSION}\nPOST\n${PATH}\n${timestamp}\n${requestNonce}\n${clientIp}\n${hash}`;
    const signature = await hmac(env.CONTACT_ORIGIN_HMAC_CURRENT, canonical);
    const headers = new Headers({
      accept: "application/json",
      "content-type": contentType,
      origin: `https://${PUBLIC_HOST}`,
      "x-sonbol-origin-version": VERSION,
      "x-sonbol-origin-key-id": env.CONTACT_ORIGIN_HMAC_CURRENT_KEY_ID,
      "x-sonbol-origin-timestamp": timestamp,
      "x-sonbol-origin-nonce": requestNonce,
      "x-sonbol-client-ip": clientIp,
      "x-sonbol-origin-body-sha256": hash,
      "x-sonbol-origin-signature": signature,
    });
    // A same-zone Worker Route fetch to this URL is sent to the DNS-configured
    // origin by Cloudflare; it does not re-enter the matching Worker Route.
    // Keep the public URL intact so no alternate Hostinger hostname is needed.
    const originRequest = new Request(request.url, { method: "POST", headers, body: rawBody });
    return await fetchImpl(originRequest);
  } catch (error) {
    if (error instanceof ContactBodyTooLargeError) {
      return Response.json({ error: "Invalid form submission." }, { status: 400 });
    }
    return Response.json({ error: "Unable to send message." }, { status: 503 });
  }
}

const contactOriginWorker = { fetch: handleContactWorkerRequest };

export default contactOriginWorker;
