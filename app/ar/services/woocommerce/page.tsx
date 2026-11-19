import type { Metadata } from "next";
import { PlatformPage } from "@/components/sections/platform-page";
import { LocaleDocument } from "@/components/locale-document";
import { platformPages } from "@/content/platform-pages";
import { company } from "@/content/company";

const copy = platformPages.ar.woocommerce;

export const metadata: Metadata = {
  title: { absolute: copy.meta.title },
  description: copy.meta.description,
  alternates: {
    canonical: "/ar/services/woocommerce",
    languages: { en: "/services/woocommerce", ar: "/ar/services/woocommerce" },
  },
  openGraph: {
    type: "website",
    locale: "ar_AR",
    url: new URL("/ar/services/woocommerce", company.siteUrl).toString(),
    siteName: company.name,
    title: copy.meta.title,
    description: copy.meta.description,
  },
  twitter: { card: "summary_large_image" },
};

export default function ArabicWooCommerceRoute() {
  return <><LocaleDocument locale="ar" /><PlatformPage locale="ar" platform="woocommerce" /></>;
}
