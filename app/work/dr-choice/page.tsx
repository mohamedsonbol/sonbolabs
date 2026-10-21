import type { Metadata } from "next";
import { DrChoiceCaseStudy } from "@/components/sections/dr-choice-case-study";
export const metadata:Metadata={title:"DR. CHOICE | Bilingual E-commerce Platform",description:"A live bilingual e-commerce platform for DR. CHOICE, built with Next.js, React, WordPress and WooCommerce.",alternates:{canonical:"/work/dr-choice",languages:{en:"/work/dr-choice",ar:"/ar/work/dr-choice"}}};
export default function DrChoice(){return <DrChoiceCaseStudy locale="en"/>}
