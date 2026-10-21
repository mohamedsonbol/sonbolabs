# Sonbol Labs — Contact Origin Security Design

**Decision date:** 21 October 2026
**Status:** NO-GO for the current trusted-proxy deployment; GO after Option A is implemented, tested, and released through a controlled change.
**Scope:** design only. No Worker, origin code, environment value, Cloudflare rule, deployment, or email delivery is authorized by this document.

## Executive decision

Recommend **Option A: a Cloudflare Worker authenticates each request to the existing Next.js contact API with a short-lived, replay-protected HMAC envelope**.

This is the smallest secure change that retains the Hostinger-hosted website, existing server validation, SMTP delivery implementation, and Upstash limit. It does **not** try to prove that a direct request came from Cloudflare. Instead, the origin rejects every contact request unless it can verify a signature that only the Worker can create.

The current design—trusting `CF-Connecting-IP` whenever an environment flag equals `cloudflare`—is **NO-GO** because the shared Hostinger origin can be addressed directly and Hostinger cannot prove the immediate peer or enforce a Cloudflare-only origin boundary.

## Threat model and required invariant

The Hostinger origin IP/alternate hostname may be discovered and contacted directly. An attacker can then supply arbitrary `Origin`, `CF-Connecting-IP`, `X-Forwarded-For`, and custom headers. Full (strict), proxied DNS, and WAF checks apply to the public Cloudflare path; they do not authenticate direct-origin traffic.

Required invariant after the change:

> `POST /api/contact` reaches validation, Redis, or SMTP only after a valid, fresh, one-time Worker-authentication envelope is verified.

This turns direct-origin access into a harmless 401/403 response. It does not make the shared origin private, but it prevents that origin from accepting contact submissions or using attacker-chosen client IP identities.

## Option comparison

| Option | Direct-origin SMTP bypass resistance | Scope/cost | Decision |
| --- | --- | --- | --- |
| A. Worker authenticates existing Next API | Strong after origin signature validation is added | One Worker route plus narrow Next API/auth change | **Recommended** |
| B. Worker owns contact endpoint | Strong only after Hostinger route is removed/disabled | New Worker validation, rate-limit and mail delivery implementation | Stronger separation, but larger change |
| C. Application-only, no Worker | No secure browser-to-origin proof is available on this host | Superficially small, but insecure | Reject |

## A. Worker-authenticated existing Next.js API — recommended

### Trust boundary and request flow

```text
Browser -> Cloudflare WAF -> Worker (/api/contact) -> signed request -> Hostinger Next API
Attacker -> Hostinger origin -------------------------------> rejected before Redis/SMTP
```

