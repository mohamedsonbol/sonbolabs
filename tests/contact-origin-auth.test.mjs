import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { interopDefault: true });
const { authenticateContactOrigin, hashContactOriginBody, signContactOriginRequest } = await jiti.import("../lib/contact/origin-auth.ts");
const { handleContactPost } = await jiti.import("../lib/contact/request.ts");
const { handleContactWorkerRequest } = await jiti.import("../workers/contact-origin-proxy.ts");

const publicUrl = "https://sonbolabs.exceptionalgrp.com/api/contact";
const workerEnv = {
  CONTACT_ORIGIN_HMAC_CURRENT: "test-current-hmac-secret",
  CONTACT_ORIGIN_HMAC_CURRENT_KEY_ID: "current",
};
const keyRing = { current: workerEnv.CONTACT_ORIGIN_HMAC_CURRENT, previous: "test-previous-hmac-secret" };
const validBody = JSON.stringify({
  name: "Ada Lovelace", email: "ada@example.com", company: "Analytical Engines", website: "",
  projectType: "digital_product", budget: "2500_5000", timeline: "one_to_two_months",
  message: "A valid test request.", locale: "en", companyWebsite: "",
});

function memoryNonceStore() {
  const seen = new Set();
  return async (nonce) => {
    await Promise.resolve();
    if (seen.has(nonce)) return false;
    seen.add(nonce);
    return true;
  };
}

async function signedByWorker(body = validBody, clientIp = "198.18.0.44") {
  let forwarded;
  const response = await handleContactWorkerRequest(
    new Request(publicUrl, {
      method: "POST",
      headers: { "content-type": "application/json", "cf-connecting-ip": clientIp, "x-forwarded-for": "203.0.113.200" },
      body,
    }),
    workerEnv,
    async (request) => { forwarded = request; return new Response("{}", { status: 200 }); },
  );
  assert.equal(response.status, 200);
  return forwarded;
}

function raw(body = validBody) { return new TextEncoder().encode(body); }

function originDependencies({ claimNonce = memoryNonceStore(), deliveries, rateCalls } = {}) {
  return {
    authenticateOrigin: (request, rawBody) => authenticateContactOrigin(request, rawBody, { keyRing, claimNonce }),
    checkRateLimit: async (clientIp) => { rateCalls?.push(clientIp); return { allowed: true }; },
    deliver: async () => { deliveries?.push(true); },
  };
}

function manualSignedRequest({ secret = keyRing.current, keyId = "current", body = validBody, timestamp = String(Math.floor(Date.now() / 1000)), nonce = "a".repeat(32), clientIp = "198.18.0.45" } = {}) {
  const bytes = raw(body);
  const hash = hashContactOriginBody(bytes);
  const signature = signContactOriginRequest(secret, "POST", "/api/contact", timestamp, nonce, clientIp, hash);
  return new Request("https://direct-origin.invalid/api/contact", {
    method: "POST",
    headers: {
      origin: "https://sonbolabs.exceptionalgrp.com", "content-type": "application/json",
      "x-sonbol-origin-version": "v1", "x-sonbol-origin-key-id": keyId,
      "x-sonbol-origin-timestamp": timestamp, "x-sonbol-origin-nonce": nonce,
      "x-sonbol-client-ip": clientIp, "x-sonbol-origin-body-sha256": hash,
      "x-sonbol-origin-signature": signature,
    },
    body,
  });
}

test("Worker-signed request authenticates and preserves the Worker client IP", async () => {
  const request = await signedByWorker();
  const authenticated = await authenticateContactOrigin(request, raw(), { keyRing, claimNonce: memoryNonceStore() });
  assert.deepEqual(authenticated, { clientIp: "198.18.0.44" });
  assert.equal(request.headers.get("cf-connecting-ip"), null);
  assert.equal(request.headers.get("x-forwarded-for"), null);
});

test("valid signed request can reach delivery only after origin authentication", async () => {
  const deliveries = [];
  const rateCalls = [];
  const response = await handleContactPost(await signedByWorker(), originDependencies({ deliveries, rateCalls }));
  assert.equal(response.status, 200);
  assert.deepEqual(rateCalls, ["198.18.0.44"]);
  assert.equal(deliveries.length, 1);
});

test("unsigned direct-origin request cannot consume rate limit or trigger SMTP", async () => {
  const deliveries = [];
  const rateCalls = [];
  const response = await handleContactPost(
    new Request("https://direct-origin.invalid/api/contact", {
      method: "POST", headers: { origin: "https://sonbolabs.exceptionalgrp.com", "content-type": "application/json", "cf-connecting-ip": "1.2.3.4" }, body: validBody,
    }),
    originDependencies({ deliveries, rateCalls }),
  );
  assert.equal(response.status, 403);
  assert.equal(deliveries.length, 0);
  assert.equal(rateCalls.length, 0);
});

