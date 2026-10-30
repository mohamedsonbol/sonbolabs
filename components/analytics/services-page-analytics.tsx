"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/components/analytics/analytics";

export function ServicesPageAnalytics() {
  const tracked = useRef(false);

  useEffect(() => {
    const trackPageView = () => {
      if (tracked.current || !document.cookie.split("; ").includes("sonbol_analytics_consent=granted")) return;
      tracked.current = true;
      trackEvent("services_page_view");
    };

    trackPageView();
    window.addEventListener("sonbol-consent-change", trackPageView);
    return () => window.removeEventListener("sonbol-consent-change", trackPageView);
  }, []);

  return null;
}
