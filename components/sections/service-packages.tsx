import Link from "next/link";
import { TrackedLink } from "@/components/ui/tracked-link";
import { servicePackages } from "@/content/service-packages";
import type { Locale } from "@/content/site";

export function ServicePackages({ locale }: { locale: Locale }) {
  const copy = servicePackages[locale];
  const contactHref = locale === "ar" ? "/ar/contact" : "/contact";
  return <section className="section service-packages" id="services"><div className="container"><p className="eyebrow">{copy.label}</p><h2 className="display section-title">{copy.title}</h2><p className="service-packages-note">{copy.scopeNote}</p><div className="service-package-grid">{copy.packages.map((item) => <article className="service-package" key={item.title}><div><p className="service-package-price">{item.price}</p><h3>{item.title}</h3><p className="service-package-description">{item.description}</p><ul>{item.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}</ul></div><div className="service-package-actions">{item.caseStudy && <p className="service-package-proof">{copy.caseStudyPrefix} <Link href={item.caseStudy.href}>{item.caseStudy.label} <span className="directional-arrow">↗</span></Link></p>}<TrackedLink href={`${contactHref}?projectType=${item.projectType}`} name={copy.cta} location={`${item.title} service package`} className="button button-primary">{copy.cta}</TrackedLink></div></article>)}</div></div></section>;
}
