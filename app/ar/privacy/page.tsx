import type { Metadata } from "next";
import { LocaleDocument } from "@/components/locale-document";
import { getDictionary } from "@/content/site";
export const metadata:Metadata={title:"الخصوصية",alternates:{canonical:"/ar/privacy",languages:{en:"/privacy",ar:"/ar/privacy"}},openGraph:{locale:"ar_AR"}};
export default function ArabicPrivacy(){const d=getDictionary("ar").privacy;return <section className="section"><LocaleDocument locale="ar"/><div className="container privacy-copy"><p className="eyebrow">{d.label}</p><h1 className="display section-title">{d.title}</h1><p>{d.paragraphs[0]}</p>{d.headings.map((heading,i)=><div key={heading}><h2>{heading}</h2><p>{d.paragraphs[i+1]}</p></div>)}</div></section>}
