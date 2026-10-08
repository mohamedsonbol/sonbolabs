import { contactSchema } from "./validation";
import type { Lead } from "../email/mailer";
import type { z } from "zod";

type Delivery = (lead: Lead) => Promise<void>;
type ValidationIssue = z.core.$ZodIssue;
type FieldErrors = Record<string, string[]>;

const publicFields = new Set(["name", "email", "company", "website", "projectType", "budget", "timeline", "message", "locale"]);

function validationMessage(issue: ValidationIssue, field: string): string {
  if (issue.code === "too_big") return "Value is too long.";
  if (issue.code === "invalid_value") return "Choose a valid option.";
  if (issue.code === "invalid_format" && field === "email") return "Enter a valid email address.";
  if (issue.code === "invalid_format" && field === "website") return "Enter a valid website URL.";
  if (issue.code === "custom" && field === "website") return "Enter a valid website URL.";
  return "This field is required.";
}

function fieldErrors(issues: ValidationIssue[]): FieldErrors {
  return issues.reduce<FieldErrors>((errors, issue) => {
    const field = String(issue.path[0] ?? "");
    if (!publicFields.has(field)) return errors;
    const messages = errors[field] ?? [];
    const message = validationMessage(issue, field);
    if (!messages.includes(message)) messages.push(message);
    errors[field] = messages;
    return errors;
  }, {});
}

function headerSafe(value: string) {
  return value.replace(/[\r\n]+/g, " ");
}

/** Filled or malformed honeypots receive a generic acknowledgement. */
export async function processContactSubmission(raw: unknown, deliver: Delivery): Promise<Response> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return Response.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const body = raw as Record<string, unknown>;
  const honeypot = body.companyWebsite;
  if (typeof honeypot !== "undefined" && (typeof honeypot !== "string" || honeypot.trim() !== "")) {
    return Response.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed.", fields: fieldErrors(parsed.error.issues) },
      { status: 400 },
    );
  }

  const data = parsed.data;
  await deliver({
    name: headerSafe(data.name),
    email: data.email,
    company: headerSafe(data.company),
    website: data.website ?? "",
    projectType: data.projectType,
    budget: data.budget,
    timeline: data.timeline,
    message: data.message,
    locale: data.locale,
  });

  return Response.json({ ok: true });
}
