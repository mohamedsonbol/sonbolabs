import type { Metadata } from "next";
import { ServicesPage } from "@/components/sections/services-page";
import { company } from "@/content/company";

const title = "Services | Sonbolabs — Web Development & Automation";
const description = "Explore Sonbolabs services: professional websites from €900, lead automation from €500, and e-commerce growth infrastructure from €900.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: "/services",
    languages: { en: "/services", ar: "/ar/services" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: new URL("/services", company.siteUrl).toString(),
    title,
    description,
  },
};

export default function ServicesRoute() {
  return <ServicesPage locale="en" />;
}
