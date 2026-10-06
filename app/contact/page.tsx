import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
export const metadata:Metadata={title:"Start a Project",description:"Tell Sonbol Labs about your digital product, commerce or automation challenge.",alternates:{canonical:"/contact",languages:{en:"/contact",ar:"/ar/contact"}}};
export default function Contact(){return <section className="section"><div className="container" style={{maxWidth:900}}><p className="eyebrow">Start a project</p><h1 className="display section-title">Tell us what needs to work better.</h1><p className="body-large">You don&apos;t need a finished brief. Share the business context, the problem and where you want to get to.</p><div style={{marginTop:50}}><ContactForm locale="en"/></div></div></section>}
