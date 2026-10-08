import { z } from "zod";
import { normalizeWebsite } from "./website";

export const projectTypeValues = ["digital_product", "ecommerce", "ai_automation", "integrations", "analytics_tracking", "other"] as const;
export const budgetValues = ["under_2500", "2500_5000", "5000_10000", "10000_25000", "25000_plus", "not_sure"] as const;
export const timelineValues = ["asap", "one_to_two_months", "three_to_six_months", "exploring"] as const;
export const localeValues = ["en", "ar"] as const;

const optionalWebsite = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;
    return normalizeWebsite(value) ?? (value.trim() === "" ? undefined : value.trim());
  },
  z
    .string()
    .trim()
    .max(2048)
    .url()
    .refine((value) => {
      try {
        const protocol = new URL(value).protocol;
        return protocol === "http:" || protocol === "https:";
      } catch {
        return false;
      }
    }, "Website must use http or https")
    .optional(),
);

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  company: z.string().trim().min(1).max(150),
  website: optionalWebsite,
  projectType: z.enum(projectTypeValues),
  budget: z.enum(budgetValues),
  timeline: z.enum(timelineValues),
  message: z.string().trim().min(1).max(5000),
  locale: z.enum(localeValues),
  companyWebsite: z.string().max(100).optional(),
});

export type ContactSubmission = z.infer<typeof contactSchema>;
export type ProjectType = (typeof projectTypeValues)[number];
export type Budget = (typeof budgetValues)[number];
export type Timeline = (typeof timelineValues)[number];
