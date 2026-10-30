import type { Metadata } from "next";
import { ServicesPage } from "@/components/sections/services-page";
import { company } from "@/content/company";

const title = "الخدمات | Sonbol Labs — تطوير الويب والأتمتة";
const description = "اكتشف خدمات Sonbol Labs: مواقع احترافية ابتداءً من €900، وأتمتة العملاء المحتملين ابتداءً من €500، وبنية تقنية لنمو التجارة الإلكترونية ابتداءً من €900.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: "/ar/services",
    languages: { en: "/services", ar: "/ar/services" },
  },
  openGraph: {
    type: "website",
    locale: "ar_AR",
    url: new URL("/ar/services", company.siteUrl).toString(),
    title,
    description,
  },
};

export default function ArabicServicesRoute() {
  return <ServicesPage locale="ar" />;
}
