import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { LocaleDocument } from "@/components/locale-document";
export const metadata:Metadata={title:"ابدأ مشروعك",description:"أخبر Sonbol Labs عن منتجك الرقمي أو تجارتك الإلكترونية أو تحدي الأتمتة.",alternates:{canonical:"/ar/contact",languages:{en:"/contact",ar:"/ar/contact"}},openGraph:{locale:"ar_AR"}};
export default function ArabicContact(){return <section className="section"><LocaleDocument locale="ar"/><div className="container" style={{maxWidth:900}}><p className="eyebrow">ابدأ مشروعًا</p><h1 className="display section-title">أخبرنا بما يحتاج إلى أن يعمل بشكل أفضل.</h1><p className="body-large">لا تحتاج إلى موجز مكتمل. شاركنا سياق عملك، والمشكلة، والوجهة التي تريد الوصول إليها.</p><div style={{marginTop:50}}><ContactForm locale="ar"/></div></div></section>}
