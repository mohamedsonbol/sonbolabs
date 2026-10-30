import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { interopDefault: true });
const { servicesPageCopy } = await jiti.import("../content/services-page.ts");
const { contactOptions } = await jiti.import("../content/contact-options.ts");
const expectedServiceIds = ["business-website", "lead-automation", "ecommerce-growth"];

test("provides complete localized Services page content", () => {
  for (const locale of ["en", "ar"]) {
    const page = servicesPageCopy[locale];
    assert.equal(page.packages.packages.length, 3);
    assert.deepEqual(page.packages.packages.map((service) => service.id), expectedServiceIds);
    assert.equal(page.support.items.length, 3);
    assert.equal(page.approach.steps.length, 4);
    assert.equal(page.faq.items.length, 6);
    assert.ok(page.hero.title.length > 0);
    assert.ok(page.finalCta.description.length > 0);
    assert.ok(page.support.scopeNote.length > 0);

    for (const service of page.packages.packages) {
      assert.ok(service.deliverables.length > 0);
      assert.ok(service.delivery.length > 0);
      assert.ok(contactOptions[locale].types.some((option) => option.value === service.projectType));
    }
  }
});

test("Arabic Services page copy contains Arabic text and specified starting prices", () => {
  const arabicPage = servicesPageCopy.ar;
  assert.match(arabicPage.hero.title, /[\u0600-\u06ff]/);
  assert.deepEqual(arabicPage.packages.packages.map((service) => service.price), [
    "ابتداءً من €900",
    "ابتداءً من €500",
    "ابتداءً من €900",
  ]);
});
