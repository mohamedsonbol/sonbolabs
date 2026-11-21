# Sonbol Labs — Pre-Launch Technical Audit

Date: 2026-10-16  
Target: `https://sonbolabs.exceptionalgrp.com`  
Scope: non-destructive repository and production audit. No valid contact-form request was submitted, so no lead email was intentionally sent.

## Phase 4 — Public contact channel hygiene — 2026-11-20

Approved public contact policy: the website contact form and LinkedIn only. The following public-facing personal or direct channels were removed locally (not deployed):

- **Personal WhatsApp:** `components/contact/whatsapp-cta.tsx` deleted; usages removed from `app/contact/page.tsx` and `app/ar/contact/page.tsx`; EN/AR dictionary strings, CSS and dead wrappers removed.
- **Personal Calendly/booking link:** booking CTA and `NEXT_PUBLIC_BOOKING_URL` removed from `components/localized-site.tsx`, `components/sections/home-sections.tsx` and `.env.example`; the consent-gated `booking_click` tracker removed from `components/analytics/analytics-consent.tsx`; the Calendly origin removed from the report-only CSP in `next.config.ts`.
- **Personal Instagram and attribution:** Instagram link/icon and the personal "Built by" credit removed from `components/layout/footer.tsx`. The existing LinkedIn link was kept unchanged with `target="_blank" rel="noopener noreferrer"`.

Preserved: contact form fields, validation, honeypot, SMTP delivery, success/error states, all server-side SMTP variables, privacy/legal notices, pricing, positioning and branding.

Repository hygiene: `.webui_secret_key` was added to `.gitignore`. Git metadata checks (`git ls-files --error-unmatch`, `git log --all --full-history -- .webui_secret_key`, `git rev-list --all --objects -- .webui_secret_key`) confirm it is not in HEAD, the index, or any local ref; no history or index change was made. Its contents were not read.

The snapshot below is historical. Its references to WhatsApp, Calendly, booking links and booking events describe the pre-Phase-4 site and no longer describe the current code. Obsolete booking-click wording in the privacy notices is listed for the separate privacy/legal review; those notices were not edited.

## Phase 5 — Production GTM disablement and consent remediation — 2026-11-20

Approved decision: Google Tag Manager is disabled in production builds while the consent/analytics architecture is preserved for possible future reactivation.

- **Evidence:** the previously deployed production bundle contained an inlined container ID (`GTM-N63C7TRK`) in the GTM component. Before this note the ID was absent from application source and from tracked Git history; it is recorded here only as historical evidence, and no owner/configuration record exists in authorized project documentation. The old "no GTM marker in fetched HTML" finding was accurate for server HTML only and did not rule out a build-time ID.
- **Build configuration:** `next.config.ts` now sets `env: { NEXT_PUBLIC_GTM_ID: "" }`, which is inlined at build time and overrides environment/.env values. A verification build with a dummy non-empty `NEXT_PUBLIC_GTM_ID` still produced no container ID. No replacement ID was hardcoded; the GTM component and all event definitions were retained.
- **Consent withdrawal:** GTM injection is isolated in `injectGtmScript(enabled, id)` (`components/analytics/analytics.tsx`), which returns a cleanup function that removes the script element it created. React effect cleanup runs when consent changes from granted to denied, so the injected script is removed. Duplicate injection is still blocked by the `sonbol-gtm` element check. Consent signals still update with `analytics_storage: denied` and `trackEvent` still re-checks the cookie on every call. Removing the script cannot reverse requests already sent or guarantee that previously executed third-party code is fully unloaded.
- **Privacy link:** `components/analytics/consent-copy.ts` holds bilingual banner copy; the banner now shows a localized Privacy Notice link to `/privacy` and `/ar/privacy` with RTL preserved.
- **CSP note:** the report-only CSP in `next.config.ts` still allows `www.googletagmanager.com` in `script-src`/`connect-src` and `www.google-analytics.com`, `region1.google-analytics.com` in `connect-src`/`img-src`. No other source dependency on those origins exists in the repository; they are candidates for removal only after a future approved CSP change and validation.
- **Tests:** `npm run lint`, `npm run typecheck`, `npm test` (26 passed / 0 failed) and `npm run build` (Next.js 16.4.6) passed. Generated bundles contain no `GTM-N63C7TRK`, no other GTM/GA4 ID pattern, and the compiled GTM effect is a no-op.
- **Status:** local implementation only. Production deployment remains pending and requires separate approval.

## Phase 3 privacy-verification update — 2026-10-20

### Current recommendation: NO-GO for privacy publication or a privacy-related deployment

