import { TrackedLink } from "@/components/ui/tracked-link";
import { ServicesPageAnalytics } from "@/components/analytics/services-page-analytics";
import { servicesPageCopy } from "@/content/services-page";
import { localePath, type Locale } from "@/content/site";

export function ServicesPage({ locale }: { locale: Locale }) {
  const copy = servicesPageCopy[locale];
  const contactHref = (projectType: string) => localePath(locale, `/contact?projectType=${projectType}`);
  const generalContactHref = localePath(locale, "/contact");

  return (
    <div className="services-page">
      <ServicesPageAnalytics />
      <section className="services-hero" aria-labelledby="services-title">
        <div className="container services-hero-inner">
          <p className="eyebrow">{copy.hero.eyebrow}</p>
          <h1 className="display" id="services-title">{copy.hero.title}</h1>
          <div className="services-hero-bottom">
            <div>
              <p className="services-hero-description">{copy.hero.description}</p>
              <p className="services-hero-supporting">{copy.hero.supporting}</p>
            </div>
            <div className="services-hero-actions">
              <TrackedLink
                href={generalContactHref}
                name={copy.hero.discuss}
                location="services hero"
                eventName="contact_cta_click"
                className="button button-primary"
              >
                {copy.hero.discuss}
              </TrackedLink>
              <a className="button button-dark" href="#service-packages">{copy.hero.explore}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section services-offerings" id="service-packages" aria-labelledby="service-packages-title">
        <div className="container">
          <p className="eyebrow">{copy.packages.eyebrow}</p>
          <h2 className="display section-title" id="service-packages-title">{copy.packages.title}</h2>
          <div className="services-package-grid">
            {copy.packages.packages.map((service) => (
              <article className="services-card" key={service.id}>
                <div>
                  <div className="services-card-index">
                    <span>{service.number}</span>
                    <span>{service.title}</span>
                  </div>
                  <h3>{service.headline}</h3>
                  <p className="services-card-description">{service.description}</p>
                  <div className="services-card-facts">
                    <div>
                      <span>{copy.packages.priceLabel}</span>
                      <strong>{service.price}</strong>
                    </div>
                    <div>
                      <span>{copy.packages.deliveryLabel}</span>
                      <strong>{service.delivery}</strong>
                    </div>
                  </div>
                  <h4>{copy.packages.deliverablesLabel}</h4>
                  <ul className="services-deliverables">
                    {service.deliverables.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <div className="services-card-audience">
                    <h4>{copy.packages.idealCustomerLabel}</h4>
                    <p>{service.idealCustomer}</p>
                  </div>
                  <p className="services-card-scope">{service.scopeNote}</p>
                </div>
                <TrackedLink
                  href={contactHref(service.projectType)}
                  name={service.cta}
                  location={`${service.id} service card`}
                  eventName="service_cta_click"
                  eventData={{ service_id: service.id }}
                  className="button button-primary"
                >
                  {service.cta}
                </TrackedLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section services-support" aria-labelledby="services-support-title">
        <div className="container">
          <p className="eyebrow">{copy.support.eyebrow}</p>
          <h2 className="display section-title" id="services-support-title">{copy.support.title}</h2>
          <p className="body-large services-support-description">{copy.support.description}</p>
          <p className="services-support-scope">{copy.support.scopeNote}</p>
          <div className="services-support-grid">
            {copy.support.items.map((item, index) => (
              <article className="services-support-card" key={item.title}>
                <span className="services-support-index">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p className="services-support-price">{item.price}</p>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section services-approach" aria-labelledby="services-approach-title">
        <div className="container">
          <p className="eyebrow">{copy.approach.eyebrow}</p>
          <h2 className="display section-title" id="services-approach-title">{copy.approach.title}</h2>
          <ol className="services-steps">
            {copy.approach.steps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
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
            {copy.faq.items.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section services-final-cta" aria-labelledby="services-final-title">
        <div className="container services-final-inner">
          <div>
            <p className="eyebrow">{copy.hero.eyebrow}</p>
            <h2 className="display" id="services-final-title">{copy.finalCta.title}</h2>
          </div>
          <div className="services-final-copy">
            <p>{copy.finalCta.description}</p>
            <p>{copy.finalCta.supporting}</p>
            <TrackedLink
              href={generalContactHref}
              name={copy.finalCta.discuss}
              location="services final CTA"
              eventName="contact_cta_click"
              className="button button-dark"
            >
              {copy.finalCta.discuss}
            </TrackedLink>
            <p className="services-final-contact">
              <strong>{copy.finalCta.emailLead}</strong>{" "}
              <TrackedLink
                href={generalContactHref}
                name={copy.finalCta.contact}
                location="services final contact option"
                eventName="contact_cta_click"
              >
                {copy.finalCta.contact}
              </TrackedLink>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