test("missing, invalid, expired, modified, and spoofed signature fields are rejected", async () => {
  const base = await signedByWorker();
  const cases = [
    { request: new Request(base.url, { method: "POST", headers: new Headers(base.headers), body: validBody }), bytes: raw() },
    { request: new Request(base.url, { method: "POST", headers: new Headers({ ...Object.fromEntries(base.headers), "x-sonbol-origin-signature": "x".repeat(43) }), body: validBody }), bytes: raw() },
    { request: new Request(base.url, { method: "POST", headers: new Headers({ ...Object.fromEntries(base.headers), "x-sonbol-origin-timestamp": "1000000000" }), body: validBody }), bytes: raw() },
    { request: new Request(base.url, { method: "POST", headers: new Headers(base.headers), body: `${validBody} ` }), bytes: raw(`${validBody} `) },
    { request: new Request(base.url, { method: "POST", headers: new Headers({ ...Object.fromEntries(base.headers), "x-sonbol-client-ip": "203.0.113.77" }), body: validBody }), bytes: raw() },
  ];
  cases[0].request.headers.delete("x-sonbol-origin-signature");
  for (const { request, bytes } of cases) {
    await assert.rejects(() => authenticateContactOrigin(request, bytes, { keyRing, claimNonce: memoryNonceStore() }));
  }
});

test("nonce replay and concurrent replay attempts admit exactly one request", async () => {
  const request = await signedByWorker();
  const store = memoryNonceStore();
  await authenticateContactOrigin(request, raw(), { keyRing, claimNonce: store });
  await assert.rejects(() => authenticateContactOrigin(request, raw(), { keyRing, claimNonce: store }));

  const concurrent = await signedByWorker();
  const concurrentStore = memoryNonceStore();
  const results = await Promise.allSettled([
    authenticateContactOrigin(concurrent, raw(), { keyRing, claimNonce: concurrentStore }),
    authenticateContactOrigin(concurrent, raw(), { keyRing, claimNonce: concurrentStore }),
  ]);
  assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
  assert.equal(results.filter((result) => result.status === "rejected").length, 1);
});

test("nonce-store outage fails closed before rate limiting or SMTP", async () => {
  const deliveries = [];
  const rateCalls = [];
  const response = await handleContactPost(
    await signedByWorker(),
    originDependencies({ claimNonce: async () => { throw new Error("redis unavailable"); }, deliveries, rateCalls }),
  );
  assert.equal(response.status, 503);
  assert.equal(deliveries.length, 0);
  assert.equal(rateCalls.length, 0);
});

test("current and previous key IDs are both accepted during rotation", async () => {
  const store = memoryNonceStore();
  const current = manualSignedRequest({ nonce: "b".repeat(32) });
  const previous = manualSignedRequest({ secret: keyRing.previous, keyId: "previous", nonce: "c".repeat(32) });
  assert.equal((await authenticateContactOrigin(current, raw(), { keyRing, claimNonce: store })).clientIp, "198.18.0.45");
  assert.equal((await authenticateContactOrigin(previous, raw(), { keyRing, claimNonce: store })).clientIp, "198.18.0.45");
});

test("Worker forwards once to the same-zone URL for Cloudflare origin routing", async () => {
  let calls = 0;
  let forwarded;
  const response = await handleContactWorkerRequest(
    new Request(publicUrl, { method: "POST", headers: { "content-type": "application/json", "cf-connecting-ip": "198.18.0.50" }, body: "{}" }),
    workerEnv,
    async (request) => { calls += 1; forwarded = request; return new Response("{}", { status: 200 }); },
  );
  assert.equal(response.status, 200);
  assert.equal(calls, 1);
  assert.equal(forwarded.url, publicUrl);
  assert.ok(forwarded.headers.get("x-sonbol-origin-signature"));
});

test("Worker and origin bound unauthenticated request bodies before forwarding or delivery", async () => {
  const oversized = "x".repeat(16 * 1024 + 1);
  let fetched = false;
  const workerResponse = await handleContactWorkerRequest(
    new Request(publicUrl, { method: "POST", headers: { "content-type": "application/json", "cf-connecting-ip": "198.18.0.51" }, body: oversized }),
    workerEnv,
    async () => { fetched = true; return new Response(); },
  );
  assert.equal(workerResponse.status, 400);
  assert.equal(fetched, false);

  const deliveries = [];
  const rateCalls = [];
  const originResponse = await handleContactPost(
    new Request("https://direct-origin.invalid/api/contact", { method: "POST", headers: { origin: "https://sonbolabs.exceptionalgrp.com", "content-type": "application/json" }, body: oversized }),
    originDependencies({ deliveries, rateCalls }),
  );
  assert.equal(originResponse.status, 400);
  assert.equal(deliveries.length, 0);
  assert.equal(rateCalls.length, 0);
});