The business identity, privacy email and retention policy are now documented in bilingual approval drafts and the verification report. The local `/privacy` and `/ar/privacy` routes use those drafts and include contact-form links, but production remains unchanged. Do not deploy until controller-address requirements, actual processors, processor contracts/transfers, mailbox/backup deletion, technical-log retention and any optional analytics configuration are verified and legally approved.

Read-only live checks confirmed a Hostinger/LiteSpeed/hPanel response and confirmed the placeholder content is still public. Cloudflare is confirmed in the traffic path, but its enabled products, processing region and log retention remain unverified. The checks did not establish the Hostinger account configuration, SMTP/mailbox provider, backup/log retention or GTM/GA4 property. There is no active Upstash rate limiter; earlier references are historical conditional-code references, not a processor disclosure.

No deployment was performed and no valid contact enquiry was sent. See `PRIVACY-VERIFICATION.md` for the data inventory, provider evidence, required decisions, dashboard actions and operational procedures; see `docs/privacy-notice.en.md` and `docs/privacy-notice.ar.md` for the approval drafts.

## Phase 2 remediation update — 2026-10-16

### Final recommendation: NO-GO pending deployment and legal decisions

The confirmed dependency vulnerabilities are resolved in the repository and all automated checks pass on Node.js 22.23.1. Do not deploy yet: the public privacy pages still contain the old development placeholder because the supplied English and Arabic notices explicitly leave material legal facts unconfirmed. In addition, the shared rate-limit store, trusted-proxy origin lock, and post-deploy CSP validation must be completed before launch.

### Resolved in the repository (not yet deployed)

- **Dependency security — resolved.** `next`, `@next/third-parties`, and `eslint-config-next` were updated from 16.3.7 to 16.4.2. `source-map-js` is now 1.2.2. `npm audit --omit=dev` reports **0 vulnerabilities**.
- **Contact rate-limiting history — superseded.** Earlier audit text described a conditional Upstash Redis sliding-window path. There is no active Upstash rate limiter; do not treat that historical description as a live configuration or processor disclosure. The confirmed controls are origin validation, body-size restrictions, schema validation and a honeypot.
- **Consent-aware analytics — implemented.** Analytics is default-denied, GTM is not injected until analytics consent, Google Consent Mode v2 consent signals are sent, preferences persist for 180 days, and a bilingual accept/reject/change-preferences UI is included. CTA and successful-form events remain consent-gated and free of PII. Actual Calendly links now produce a consent-gated `booking_click` event.
- **Security headers — implemented in configuration.** HSTS, COOP, `X-Permitted-Cross-Domain-Policies`, `poweredByHeader: false`, and a restrictive external-origin CSP in report-only mode were added. Existing anti-framing, referrer, permissions, and MIME headers remain.

### Required business, legal, and deployment decisions

1. **Legal/privacy (P0):** Confirm the final legal bases, objective retention periods/criteria, actual processor and transfer locations/safeguards, and registered business address. The supplied notices label each of these as proposed or to be confirmed; they must not be published as final notices until confirmed. Provide an approved English and Arabic final text after those confirmations.
2. **Rate limiting (P0):** Decide whether to add a rate limiter. If one is selected, assess its data processing, configure it safely, and update the notice and verification record before activation. No active Upstash configuration is assumed.
3. **Analytics (P0 if enabled):** Confirm whether a GTM container/GA4 property will be deployed. If yes, name the provider in the final privacy notice, verify the container sends no PII, and test consent, CTA, successful-form, and Calendly events in GTM Preview/GA4 DebugView. If no analytics is to be deployed, leave `NEXT_PUBLIC_GTM_ID` empty.
4. **Headers (P1):** After deployment, verify HSTS and the `Content-Security-Policy-Report-Only` header on the public hostname, monitor browser/CSP reports while testing English/Arabic pages, forms, and booking, then change to enforced CSP only after all approved origins are confirmed. The report-only policy has no report endpoint; configure one if operational monitoring is required.

### Phase 2 commits

- `0e4dbc1` `chore: patch production dependencies`
- `0fa3486` `feat: rate limit contact submissions`
- `05832d4` `feat: add consent-aware analytics`
- `b793587` `chore: harden security headers`

### Phase 2 verification

| Check | Result |
| --- | --- |
| Node.js | PASS — `v22.23.1` |
| `npm test` | PASS — 8 tests, including allowed/blocked rate-limit cases |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — Next.js 16.4.2 with webpack |
| `npm audit --omit=dev` | PASS — found 0 vulnerabilities |

No production route, DNS, Hostinger setting, Cloudflare setting, SMTP configuration, or GTM container was changed during Phase 2. A valid contact form was not submitted.

## Original audit snapshot

