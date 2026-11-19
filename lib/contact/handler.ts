import { contactSchema } from "./validation";
import type { Lead } from "../email/mailer";
import type { z } from "zod";

type Delivery = (lead: Lead) => Promise<void>;
type ValidationIssue = z.core.$ZodIssue;
export type ContactFieldErrorCode = "required" | "too_long" | "invalid_option" | "invalid_email" | "invalid_website";
type FieldErrors = Record<string, ContactFieldErrorCode[]>;

const publicFields = new Set(["name", "email", "company", "website", "projectType", "budget", "timeline", "platform", "message", "locale"]);

function validationCode(issue: ValidationIssue, field: string): ContactFieldErrorCode {
  if (issue.code === "too_big") return "too_long";
  if (issue.code === "invalid_value") return "invalid_option";
  if (issue.code === "invalid_format" && field === "email") return "invalid_email";
  if ((issue.code === "invalid_format" || issue.code === "custom") && field === "website") return "invalid_website";
  return "required";
}

function fieldErrors(issues: ValidationIssue[]): FieldErrors {
  return issues.reduce<FieldErrors>((errors, issue) => {
    const field = String(issue.path[0] ?? "");
    if (!publicFields.has(field)) return errors;
    const messages = errors[field] ?? [];
    const code = validationCode(issue, field);
    if (!messages.includes(code)) messages.push(code);
    errors[field] = messages;
    return errors;
  }, {});
}

function headerSafe(value: string) {
  return value.replace(/[\r\n]+/g, " ");
}

/** Filled or malformed honeypots receive a generic acknowledgement. */
export async function processContactSubmission(raw: unknown, deliver: Delivery): Promise<Response> {
  console.info("contact.request", { stage: "received" });
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    console.warn("contact.request_rejected", { stage: "body" });
    return Response.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const body = raw as Record<string, unknown>;
  const honeypot = body.companyWebsite;
  if (typeof honeypot !== "undefined" && (typeof honeypot !== "string" || honeypot.trim() !== "")) {
    console.warn("contact.request_rejected", { stage: "honeypot" });
    return Response.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const errors = fieldErrors(parsed.error.issues);
    console.warn("contact.validation_failed", {
      fields: Object.keys(errors),
      locale: body.locale === "ar" ? "ar" : body.locale === "en" ? "en" : "unknown",
    });
    return Response.json(
      { error: "Validation failed.", fields: errors },
      { status: 400 },
    );
  }

  const data = parsed.data;
  console.info("contact.request", { stage: "smtp_send", locale: data.locale });
  await deliver({
    name: headerSafe(data.name),
    email: data.email,
    company: headerSafe(data.company),
    website: data.website ?? "",
    projectType: data.projectType,
    budget: data.budget,
    timeline: data.timeline,
    platform: data.platform,
    message: data.message,
    locale: data.locale,
  });
  console.info("contact.request", { stage: "accepted", locale: data.locale });

  return Response.json({ ok: true });
}
