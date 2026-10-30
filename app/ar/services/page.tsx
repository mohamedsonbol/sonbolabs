import type { Metadata } from "next";
import { LocaleDocument } from "@/components/locale-document";
import { ServicesPage } from "@/components/services/services-page";
import { servicesPageContent } from "@/content/services-page";

const copy = servicesPageContent.ar;

export const metadata: Metadata = {
  title: { absolute: copy.metadata.title },
  description: copy.metadata.description,
  alternates: { canonical: "/ar/services", languages: { en: "/services", ar: "/ar/services" } },
  openGraph: { type: "website", siteName: "Sonbol Labs", locale: copy.metadata.openGraphLocale, title: copy.metadata.title, description: copy.metadata.description, url: "/ar/services" },
};

export default function ArabicServices() {
  return <><LocaleDocument locale="ar" /><ServicesPage locale="ar" /></>;
}
