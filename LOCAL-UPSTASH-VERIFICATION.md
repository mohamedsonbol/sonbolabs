# Local Upstash Integration Verification

**Date:** 20 October 2026  
**Scope:** local repository only. No source security behaviour, production system, deployment, provider dashboard, or credentials were changed or exposed.

## Result

**BLOCKED — live Upstash integration could not be verified.**

The active shell initially used Node.js `v24.18.0`; the verification toolchain was switched to Node.js `v22.23.1`. Neither `.env.local` nor the process environment contained a non-empty value for any required rate-limit variable. No Upstash request was attempted because doing so without configured local credentials cannot verify authentication safely.

**Recheck requested later on 20 October 2026:** `.env.local` is correctly ignored by Git through `.gitignore` rule `.env*`, but the same three exact variable names remain absent from the file and missing or empty from the process environment. Its recorded modification time is `2026-10-08 15:44:45 +0200`. No secret value was displayed. The requested live connectivity, five-permitted/sixth-429, and actual-Redis-503 tests remain blocked.

| Required variable | `.env.local` | Process environment |
| --- | --- | --- |
| `UPSTASH_REDIS_REST_URL` | missing | missing or empty |
| `UPSTASH_REDIS_REST_TOKEN` | missing | missing or empty |
| `CONTACT_RATE_LIMIT_TRUSTED_PROXY` | missing | missing or empty |

Only variable presence was inspected; values were never printed or read into the report.

## Implementation inspection

- The implementation uses `@upstash/redis` with `new Redis({ url, token })`: Upstash REST/HTTPS, not Redis TCP.
- It requires the two `UPSTASH_REDIS_REST_*` values and `CONTACT_RATE_LIMIT_TRUSTED_PROXY=cloudflare`.
- It creates a shared sliding-window limit of **5 requests per 10 minutes** with key prefix `sonbol:contact:v1` and `analytics: false`.
- Rate limiting runs before JSON parsing, validation, and SMTP delivery.
- Missing configuration, a missing/malformed client identity, invalid Redis credentials, or a Redis/service error is caught by the contact handler and returns **503**. This is fail-closed.
- A limit rejection returns **429** with `Retry-After`.

## Trusted-proxy and origin requirements

The API separately requires `Origin: https://sonbolabs.exceptionalgrp.com` in production. The rate limiter reads `CF-Connecting-IP` only when `CONTACT_RATE_LIMIT_TRUSTED_PROXY` is exactly `cloudflare`; it rejects absent or comma-separated values.

The code does not validate the network peer independently. Production must therefore make the Hostinger origin reachable only through Cloudflare—by allowlisting Cloudflare origin IP ranges or an equivalent verified origin-protection control—and block direct-origin/alternative-hostname access. Until that is true, setting the trusted-proxy variable is unsafe.

## Safe local test plan once credentials are available

Do not run an end-to-end local request with a forged Cloudflare header. Instead, use an isolated integration harness that calls `handleContactPost` in-process with a mocked trusted request context. This preserves the production requirement instead of weakening it.

1. Load the three local variables through the normal environment mechanism; do not print them.
2. Use `Origin: https://sonbolabs.exceptionalgrp.com`, a reserved controlled identity such as `198.18.0.42` as the mocked `CF-Connecting-IP`, and body `{}`.
3. Send five sequential requests. Each should reach validation and return **400**; `{}` cannot produce an SMTP delivery.
4. Send a sixth request with the same controlled identity. It should return **429** and a positive `Retry-After`; again, no SMTP path is reachable.
5. In a fresh isolated process, replace only the in-memory token with a deliberately invalid dummy value before importing the handler. The same invalid body should return **503**. Do not edit `.env.local` or source to do this.
6. Do not use a real visitor IP, a valid form body, or the public production endpoint. The Upstash entries for the reserved test identity expire with the 10-minute sliding window.

