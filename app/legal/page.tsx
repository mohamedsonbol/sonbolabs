import type { Metadata } from "next";
import { LegalNotice } from "@/components/legal-notice";

export const metadata: Metadata = { title: "Legal Notice", description: "Sonbolabs legal notice.", alternates: { canonical: "/legal", languages: { en: "/legal", ar: "/ar/legal" } } };

export default function Legal() { return <LegalNotice locale="en"/>; }
