"use client";
import { useState } from "react";
import { trackEvent } from "@/components/analytics/analytics";
import { getDictionary, type Locale } from "@/content/site";
import { contactOptions } from "@/content/contact-options";
import type { ContactFieldErrorCode } from "@/lib/contact/handler";
import { normalizeWebsite } from "@/lib/contact/website";

type FieldErrors = Partial<Record<string, ContactFieldErrorCode[]>>;
type ContactErrorResponse = { fields?: FieldErrors };

function SuccessIcon() {
  return <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-5"><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></svg></span>;
}

export function ContactForm({ locale = "en" }: { locale?: Locale }) {
  const d = getDictionary(locale).contact;
  const options = contactOptions[locale];
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [started, setStarted] = useState(false);

  function errorFor(field: string) {
    return fieldErrors[field]?.map((code) => d.validation[code]).join(" ");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const website = typeof values.website === "string" ? normalizeWebsite(values.website) : undefined;
    if (typeof values.website === "string" && values.website.trim() !== "" && !website) {
      setFieldErrors({ website: ["invalid_website"] });
      setStatus("error");
      return;
    }

    setStatus("loading");
    setFieldErrors({});
    const payload = { ...values, website: website ?? "", locale };
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) {
        const body = await response.json().catch(() => ({})) as ContactErrorResponse;
        setFieldErrors(body.fields ?? {});
        throw new Error("Contact submission failed");
      }
      trackEvent("lead_form_submit", { project_type: String(values.projectType), budget_range: String(values.budget), timeline: String(values.timeline), locale });
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function onStart() {
    if (!started) {
      setStarted(true);
      trackEvent("lead_form_start", { locale });
    }
  }

  if (status === "success") return <div className="flex gap-3 rounded-[10px] border border-[#22C55E] bg-[#F0FDF4] p-5 text-start sm:gap-4 sm:p-6" role="status" aria-live="polite"><SuccessIcon /><div className="min-w-0"><p className="m-0 text-base font-bold leading-6 text-[#166534]">{d.success.heading}</p><p className="m-0 mt-1 text-sm leading-6 text-green-800">{d.success.description}</p></div></div>;
  const field = d.fields;
  const inputError = (name: string) => errorFor(name) && <p className="error" role="alert">{errorFor(name)}</p>;

  return <form onSubmit={submit} onFocus={onStart} className="form-grid" noValidate>
    <input className="honeypot" tabIndex={-1} autoComplete="off" name="companyWebsite" aria-hidden="true" />
    <div className="field"><label htmlFor="name">{field.name}</label><input required maxLength={100} id="name" name="name" autoComplete="name" aria-invalid={Boolean(errorFor("name"))} />{inputError("name")}</div>
    <div className="field"><label htmlFor="email">{field.email}</label><input required type="email" maxLength={254} id="email" name="email" autoComplete="email" aria-invalid={Boolean(errorFor("email"))} />{inputError("email")}</div>
    <div className="field"><label htmlFor="company">{field.company}</label><input required maxLength={150} id="company" name="company" autoComplete="organization" aria-invalid={Boolean(errorFor("company"))} />{inputError("company")}</div>
    <div className="field"><label htmlFor="website">{field.website} <span style={{ fontWeight: 400 }}>({field.optional})</span></label><input type="text" inputMode="url" maxLength={2048} id="website" name="website" placeholder="example.com" aria-invalid={Boolean(errorFor("website"))} />{inputError("website")}</div>
    <div className="field"><label htmlFor="projectType">{field.projectType}</label><select required id="projectType" name="projectType" defaultValue="" aria-invalid={Boolean(errorFor("projectType"))}><option value="" disabled>{d.select}</option>{options.types.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{inputError("projectType")}</div>
    <div className="field"><label htmlFor="budget">{field.budget}</label><select required id="budget" name="budget" defaultValue="" aria-invalid={Boolean(errorFor("budget"))}><option value="" disabled>{d.select}</option>{options.budgets.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{inputError("budget")}</div>
    <div className="field"><label htmlFor="timeline">{field.timeline}</label><select required id="timeline" name="timeline" defaultValue="" aria-invalid={Boolean(errorFor("timeline"))}><option value="" disabled>{d.select}</option>{options.timelines.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{inputError("timeline")}</div>
    <div className="field field-full"><label htmlFor="message">{field.message}</label><textarea required maxLength={5000} id="message" name="message" aria-invalid={Boolean(errorFor("message"))} />{inputError("message")}</div>
    {status === "error" && <p className="error field-full" role="alert">{d.error}</p>}
    <div className="field-full"><button disabled={status === "loading"} className="button button-primary" type="submit">{status === "loading" ? d.sending : d.submit}</button></div>
  </form>;
}
