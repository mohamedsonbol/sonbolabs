"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/components/analytics/analytics";
import type { Locale } from "@/content/site";

export function ServicesPageView({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const trackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || trackedPath.current === pathname) return;
    trackedPath.current = pathname;
    trackEvent("services_page_view", { locale });
  }, [locale, pathname]);

  return null;
}
