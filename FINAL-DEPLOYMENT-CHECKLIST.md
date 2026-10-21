# Sonbol Labs — Final Deployment Checklist

**Status:** NO-GO for a complete public production release as of 21 October 2026.
**Scope:** deployment preparation only. This document does not authorize a deployment, push, environment change, Cloudflare change, or valid contact submission.

## 1. Evidence reviewed

| Area | Evidence | Result |
| --- | --- | --- |
| Node/runtime build | Node.js 22.23.1; `next build --webpack` | PASS |
| Automated checks | `npm test`, `npm run typecheck`, `npm run lint` | PASS |
| Dependency audit | `npm audit --omit=dev` | PASS — 0 vulnerabilities |
| Local Upstash | Real REST limiter: five invalid requests allowed to validation, sixth 429; unavailable local endpoint returned 503 | PASS — see `LOCAL-UPSTASH-VERIFICATION.md` |
| Repository secrets | Only `.env.example` is tracked; no non-empty assignments for the checked server-secret patterns were found in reachable Git history | PASS, with normal review still required before commit |
| Environment-file ignore | `.env.local` matches `.gitignore` rule `.env*` | PASS |
| Generated artifacts | `tsconfig.tsbuildinfo` is ignored and no longer tracked | PASS |
| Authenticated contact origin | Worker HMAC verifier, replay controls, and same-zone Route forwarding regression test pass locally | FAIL — external staging blocker |
| Privacy publication | Live pages remain placeholders; provider/retention/legal facts remain unapproved | FAIL — blocker for publishing privacy notices or enabling analytics |

## 2. Phase 2 remediation review

| Commit | Scope | Deployment implication |
| --- | --- | --- |
| `0e4dbc1` | Dependency remediation | Safe after audit verification. |
| `0fa3486` | Shared Upstash contact limiter | Must not be active with trusted Cloudflare headers until origin protection is proven. |
| `05832d4` | Consent-aware analytics | Safe with `NEXT_PUBLIC_GTM_ID` absent; analytics activation remains gated by privacy approval. |
| `b793587` | Security headers | Build-verified; verify actual headers after any deployment. CSP remains report-only. |
| `43c0d13` | Launch remediation audit | Documentation only; its dated local-variable finding is superseded by the 21 October successful local verification. |
| `89d0894` | Webpack Hostinger build compatibility | Verified by the Node.js 22 webpack build. |

## 3. Documentation and repository hygiene gates

- [ ] Review and intentionally stage the current documentation changes: `README.md`, `PRE-LAUNCH-AUDIT.md`, `LOCAL-UPSTASH-VERIFICATION.md`, `PRIVACY-VERIFICATION.md`, and `docs/`.
- [x] `tsconfig.tsbuildinfo` is removed from Git tracking and `*.tsbuildinfo` is ignored.
- [ ] Keep `.env.local`, `.next/`, and `node_modules/` untracked. Do not add an environment file to any commit.
- [ ] Treat the 20 October absence-of-local-credentials statements in the audit/privacy reports as dated evidence, not the current state. `LOCAL-UPSTASH-VERIFICATION.md` contains the later successful verification.
- [ ] Do not publish `docs/privacy-notice.en.md` or `docs/privacy-notice.ar.md` until their documented publication blockers are closed and legal approval is obtained.

## 4. Exact Hostinger production environment variables

Set server-side values only in Hostinger's environment-variable interface. Never put secrets in Git, browser-visible variables, build logs, or support tickets.

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://sonbolabs.exceptionalgrp.com`; browser-visible by design. |
| `NEXT_PUBLIC_GTM_ID` | Optional | Leave absent/empty until analytics, consent configuration, and privacy publication gates are approved. Browser-visible by design. |
| `NEXT_PUBLIC_BOOKING_URL` | Optional | Browser-visible if the application uses it. |
| `SMTP_HOST` | Yes for contact delivery | Server-side only. |
| `SMTP_PORT` | Yes for contact delivery | Server-side only; numeric valid port. |
| `SMTP_SECURE` | Yes for contact delivery | `true` for implicit TLS where the mail provider requires it. |
| `SMTP_USER` | Yes for contact delivery | Server-side only. |
| `SMTP_PASS` | Yes for contact delivery | Server-side only. |
| `CONTACT_TO_EMAIL` | Yes for contact delivery | Server-side only. |
| `CONTACT_FROM_EMAIL` | Yes for contact delivery | Server-side only; verified sending identity. |
| `UPSTASH_REDIS_REST_URL` | Yes for active limiter | Server-side only. |
| `UPSTASH_REDIS_REST_TOKEN` | Yes for active limiter | Server-side only. |
| `CONTACT_ORIGIN_HMAC_CURRENT` | Yes for active contact delivery | Server-side only; same secret as Worker current key. |
| `CONTACT_ORIGIN_HMAC_CURRENT_KEY_ID` | Yes for active contact delivery | Non-secret identifier for the current key. |
| `CONTACT_ORIGIN_HMAC_PREVIOUS` | Only during rotation | Server-side only; remove after the overlap window. |
| `CONTACT_ORIGIN_HMAC_PREVIOUS_KEY_ID` | Only during rotation | Non-secret previous-key identifier. |

