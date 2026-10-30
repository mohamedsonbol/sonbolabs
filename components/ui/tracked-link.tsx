"use client";
import Link from "next/link";
import { trackEvent } from "@/components/analytics/analytics";
export function TrackedLink({ href, children, className, name, location, eventName, eventData }: { href:string; children:React.ReactNode; className?:string; name:string; location:string; eventName?:string; eventData?:Record<string,string|undefined> }) {
  return <Link href={href} className={className} onClick={() => {
    trackEvent("cta_click", { cta_name:name, cta_location:location, destination:href });
    if (eventName) trackEvent(eventName, eventData);
  }}>{children}</Link>;
}
