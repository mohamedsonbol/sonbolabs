import type { Metadata } from "next";
import { LocaleDocument } from "@/components/locale-document";
import { PrivacyNotice } from "@/components/privacy-notice";
export const metadata: Metadata = { title: "إشعار الخصوصية", description: "إشعار خصوصية Sonbolabs.", alternates: { canonical: "/ar/privacy", languages: { en: "/privacy", ar: "/ar/privacy" } }, openGraph: { locale: "ar_AR" } };
export default function ArabicPrivacy() { return <><LocaleDocument locale="ar"/><PrivacyNotice locale="ar"/></>; }