Historical record only (2026-10-16). Superseded where contact channels are concerned by the Phase 4 note above.

## Category status

| Category | Status | Summary |
| --- | --- | --- |
| Security | FAIL | Two production dependency findings are rated high by `npm audit`; no rate limiting; incomplete transport/browser hardening. |
| Performance and responsiveness | WARNING | Lean text/CSS pages and responsive/RTL CSS are present; all public pages are dynamically rendered and no device-browser rendering run was available. |
| SEO | WARNING | Production indexing, canonical URLs, hreflang, robots, sitemap, and bilingual title/description tags work. OG/Twitter image metadata is missing. |
| Analytics | FAIL | GTM is not visibly active in the tested production HTML; implementation has no consent gate, booking clicks are not tracked, and no analytics destination was verified. |
| Functional testing | PASS | All ten public routes returned HTTP 200; English/Arabic document direction and safe contact API cases behaved correctly. |
| Build and code validation | PASS | Unit test, typecheck, lint, and `next build --webpack` completed successfully. |

## Critical issues

1. **P0 — Upgrade Next.js before release.** The lockfile resolves `next` to **16.3.7**. `npm audit --omit=dev` reports it in six advisory ranges, including high-severity `GHSA-cjq9-62q9-8jv4` (Image Optimization SSRF), with a non-major fix available at **16.4.2**. The audit also reports `source-map-js@1.2.1` as high severity (`GHSA-68fv-2mgg-jv7q`), fixed in 1.2.2. Do this on a branch, regenerate the lockfile, then repeat all validation and deploy the resulting build. Do not use `npm audit fix --force`.
2. **P0 — Replace the live placeholder privacy policy and decide/implement consent before analytics activation.** `/privacy` and `/ar/privacy` explicitly say "development version" and instruct replacement before launch. It lacks controller identity, lawful basis, retention, processor/transfers, data-subject rights, and contact details. If GTM/GA4 is enabled for EEA/UK visitors, block non-essential tags until consent and provide an auditable preference mechanism.

## Recommended fixes

### P0 — required before launch

- Upgrade the pinned Next.js dependency from 16.3.7 to at least 16.4.2 and update the affected lockfile transitive dependencies, including `source-map-js` to at least 1.2.2. Prefer targeted, non-major upgrades; review the diff rather than using force.
- Publish reviewed English and Arabic privacy notices and implement the chosen consent model before configuring `NEXT_PUBLIC_GTM_ID` in production.

### P1 — release hardening

- Add server-side rate limiting to `POST /api/contact` (edge/Redis/provider-backed where Hostinger permits), with a conservative per-IP and per-address threshold. The current honeypot and strict origin check are useful but do not prevent direct POST floods or SMTP exhaustion.
- Add a real restrictive CSP (with the required GTM/GA/Calendly origins only if enabled), HSTS after confirming HTTPS-only operation, and disable `X-Powered-By`. Production currently returns only `Content-Security-Policy: upgrade-insecure-requests`; it does not return HSTS. Retain the existing `nosniff`, `DENY`, referrer, and permissions policies.
- Complete analytics: gate GTM behind consent; verify an actual GA4/GTM container; implement booking-link tracking; verify CTA, form-start, and successful-form events in GTM Preview/GA4 DebugView. Keep names, email addresses, company, website, and message text out of event payloads.
- Perform one controlled, authorized valid submission after SMTP credentials are configured. Confirm delivery, Reply-To, error alerting/log retention, and the 503/500 user experience. Do not automate repeated valid sends.
- Configure/require encrypted SMTP transport appropriate to the selected Hostinger port (implicit TLS for 465 or required STARTTLS for 587), and use a least-privilege mailbox.

### P2 — quality and discoverability

- Add absolute `openGraph.images` and `twitter.images` metadata (English and Arabic variants if practical). The site declares `summary_large_image` but supplies no share image.
- Consider removing the root-layout request-header dependency for locale selection or otherwise cache safely. The production build marks all public UI routes dynamic; this is functional but gives up static delivery for a mostly content site.
- Run a final visual pass in real browsers at mobile (375px), tablet (768px), and desktop (1440px), including menu open/close, language switching, WhatsApp, keyboard focus, and long Arabic content. This audit inspected the responsive and RTL CSS and production document attributes, but the environment did not provide a headless browser for screenshot/interaction assertions.
- Correct deployment documentation that still says Vercel when the stated host is Hostinger, and replace the public-contact-email `TODO` with the approved contact channel if one is intended.

## Evidence

### Dependency and security review