## 5. GO / NO-GO gates

### Gate H — repository package

- [ ] Working tree contains only reviewed, intentional changes.
- [ ] `tsconfig.tsbuildinfo` is no longer tracked.
- [ ] No secret/environment/build artifact is staged.
- [ ] Node 22 webpack build, tests, typecheck, lint, and production dependency audit pass.

### Gate T — authenticated contact-origin security

- [x] Origin implementation verifies a short-lived, body-bound Worker HMAC and atomically claims a nonce before Redis rate limiting or SMTP.
- [x] The Worker uses the same public URL for its origin fetch. Cloudflare documents that same-zone Route fetches reach the configured origin and do not target the same-zone Route.
- [ ] Prove Worker-to-origin signed-header/raw-body pass-through and prove direct-origin requests return 403 with zero SMTP sends.
- [ ] In staging, confirm one Worker invocation and one Hostinger origin request per request, proving the configured route does not recurse.
- [ ] Configure Worker and Hostinger current/previous HMAC secrets, then run the non-delivering API smoke sequence below.

**Gate T current result: NO-GO.** The code no longer relies on `CF-Connecting-IP`, and no second hostname is required, but the Worker route/secrets and Hostinger staging evidence do not yet exist.

### Gate S — optional isolated full-path staging

The temporary Hostinger pull-request preview is useful for reviewing a build without changing production, but its temporary `hostingersite.com` hostname is not in the Cloudflare zone. It cannot exercise the same-zone Worker Route path.

The minimum full-path staging topology is a separate Hostinger Node.js Web App attached to an orange-clouded `staging.sonbolabs.exceptionalgrp.com` DNS record, with its own process, deployment source, HMAC keys, and Upstash database. It must have **no SMTP credentials or production recipient**. A same-zone Worker Route for `https://staging.sonbolabs.exceptionalgrp.com/api/contact` then forwards only to that staging app's DNS-configured origin; it cannot invoke the production contact handler.

`72a5da3` is not yet hostname-configurable: the Worker and origin allow-list intentionally contain the production hostname. Before a full-path staging deployment, make and test a narrowly scoped follow-up that supplies the public hostname/origin from a server-side staging configuration. Do not instead force the production `Origin` header in a staging Worker, and do not route the staging hostname to the production Hostinger app.

- [ ] Confirm in Hostinger that the current plan has a spare Node.js website slot and permits assignment of the staging subdomain as a separate Web App.
- [ ] Create the separate staging app from the release branch only after the hostname-configurability follow-up is reviewed; never connect it to `main` production deployment automation.
- [ ] Give staging distinct HMAC current/previous pairs and a distinct Upstash database. Leave all SMTP variables and `CONTACT_TO_EMAIL`/`CONTACT_FROM_EMAIL` unset.
- [ ] Create a separate Cloudflare Worker/version and exact staging route. Set its route fail mode to **fail closed** because it is security-critical.
- [ ] Complete every Gate T test in staging before opening a production maintenance window.

**Gate S current result: not selected.** A PR preview may validate the origin build only. It cannot validate the Worker Route path, and the release code needs the small public-host configuration follow-up before an isolated staging hostname can be used. This does not block the separately authorized Gate M maintenance-window cutover below.

### Gate P — privacy and analytics

- [ ] Legal approval of controller details, including any required address/representative information.
- [ ] Actual processors, regions, transfer safeguards/DPAs, retention, backups, and deletion process are documented and operational.
- [ ] English and Arabic notices are approved and wired into the public routes.
- [ ] If analytics is enabled: GTM/GA4 container, tags, retention, transfers, and consent behavior are verified; otherwise leave `NEXT_PUBLIC_GTM_ID` empty.

**Gate P current result: NO-GO** for privacy-notice publication and analytics activation.

## 6. Production smoke-test runbook

Run only after Gate S completes **or** Gate M is formally approved and the controlled deployment is authorized, from a designated test network, and record only status/header results. Do not submit a valid contact body.

