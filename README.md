# Sonbol Labs

## Contact email delivery

The project form sends through Hostinger SMTP from the server only. Set these production variables in Vercel (and locally in an uncommitted `.env.local`): `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL`.

Typical Hostinger settings are `smtp.hostinger.com`, port `465`, and `SMTP_SECURE=true`; use a verified Hostinger mailbox as `CONTACT_FROM_EMAIL`. Before production, verify the sending domain’s SPF, DKIM, and DMARC records in Hostinger, then test a Vercel Preview deployment. SMTP connectivity can differ from local development. The endpoint logs only a safe delivery failure reason and never returns credentials or provider errors to the browser.

There is no distributed rate limiter configured yet. The form has server-side validation, length limits, and a honeypot; add a shared rate-limiting service before high-volume public promotion.

Production-ready marketing site for Sonbol Labs, an AI-native Digital Product & Commerce Studio serving Europe and the GCC.

## Stack

Next.js App Router, TypeScript, React, Tailwind CSS v4, and ESLint. The site is Vercel-compatible and uses Server Components by default.

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

Replace the `TODO` public contact detail and the privacy-policy placeholder before launch. Project images can be added beneath `public/images/`; use `next/image` with descriptive alt text when supplied assets are added.

## Contact form

`app/api/contact/route.ts` validates all required fields server-side and never exposes email credentials. Until a delivery provider adapter is configured, the endpoint returns an acknowledged development-safe response without claiming an email was sent. Connect a provider through server-only environment variables:

- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`
- `EMAIL_PROVIDER_API_KEY`

For production, add provider delivery, a rate limiter (edge or platform layer), and CAPTCHA/Turnstile verification in this route. The architecture keeps that integration isolated.

## Analytics

GTM is loaded only when `NEXT_PUBLIC_GTM_ID` is set. A CMP should be wired in before enabling it in EU markets; no pretend consent banner is included.

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

Push to GitHub and import in Vercel. Preview deployments work automatically per Vercel project settings. Set the environment variables in Vercel and configure `NEXT_PUBLIC_SITE_URL` only to the chosen production domain.
