import type { Metadata } from "next";
import { ServicesPage } from "@/components/services/services-page";
import { servicesPageContent } from "@/content/services-page";

const copy = servicesPageContent.en;

export const metadata: Metadata = {
  title: { absolute: copy.metadata.title },
  description: copy.metadata.description,
  alternates: { canonical: "/services", languages: { en: "/services", ar: "/ar/services" } },
  openGraph: { type: "website", siteName: "Sonbol Labs", locale: copy.metadata.openGraphLocale, title: copy.metadata.title, description: copy.metadata.description, url: "/services" },
};

export default function Services() {
  return <ServicesPage locale="en" />;
}
