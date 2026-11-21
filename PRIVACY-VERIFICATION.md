# Sonbol Labs — Privacy Verification

**Date:** 22 October 2026  
**Scope:** repository, local configuration presence (without reading secret values), prior read-only production HTTP evidence, publicly available provider documentation, and owner-confirmed production email verification. No provider dashboard, mailbox, backup, DNS, account, application code, or deployment configuration was changed. This is an implementation and evidence review, not legal advice.

## Production GTM evidence correction and disablement — 2026-11-20

- Earlier notes that `NEXT_PUBLIC_GTM_ID` is empty locally and that no GTM marker appeared in fetched production HTML remain accurate for those specific checks. They did **not** establish that production was unconfigured: `NEXT_PUBLIC_*` values are inlined at build time, and script injection is consent-gated, so a cookie-less HTTP fetch would not show the script even with an ID present.
- The deployed production bundle was subsequently found to contain an inlined container ID in the GTM component. Before this note the ID was not present in application source or tracked Git history; it is recorded here only as historical evidence, and no owner/configuration record was found in authorized documentation.
- **Approved decision recorded:** GTM is disabled in production builds. `next.config.ts` sets `env: { NEXT_PUBLIC_GTM_ID: "" }`; a verification build with a deliberately non-empty dummy value still produced no ID. The GTM component and all site-created event definitions were preserved for possible future reactivation.
- **Consent withdrawal:** the injection logic now returns a cleanup function that removes the application-created script when the effect tears down (including withdrawal from granted to denied). Consent signals continue to update (`analytics_storage: denied`), and `trackEvent` re-checks the consent cookie on each call. Script removal cannot reverse already-sent requests or guarantee complete unloading of previously executed third-party code.
- **Banner:** a localized Privacy Notice link (`/privacy` and `/ar/privacy`) was added to both consent banners.
- **Verification:** lint, typecheck, 26/26 tests and production build passed; generated bundles contain no GTM/GA4 ID pattern and the compiled GTM effect is a no-op.
- **Unresolved:** container ownership and published tag inventory, GA4 property and retention, Google DPA/transfer documentation, and whether previously executed tags in the old production build processed data. No Google account was accessed.
- **Status:** local implementation only; production deployment remains pending and requires separate approval. This section does not change any legal claim in the notices.

## Final compliance evidence review — owner/legal approval report

### Evidence classes

| Class | Meaning | Examples in this report |
| --- | --- | --- |
| Confirmed account/production fact | Observed in repository/local configuration without revealing secrets, prior production headers, or confirmed by the owner | Hostinger business inquiry mailbox receives new enquiries; Gmail receives no new copies; SMTP has one non-Gmail recipient; GTM ID is absent/empty locally. |
| Public provider documentation | Provider material describing available service behaviour or contractual terms; it does not prove the account uses it | Hostinger data-centre options, mail Trash behaviour, DPA; Cloudflare DPA, subprocessors and analytics documentation. |
| Dashboard verification required | Cannot safely be inferred from source, headers or provider marketing/legal material | Plan/SKU, active data-centre, mailbox/log/backup settings, Cloudflare products and DNS/proxy state, GTM container contents. |

### 1. Hostinger evidence

**Confirmed / owner-confirmed**

- Production previously identified Hostinger/LiteSpeed/hPanel in response headers; the Next.js contact route uses server-only SMTP variables and Nodemailer.
- The owner has confirmed that the Hostinger business inquiry mailbox receives enquiries after the forwarding change. The exact hosting and email plan/SKU is not established.
- SMTP configuration has one recipient and no application CC/BCC. It is not evidence of mailbox-retention, backup or log settings.

**Public documentation, not account evidence**

