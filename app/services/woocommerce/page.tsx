import type { Metadata } from "next";
import { PlatformPage } from "@/components/sections/platform-page";
import { platformPages } from "@/content/platform-pages";
import { company } from "@/content/company";

const copy = platformPages.en.woocommerce;

export const metadata: Metadata = {
  title: { absolute: copy.meta.title },
  description: copy.meta.description,
  alternates: {
    canonical: "/services/woocommerce",
    languages: { en: "/services/woocommerce", ar: "/ar/services/woocommerce" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: new URL("/services/woocommerce", company.siteUrl).toString(),
    siteName: company.name,
    title: copy.meta.title,
    description: copy.meta.description,
  },
  twitter: { card: "summary_large_image" },
};

export default function WooCommerceRoute() {
  return <PlatformPage locale="en" platform="woocommerce" />;
}
