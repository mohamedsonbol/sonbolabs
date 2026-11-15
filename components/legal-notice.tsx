import { legalNotices } from "@/content/legal-notice";
import type { Locale } from "@/content/site";
import Link from "next/link";

export function LegalNotice({ locale }: { locale: Locale }) {
  const notice = legalNotices[locale];
  const privacyHref = locale === "ar" ? "/ar/privacy" : "/privacy";
  const privacyLabel = locale === "ar" ? "إشعار الخصوصية" : "Privacy Notice";
  return <section className="section"><div className="container privacy-copy"><p className="eyebrow">{notice.label}</p><h1 className="display section-title">{notice.title}</h1><p className="privacy-status" role="note">{notice.status}</p>{notice.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}<p><Link href={privacyHref}>{privacyLabel}</Link></p></div></section>;
}
