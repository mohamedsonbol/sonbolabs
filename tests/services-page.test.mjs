import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { interopDefault: true });
const { serviceContactHref, servicesPageContent } = await jiti.import("../content/services-page.ts");
const { projectTypeFromSearch } = await jiti.import("../lib/contact/project-type.ts");

test("provides complete localized Services page content and metadata", () => {
  for (const locale of ["en", "ar"]) {
    const page = servicesPageContent[locale];
    assert.ok(page.metadata.title);
    assert.ok(page.metadata.description);
    assert.equal(page.packages.services.length, 3);
    assert.equal(page.support.items.length, 3);
    assert.equal(page.approach.steps.length, 4);
    assert.equal(page.faq.items.length, 6);
    for (const service of page.packages.services) {
      assert.ok(service.title);
      assert.ok(service.description);
      assert.ok(service.price);
      assert.ok(service.delivery);
      assert.ok(service.deliverables.length > 0);
      assert.ok(service.idealCustomer);
      assert.ok(service.scopeNote);
    }
  }
  assert.match(servicesPageContent.ar.hero.title, /حلول رقمية/);
});

test("service CTAs use localized contact routes and supported project types", () => {
  const expected = [
    ["business-website", "digital_product"],
    ["lead-automation", "ai_automation"],
    ["ecommerce-growth", "ecommerce"],
  ];

  for (const [serviceId, projectType] of expected) {
    const service = servicesPageContent.en.packages.services.find((item) => item.id === serviceId);
    assert.equal(service?.projectType, projectType);
    assert.equal(projectTypeFromSearch(service?.projectType ?? null), projectType);
    assert.equal(serviceContactHref("en", projectType), `/contact?projectType=${projectType}`);
    assert.equal(serviceContactHref("ar", projectType), `/ar/contact?projectType=${projectType}`);
  }
});

test("English metadata matches the approved Services page metadata", () => {
  assert.equal(servicesPageContent.en.metadata.title, "Services | Sonbolabs — Web Development & Automation");
  assert.equal(servicesPageContent.en.metadata.description, "Explore Sonbolabs services: professional websites from €900, lead automation from €500, and e-commerce growth infrastructure from €900.");
});
