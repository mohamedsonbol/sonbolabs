import { company } from "@/content/company";
export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-logo${compact ? " brand-logo-compact" : ""}`} aria-hidden="true">{company.shortName}</span>
  );
}
export const brandLogoAlt = company.name;
