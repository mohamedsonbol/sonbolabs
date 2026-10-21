# Sonbol Labs — Phase 3 Verification

**Date:** 21 October 2026
**Scope:** local implementation and non-delivering tests only. No Cloudflare route, Worker, Hostinger setting, production application, secret, SMTP delivery, push, or deployment was changed.

## Decision

**Implementation readiness: PASS.** The repository now implements the approved Worker-authenticated contact path.

**Staging/production readiness: NO-GO** until the external configuration and staging evidence below are complete. The repository cannot create or verify a Cloudflare Worker route, Worker secrets, Hostinger environment settings, or Hostinger header pass-through.

## Implemented controls

- `workers/contact-origin-proxy.ts` accepts only the public `POST /api/contact` endpoint, streams and bounds the exact body to 16 KiB, captures Cloudflare's edge-provided client IP, strips untrusted forwarding/authentication headers, and creates a short-lived HMAC envelope.
- The Worker signature binds `POST`, `/api/contact`, raw-body SHA-256, Unix timestamp, 32-byte random nonce, and client IP.
- The Worker forwards its signed request to the same public URL. Cloudflare documents that a same-zone Route `fetch()` reaches the DNS-configured origin and cannot re-enter the same-zone Route; no second Hostinger hostname is required. [Cloudflare Routes](https://developers.cloudflare.com/workers/configuration/routing/routes/)
- The Next.js route streams and bounds direct-origin bodies to 16 KiB, then `lib/contact/origin-auth.ts` verifies the signature and body hash with constant-time comparisons before body parsing, rate limiting, or delivery.
- The origin accepts configured current and previous key IDs for overlap rotation, and atomically claims each nonce with Upstash `SET ... NX EX 120` under `sonbol:contact:origin-nonce:v1:`.
- Missing/malformed/expired/unknown/replayed authentication returns 403; nonce-store/authentication configuration or service failure returns 503. Neither state reaches SMTP or the rate limiter.
- `lib/contact/rate-limit.ts` now accepts only the Worker-authenticated client IP argument. It no longer reads `CF-Connecting-IP`, `X-Forwarded-For`, or `CONTACT_RATE_LIMIT_TRUSTED_PROXY`.
- `.gitignore` now excludes Worker local secret files via `*.dev.vars*`.

## Tests completed

`npm test` passes 17 tests, including:

| Control | Result |
| --- | --- |
| Valid Worker-signed request | PASS |
| Missing / invalid signature | PASS |
| Expired timestamp | PASS |
| Modified body | PASS |
| Spoofed signed-IP field | PASS |
| Replay attempt | PASS |
| Concurrent replay attempts | PASS — exactly one accepted |
| Redis nonce-store outage | PASS — 503 before rate limit/SMTP |
| Current/previous key rotation | PASS |
| Same-zone Worker origin forwarding | PASS — exactly one signed forward uses the public URL |
| Direct-origin valid-shaped request | PASS — 403, zero rate-limit calls, zero delivery calls |

The delivery assertions use in-memory fake delivery functions only. No real SMTP connection or contact email occurred.

## Security gaps and external staging prerequisites

1. **Header pass-through:** staging must prove Hostinger delivers each `X-Sonbol-Origin-*` header and the raw body unchanged to Next.js. A valid Worker-signed staging request must reach validation; a direct request must return 403.
2. **Secrets:** generate two independent 256-bit HMAC keys outside the repository. Configure current key/key ID on both Worker and Hostinger, and previous key/key ID only during rotation. Use Worker encrypted secrets, not `wrangler` variables or source.
3. **Origin-first rollout:** deploy the origin verifier with both rotation slots first. It will fail closed until the Worker is active. Only then deploy the Worker and attach the exact route. Do not deploy the Worker before the verifier.
4. **Cloudflare controls:** retain the exact-path WAF rule in front of the Worker; confirm the Worker route does not overlap a broader route and, in staging, record one Worker invocation and one origin request per test submission.
5. **Staging test mailbox:** use a non-delivering adapter or controlled SMTP sink for the one valid-shaped staging test. Never use a real production contact recipient for authentication tests.

## Required external configuration

### Cloudflare Worker secrets

- `CONTACT_ORIGIN_HMAC_CURRENT` — secret value.
- `CONTACT_ORIGIN_HMAC_CURRENT_KEY_ID` — non-secret identifier.

Use `workers/wrangler.example.jsonc` only as a non-secret template. Do not commit a `.dev.vars` file.

### Exact Cloudflare setup

1. Create the Worker from `workers/contact-origin-proxy.ts`; keep the public hostname orange-clouded and Full (strict).
2. Add encrypted Worker secrets `CONTACT_ORIGIN_HMAC_CURRENT` and `CONTACT_ORIGIN_HMAC_CURRENT_KEY_ID`. The value and ID must match Hostinger's current pair; do not put either in Worker source, `vars`, or a dashboard text field that is exported to Git.
3. Attach exactly `https://sonbolabs.exceptionalgrp.com/api/contact` in zone `exceptionalgrp.com`. Do not use `/api/contact*`, a catch-all route, an alternate hostname, or `resolveOverride`.
4. Keep the existing Cloudflare WAF rate-limit rule scoped to `POST /api/contact` and placed before/at the public request path. It is additional abuse protection, not an authentication substitute.

### Hostinger server environment

- `CONTACT_ORIGIN_HMAC_CURRENT`
- `CONTACT_ORIGIN_HMAC_CURRENT_KEY_ID`
- `CONTACT_ORIGIN_HMAC_PREVIOUS` and `CONTACT_ORIGIN_HMAC_PREVIOUS_KEY_ID` only during rotation
- existing `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- existing SMTP values

`CONTACT_RATE_LIMIT_TRUSTED_PROXY` must be removed; it is no longer used by the authenticated implementation.

### Controlled staging sequence

1. Record the current Worker version, route, WAF rule ID, Hostinger build ID, and environment-variable **names** (never values). Configure staging SMTP to a non-delivering sink or delivery adapter.
2. Deploy the origin verifier first with staging HMAC and Upstash variables. Before the Worker route exists, `POST /api/contact` must fail closed with 403/503 and no send.
3. Deploy the Worker, add only the exact route above, then send an invalid `{}` body through the proxied staging hostname. Expect 400; the Worker invocation and Hostinger request logs must each show one correlated request.
4. Using Hostinger's approved direct-origin test method, send a valid-shaped request containing a forged `CF-Connecting-IP` but no valid envelope. Expect 403 and zero test-sink sends or rate-limit calls.
5. In staging only, use a valid signed test request against the non-delivering adapter; prove one delivery-adapter invocation, signed IP use, replay rejection, then temporarily make nonce Redis unavailable and confirm 503 with no delivery.
6. Run five then six invalid Worker-routed submissions from one controlled IP: expect five 400 responses and sixth 429. Restore any temporary staging configuration immediately.

## Rotation and rollback

1. Generate key B and a new non-secret ID.
2. Deploy origin accepting A/current and B/previous.
3. Add B to the Worker, switch the Worker signer to B, and validate staging.
4. After more than 120 seconds and confirmation that all origin versions accept B, remove A from both locations.
5. On any Worker/origin mismatch, disable the public contact path or leave it returning 503. Never restore raw `CF-Connecting-IP` trust.

If the same-zone routing test fails, remove the exact Worker route and retain the origin verifier. Public unsigned contact requests then fail closed with 403 (or 503 for unavailable authentication configuration/storage). Restore the recorded Hostinger build only if required; do not bypass the verifier or proxy to recover contact delivery.

## Final recommendation

**NO-GO for production staging until Worker/Hostinger secrets, the exact Worker route, and the header-pass-through/direct-origin staging tests are complete.**

**GO for a controlled staging rollout** after all prerequisites above are completed and the staging direct-origin/no-SMTP, nonce-replay, WAF, and route-recursion tests pass.
