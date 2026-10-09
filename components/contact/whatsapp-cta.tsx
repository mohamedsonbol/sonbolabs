import { getDictionary, type Locale } from "@/content/site";

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z" /><path d="M9.1 8.3c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5 0 .7l-.5.6c-.1.2-.1.3 0 .5.5.9 1.2 1.6 2.1 2.1.2.1.3.1.5 0l.6-.5c.2-.1.4-.2.7 0l1.6.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.5.7-.5.2-1.2.3-2.2 0-1-.4-2.1-1.1-3.1-2.1-1-1-1.7-2-2.1-3.1-.4-1-.2-1.7 0-2.2Z" /></svg>;
}

export function WhatsAppCta({ locale }: { locale: Locale }) {
  const { whatsapp } = getDictionary(locale).contact;
  return <a className="whatsapp-cta" href="https://wa.me/48732785743" target="_blank" rel="noopener noreferrer"><WhatsAppIcon />{whatsapp}</a>;
}
