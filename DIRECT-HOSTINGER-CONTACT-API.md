# Direct Hostinger Contact API

This release intentionally removes the Cloudflare Worker HMAC envelope, Redis nonce store, and Upstash rate limiter from `POST /api/contact`. The Next.js route handles a same-origin browser request and sends an accepted, validated lead through the configured Hostinger SMTP service.

## Retained safeguards

- Exact production Origin check, with localhost accepted only outside production.
- 16 KiB declared and streamed body limit.
- Server-side schema validation for English and Arabic form payloads.
- Honeypot acknowledgement without SMTP delivery.
- Server-side SMTP credentials and generic browser-facing SMTP failures.

## Explicit limitation

An Origin header can be forged by a non-browser client. It is not a replacement for HMAC authentication, a proxy-origin boundary, nonce replay protection, or distributed rate limiting. The endpoint can be contacted directly and may receive abusive traffic.

Cloudflare proxying, Full (strict), and WAF controls remain worthwhile perimeter protections. Before broader promotion, configure a managed Cloudflare WAF rate rule and assess Turnstile. Do not claim these controls authenticate direct requests to Hostinger.

## Environment

Only SMTP variables are needed for contact delivery: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL`. The removed Upstash and HMAC variables must remain absent.
