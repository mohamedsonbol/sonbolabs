import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { interopDefault: true });
const { platformFromSearch } = await jiti.import("../lib/contact/platform.ts");
const { processContactSubmission } = await jiti.import("../lib/contact/handler.ts");

const base = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  website: "",
  projectType: "ecommerce",
  budget: "5000_10000",
  timeline: "three_to_six_months",
  message: "We need a store.",
  locale: "en",
  companyWebsite: "",
};

async function submit(body) {
  const leads = [];
  const response = await processContactSubmission(body, async (lead) => { leads.push(lead); });
  return { response, leads };
}

test("accepts only supported platforms from CTA query strings", () => {
  assert.equal(platformFromSearch("woocommerce"), "woocommerce");
  assert.equal(platformFromSearch("shopify"), "shopify");
  assert.equal(platformFromSearch("drupal"), "drupal");
  assert.equal(platformFromSearch("not_sure"), "not_sure");
  assert.equal(platformFromSearch("unknown"), undefined);
  assert.equal(platformFromSearch(null), undefined);
});

test("includes the selected platform in the delivered lead payload", async () => {
  for (const platform of ["woocommerce", "shopify", "drupal", "not_sure"]) {
    const { response, leads } = await submit({ ...base, platform });
    assert.equal(response.status, 200);
    assert.equal(leads.length, 1);
    assert.equal(leads[0].platform, platform);
  }
});

test("defaults a missing platform to not_sure for backwards compatibility", async () => {
  const { response, leads } = await submit(base);
  assert.equal(response.status, 200);
  assert.equal(leads[0].platform, "not_sure");
});

test("reports an invalid platform as a localized field error", async () => {
  const { response, leads } = await submit({ ...base, platform: "magento" });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: "Validation failed.",
    fields: { platform: ["invalid_option"] },
  });
  assert.equal(leads.length, 0);
});
