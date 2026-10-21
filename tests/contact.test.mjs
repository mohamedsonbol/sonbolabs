import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { interopDefault: true });
const { processContactSubmission } = await jiti.import("../lib/contact/handler.ts");
const { isAllowedContactOrigin } = await jiti.import("../lib/contact/origin.ts");
const { handleContactPost } = await jiti.import("../lib/contact/request.ts");

async function submit(body) {
  const leads = [];
  const response = await processContactSubmission(body, async (lead) => {
    leads.push(lead);
  });
  return { response, leads };
}

test("only permits the exact production origin in production", () => {
  assert.equal(isAllowedContactOrigin("https://sonbolabs.exceptionalgrp.com", "production"), true);
  assert.equal(isAllowedContactOrigin("https://www.sonbolabs.exceptionalgrp.com", "production"), false);
  assert.equal(isAllowedContactOrigin("https://sonbolabs.exceptionalgrp.com.evil.example", "production"), false);
  assert.equal(isAllowedContactOrigin(null, "production"), false);
});

test("accepts a valid English submission with an empty website and honeypot", async () => {
  const { response, leads } = await submit({
    name: "Ada Lovelace",
    email: "ada@example.com",
    company: "Analytical Engines",
    website: "",
    projectType: "digital_product",
    budget: "2500_5000",
    timeline: "one_to_two_months",
    message: "We need a product website.",
    locale: "en",
    companyWebsite: "",
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(leads.length, 1);
  assert.equal(leads[0].website, "");
  assert.equal(leads[0].locale, "en");
});

test("accepts a valid Arabic submission with an optional HTTPS website", async () => {
  const { response, leads } = await submit({
    name: "سارة أحمد",
    email: "sara@example.com",
    company: "مختبرات سونبول",
    website: "https://example.com",
    projectType: "ai_automation",
    budget: "10000_25000",
    timeline: "three_to_six_months",
    message: "نحتاج إلى أتمتة عمليات خدمة العملاء.",
    locale: "ar",
    companyWebsite: "",
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(leads.length, 1);
  assert.equal(leads[0].locale, "ar");
});

test("normalizes bare domains and preserves HTTP/HTTPS across both locales", async () => {
  for (const [locale, website, expected] of [["en", " example.com ", "https://example.com/"], ["ar", "www.example.com", "https://www.example.com/"], ["en", "http://example.com", "http://example.com/"], ["ar", "https://example.com", "https://example.com/"]]) {
    const { response, leads } = await submit({
      name: "Test Person",
      email: "test@example.com",
      company: "Example Company",
      website,
      projectType: "digital_product",
      budget: "2500_5000",
      timeline: "one_to_two_months",
      message: "A valid request.",
      locale,
      companyWebsite: "",
    });
    assert.equal(response.status, 200);
    assert.equal(leads[0].website, expected);
  }
});

test("returns localized-client-compatible field codes for invalid submissions in both locales", async () => {
  for (const locale of ["en", "ar"]) {
    const { response, leads } = await submit({
    name: "Ada",
    email: "not-an-email",
    company: "Analytical Engines",
    website: "not a URL",
    projectType: "Digital Product / Website",
    budget: "2500_5000",
    timeline: "one_to_two_months",
    message: "Help.",
    locale,
    companyWebsite: "",
    });

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
    error: "Validation failed.",
    fields: {
      email: ["invalid_email"],
      website: ["invalid_website"],
      projectType: ["invalid_option"],
    },
    });
    assert.equal(leads.length, 0);
  }
});

test("acknowledges a filled honeypot without exposing spam controls", async () => {
  const { response, leads } = await submit({ companyWebsite: "https://spam.example" });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(leads.length, 0);
});

test("accepts a same-origin request without infrastructure authentication", async () => {
  const delivered = [];
  const response = await handleContactPost(
    new Request("https://sonbolabs.exceptionalgrp.com/api/contact", {
      method: "POST",
      headers: { origin: "https://sonbolabs.exceptionalgrp.com", "content-type": "application/json" },
      body: JSON.stringify({ name: "Ada Lovelace", email: "ada@example.com", company: "Analytical Engines", website: "", projectType: "digital_product", budget: "2500_5000", timeline: "one_to_two_months", message: "We need a product website.", locale: "en", companyWebsite: "" }),
    }),
    { deliver: async (lead) => { delivered.push(lead); } },
  );

  assert.equal(response.status, 200);
  assert.equal(delivered.length, 1);
});

test("rejects cross-origin requests before parsing or SMTP delivery", async () => {
  let deliveries = 0;
  const response = await handleContactPost(
    new Request("https://sonbolabs.exceptionalgrp.com/api/contact", {
      method: "POST",
      headers: { origin: "https://attacker.example", "content-type": "application/json" },
      body: "{}",
    }),
    { deliver: async () => { deliveries += 1; } },
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Invalid form submission." });
  assert.equal(deliveries, 0);
});

test("rejects declared and streamed oversized bodies before SMTP delivery", async () => {
  let deliveries = 0;
  const headers = { origin: "https://sonbolabs.exceptionalgrp.com", "content-type": "application/json" };
  const declaredTooLarge = await handleContactPost(new Request("https://sonbolabs.exceptionalgrp.com/api/contact", { method: "POST", headers: { ...headers, "content-length": "16385" }, body: "{}" }), { deliver: async () => { deliveries += 1; } });
  const streamedTooLarge = await handleContactPost(new Request("https://sonbolabs.exceptionalgrp.com/api/contact", { method: "POST", headers, body: "x".repeat(16 * 1024 + 1) }), { deliver: async () => { deliveries += 1; } });
  assert.equal(declaredTooLarge.status, 400);
  assert.equal(streamedTooLarge.status, 400);
  assert.equal(deliveries, 0);
});

test("returns a generic error when SMTP delivery fails", async () => {
  const response = await handleContactPost(
    new Request("https://sonbolabs.exceptionalgrp.com/api/contact", { method: "POST", headers: { origin: "https://sonbolabs.exceptionalgrp.com", "content-type": "application/json" }, body: JSON.stringify({ name: "Ada Lovelace", email: "ada@example.com", company: "Analytical Engines", website: "", projectType: "digital_product", budget: "2500_5000", timeline: "one_to_two_months", message: "We need a product website.", locale: "en", companyWebsite: "" }) }),
    { deliver: async () => { throw new Error("test SMTP failure"); } },
  );
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), { error: "Unable to send message." });
});