This plan also proves authentication: a first **400** after the actual limiter is invoked demonstrates that Upstash accepted the REST request. A direct `PING` using the REST client may additionally be used, but is not necessary and should not print the endpoint or token.

## SMTP safety

No SMTP messages were sent during this verification. The planned bodies are invalid and the handler invokes rate limiting before it parses or validates them; mail delivery is only reachable after a valid, allowed submission.

## Limitation to resolve

Provide the three variables to the local Node.js 22 process or `.env.local` (which remains ignored by Git), then rerun the isolated harness. Until then, live REST connectivity/authentication, the five-request **400** sequence, the sixth-request **429**, and a real Redis-error **503** cannot be truthfully reported as verified.

## Reverification — 21 October 2026

### Result: BLOCKED for live Upstash integration

Node.js `22.23.1` loaded `.env.local` through Next.js' normal environment loader. Only variable presence was checked; no value was read, printed, or written. The following variables were still missing from the resulting process environment:

| Required variable | Result |
| --- | --- |
| `UPSTASH_REDIS_REST_URL` | missing |
| `UPSTASH_REDIS_REST_TOKEN` | missing |
| `CONTACT_RATE_LIMIT_TRUSTED_PROXY` | missing |

`.env.local` is ignored by Git through `.gitignore` rule `.env*`.

Consequently, no authenticated Upstash REST request, isolated five-permitted/sixth-429 sequence, or real service-unavailable test could be run. No substitute credential, public endpoint request, valid contact body, or SMTP delivery was used.

### Safe checks completed

- `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` passed on Node.js 22.23.1.
- `npm audit --omit=dev` completed with **0 vulnerabilities**.
- An in-process request with an invalid `{}` body and an allowed mocked rate-limit decision returned **400** and invoked the mocked delivery function **0** times. This proves invalid submissions do not reach SMTP.
- With production dependencies and the absent local Redis configuration, the same invalid request returned **503**. This verifies local fail-closed configuration behavior, not live Redis connectivity.
- Existing automated coverage verifies handler-level allowed and rejected rate-limit decisions, including the **429** response and `Retry-After` header. It does not substitute for the requested real Upstash integration test.

### Required rerun condition

Make the three variables available to the Node.js process that runs this repository's `.env.local`, then rerun this verification with a fresh, reserved test identity. The integration harness must use invalid bodies only, submit five sequential requests that return **400** after the real limiter allows them, verify a sixth **429** with positive `Retry-After`, and run the unavailable-service case in a separate process with a deliberately invalid in-memory token. The limiter's `sonbol:contact:v1` prefix keeps the test keys isolated within the Sonbol Labs namespace; keys expire under the configured 10-minute window.

## Completed integration verification — 21 October 2026

### Result: PASS

The three required variables were subsequently present after loading `.env.local` through Next.js' normal environment loader. Their values were not printed or recorded.

An isolated in-process harness used the reserved documentation identity `198.18.0.42`, an exact production `Origin`, and an invalid `{}` body. It never contacted the public endpoint and could not enter the SMTP path because rate limiting runs before body parsing and the invalid body returns validation failure.

| Request | Actual result |
| --- | --- |
| 1–5 | **400** validation failure after the real Upstash limiter allowed the request |
| 6 | **429** with positive `Retry-After` (`183` seconds at the time of the run) |

The first five responses establish successful Upstash REST connectivity and authentication: the handler reaches body validation only after `Ratelimit.limit()` completes successfully. The sixth response establishes the configured five-per-ten-minute shared sliding-window limit. The test key is under the `sonbol:contact:v1` namespace and expires under that limiter window.

In a fresh process, the Redis REST URL and token were replaced in memory only with an unreachable loopback endpoint and a non-secret test value before importing the application module. The same invalid request returned **503**. This proves fail-closed behavior for an unavailable Redis service without modifying `.env.local`, source, or production state.

The sandbox initially could not resolve the Upstash endpoint and returned `503`; the identical test with approved network access passed. This was local sandbox network isolation, not an application or Upstash authentication failure.
