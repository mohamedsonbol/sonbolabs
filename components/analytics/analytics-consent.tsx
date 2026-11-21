"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { GTM, setGoogleConsent } from "./analytics";
import { consentCopy } from "./consent-copy";
type Consent = "granted" | "denied" | null;
const cookieName = "sonbol_analytics_consent";
const maxAge = 60 * 60 * 24 * 180;
function readConsent(): Consent { const value=document.cookie.split("; ").find((item)=>item.startsWith(`${cookieName}=`))?.split("=")[1]; return value === "granted" || value === "denied" ? value : null; }
function persistConsent(consent: Exclude<Consent,null>) { document.cookie=`${cookieName}=${consent}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`; }
function subscribeConsent(callback: () => void) { window.addEventListener("sonbol-consent-change", callback); return () => window.removeEventListener("sonbol-consent-change", callback); }
export function AnalyticsConsent({locale}:{locale:"en"|"ar"}) { const consent=useSyncExternalStore(subscribeConsent,readConsent,()=>null); const [open,setOpen]=useState(false); const text=consentCopy[locale]; useEffect(()=>{setGoogleConsent(consent === "granted" ? "granted" : "denied",consent === null ? "default" : "update");},[consent]); function choose(next:Exclude<Consent,null>){persistConsent(next);window.dispatchEvent(new Event("sonbol-consent-change"));setOpen(false);} return <><GTM enabled={consent === "granted"}/>{(consent === null || open)&&<section className="consent-banner" role="dialog" aria-modal="false" aria-label={text.title}><div><strong>{text.title}</strong><p>{text.body}</p><p className="consent-privacy"><Link href={text.privacyHref}>{text.privacy}</Link></p></div><div className="consent-actions"><button className="button button-primary" type="button" onClick={()=>choose("granted")}>{text.accept}</button><button className="consent-reject" type="button" onClick={()=>choose("denied")}>{text.reject}</button></div></section>}{consent !== null&&!open&&<button className="consent-settings" type="button" onClick={()=>setOpen(true)}>{text.change}</button>}</>; }
