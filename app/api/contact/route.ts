import { processContactSubmission } from "@/lib/contact/handler";
import { isAllowedContactOrigin } from "@/lib/contact/origin";
import { ContactMailConfigurationError, sendLeadEmail, smtpErrorDiagnostic } from "@/lib/email/mailer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAllowedContactOrigin(request.headers.get("origin"))) {
    console.warn("contact.request_rejected", { stage: "origin" });
    return Response.json({ error: "Invalid form submission." }, { status: 400 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Invalid form submission." }, { status: 400 });
  }

  try {
    return await processContactSubmission(raw, sendLeadEmail);
  } catch (error) {
    console.error("contact.smtp_failed", smtpErrorDiagnostic(error));
    return Response.json({ error: "Unable to send message." }, { status: error instanceof ContactMailConfigurationError ? 503 : 500 });
  }
}