1. Route a Worker only for the exact `https://sonbolabs.exceptionalgrp.com/api/contact` URL. A Workers Route requires the existing orange-clouded DNS record; routes are intended to run in front of an external origin. [Cloudflare routing documentation](https://developers.cloudflare.com/workers/configuration/routing/routes/)
2. The Worker accepts only `POST /api/contact`, enforces a conservative body-size/type limit, and reads the raw body once.
3. At the Worker ingress, capture the edge-provided `CF-Connecting-IP` as the client identity. Do not use `X-Real-IP` or `X-Forwarded-For`; Cloudflare documents that `x-real-ip` can be altered in Worker subrequests. [Cloudflare header behavior](https://developers.cloudflare.com/fundamentals/reference/http-headers/)
4. Delete inbound `CF-Connecting-IP`, `CF-Connecting-IPv6`, `X-Forwarded-For`, `X-Real-IP`, and every `X-Sonbol-Origin-*` header before forwarding.
5. Generate a cryptographically random nonce and a short expiry (recommended: 60 seconds), then sign this canonical byte sequence with HMAC-SHA-256:

   ```text
   v1\nPOST\n/api/contact\n<unix-seconds>\n<nonce>\n<client-ip>\n<sha256-raw-body>
   ```

6. Forward the exact body to the existing origin with only these Worker-controlled fields: `X-Sonbol-Origin-Version`, `X-Sonbol-Origin-Key-Id`, `X-Sonbol-Origin-Timestamp`, `X-Sonbol-Origin-Nonce`, `X-Sonbol-Client-IP`, `X-Sonbol-Origin-Body-SHA256`, and `X-Sonbol-Origin-Signature`.
7. Before parsing the body or running the limiter, Next.js must: validate method/path/version/header formats; enforce timestamp skew; recompute the raw-body hash; verify HMAC using timing-safe comparison; and atomically claim the nonce in Upstash with `SET ... NX EX 120`.
8. Only after all checks succeed, Next.js uses the **signed** `X-Sonbol-Client-IP` as the Upstash limiter identity. It must permanently stop using raw `CF-Connecting-IP` for this endpoint.
9. Existing origin validation, Zod validation, honeypot, mailer, SMTP variables, and the `sonbol:contact:v1` limiter remain in place. Add a separate nonce prefix, for example `sonbol:contact:origin-nonce:v1:`.

Cloudflare states that `CF-Connecting-IP` is supplied on edge-to-origin traffic, but Worker subrequest behavior differs by route/zone; this is why the origin must authenticate the Worker-signed identity rather than trusting the forwarded Cloudflare header. [Cloudflare header reference](https://developers.cloudflare.com/fundamentals/reference/http-headers/)

### Header spoofing, replay, and rate-limit evasion

- **Header spoofing:** a direct caller can set every header but cannot produce a valid HMAC over the method, canonical path, exact body hash, timestamp, nonce, and client identity. The origin must ignore all client-supplied forwarding headers.
- **Replay:** HMAC alone is insufficient. Upstash nonce `SET NX EX` must succeed exactly once; duplicate nonce returns a generic 401/409 and never reaches SMTP. If nonce storage is unavailable, fail closed with 503.
- **Body substitution:** hashing the exact raw bytes prevents reusing a signature with a different JSON body.
- **Path/method substitution:** include exact method and canonical path in the signature and reject query-string/path normalization ambiguity. Route only the one exact endpoint.
- **Rate-limit evasion:** the Worker signs the edge-observed client IP, so an attacker cannot select another IP bucket at the origin. IP rotation remains possible by design; retain Cloudflare WAF rate limiting and add Turnstile later if abuse warrants it. Do not count a Worker-generated `CF-Connecting-IP` at the origin.
- **Retry safety:** Worker must not automatically retry a forwarded POST. A client retry receives a new nonce; the nonce store prevents replay of a captured request.

### Secret storage and rotation

Use a 256-bit random HMAC secret, never a browser value.

| Location | Current secret | Previous/overlap secret during rotation |
| --- | --- | --- |
| Cloudflare Worker encrypted secret binding | `CONTACT_ORIGIN_HMAC_CURRENT` | Not required; Worker signs only with current key |
| Hostinger server environment | `CONTACT_ORIGIN_HMAC_CURRENT` | `CONTACT_ORIGIN_HMAC_PREVIOUS` |

- Give each key a non-secret key ID in the envelope.
- Store Worker values as encrypted Worker secrets, not Wrangler `vars` or source. [Cloudflare Workers secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- Rotation sequence: generate B; deploy the origin accepting A/current and B/previous; switch the Worker signer to B; promote B to current and retain A as previous at the origin; wait longer than timestamp plus nonce TTL; remove A from the origin. Retain audit metadata only, never secret values.
- Missing/unknown key ID, malformed signature, expired timestamp, used nonce, or unavailable nonce store must fail closed. Return generic 401/403 for authentication failures and 503 for a storage dependency failure; do not disclose which check failed.

### Worker route recursion and origin forwarding

Use a single exact Worker route for `/api/contact`, not a wildcard. A Worker Route is designed to proxy an existing origin, and Cloudflare documents that calling `fetch()` on the incoming request invokes the configured application server; same-zone routes cannot be recursively targeted by a same-zone `fetch()`. The Worker therefore forwards its signed replacement request to the same public URL, which Cloudflare sends to the configured Hostinger origin. [Routes documentation](https://developers.cloudflare.com/workers/configuration/routing/routes/)

Before release, test the deployed route with a request ID and confirm one Worker invocation and one Hostinger origin request. Do not add an alternate hostname or `resolveOverride`: neither is needed for the documented same-zone routing model.

### Hostinger requirements and limitations

Hostinger does not need to supply a trustworthy client-IP header under this design. It only needs to pass ordinary request headers to Node.js and permit the application to read them. That header pass-through is an implementation prerequisite, not an assumption: verify it in a staging deployment with a Worker-signed request before enabling the production route.

Hostinger must receive and verify the envelope in application code; it cannot verify Cloudflare source IP, mTLS, or AOP on this plan. A direct Hostinger request bearing a fake `CF-Connecting-IP` remains rejected because it lacks a valid HMAC.

### Cloudflare requirements

- Existing active zone and orange-clouded hostname.
- A Worker and a route for the exact API path. Workers Free currently permits 100,000 requests/day and 50 subrequests/request; validate actual traffic and plan limits. Workers Paid is a separate plan from the zone plan. [Workers limits](https://developers.cloudflare.com/workers/platform/limits/), [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- Worker secret bindings for both rotation keys; separate staging and production Worker environments.
- Existing WAF rate limiting remains in front of the Worker. Rate-limit exact `POST /api/contact`; it is defense in depth, not origin authentication.
- No Worker secret, Upstash token, SMTP password, or mail content may be logged by the Worker.

### Tests proving direct requests cannot trigger SMTP

1. **Unit:** inject a valid form body and fake delivery function into the origin handler; omit envelope headers. Assert 401/403 and delivery calls equal zero.
2. **Unit:** use a valid HMAC but altered body, path, method, timestamp, nonce, and key ID independently. Assert every case returns 401/403 and zero delivery calls.
3. **Integration/staging:** call the Hostinger origin hostname directly with a complete valid-shaped body and forged `CF-Connecting-IP`; assert 401/403 and a test mail sink receives nothing.
4. **Integration/staging:** send one Worker-routed valid-shaped body to a non-delivering test delivery adapter; assert signature acceptance, signed IP passed to rate limiter, and exactly one adapter call.
5. **Replay:** resend byte-for-byte Worker envelope; assert first request may proceed and the duplicate is rejected before delivery.
6. **Failure:** disable the nonce-store test binding in staging; assert 503 and zero delivery calls.
7. **Production smoke:** use invalid `{}` bodies only. Confirm five 400 responses then 429 through the Worker and direct-origin 401/403; do not send a valid contact submission.

### Failure and rollback

- Worker secret/configuration missing, origin fetch error, or invalid upstream response: Worker returns generic 503 and does not fall through to the origin.
- Origin authentication/nonce failure: return 401/403 or 503 as above, before SMTP.
- Rollback application and Worker as a coordinated pair. If either version is uncertain, remove the Worker route **and unset/disable the contact endpoint** rather than returning to raw `CF-Connecting-IP` trust. A safe emergency state is contact API 503, not unauthenticated delivery.
- During rotation, preserve both keys until all Worker/origin versions and the replay window have expired.

## B. Worker hosts the contact endpoint

### Design

The Worker owns `POST /api/contact`, validates and rate-limits at Cloudflare, then sends mail through an authenticated HTTPS email API using a Worker secret. The Worker uses edge `CF-Connecting-IP` only within the Worker; it never forwards that identity to Hostinger. Upstash REST can remain the shared limiter using Worker secrets.

For bypass resistance, deploy a Next.js change that removes/disables the Hostinger contact route (return 404/403 before parsing or delivery). Otherwise attackers can still call the old Hostinger endpoint directly and bypass the Worker entirely.

### Effects

- **Validation:** extract the existing pure schema/normalization into a Worker-compatible shared package or duplicate it with contract tests. Do not let validation drift.
- **SMTP:** existing Nodemailer/Hostinger SMTP delivery is not reused. Use an approved HTTPS email API with a Worker secret and test recipient controls.
- **Redis:** use Upstash REST from the Worker for the 5/10-minute policy and optionally nonce/idempotency keys.
- **Consent:** contact delivery remains necessary service processing and is not consent-gated; analytics remains separate and consent-gated.
- **Plan:** same Worker route/custom-domain and secret requirements. A custom domain is suitable when a Worker is the origin; use a route when it fronts an existing external application. [Workers routes and custom domains](https://developers.cloudflare.com/workers/configuration/routing/)

### Tests, rollback, and decision

Test direct Hostinger `POST /api/contact` with a valid-shaped body against a non-delivering staging mail adapter: expect 404/403 and zero sends. Test Worker validation, Upstash 5/6, and email API failures (503, no retry that can duplicate sends). Rollback requires restoring both the prior Worker and the Hostinger route state; never restore a Hostinger mail-capable endpoint without authenticated-origin protection.

**Decision:** viable and strongest separation, but not the smallest change because it replaces delivery and duplicates/moves validation.

## C. Application-only alternative with no Worker — rejected

There is no secure secret that browser JavaScript can present to prove its request traversed Cloudflare. A browser-visible header, static API key, `Origin`, `Referer`, or client-side signature can be copied by a direct-origin attacker. Cloudflare Turnstile and WAF reduce abuse but do not establish an authenticated Cloudflare-to-Hostinger channel; a valid token can still be presented to a directly reachable endpoint if that endpoint accepts it.

Cloudflare Access service tokens are for trusted machine-to-machine clients and cannot be embedded in the public contact form. Application-level peer-IP validation is unavailable because this managed Next.js runtime does not expose a trustworthy immediate socket peer and Hostinger provides no trusted-header contract.

The only application-only safe state is to disable contact delivery and fail closed with 503. It is not a functional production contact solution.

## Implementation plan and release gates for Option A

1. Design and code-review a small shared raw-body authentication module and nonce-store adapter; update route tests before enabling Worker traffic.
2. Add origin tests proving unsigned, stale, altered, replayed, and missing-nonce-store requests cannot call delivery.
3. Create Worker staging environment, route, secret bindings, and a non-production Hostinger deployment with two rotation keys.
4. Validate header pass-through, route non-recursion, direct-origin rejection, 5/6 limiting, nonce replay rejection, and SMTP test sink behavior.
5. Record Worker route ID, Hostinger build ID, Cloudflare WAF rule IDs, and rollback version pair.
6. Deploy origin verifier first with both keys, then Worker signer; enable the Worker route only after staging evidence is approved.
7. Run production smoke tests with invalid bodies only. Do not send a valid production enquiry without separate authorization.
8. Retire raw `CF-Connecting-IP` trust for this API permanently; use only the verified signed identity.

## Final GO / NO-GO

- **Current deployment with `CONTACT_RATE_LIMIT_TRUSTED_PROXY=cloudflare`: NO-GO.**
- **Option A after all implementation/release gates: GO.** It provides authenticated client identity to the origin and prevents direct-origin requests from triggering SMTP without requiring a website migration.
- **Option B after the old Hostinger route is disabled: GO**, if the business prefers the larger contact-service extraction.
- **Option C: NO-GO.**
