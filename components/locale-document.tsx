"use client";
import { useEffect } from "react";
import type { Locale } from "@/content/site";
export function LocaleDocument({ locale }: { locale: Locale }) { useEffect(()=>{ document.documentElement.lang=locale; document.documentElement.dir=locale === "ar" ? "rtl" : "ltr"; return ()=>{ document.documentElement.lang="en"; document.documentElement.dir="ltr"; }; },[locale]); return null; }