| Test | Expected result |
| --- | --- |
| `GET /` and `GET /ar` | 200; English `lang=en`, Arabic `lang=ar` and RTL; expected canonical/hreflang metadata. |
| `GET /contact` and `GET /ar/contact` | 200; translated form and privacy link render. |
| Invalid contact body through the proxied hostname | `POST /api/contact` with exact production `Origin` and `{}` returns 400; no email is delivered. |
| Redis limiter | Only after Gate T: six Worker-routed invalid `{}` requests from one controlled source return five 400 responses, then 429 with positive `Retry-After`. This temporarily limits the operator IP for up to ten minutes. |
| Redis failure | In staging only, temporarily use an invalid/inaccessible Redis configuration and confirm 503; restore configuration immediately. Do not perform this on public production. |
| Direct-origin denial | Using Hostinger's approved direct-origin test method, a valid-shaped request with forged `CF-Connecting-IP` returns 403 and the non-delivering sink records zero sends. |
| Security headers | Confirm `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `X-Permitted-Cross-Domain-Policies`, and `Content-Security-Policy-Report-Only`; confirm `X-Powered-By` is absent. |
| Consent, GTM unset | Fresh browser profile: banner appears; reject/accept/change preference persists as the first-party 180-day cookie; no Google script/network request occurs while GTM ID is unset. |
| Consent, GTM approved later | Fresh profile: no GTM request before consent; one expected GTM request only after acceptance; reject/change preference stops future loading; inspect Preview/DebugView for PII-free events. |

## 7. Changes that can deploy independently

Technically safe only as a **non-contact release** with the HMAC origin secrets absent, so the contact API fails closed with 503:

- dependency remediation;
- Node 22 webpack build compatibility;
- report-only CSP and other response headers;
- consent UI and analytics code while `NEXT_PUBLIC_GTM_ID` remains empty;
- server-side validation, honeypot, and origin checks.

Do not advertise a working contact form in that state. A normal public release with an active contact API is blocked by Gate T. Privacy-notice publication and analytics activation are separately blocked by Gate P.

## 8. Hostinger rollback plan

Before any deployment:

1. Record the current production Git SHA/build identifier, deployment time, Hostinger environment-variable names (not values), Cloudflare rule identifiers, DNS/proxy state, and a header snapshot.
2. Retain the prior known-good deployment artifact/commit and verify Hostinger's account-specific previous-build restore procedure. Do not assume a rollback control exists without confirming it in the account.
3. Capture the expected smoke-test results and designate the operator/test source IP.

If a deployment fails compilation, headers, language routes, consent behavior, or static content:

1. Restore the recorded previous Hostinger build, or redeploy the recorded known-good commit through the approved Hostinger workflow.
2. Keep Cloudflare proxied and Full (strict); do not disable the proxy as a troubleshooting shortcut.
3. Re-run the non-contact route/header smoke tests and record the restored build identifier.

If an authenticated-origin-control failure is discovered:

1. Remove/disable the Worker route while retaining the origin verifier; unsigned requests then fail closed with 403 (and dependency/configuration failures with 503).
2. Do not weaken origin, HMAC, nonce, `Origin`, or rate-limit checks.
3. Keep Cloudflare WAF protections active while correcting the Worker/origin configuration.
4. Record the incident and do not re-enable contact delivery until Gate T is fully evidenced.

## 9. Gate M — fail-closed production cutover without staging

This is the selected maintenance-window path when isolated staging is intentionally skipped. It accepts a short, deliberate contact-form outage while the origin verifier is live and before the Worker Route is attached. No staging-only hostname configuration is required: `72a5da3` is explicitly restricted to the production hostname.

1. Record the Hostinger deployment/build ID, Cloudflare Worker version and route state, WAF rule ID, DNS state, and health/header snapshot. Configure the production HMAC values in Hostinger and Worker secrets first; the old application ignores the new HMAC variables.
2. Publish the reviewed origin verifier to `main` during the window and wait for Hostinger to show a successful deployment of the recorded commit. The public contact path will intentionally return 403 until the Worker Route is attached; this is the expected fail-closed interval.
3. Attach the exact production Worker Route, with **fail-closed** route behavior. Send one invalid `{}` request: it must return 400 after Worker signing, never send email, and appear once in Worker and origin logs.
4. Use only invalid bodies for the five/then-six limiter verification. Stop immediately on any unexpected response, missing log evidence, or delivery signal.
5. If any check fails, remove the Worker Route and retain the origin verifier. The contact endpoint remains safely unavailable (403/503); do not restore the pre-Phase-3 trusted-proxy endpoint simply to resume contact delivery.

## Decision

**Current deployment decision: NO-GO for a complete production release.**

Smallest blocking set:

1. Complete Gate S with a separate staging app and route, or complete every Gate M prerequisite and formally accept its temporary contact outage.
2. Review/stage the intended documentation package.
3. For privacy publication or analytics activation only: close Gate P.
