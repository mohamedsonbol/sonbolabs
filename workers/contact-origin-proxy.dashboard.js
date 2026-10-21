// Paste this entire module into the Cloudflare Workers dashboard editor.
// Configure these encrypted Worker secrets in the dashboard; do not add values here:
// - CONTACT_ORIGIN_HMAC_CURRENT
// - CONTACT_ORIGIN_HMAC_CURRENT_KEY_ID

const PUBLIC_HOST = "sonbolabs.exceptionalgrp.com";
const PATH = "/api/contact";
const VERSION = "v1";
const MAX_BODY_BYTES = 16 * 1024;

class ContactBodyTooLargeError extends Error {}

function base64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

async function sha256(rawBody) {
  const bytes = rawBody.buffer.slice(rawBody.byteOffset, rawBody.byteOffset + rawBody.byteLength);
  return base64Url(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)));
}

async function hmac(secret, canonical) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return base64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(canonical))));
}

function nonce() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

function validClientIp(value) {
  return Boolean(value && !value.includes(",") && value.length <= 45 && /^[0-9A-Fa-f:.]+$/.test(value));
}

async function readBodyWithinLimit(request) {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) throw new ContactBodyTooLargeError();
  if (!request.body) return new Uint8Array();

  const reader = request.body.getReader();
  const chunks = [];
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
  for (const chunk of chunks) {
    rawBody.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return rawBody;
}

const contactOriginWorker = {
  async fetch(request, env) {
    try {
      const publicUrl = new URL(request.url);
      if (request.method !== "POST" || publicUrl.hostname !== PUBLIC_HOST || publicUrl.pathname !== PATH || publicUrl.search) {
        return new Response("Not found", { status: 404 });
      }

      const contentType = request.headers.get("content-type");
      const clientIp = request.headers.get("cf-connecting-ip");
      if (!contentType?.toLowerCase().startsWith("application/json") || !validClientIp(clientIp)) {
        return new Response(JSON.stringify({ error: "Invalid form submission." }), {
          status: 400,
          headers: { "content-type": "application/json" },
        });
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

      // Cloudflare sends a same-zone Route fetch to the configured origin;
      // it does not invoke this matching Route again.
      return await fetch(new Request(request.url, { method: "POST", headers, body: rawBody }));
    } catch (error) {
      if (error instanceof ContactBodyTooLargeError) {
        return Response.json({ error: "Invalid form submission." }, { status: 400 });
      }
      return Response.json({ error: "Unable to send message." }, { status: 503 });
    }
  },
};

export default contactOriginWorker;
