import { processContactSubmission } from "@/lib/contact/handler";
import { sendLeadEmail } from "@/lib/email/mailer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Invalid form submission." }, { status: 400 });
  }

  try {
    return await processContactSubmission(raw, sendLeadEmail);
  } catch (error) {
    console.error("Contact form delivery failed", error instanceof Error ? error.message : "unknown error");
    return Response.json({ error: "Unable to send message." }, { status: 500 });
  }
}
