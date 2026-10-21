import { processContactSubmission } from "./handler";
import { isAllowedContactOrigin } from "./origin";
import {
  ContactRateLimitConfigurationError,
  checkContactRateLimit,
  type ContactRateLimitCheck,
} from "./rate-limit";
import {
  ContactOriginAuthenticationUnavailableError,
  authenticateContactOrigin,
  type ContactOriginAuthentication,
} from "./origin-auth";
import {
  ContactMailConfigurationError,
  sendLeadEmail,
  smtpErrorDiagnostic,
  type Lead,
} from "../email/mailer";

type Delivery = (lead: Lead) => Promise<void>;
type Dependencies = { authenticateOrigin: ContactOriginAuthentication; checkRateLimit: ContactRateLimitCheck; deliver: Delivery };
const MAX_CONTACT_BODY_BYTES = 16 * 1024;

const productionDependencies: Dependencies = {
  authenticateOrigin: authenticateContactOrigin,
  checkRateLimit: checkContactRateLimit,
  deliver: sendLeadEmail,
};

async function readContactBody(request: Request) {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_CONTACT_BODY_BYTES) throw new Error("Contact body too large");
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > MAX_CONTACT_BODY_BYTES) throw new Error("Contact body too large");
    chunks.push(value);
  }
  const rawBody = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { rawBody.set(chunk, offset); offset += chunk.byteLength; }
  return rawBody;
}

export async function handleContactPost(request: Request, dependencies = productionDependencies) {
  if (!isAllowedContactOrigin(request.headers.get("origin"))) {
    console.warn("contact.request_rejected", { stage: "origin" });
    return Response.json({ error: "Invalid form submission." }, { status: 400 });
  }

  let rawBody: Uint8Array;
  try {
    rawBody = await readContactBody(request);
  } catch {
    return Response.json({ error: "Invalid form submission." }, { status: 400 });
  }

  let authenticated: { clientIp: string };
  try {
    authenticated = await dependencies.authenticateOrigin(request, rawBody);
  } catch (error) {
    console.warn("contact.request_rejected", {
      stage: error instanceof ContactOriginAuthenticationUnavailableError ? "origin_auth_unavailable" : "origin_auth",
    });
    return Response.json(
      { error: "Unable to send message." },
      { status: error instanceof ContactOriginAuthenticationUnavailableError ? 503 : 403 },
    );
  }

  try {
    const rateLimit = await dependencies.checkRateLimit(authenticated.clientIp);
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
    raw = JSON.parse(new TextDecoder().decode(rawBody));
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
