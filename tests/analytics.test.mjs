import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { interopDefault: true });
const { injectGtmScript, trackEvent, setGoogleConsent } = await jiti.import("../components/analytics/analytics.tsx");
const { consentCopy } = await jiti.import("../components/analytics/consent-copy.ts");
const { contactSchema } = await jiti.import("../lib/contact/validation.ts");

function dom(cookie = "") {
  const elements = new Map();
  const head = {
    appendChild(el) {
      el.parentNode = head;
      elements.set(el.id, el);
    },
    removeChild(el) {
      el.parentNode = null;
      elements.delete(el.id);
    },
  };
  globalThis.document = {
    cookie,
    getElementById: (id) => elements.get(id) ?? null,
    createElement: (tag) => ({ tagName: tag, id: "", async: false, src: "", parentNode: null }),
    head,
  };
  globalThis.window = { dataLayer: [] };
  return { elements, dataLayer: globalThis.window.dataLayer };
}

test("empty GTM ID prevents injection", () => {
  const d = dom();
  assert.equal(injectGtmScript(true, ""), undefined);
  assert.equal(d.elements.size, 0);
  assert.deepEqual(d.dataLayer, []);
});

test("non-empty ID does not inject before consent", () => {
  const d = dom();
  assert.equal(injectGtmScript(false, "GTM-TEST123"), undefined);
  assert.equal(d.elements.size, 0);
  assert.deepEqual(d.dataLayer, []);
});

test("granted consent allows injection when explicitly configured", () => {
  const d = dom();
  const cleanup = injectGtmScript(true, "GTM-TEST123");
  assert.equal(typeof cleanup, "function");
  const script = d.elements.get("sonbol-gtm");
  assert.ok(script);
  assert.equal(script.async, true);
  assert.match(script.src, /gtm\.js\?id=GTM-TEST123$/);
  const startEvent = d.dataLayer.find((entry) => entry.event === "gtm.js");
  assert.equal(typeof startEvent["gtm.start"], "number");
});

test("duplicate injection is prevented", () => {
  const d = dom();
  assert.equal(typeof injectGtmScript(true, "GTM-TEST123"), "function");
  assert.equal(injectGtmScript(true, "GTM-TEST123"), undefined);
  assert.equal(d.elements.size, 1);
  assert.equal(d.dataLayer.filter((entry) => entry.event === "gtm.js").length, 1);
});

test("consent withdrawal updates Google consent state", () => {
  const d = dom();
  setGoogleConsent("granted", "default");
  setGoogleConsent("denied", "update");
  assert.deepEqual(d.dataLayer[0], ["consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted" }]);
  assert.deepEqual(d.dataLayer[1], ["consent", "update", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" }]);
});

test("tracking events stop after withdrawal", () => {
  const d = dom("sonbol_analytics_consent=granted");
  trackEvent("lead_form_start", { locale: "en" });
  assert.equal(d.dataLayer.length, 1);
  globalThis.document.cookie = "sonbol_analytics_consent=denied";
  trackEvent("lead_form_submit", {});
  assert.equal(d.dataLayer.length, 1);
});

test("cleanup removes the injected script and allows reinjection", () => {
  const d = dom();
  const cleanup = injectGtmScript(true, "GTM-TEST123");
  assert.ok(d.elements.has("sonbol-gtm"));
  cleanup();
  assert.equal(d.elements.size, 0);
  assert.equal(globalThis.document.getElementById("sonbol-gtm"), null);
  assert.equal(typeof injectGtmScript(true, "GTM-TEST123"), "function");
  assert.equal(d.elements.size, 1);
});

test("privacy notice links are localized", () => {
  assert.equal(consentCopy.en.privacy, "Privacy Notice");
  assert.equal(consentCopy.en.privacyHref, "/privacy");
  assert.equal(consentCopy.ar.privacy, "إشعار الخصوصية");
  assert.equal(consentCopy.ar.privacyHref, "/ar/privacy");
});

test("contact form schema still validates required fields", () => {
  const valid = { name: "Test", email: "test@example.com", company: "Example", projectType: "digital_product", budget: "2500_5000", timeline: "asap", platform: "not_sure", message: "Hello", locale: "en", companyWebsite: "" };
  assert.equal(contactSchema.safeParse(valid).success, true);
  assert.equal(contactSchema.safeParse({ ...valid, email: "not-an-email" }).success, false);
});