- Hostinger publishes a [DPA](https://www.hostinger.com/legal/dpa) under which it acts as processor where applicable, with subprocessors and transfer terms governed by that agreement; confirm the contracting entity and acceptance in hPanel.
- Hostinger documents possible web/cloud server locations in Europe (France, Germany, Lithuania, UK and Netherlands) and other regions, but the account’s selected data centre is not known from the repository. See [Hostinger server locations](https://support.hostinger.com/en/articles/1583267-where-are-hostinger-servers-located).
- Hostinger Mail documentation says deleted messages move to Trash and can remain there for up to 30 days; it also documents account-recovery/backup limits. This is service documentation, not evidence of this mailbox’s actual retention, exports or backups. See [recover deleted emails](https://www.hostinger.com/support/1583473-how-to-recover-deleted-emails-in-hostinger-email/) and [restore a deleted mailbox](https://support.hostinger.com/en/articles/1583466-how-to-restore-a-deleted-hostinger-email-account).

**Owner hPanel actions required**

1. Record the active hosting plan, email plan, contracting entity, selected data-centre/region, and whether the DPA is accepted or otherwise incorporated.
2. Record the business inquiry mailbox, its access owners, MFA status, aliases/forwarders/catch-all, retention/deletion behaviour, Trash/Spam settings, and whether clients retain local copies.
3. Record hosting, application, access-log and backup products/settings, their retention, restoration process, access roles, and deletion/expiry limits. Do not assume provider backups permit individual-message deletion.

### 2. Cloudflare evidence

**Confirmed / unconfirmed boundary**

- Cloudflare is confirmed to be in the traffic path from prior evidence. That supports a DNS/CDN/proxy role, but does not identify individual DNS records, proxy state, plan, regional services, WAF rules or logging configuration.
- No repository evidence establishes use of Cloudflare Workers, Zaraz, Turnstile, Bot Management, Zero Trust, Logpush, Browser Insights, Web Analytics, Workers Analytics Engine, or other optional security/analytics products. Their absence must be checked in the dashboard; a Free plan would not prove they are disabled.

**Public documentation, not account evidence**

- Cloudflare’s [Customer DPA](https://www.cloudflare.com/cloudflare-customer-dpa/) describes its processor/subprocessor framework. The current [subprocessor list](https://www.cloudflare.com/gdpr/subprocessors/) and DPA must be reviewed against the active services.
- Cloudflare makes [SCC/DPA materials](https://www.cloudflare.com/cloudflare_customer_SCCs.pdf) available for relevant international transfers. Legal counsel must confirm the appropriate transfer mechanism for the actual service configuration.
- Cloudflare documents that zone/account analytics and product analytics expose traffic/security metadata, and that available data/retention varies by product and plan. See [types of analytics](https://developers.cloudflare.com/analytics/types-of-analytics/) and [security-events retention](https://developers.cloudflare.com/waf/analytics/security-events/). These pages do not establish that this account collects a particular dataset or has a particular retention setting.

**Owner dashboard actions required**

1. Export/record the zone’s DNS records and orange-cloud proxy state; confirm enabled CDN, SSL/TLS, WAF, rate limiting and security products.
2. Check Zaraz, Web Analytics, Browser Insights, Workers, Pages, Turnstile, Logpush, Zero Trust and all integrations for enabled services, tags, destinations and data flows.
3. Record available analytics/security/log datasets, plan-specific retention/query windows, Logpush destinations, access roles, regional services/data-localization settings, and DPA/SCC acceptance status.

### 3. Retention operating procedure

No automated deletion is established. The following owner-controlled procedure applies:

1. Monthly, maintain a minimal enquiry register: received date, last substantive interaction, status, known storage locations, scheduled review date, responsible person and any legal-retention hold. Do not put enquiry content in the register.
2. Identify unconverted enquiries whose last substantive interaction is more than 12 months old. Retain only where a documented contractual, tax, accounting or claims requirement applies.
3. Delete controllable copies from the Hostinger business mailbox (including Inbox, Sent, Archive/custom folders, Spam/Junk, Trash, aliases/shared folders and authorised exports), then permanently remove Trash contents where the service permits.
4. Historical Gmail copies may exist. Use the historical-copy procedure below for those records; do not state that they have been deleted until it is verified and recorded.
5. For application, Hostinger and Cloudflare technical logs, identify the system owner and configured retention. Delete or anonymize only where the system supports it, then record the setting/action, date, operator and limitation. Do not add form content, email values, message text or credentials to logs.
6. Record provider-managed backups, recovery windows, retention and individual-item-deletion limits. Do not restore a backup solely to erase one enquiry; allow non-addressable backup copies to expire under the documented lifecycle unless legal advice requires another approach.

### 4. Analytics evidence and actions

- `.env.example` declares `NEXT_PUBLIC_GTM_ID`, but its value is blank. The inspected local `.env.local` has the variable absent or empty; its value was not exposed.
- The GTM component injects the Google script only when both the ID exists and the visitor has granted analytics consent. Consent is stored in the first-party `sonbol_analytics_consent` cookie for 180 days. Site-created event payloads exclude direct identifiers and free-text form values.
- Prior review found no GTM marker in downloaded production HTML. A fresh re-check could not be completed because this environment could not resolve the production hostname. This is not evidence that production has no GTM ID.
- Before any activation or publication, inspect the production build/runtime and GTM container: container ID, every tag/trigger/variable, destinations (including GA4, ads, pixels and server-side tagging), consent defaults, Google signals/ads settings, data retention, user access, linked products and data-processing terms. Verify with GTM Preview/GA4 DebugView using non-production personal data only.

### 5. Questions for Polish privacy/business-law review

1. What exact controller identification must be published for `Mohamed Sonbol Business Consulting` trading as Sonbol Labs, including legal form, registration/tax identifiers and public business-address requirements? Is an alternative service address permitted or required if the owner’s home address must not be published?
2. Are the stated purposes and GDPR lawful bases appropriate for enquiry handling, security/abuse controls, email delivery, retained client records and any optional analytics in this controller’s circumstances?
3. Which processors require a written Article 28 arrangement, and which documented processor/subprocessor, location and retention details must appear in the notice or internal records for Hostinger, Cloudflare, mail, backups, logging, booking and analytics?
4. What transfer mechanism, transfer-impact assessment and supplementary measures are required for the actual providers and any access outside the EEA? How should historical Gmail copies be addressed in the compliance record?
5. Is the 12-month unconverted-enquiry period proportionate and how should it interact with Polish tax, accounting, limitation and evidentiary obligations?
6. Is the proposed rights-request process, identity verification, request log and UODO complaint wording adequate? Is a DPO, EU/UK representative, registration or other business disclosure required?

### Final owner checklist

| Gate | Status | Owner evidence required |
| --- | --- | --- |
| Hostinger business mailbox receives enquiries; no new Gmail copies | PASS — owner confirmed | Retain the recorded forwarding-change verification. |
| Historical Gmail copies | OPEN | Approved deletion review/register; do not claim deletion before verification. |
| Hostinger processor, region, mailbox/log/backup retention | OPEN | hPanel inventory, DPA/contract evidence, settings and backup limits. |
| Cloudflare active services, logs, regional settings and DPA/SCC | OPEN | Dashboard inventory and contractual evidence. |
| GTM/analytics production state and tags | OPEN | Production/runtime and container review; keep off unless approved. |
| Technical-log 90-day target | OPEN | Per-system configured retention and owner evidence. |
| Polish controller/business disclosure and lawful-basis review | OPEN | Written Polish legal advice and approved final notice text. |
| Public notice effective date | SET — 22 October 2026 | Publish only after all open gates are closed. |

**Final readiness: NO-GO for publication.** The email-forwarding remediation is verified, but the open processor, transfer, retention/log, analytics and Polish legal-disclosure gates prevent a final privacy-publication approval.

## Current implementation update — 22 October 2026

The local `/privacy` and `/ar/privacy` routes now use a reusable bilingual approval draft and the contact form links to the corresponding notice. **This does not authorise a deployment or publication.** The production pages have not been changed.

- The confirmed traffic path is Hostinger with Cloudflare; enabled Cloudflare products, logging, regions, retention and processor terms remain unverified.
- There is **no active Upstash rate limiter**. Any earlier Upstash references below describe a conditional, inactive code path and must not be treated as a live processor or public disclosure.
- The contact endpoint continues to use validation, exact-origin checks, body-size restrictions and a honeypot. It sends successful enquiries through Nodemailer SMTP and has no application database or CRM storage.
- GTM remains conditional on both configuration and consent. Do not activate it until the analytics checklist is completed.

## Historical email privacy remediation — 22 October 2026

### Confirmed application boundary

- SMTP configuration contains the standard seven server-only variables. Their values and credentials were not recorded.
- `CONTACT_TO_EMAIL` is syntactically a **single**, non-Gmail recipient. `sendLeadEmail` supplies that single value only as Nodemailer’s `to` field; it has no `cc` or `bcc` field and no multiple-recipient construction.
- The application contains no Gmail address, forwarding rule, mailbox API, or other code that creates a Gmail copy. The Gmail copy therefore arises after application SMTP delivery, through a Hostinger mailbox forwarding setting or another mailbox-side rule/client action. The exact downstream mechanism cannot be verified without inspecting the Hostinger mailbox settings.

### Recorded production verification

The owner has confirmed that the forwarding change was recorded, Hostinger receives contact enquiries, personal Gmail receives no new copies, and website submissions succeed. The current business inquiry mailbox is Hostinger. No SMTP configuration was changed by this repository review.

Historical Gmail copies may still exist. Their deletion has **not** been verified or claimed. Retain the procedure below until an approved deletion review has been completed.

### Manual deletion procedure for historical enquiries

Perform only after approval, with a minimal deletion register recording the enquiry identifier/date, mailbox searched, operator, action date, and any retention exception—never the enquiry content.

1. **Define scope.** Identify unconverted enquiries whose last substantive interaction is over 12 months old, unless a documented legal, tax, accounting or claims hold applies. Preserve the approved 12-month policy; do not delete a still-required client record merely because it exists in mail.
2. **Hostinger mailbox.** Search the Inbox, Sent, Archive/custom folders, Spam/Junk, Trash and any shared folders or aliases for each in-scope enquiry. Delete all controllable copies, then permanently remove them from Trash if the mailbox offers that action. Check mailbox forwarding, filters/rules and delegated/mobile access for additional copies; do not change forwarding without separate approval.
3. **Personal Gmail.** Search All Mail, Inbox, Sent, Archive/labels, Spam and Trash for the same in-scope enquiries. Delete every controllable message/thread and empty Gmail Trash; Gmail ordinarily removes messages left in Trash after 30 days, but this is not a substitute for emptying it when an approved deletion is due. Check filters, forwarding, delegated access, downloaded mail clients and exports for additional copies.
4. **Backups and limitations.** Do not restore a backup solely to delete one message. Record the applicable Hostinger and Gmail/Google backup, Vault/retention, export and recovery limitations. For provider-managed backups or retained copies that cannot be individually deleted, let them expire under the documented lifecycle and record the expected expiry; obtain provider/legal guidance if a different action is required.
5. **Complete the register.** Record systems checked, deleted folders, permanent-deletion/Trash status, backup limitation, retention exception and next review date. Keep only the minimum compliance record for its approved retention period.

## Decision

**Publication readiness: NO-GO.** The local `/privacy` and `/ar/privacy` routes use the bilingual approval drafts, but production has not been changed and must not be deployed until the open gates in the final checklist are closed.

**Deployment readiness: NO-GO for a privacy-related release.** Do not deploy a privacy-page replacement or enable analytics until the P0 items below are closed. No deployment or push was performed.

## Confirmed facts

- **Controller:** Mohamed Sonbol Business Consulting, an individual / sole proprietorship.
- **Privacy contact:** `ezzat@exceptionalgrp.com`.
- **Address:** intentionally omitted pending legal assessment; no address was invented in the drafts.
- **No marketing list:** confirmed business instruction; no newsletter or marketing-list integration appears in the repository.
- **Retention approved by the business:** unconverted enquiries, at most 12 months after the last substantive interaction; client records under applicable contractual, tax, accounting and legal-claims requirements; technical logs, intended maximum 90 days where controlled; no marketing list.
- **Live hosting evidence:** on 20 October 2026, the public home response returned `server: LiteSpeed`, `platform: hostinger`, and `panel: hpanel`. This verifies the responding production platform, not the exact Hostinger plan, server geography, account holder, backups, or data centre.
- **Local configuration presence:** SMTP configuration keys are present in the untracked local environment file. `NEXT_PUBLIC_GTM_ID` is empty or absent there. No active Upstash configuration is in scope. Values and credentials were not read or recorded. This does not prove the production environment has the same configuration.
- **Live privacy pages:** read-only checks confirm both live privacy routes still expose their development-placeholder wording. They were left untouched.

## Data-processing inventory

| Activity | Data and purpose | Storage / recipient | EEA status and retention | Deletion path |
| --- | --- | --- | --- | --- |
| Contact form | Name, work email, company, optional website, project type, budget, timeline, message, locale; used to assess and answer an enquiry | Submitted to the Next.js server and sent by SMTP to the Hostinger business inquiry mailbox; no CRM/database persistence is implemented in this repository | No new personal-Gmail copies are received. Historical Gmail copies may remain; maximum 12 months after last substantive interaction if not converted | Apply the approved Hostinger/Gmail procedure above to historical copies; no historical deletion is claimed. |
| SMTP delivery | Full enquiry, sender email in `Reply-To`, sender/recipient addresses and normal mail-delivery metadata; used to deliver the enquiry | Configured SMTP service and Hostinger business inquiry mailbox. Code uses server-only `SMTP_*`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` variables; no application CC/BCC. | Current Hostinger mailbox retention and backups, and historical Gmail retention/backups, remain unverified. Enquiry policy applies to controllable copies. | Mailbox administrator deletes eligible Hostinger and historical Gmail copies, Trash contents and authorised exports; document backup limitations and expiry. |
| Application contact logs | Stages, locale, failed validation field names, rate-limit outcome, and categorised SMTP failures; used for operations/security | Host/application logs | Application code deliberately excludes submitted values, email, message text, credentials and detailed provider errors. Hosting/log destination and retention are unverified; intended maximum is 90 days where controlled | Set log retention to 90 days or less where configurable; purge searchable copies and follow provider backup/log-retention procedure. |
| Hosting/proxy access and security logs | Potentially IP address, request metadata, headers, paths, timestamps and security events | Hostinger and Cloudflare | Cloudflare is in the traffic path; enabled products, log products, regional settings, retention and backups are unverified | Set a documented retention period; use the applicable dashboard/support procedure. Do not claim a deletion capability until confirmed. |
| Consent choice | Cookie value `granted` or `denied` | First-party browser cookie `sonbol_analytics_consent` | Browser-side, `Secure`, `SameSite=Lax`, 180-day Max-Age | Visitor can change choice in the site UI or clear browser storage. |
| Optional GTM / GA4 | Only after acceptance: structured interaction event names and values such as CTA name/location/destination, selected project/budget/timeline and locale; no form text or direct identifiers in source | Google Tag Manager only when `NEXT_PUBLIC_GTM_ID` is configured and user consents; destinations/tags inside the container cannot be established from the repository | No GTM ID locally and no public GTM marker found in fetched HTML. Actual GTM/GA4 state, property, tags, regional controls, retention and transfers are unverified | Delete or export under the actual GA4/GTM configuration and Google procedures only after those services are verified. Disable or remove tags where appropriate. |

## Code evidence

- The contact form has required fields for name, email, company, project type, budget, timeline and message; website is optional. Field limits are enforced server-side.
- `POST /api/contact` only accepts the exact production origin in production, validates the body, uses a honeypot, invokes rate limiting before parsing the body, and sends successful submissions by SMTP. The endpoint returns generic failures rather than SMTP details.
- The mailer puts the complete enquiry in text and HTML email, HTML-escapes fields, and sets `Reply-To` to the enquirer’s email. It does not create a CRM record.
- No active shared rate limiter is confirmed. The contact controls currently documented for disclosure are validation, origin checks, body-size restrictions and a honeypot.
- The consent component writes the 180-day cookie. It loads GTM only after a `granted` value; prior consent-mode calls populate the browser data layer but do not load an external Google script on their own. Analytics event wrappers are consent-gated.
- There is no full request-body logging in application code. This does not establish what the host, proxy, SMTP provider, or platform runtime logs.

## Provider verification

| Service | What is verified | What is not verified / required dashboard work | Relevant provider materials |
| --- | --- | --- | --- |
| Hostinger | Production response identifies Hostinger/LiteSpeed/hPanel. Repository documentation and local key presence indicate an intended SMTP integration, but neither proves the active SMTP vendor or hosting configuration. | Identify the hosting product, account controller, data-centre region, backups, access-log retention, email mailbox/backup retention, and all subprocessors. Execute/retain the applicable DPA. | [Hostinger DPA](https://www.hostinger.com/legal/dpa) includes controller-to-processor SCC terms for qualifying transfers; [Hostinger privacy policy](https://www.hostinger.com/legal/privacy-policy) should be reviewed against the contracted entity. These documents are available safeguards, not proof that the account has been configured or that a transfer occurs. |
| Cloudflare | Cloudflare is confirmed to be in the traffic path. | Document enabled products (CDN, WAF, Logs, Zaraz, Turnstile etc.), regional services, logs and retention; execute/retain the DPA if used. | [Cloudflare Trust Hub](https://www.cloudflare.com/trust-hub/) and [Cloudflare customer SCCs](https://www.cloudflare.com/cloudflare-customer-scc/) provide relevant privacy/DPA material. Their availability does not prove account acceptance or regional configuration. |
| Google Tag Manager / GA4 | Source implements consent gating and excludes form PII from site-created events. `NEXT_PUBLIC_GTM_ID` is empty locally; no GTM marker was found in the fetched public HTML. | Confirm whether any production GTM container or GA4 property exists; if yes, inventory all tags, triggers, variables, consent settings, data retention, Google signals/ads features, users, linked products and server-side tagging; accept/configure applicable data-processing terms and update the public notice with actual products and transfer information. | [Google Analytics data processing terms](https://support.google.com/analytics/answer/3379636), [Google’s site/app data explanation](https://policies.google.com/technologies/partner-sites), and [Google transfer frameworks](https://policies.google.com/privacy/frameworks). These are not proof of a configured property or the chosen legal mechanism. |

## Required decisions and configuration

### P0 — before publishing the notices or enabling analytics

1. Obtain legal approval for controller identification and whether a registered/business address or an EEA/UK representative detail must appear. Insert it in both notices if required.
2. Confirm the actual production processors: hosting, SMTP/Hostinger mailbox, Cloudflare services, backups, logs and any booking provider. Record contract entity, purpose, region, retention, subprocessors, DPA status and transfer safeguard. Also document the handling and deletion status of historical Gmail copies.
3. Set and test the retention/deletion process for Hostinger, historical Gmail copies, authorised work copies, hosting logs and backups. A statement that historical copies have been deleted must not be published before it is verified.
4. Decide whether GTM/GA4 will be used. If yes, complete the GTM/GA4 inventory, consent test and Google DPA/account details. If no, keep `NEXT_PUBLIC_GTM_ID` absent/empty and remove unused Google origins from the eventual enforced CSP after validation.
5. Determine and document any future rate-limit design before describing it publicly. No active Upstash rate limiter is currently disclosed.

### P1 — before or immediately with the next production release

1. Turn the 90-day technical-log target into configurations and written owner/review dates for every controlled system.
2. Change report-only CSP to an enforced policy only after validating every approved external origin; remove optional analytics endpoints when analytics remains off.
3. Keep deployment and privacy documentation aligned with the verified Hostinger architecture and the actual consent configuration.
4. Establish a documented request channel, identity-verification method, request log, response owner and escalation route for access/erasure/objection requests.

## Operational retention procedure

### Monthly inquiry review

1. Maintain a minimal private register of enquiries: received date, last substantive interaction date, status (unconverted/client), storage locations, and scheduled deletion date.
2. Each month, identify unconverted enquiries whose last substantive interaction is older than 12 months.
3. Delete the enquiry from the recipient mailbox, any local download, task tool, notes, CRM (if later adopted), and authorised shared workspace. Do not retain message content in the register.
4. Record date, systems checked, operator and any lawful retention exception. Let backup copies expire through the documented backup lifecycle; do not restore a backup solely to delete a single email unless required by law or policy.

### Email and backups

- Use a dedicated mailbox with least-privilege access and MFA where offered.
- Configure mailbox retention/deletion and trash retention; verify whether sent, forwarded, archived and mobile-client copies exist.
- Obtain the provider’s backup scope, encryption, restoration process and retention. Set the shortest feasible lifecycle consistent with continuity and legal duties.
- Ensure forwarding rules do not create unmanaged copies. Keep an inventory of any manually exported enquiries.

### Client records

- At conversion, move only necessary information to the approved client-record system.
- Document the applicable contract, tax, accounting and claims-retention rule for the relevant jurisdiction and apply the longest mandatory period only to the relevant record category.
- Segregate client records from unconverted enquiries; reassess holds and delete when the applicable period ends.

### Technical logs

- Configure application, host, proxy/CDN, WAF and provider logs for no more than 90 days where Sonbol Labs controls the setting.
- Minimise logs: do not add form bodies, email values, message text, SMTP credentials or raw provider errors.
- Review retention, access, exports and backups quarterly; record provider settings that cannot be controlled.

### GDPR access and deletion requests

1. Receive requests at `ezzat@exceptionalgrp.com`; log the date, request type, identity-verification status, systems searched and deadline.
2. Verify identity proportionately; do not ask for more data than needed.
3. Search the enquiry register, mailbox, authorised work systems, client-record system, and controllable logs. Ask active processors to assist where the DPA/process allows.
4. Provide a clear response within the applicable legal timeframe. For erasure, delete unless a documented legal retention/claims exception applies; explain any retained category and the reason.
5. Record completion without retaining unnecessary personal data, and retain the request log only for the approved compliance period.

## Audit limitations

- No Hostinger, Cloudflare, Google, SMTP, mailbox, backup, DNS, or GTM/GA4 dashboard was accessed. No Upstash service is active.
- The production checks were read-only; no valid enquiry was sent, no cookies were accepted, and no user account state was changed.
- Production environment variables, actual mailbox provider, processing regions, backup architecture, analytics container content and service contracts cannot be inferred safely from source code or headers.
