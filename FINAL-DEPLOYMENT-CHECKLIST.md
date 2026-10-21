# Sonbol Labs — Direct Hostinger Contact Deployment Checklist

**Scope:** direct Next.js-to-SMTP contact delivery on Hostinger. This checklist does not authorize a push, deployment, or real contact submission.

## Required Hostinger variables

Configure only these server-side values for contact delivery:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

`NEXT_PUBLIC_SITE_URL` is required for the public site. Leave `NEXT_PUBLIC_GTM_ID` empty until the separate privacy and analytics gates are approved. Do not configure `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `CONTACT_ORIGIN_HMAC_CURRENT`, or any prior Worker/HMAC variables for this release.

## Contact behavior and security boundary

`POST /api/contact` accepts only the exact production `Origin`, limits bodies to 16 KiB, validates all fields server-side, silently acknowledges a filled honeypot, and invokes SMTP only after those checks pass. SMTP configuration errors return 503; delivery errors return a generic 500 response.

The `Origin` check is a browser-oriented same-origin/CSRF signal. It is **not** authentication and cannot prevent direct HTTP clients from sending a matching header. This release has no application-level distributed rate limiting, replay protection, authenticated origin channel, or Cloudflare Worker contact proxy. Keep Cloudflare proxying, Full (strict), and WAF protections enabled, and consider a managed WAF rate rule or Turnstile before public promotion. Those controls reduce abuse; they do not turn the Origin header into authentication.

## Pre-deployment gates

- [ ] Verify the intended branch contains no `.env*` file other than `.env.example`, no `.next/`, `node_modules/`, or `*.tsbuildinfo` artifact, and no secret values.
- [ ] Verify `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm audit --omit=dev` pass under Node.js 22.
- [ ] Confirm Hostinger uses Node.js 22 and deploys the reviewed GitHub `main` commit.
- [ ] Confirm the seven SMTP variables above are present and the sending identity is verified. Do not place them in Git.
- [ ] Confirm Cloudflare proxy and Full (strict) remain enabled and preserve existing WAF protections.
- [ ] Keep `NEXT_PUBLIC_GTM_ID` empty unless privacy/analytics approval is complete.

## Controlled smoke test

After an authorized deployment, use only invalid requests first:

1. Check `GET /`, `/ar`, `/contact`, and `/ar/contact` return 200.
2. Submit `{}` with the exact production Origin and confirm 400 with field errors; no SMTP delivery must occur.
3. Submit a cross-origin request and confirm 400; no SMTP delivery must occur.
4. Confirm the response headers remain present, including CSP report-only, HSTS, framing, referrer, permissions, and content-type protections.
5. Only after explicit authorization, submit one valid test request to a designated monitored mailbox and confirm one delivery.

## Rollback

Before deployment, record the current Hostinger build ID and Git commit. If the build, routes, headers, or SMTP behavior fail, restore the previous Hostinger build or redeploy the prior reviewed commit through the normal GitHub-to-Hostinger workflow. Keep Cloudflare proxying and Full (strict) enabled during rollback. Reverting to `d1ba90f8` with the removed HMAC/Upstash variables still absent deliberately restores a 503 contact endpoint; it is a site rollback, not a functional-contact rollback. Do not restore removed Worker/HMAC or Upstash variables unless a separately reviewed architecture restores their corresponding code.

## Current decision

**Repository readiness:** pending review of this branch and a clean working tree.

**Contact security:** GO only with explicit acceptance of the stated direct-origin and no-distributed-rate-limit tradeoff. It is not equivalent to the removed Worker-authenticated architecture.

**Privacy/analytics publication:** separately NO-GO until legal, provider, retention, and notice-publication gates are closed.
