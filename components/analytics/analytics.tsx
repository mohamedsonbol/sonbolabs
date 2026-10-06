"use client";
import { useEffect } from "react";
declare global { interface Window { dataLayer?: Record<string, unknown>[] } }
export function trackEvent(event: string, data: Record<string, string | undefined> = {}) { window.dataLayer?.push({ event, ...data }); }
export function GTM() { const id = process.env.NEXT_PUBLIC_GTM_ID; useEffect(() => { if (!id) return; window.dataLayer = window.dataLayer || []; window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" }); const s=document.createElement("script"); s.async=true; s.src=`https://www.googletagmanager.com/gtm.js?id=${id}`; document.head.appendChild(s); }, [id]); return null; }
