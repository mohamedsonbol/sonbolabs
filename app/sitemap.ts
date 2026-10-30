import type { MetadataRoute } from "next";
import { company } from "@/content/company";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/services", "/work/dr-choice", "/contact", "/privacy", "/ar", "/ar/services", "/ar/work/dr-choice", "/ar/contact", "/ar/privacy"].map((url) => ({
    url: `${company.siteUrl}${url}`,
    lastModified: new Date(),
  }));
}
