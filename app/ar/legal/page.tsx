import type { Metadata } from "next";
import { LocaleDocument } from "@/components/locale-document";
import { LegalNotice } from "@/components/legal-notice";

export const metadata: Metadata = { title: "الإشعار القانوني", description: "مسودة الإشعار القانوني لـ Sonbol Labs.", alternates: { canonical: "/ar/legal", languages: { en: "/legal", ar: "/ar/legal" } }, openGraph: { locale: "ar_AR" } };

export default function ArabicLegal() { return <><LocaleDocument locale="ar"/><LegalNotice locale="ar"/></>; }
