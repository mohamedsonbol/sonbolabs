import { processContactSubmission } from "./handler";
import { isAllowedContactOrigin } from "./origin";
import {
  ContactRateLimitConfigurationError,
  checkContactRateLimit,
  type ContactRateLimitCheck,
} from "./rate-limit";
import {
  ContactMailConfigurationError,
  sendLeadEmail,
  smtpErrorDiagnostic,
  type Lead,
} from "../email/mailer";

type Delivery = (lead: Lead) => Promise<void>;
type Dependencies = { checkRateLimit: ContactRateLimitCheck; deliver: Delivery };

const productionDependencies: Dependencies = {
  checkRateLimit: checkContactRateLimit,
  deliver: sendLeadEmail,
};

export async function handleContactPost(request: Request, dependencies = productionDependencies) {
  if (!isAllowedContactOrigin(request.headers.get("origin"))) {
    console.warn("contact.request_rejected", { stage: "origin" });
    return Response.json({ error: "Invalid form submission." }, { status: 400 });
  }

  try {
    const rateLimit = await dependencies.checkRateLimit(request);
    if (!rateLimit.allowed) {
      console.warn("contact.request_rejected", { stage: "rate_limit" });
      return Response.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } },
      );
    }
  } catch (error) {
    console.error("contact.rate_limit_unavailable", {
      category: error instanceof ContactRateLimitConfigurationError ? "configuration" : "service",
    });
    return Response.json({ error: "Unable to send message." }, { status: 503 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Invalid form submission." }, { status: 400 });
  }

  try {
    return await processContactSubmission(raw, dependencies.deliver);
  } catch (error) {
    console.error("contact.smtp_failed", smtpErrorDiagnostic(error));
    return Response.json(
      { error: "Unable to send message." },
      { status: error instanceof ContactMailConfigurationError ? 503 : 500 },
    );
  }
}
