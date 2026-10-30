"use client";

import Link from "next/link";
import { trackEvent } from "@/components/analytics/analytics";

export function ServiceCtaLink({ href, serviceId, children }: { href: string; serviceId: string; children: React.ReactNode }) {
  return <Link href={href} className="button button-primary" onClick={() => trackEvent("service_cta_click", { service_id: serviceId })}>{children}</Link>;
}

export function ContactCtaLink({ href, location, children, className }: { href: string; location: string; children: React.ReactNode; className?: string }) {
  return <Link href={href} className={className ?? "button button-primary"} onClick={() => trackEvent("contact_cta_click", { cta_location: location, destination: href })}>{children}</Link>;
}
