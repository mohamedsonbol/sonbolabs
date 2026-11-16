import nodemailer from "nodemailer";

const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_SECURE", "SMTP_USER", "SMTP_PASS", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"] as const;

export class ContactMailConfigurationError extends Error {
  constructor() {
    super("Contact email is not configured");
  }
}

export class ContactMailDeliveryError extends Error {
  constructor() {
    super("SMTP did not accept the contact message");
  }
}

function config() {
  if (required.some((key) => !process.env[key])) throw new ContactMailConfigurationError();
  const port = Number(process.env.SMTP_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new ContactMailConfigurationError();
  return { host: process.env.SMTP_HOST!, port, secure: process.env.SMTP_SECURE === "true", auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! } };
}

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]!);
export type Lead = { name: string; email: string; company: string; website: string; projectType: string; budget: string; timeline: string; message: string; locale: "en" | "ar" };

export function smtpErrorDiagnostic(error: unknown) {
  if (error instanceof ContactMailConfigurationError) return { category: "configuration" };
  if (error instanceof ContactMailDeliveryError) return { category: "recipient" };
  const code = typeof error === "object" && error !== null && "code" in error && typeof error.code === "string" ? error.code : "unknown";
  const category = ["EAUTH", "EENVELOPE"].includes(code) ? "authentication" : ["ECONNECTION", "ETIMEDOUT", "ESOCKET"].includes(code) ? "connection" : "smtp";
  return { category, code };
}

export async function sendLeadEmail(lead: Lead) {
  const transporter = nodemailer.createTransport(config());
  const fields: [string, string][] = [["Name", lead.name], ["Email", lead.email], ["Company", lead.company], ["Website", lead.website || "—"], ["Project", lead.projectType], ["Budget", lead.budget], ["Timeline", lead.timeline], ["Language", lead.locale === "ar" ? "Arabic" : "English"], ["Message", lead.message]];
  const text = `New project enquiry received through sonbolabs website.\n\n${fields.map(([label, value]) => `${label}:\n${value}`).join("\n\n")}`;
  const rows = fields.map(([label, value]) => `<tr><th align="left" style="padding:8px 14px 8px 0;vertical-align:top;color:#59615c">${label}</th><td style="padding:8px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join("");
  const info = await transporter.sendMail({ from: `Sonbolabs Website <${process.env.CONTACT_FROM_EMAIL!}>`, to: process.env.CONTACT_TO_EMAIL!, replyTo: lead.email, subject: `New Sonbolabs Lead — ${lead.company || lead.name}`, text, html: `<div style="font-family:Arial,sans-serif;color:#101312;max-width:680px"><p style="font-size:12px;font-weight:bold;letter-spacing:1px">SONBOLABS</p><h1 style="font-size:24px">New Project Enquiry</h1><table style="border-collapse:collapse;width:100%;border-top:1px solid #d5d9d3">${rows}</table></div>` });
  if (info.accepted.length === 0) throw new ContactMailDeliveryError();
  console.info("contact.smtp", { stage: "accepted", accepted: info.accepted.length, rejected: info.rejected.length });
}
