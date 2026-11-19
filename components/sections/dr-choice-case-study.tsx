import Image from "next/image";
import { TrackedLink } from "@/components/ui/tracked-link";
import { drChoiceCaseStudy, drChoiceScreenshots, type CaseStudyLocale } from "@/content/dr-choice-case-study";

export function DrChoiceCaseStudy({ locale }: { locale: CaseStudyLocale }) {
  const copy = drChoiceCaseStudy[locale];
  const contactHref = locale === "ar" ? "/ar/contact" : "/contact";
  const woocommerceHref = locale === "ar" ? "/ar/services/woocommerce" : "/services/woocommerce";
  const section = copy.sections;

  return <>
    <section className="case-study-hero section">
      <div className="container">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 className="display section-title">{copy.title}</h1>
        <p className="body-large">{copy.summary}</p>
        <a className="case-study-live-link" href={copy.liveSite} target="_blank" rel="noreferrer">{copy.liveSiteLabel} <span aria-hidden="true">↗</span></a>
      </div>
    </section>

    <section className="case-study-overview section">
      <div className="container case-study-two-column">
        <p className="eyebrow">{section.overview.label}</p>
        <div><h2 className="display case-study-heading">{section.overview.title}</h2><p className="case-study-copy">{section.overview.body}</p></div>
      </div>
    </section>

    <section className="case-study-dark section">
      <div className="container case-study-two-column">
        <p className="eyebrow">{section.challenge.label}</p>
        <div><h2 className="display case-study-heading">{section.challenge.title}</h2><p className="case-study-copy">{section.challenge.body}</p></div>
      </div>
    </section>

    <section className="section">
      <div className="container"><p className="eyebrow">{section.solution.label}</p><h2 className="display section-title">{section.solution.title}</h2><p className="body-large">{section.solution.body}</p><div className="case-study-grid">{section.solution.points.map((point, index) => <article className="case-study-card" key={point}><b>0{index + 1}</b><p>{point}</p></article>)}</div></div>
    </section>

    <section className="case-study-soft section">
      <div className="container"><p className="eyebrow">{section.features.label}</p><h2 className="display section-title">{section.features.title}</h2><ul className="case-study-list">{section.features.points.map((point) => <li key={point}>{point}</li>)}</ul></div>
    </section>

    <section className="section">
      <div className="container"><p className="eyebrow">{section.stack.label}</p><h2 className="display section-title">{section.stack.title}</h2><div className="case-study-stack">{section.stack.items.map(([label, detail]) => <div key={label}><b>{label}</b><p>{detail}</p></div>)}</div><p className="case-study-platform">{section.stack.platform.label} <TrackedLink href={woocommerceHref} name={section.stack.platform.linkLabel} location="DR. CHOICE case study platform" className="case-study-platform-link">{section.stack.platform.linkLabel}</TrackedLink></p></div>
    </section>

    <section className="case-study-dark section">
      <div className="container"><p className="eyebrow">{section.engineering.label}</p><h2 className="display section-title">{section.engineering.title}</h2><ul className="case-study-list">{section.engineering.points.map((point) => <li key={point}>{point}</li>)}</ul></div>
    </section>

    <section className="section">
      <div className="container case-study-two-column"><p className="eyebrow">{section.outcome.label}</p><div><h2 className="display case-study-heading">{section.outcome.title}</h2><p className="case-study-copy">{section.outcome.body}</p></div></div>
    </section>

    {drChoiceScreenshots.length > 0 && <section className="case-study-soft section"><div className="container"><p className="eyebrow">{section.screenshots.label}</p><h2 className="display section-title">{section.screenshots.title}</h2><p className="case-study-screenshot-note">{section.screenshots.note}</p><div className="case-study-screenshots">{drChoiceScreenshots.map((screenshot) => <figure key={screenshot.src}><Image src={screenshot.src} alt={screenshot.alt[locale]} fill sizes="(max-width: 760px) 100vw, 50vw" quality={80}/></figure>)}</div></div></section>}

    <section className="case-study-cta section"><div className="container case-study-cta-inner"><div><p className="eyebrow">Sonbolabs</p><h2 className="display case-study-heading">{copy.cta.title}</h2></div><div><p>{copy.cta.body}</p><TrackedLink href={contactHref} name={copy.cta.action} location="DR. CHOICE case study CTA" className="button button-primary">{copy.cta.action}</TrackedLink></div></div></section>
  </>;
}
