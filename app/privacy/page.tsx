import type { Metadata } from "next";
import { PrivacyNotice } from "@/components/privacy-notice";

export const metadata: Metadata = { title: "Privacy Notice", description: "Sonbolabs privacy notice.", alternates: { canonical: "/privacy", languages: { en: "/privacy", ar: "/ar/privacy" } } };

export default function Privacy() { return <PrivacyNotice locale="en"/>; }
