import { TrackedLink } from "@/components/ui/tracked-link";
import { platformPages, type PlatformKey } from "@/content/platform-pages";
import { localePath, type Locale } from "@/content/site";

export function PlatformPage({ locale, platform }: { locale: Locale; platform: PlatformKey }) {
  const copy = platformPages[locale][platform];
  const href = (path: string) => localePath(locale, path);

  return (
    <div className="platform-page">
      <section className="platform-hero section" aria-labelledby="platform-title">
        <div className="container">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="display platform-title" id="platform-title">{copy.title}</h1>
          <p className="body-large">{copy.intro}</p>
        </div>
      </section>

      <section className="section platform-offer" aria-labelledby="platform-offer-title">
        <div className="container platform-two-column">
          <p className="eyebrow">{copy.eyebrow}</p>
          <div>
            <h2 className="display section-title" id="platform-offer-title">{copy.offer.heading}</h2>
            <ul className="platform-list">
              {copy.offer.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p className="platform-scope">{copy.scopeNote}</p>
          </div>
        </div>
      </section>

      {copy.proof && (
        <section className="section platform-proof" aria-labelledby="platform-proof-title">
          <div className="container platform-two-column">
            <p className="eyebrow">{copy.eyebrow}</p>
            <div>
              <p className="platform-proof-label">{copy.proof.label}</p>
              <h2 className="display platform-proof-name" id="platform-proof-title">{copy.proof.name}</h2>
              <p className="platform-proof-copy">{copy.proof.description}</p>
              <TrackedLink
                href={href("/work/dr-choice")}
                name={copy.proof.linkLabel}
                location={`${platform} platform proof`}
                className="platform-proof-link"
              >
                {copy.proof.linkLabel} <span className="directional-arrow" aria-hidden="true">↗</span>
              </TrackedLink>
            </div>
          </div>
        </section>
      )}

      <section className="section platform-process" aria-labelledby="platform-process-title">
        <div className="container">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="display section-title" id="platform-process-title">{copy.process.heading}</h2>
          <ol className="platform-steps">
            {copy.process.steps.map((step, index) => (
              <li key={step.title}>
                <span>0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section platform-cta" aria-labelledby="platform-cta-title">
        <div className="container platform-cta-inner">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 className="display" id="platform-cta-title">{copy.cta.title}</h2>
          </div>
          <div>
            <p>{copy.cta.copy}</p>
            <TrackedLink
              href={`${href("/contact")}?platform=${platform}`}
              name={copy.cta.label}
              location={`${platform} platform CTA`}
              eventName="contact_cta_click"
              className="button button-primary"
            >
              {copy.cta.label}
            </TrackedLink>
          </div>
        </div>
      </section>
    </div>
  );
}
