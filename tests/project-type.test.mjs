import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { interopDefault: true });
const { projectTypeFromSearch } = await jiti.import("../lib/contact/project-type.ts");

test("uses only API-supported project types from service-package links", () => {
  assert.equal(projectTypeFromSearch("digital_product"), "digital_product");
  assert.equal(projectTypeFromSearch("ecommerce"), "ecommerce");
  assert.equal(projectTypeFromSearch("ai_automation"), "ai_automation");
  assert.equal(projectTypeFromSearch("integrations"), "integrations");
  assert.equal(projectTypeFromSearch("unknown"), undefined);
  assert.equal(projectTypeFromSearch(null), undefined);
});
