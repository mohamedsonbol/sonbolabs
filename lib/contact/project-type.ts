import type { ProjectType } from "./validation";

const projectTypes: readonly ProjectType[] = ["digital_product", "ecommerce", "ai_automation", "integrations", "analytics_tracking", "other"];

export function projectTypeFromSearch(value: string | null): ProjectType | undefined {
  return value !== null && projectTypes.includes(value as ProjectType) ? value as ProjectType : undefined;
}