- `npm audit`: **7 high**, 0 critical findings. In addition to the two production findings, the dev dependency chain contains `braces`, `micromatch`, `fast-glob`, and `eslint-config-next` findings; the proposed audit fix would be a major downgrade to Next 14, so it is not a safe remediation path.
- `npm audit --omit=dev`: **2 high**, 0 critical findings: `next@16.3.7` and `source-map-js@1.2.1`.
- Dependency paths observed: `next@16.3.7`; `source-map-js@1.2.1` via PostCSS/Tailwind; lint-only `braces@3.0.3` via eslint-config-next → fast-glob → micromatch.
- Secret exposure review: only `.env.example` is tracked; `.env*` is ignored. SMTP variables are used only in server route/mail code. Browser-visible variables are limited to `NEXT_PUBLIC_SITE_URL`, optional GTM ID, and booking URL. No secret values were read or recorded.
- Contact API review: Zod limits and validates every field; website URLs are restricted to HTTP(S) domains; a hidden honeypot returns a generic success response; production requires the exact HTTPS origin; mailer escapes HTML and returns generic 503/500 responses while logging categorized diagnostics. No rate limit, CAPTCHA/challenge, or abuse quota exists.
- Production headers observed: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy: camera=(), microphone=(), geolocation=()` are present. `Strict-Transport-Security` is absent; CSP is only `upgrade-insecure-requests`; `X-Powered-By: Next.js` is exposed.

### Production routes and functional checks

All returned HTTP 200:

`/`, `/ar`, `/contact`, `/ar/contact`, `/work/dr-choice`, `/ar/work/dr-choice`, `/privacy`, `/ar/privacy`, `/robots.txt`, `/sitemap.xml`.

- `/` rendered `lang="en" dir="ltr"`; `/ar` rendered `lang="ar" dir="rtl"`. The Arabic title and description were present and localized.
- Contact API, with no valid lead payload sent:
  - exact production origin + invalid body: **400** with localized-client-compatible field codes;
  - exact production origin + filled honeypot: **200 `{ "ok": true }`** (no delivery path);
  - untrusted origin: **400 `Invalid form submission.`**.
- Contact pages expose the WhatsApp link in both languages. Header/footer links, language alternate links, and the Calendly booking URL appear in server-rendered production HTML. Interactive click behavior was not browser-automated.

### SEO and content checks

- Production `robots.txt` allows crawling and references the sitemap. `sitemap.xml` contains all eight English/Arabic content routes.
- Home and Arabic-home responses have absolute canonical URLs and reciprocal `hreflang` (`en`, `ar`) alternatives, descriptions, Open Graph title/description, and Twitter card tags. Route-level canonical/hreflang metadata is implemented in source for contact, privacy, and case-study pages.
- No `noindex` directive was found. Indexing is enabled.
- No `og:image`/`twitter:image` was present in the tested HTML.

### Performance and UI review

- Production home HTML was approximately 18 KB and its CSS approximately 20 KB before compression. No raster image assets were referenced on the home page, so oversized image payloads were not found.
- CSS has a mobile breakpoint at 760px, single-column forms/layouts, an expandable mobile navigation, and RTL-specific direction/alignment rules. The root document direction also switched correctly in production.
- The responsive CSS likely avoids many horizontal-overflow patterns, but visual layout shifts, touch targets, font loading, Core Web Vitals, and actual menu interactions require the P2 real-browser pass before sign-off.

### Analytics review

- `cta_click`, `lead_form_start`, and `lead_form_submit` are implemented and send only CTA/location/destination or option values and locale—not free-text form PII.
- GTM script insertion occurs client-side whenever `NEXT_PUBLIC_GTM_ID` is configured, with no consent check. It was not visibly active in the downloaded production HTML; client runtime/container configuration was not independently verifiable.
- The booking control is a plain anchor, so it does not use `TrackedLink` and has no booking event. The successful form event is sent only after a successful API response, which is correct.

## Validation results

| Command | Result |
| --- | --- |
| `npm test` | PASS — 1 test file, 6 subtests; 0 failures. |
| `npm run typecheck` | PASS. |
| `npm run lint` | PASS. |
| `npm run build` | PASS — Next.js 16.3.7, webpack; all 13 static generation steps completed. |
| `npm audit` | FAIL — 7 high findings. |
| `npm audit --omit=dev` | FAIL — 2 high production findings. |

## Audit limitations

This was intentionally non-destructive. It did not inspect Hostinger or Cloudflare account settings, DNS records, server logs, SMTP credentials, GTM/GA4 containers, or send a valid live email. Production HTTP/HTML and safe invalid/honeypot API checks were performed. No headless browser was installed, so responsive behavior was assessed from live documents and source/CSS rather than visual screenshots or Lighthouse traces.
