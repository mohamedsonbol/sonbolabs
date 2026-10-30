import { privacyNotices } from "@/content/privacy-notice";
import type { Locale } from "@/content/site";

const email = "ezzat@exceptionalgrp.com";

function TextWithEmail({ text }: { text: string }) {
  const parts = text.split(email);
  return <>{parts.map((part, index) => <span key={`${part}-${index}`}>{part}{index < parts.length - 1 && <a href={`mailto:${email}`}>{email}</a>}</span>)}</>;
}

export function PrivacyNotice({ locale }: { locale: Locale }) {
  const notice = privacyNotices[locale];
  return <section className="section"><div className="container privacy-copy"><p className="eyebrow">{notice.label}</p><h1 className="display section-title">{notice.title}</h1><p className="privacy-status" role="note">{notice.status}</p><p className="privacy-effective-date">{notice.effectiveDate}</p>{notice.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs?.map((paragraph) => <p key={paragraph}><TextWithEmail text={paragraph}/></p>)}{section.items && <ul>{section.items.map((item) => <li key={item}><TextWithEmail text={item}/></li>)}</ul>}</section>)}</div></section>;
}
