import type { Metadata } from "next";
import { LocalizedHome } from "@/components/localized-site";
import { LocaleDocument } from "@/components/locale-document";
export const metadata: Metadata = { title:"Sonbolabs | استوديو للمنتجات الرقمية والتجارة الإلكترونية والذكاء الاصطناعي", description:"نبني في Sonbolabs المنتجات الرقمية، ومنظومات التجارة الإلكترونية، وحلول الذكاء الاصطناعي والأتمتة للشركات الطموحة في أوروبا ودول الخليج.", alternates:{canonical:"/ar",languages:{en:"/",ar:"/ar"}}, openGraph:{locale:"ar_AR",title:"Sonbolabs | استوديو للمنتجات الرقمية والتجارة الإلكترونية والذكاء الاصطناعي",description:"نبني المنتجات الرقمية، ومنظومات التجارة الإلكترونية، وحلول الذكاء الاصطناعي والأتمتة."} };
export default function ArabicHome(){return <><LocaleDocument locale="ar"/><LocalizedHome locale="ar"/></>}
