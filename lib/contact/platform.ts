import type { Platform } from "./validation";

const platforms: readonly Platform[] = ["woocommerce", "shopify", "drupal", "not_sure"];

export function platformFromSearch(value: string | null): Platform | undefined {
  return value !== null && platforms.includes(value as Platform) ? value as Platform : undefined;
}
