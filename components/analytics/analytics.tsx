"use client";

import { useEffect } from "react";

declare global { interface Window { dataLayer?: unknown[] } }

const consentCookie = "sonbol_analytics_consent";

function hasAnalyticsConsent() { return typeof document !== "undefined" && document.cookie.split("; ").includes(`${consentCookie}=granted`); }
function gtag(...args: unknown[]) { window.dataLayer = window.dataLayer || []; window.dataLayer.push(args); }

export function setGoogleConsent(consent: "granted" | "denied", mode: "default" | "update") {
  gtag("consent", mode, { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: consent });
}

export function trackEvent(event: string, data: Record<string, string | undefined> = {}) {
  if (!hasAnalyticsConsent()) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
}

export function injectGtmScript(enabled: boolean, id: string | undefined): (() => void) | undefined {
  if (!enabled || !id || document.getElementById("sonbol-gtm")) return undefined;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.id = "sonbol-gtm";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
  return () => {
    if (script.parentNode) script.parentNode.removeChild(script);
  };
}

export function GTM({ enabled }: { enabled: boolean }) {
  const id = process.env.NEXT_PUBLIC_GTM_ID;
  useEffect(() => injectGtmScript(enabled, id), [enabled, id]);
  return null;
}
