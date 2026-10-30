import Link from "next/link";
import { localePath, type Locale } from "@/content/site";
import { serviceContactHref, servicesPageContent } from "@/content/services-page";
import { ContactCtaLink, ServiceCtaLink } from "@/components/services/tracked-link";
import { ServicesPageView } from "@/components/services/page-view";

export function ServicesPage({ locale }: { locale: Locale }) {
  const copy = servicesPageContent[locale];
  const contactHref = localePath(locale, "/contact");

  return <>
    <ServicesPageView locale={locale} />
    <section className="services-hero">
      <div className="container services-hero-content">
        <p className="eyebrow">{copy.hero.eyebrow}</p>
        <h1 className="display">{copy.hero.title}</h1>
        <div className="services-hero-bottom">
          <div>
            <p className="services-hero-description">{copy.hero.description}</p>
            <p className="services-hero-supporting">{copy.hero.supporting}</p>
          </div>
          <div className="services-hero-actions">
            <ContactCtaLink href={contactHref} location="services-hero">{copy.hero.primary}</ContactCtaLink>
            <Link href="#services" className="button button-dark">{copy.hero.secondary}</Link>
          </div>
        </div>
      </div>
    </section>

    <section className="section services-packages" id="services" aria-labelledby="services-title">
      <div className="container">
        <p className="eyebrow">{copy.packages.eyebrow}</p>
        <h2 className="display section-title" id="services-title">{copy.packages.title}</h2>
        <div className="services-package-grid">
          {copy.packages.services.map((service) => <article className="services-package" key={service.id}>
            <div className="services-package-main">
              <div className="services-package-index"><span>{service.number}</span><span>{service.delivery}</span></div>
              <p className="services-package-price">{service.price}</p>
              <h3>{service.title}</h3>
              <p className="services-package-headline">{service.headline}</p>
              <p className="services-package-description">{service.description}</p>
              <h4>{locale === "ar" ? "يشمل المشروع" : "Key deliverables"}</h4>
              <ul>{service.deliverables.map((item) => <li key={item}>{item}</li>)}</ul>
              <p className="services-package-ideal"><strong>{locale === "ar" ? "مناسب لـ:" : "Ideal for:"}</strong> {service.idealCustomer}</p>
              <p className="services-package-scope">{service.scopeNote}</p>
            </div>
            <div className="services-package-actions">
              <ServiceCtaLink href={serviceContactHref(locale, service.projectType)} serviceId={service.id}>{service.cta}</ServiceCtaLink>
            </div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section services-support" aria-labelledby="services-support-title">
      <div className="container">
        <p className="eyebrow">{copy.support.eyebrow}</p>
        <h2 className="display section-title" id="services-support-title">{copy.support.title}</h2>
        <p className="body-large services-support-description">{copy.support.description}</p>
        <div className="services-support-grid">
          {copy.support.items.map((item) => <article className="services-support-item" key={item.title}>
            <h3>{item.title}</h3>
            <p className="services-support-price">{item.price}</p>
            <p>{item.description}</p>
          </article>)}
        </div>
        <p className="services-support-note">{locale === "ar" ? "لا تشمل الرسوم الشهرية جميع أعمال التطوير أو الدعم أو اشتراكات الجهات الخارجية؛ تُحدد الخدمات والمخرجات ضمن نطاق متفق عليه." : "Monthly fees do not include all development, support, or third-party software. Services and deliverables are defined in an agreed scope."}</p>
      </div>
    </section>

    <section className="section services-approach" aria-labelledby="services-approach-title">
      <div className="container">
        <p className="eyebrow">{copy.approach.eyebrow}</p>
        <h2 className="display section-title" id="services-approach-title">{copy.approach.title}</h2>
        <ol className="services-steps">
          {copy.approach.steps.map((step) => <li className="services-step" key={step.number}>
            <span className="services-step-number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>)}
        </ol>
      </div>
    </section>

    <section className="section services-faq" aria-labelledby="services-faq-title">
      <div className="container services-faq-layout">
        <div>
          <p className="eyebrow">{copy.faq.eyebrow}</p>
          <h2 className="display section-title" id="services-faq-title">{copy.faq.title}</h2>
        </div>
        <div className="services-faq-list">
          {copy.faq.items.map((item) => <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>)}
        </div>
      </div>
    </section>

    <section className="section services-final-cta" aria-labelledby="services-final-cta-title">
      <div className="container services-final-inner">
        <div>
          <h2 className="display" id="services-final-cta-title">{copy.finalCta.title}</h2>
          <p>{copy.finalCta.description}</p>
        </div>
        <div className="services-final-actions">
          <p>{copy.finalCta.supporting}</p>
          <ContactCtaLink href={contactHref} location="services-final-cta">{copy.finalCta.primary}</ContactCtaLink>
          <p className="services-email-option"><Link href={contactHref}>{copy.finalCta.emailLead}</Link></p>
        </div>
      </div>
    </section>
  </>;
}
