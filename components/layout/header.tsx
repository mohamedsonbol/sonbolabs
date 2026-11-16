"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { TrackedLink } from "@/components/ui/tracked-link";
import { getDictionary, localePath } from "@/content/site";
import { BrandLogo, brandLogoAlt } from "@/components/layout/brand-logo";
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";
  const d = getDictionary(locale);
  const href = (path: string) => localePath(locale, path);
  const alternate = locale === "ar" ? pathname.replace(/^\/ar(?=\/|$)/, "") || "/" : `/ar${pathname === "/" ? "" : pathname}`;
  const languageLink = (
    <Link href={alternate} lang={locale === "ar" ? "en" : "ar"} className="language-link" onClick={() => setOpen(false)}>
      {d.nav.language}
    </Link>
  );

  return (
    <header className="site-header">
      <nav className={`container nav ${open ? "nav-open" : ""}`} aria-label="Main navigation">
        <Link href={href("/")} className="brand-link" aria-label={brandLogoAlt}><BrandLogo /></Link>
        <div className="nav-links" id="menu">
          <Link href={href("/services")} onClick={() => setOpen(false)}>{d.nav.services}</Link>
          <Link href={href("/#work")} onClick={() => setOpen(false)}>{d.nav.work}</Link>
          <Link href={href("/#about")} onClick={() => setOpen(false)}>{d.nav.about}</Link>
        </div>
        <Link href={alternate} lang={locale === "ar" ? "en" : "ar"} className="language-link desktop-language" onClick={() => setOpen(false)}>
          {d.nav.language}
        </Link>
        <TrackedLink href={href("/contact")} name={d.nav.start} location="navigation" className="button button-primary">{d.nav.start}</TrackedLink>
        <div className="mobile-nav-actions">
          {languageLink}
          <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="menu" aria-label={open ? d.nav.close : d.nav.menu}>
            {open ? "×" : "Menu"}
          </button>
        </div>
      </nav>
    </header>
  );
}
