# Sonbol Labs

## Contact email delivery

The project form sends through the configured SMTP service from the server only. Set the required values in the actual production hosting environment (and locally in an uncommitted `.env.local`): `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL`.

Hostinger SMTP may use `smtp.hostinger.com`, port `465`, and `SMTP_SECURE=true`; verify the actual provider settings and use a verified mailbox as `CONTACT_FROM_EMAIL`. Before production, verify the sending domain’s SPF, DKIM, and DMARC records with the actual mail provider, then perform one authorised production test. SMTP connectivity can differ from local development. The endpoint logs only a safe delivery failure reason and never returns credentials or provider errors to the browser.

There is no active Upstash rate limiter. The form uses server-side validation, exact-origin checks in production, body-size restrictions and a honeypot. Do not describe a future rate-limit service as active until it is configured and verified.

Production-ready marketing site for Sonbol Labs, an AI-native Digital Product & Commerce Studio serving Europe and the GCC.

## Stack

Next.js App Router, TypeScript, React, Tailwind CSS v4, and ESLint. The production site is hosted on Hostinger and uses Server Components by default.

## Run locally

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

Copy `.env.example` to `.env.local` before configuring integrations.

## Content

Structured, CMS-ready editorial content lives in `content/`:

- `company.ts` — identity and base URL
- `services.ts` — service capabilities
- `projects.ts` — case-study copy

The bilingual privacy notice is an approval draft. Do not deploy it until the checklist in `PRIVACY-VERIFICATION.md` is complete and an effective date is approved. Project images can be added beneath `public/images/`; use `next/image` with descriptive alt text when supplied assets are added.

## Contact form

`app/api/contact/route.ts` validates all required fields server-side, checks the production origin, limits body size, uses a honeypot, and never exposes email credentials. Successful submissions use Nodemailer SMTP through server-only environment variables:

- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

The endpoint has no application database or CRM persistence for enquiries. Any future provider, rate limiter or CAPTCHA integration must be assessed and documented before activation.

## Analytics

GTM is loaded only when `NEXT_PUBLIC_GTM_ID` is set and the visitor has granted analytics consent. Before enabling it, verify the actual container/property, tags, destinations, retention, data-processing terms and privacy-notice disclosures.

Events are sent through `components/analytics/analytics.tsx`:

| Event | Properties |
| --- | --- |
| `cta_click` | `cta_name`, `cta_location`, `destination` |
| `lead_form_start` | — |
| `lead_form_submit` | `project_type`, `budget_range`, `timeline` |

Personal details and message text are deliberately excluded. The wrapper can later route the same event shape through server-side GTM.

## SEO and security

Metadata, canonical configuration, Open Graph, sitemap and robots are implemented with Next metadata APIs. Set `NEXT_PUBLIC_SITE_URL` to the production origin. Organization/ProfessionalService/WebSite JSON-LD uses factual company information only.

Response headers include content type, framing, referrer and permissions protections. A launch CSP should be tailored after finalizing fonts, consent management, hosting, and any analytics domains.

## Deployment

The live audit identifies Hostinger as the responding production platform. Confirm the actual deployment workflow and set environment variables only in that environment. Configure `NEXT_PUBLIC_SITE_URL` only to the chosen production domain; do not rely on legacy Vercel references in older project documentation.
