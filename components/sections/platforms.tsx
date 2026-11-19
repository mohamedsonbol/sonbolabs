import { TrackedLink } from "@/components/ui/tracked-link";
import { getDictionary, localePath, type Locale } from "@/content/site";

export function Platforms({ locale }: { locale: Locale }) {
  const copy = getDictionary(locale).platforms;
  return (
    <section className="section platforms" id="platforms" aria-labelledby="platforms-title">
      <div className="container">
        <p className="eyebrow">{copy.label}</p>
        <h2 className="display section-title" id="platforms-title">{copy.title}</h2>
        <div className="platform-grid">
          {copy.items.map((item) => (
            <article className="platform-card" key={item.name}>
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <TrackedLink
                href={localePath(locale, item.href)}
                name={item.name}
                location="homepage platforms"
                className="platform-link"
              >
                {copy.explore} <span className="directional-arrow" aria-hidden="true">↗</span>
              </TrackedLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
