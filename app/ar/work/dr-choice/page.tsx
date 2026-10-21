import type { Metadata } from "next";
import { DrChoiceCaseStudy } from "@/components/sections/dr-choice-case-study";
import { LocaleDocument } from "@/components/locale-document";
export const metadata:Metadata={title:"DR. CHOICE | منصة تجارة إلكترونية ثنائية اللغة",description:"منصة تجارة إلكترونية حية ثنائية اللغة لـ DR. CHOICE، مبنية باستخدام Next.js وReact وWordPress وWooCommerce.",alternates:{canonical:"/ar/work/dr-choice",languages:{en:"/work/dr-choice",ar:"/ar/work/dr-choice"}},openGraph:{locale:"ar_AR"}};
export default function ArabicDrChoice(){return <><LocaleDocument locale="ar"/><DrChoiceCaseStudy locale="ar"/></>}
