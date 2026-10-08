import type { Budget, ProjectType, Timeline } from "@/lib/contact/validation";

export type ContactOption<T extends string> = { value: T; label: string };
export type ContactOptions = { types: ContactOption<ProjectType>[]; budgets: ContactOption<Budget>[]; timelines: ContactOption<Timeline>[] };

export const contactOptions: Record<"en" | "ar", ContactOptions> = {
  en: {
    types: [{value:"digital_product",label:"Digital Product / Website"},{value:"ecommerce",label:"E-commerce"},{value:"ai_automation",label:"AI & Automation"},{value:"integrations",label:"Integrations"},{value:"analytics_tracking",label:"Analytics / Tracking"},{value:"other",label:"Something Else"}],
    budgets: [{value:"under_2500",label:"Under €2,500"},{value:"2500_5000",label:"€2,500–€5,000"},{value:"5000_10000",label:"€5,000–€10,000"},{value:"10000_25000",label:"€10,000–€25,000"},{value:"25000_plus",label:"€25,000+"},{value:"not_sure",label:"Not sure yet"}],
    timelines: [{value:"asap",label:"ASAP"},{value:"one_to_two_months",label:"1–2 months"},{value:"three_to_six_months",label:"3–6 months"},{value:"exploring",label:"Exploring"}],
  },
  ar: {
    types: [{value:"digital_product",label:"منتج رقمي / موقع إلكتروني"},{value:"ecommerce",label:"تجارة إلكترونية"},{value:"ai_automation",label:"ذكاء اصطناعي وأتمتة"},{value:"integrations",label:"تكامل الأنظمة"},{value:"analytics_tracking",label:"التحليلات والتتبع"},{value:"other",label:"شيء آخر"}],
    budgets: [{value:"under_2500",label:"أقل من €2,500"},{value:"2500_5000",label:"€2,500–€5,000"},{value:"5000_10000",label:"€5,000–€10,000"},{value:"10000_25000",label:"€10,000–€25,000"},{value:"25000_plus",label:"€25,000+"},{value:"not_sure",label:"لست متأكدًا بعد"}],
    timelines: [{value:"asap",label:"في أقرب وقت"},{value:"one_to_two_months",label:"خلال شهر إلى شهرين"},{value:"three_to_six_months",label:"خلال 3–6 أشهر"},{value:"exploring",label:"ما زلنا في مرحلة الاستكشاف"}],
  },
};
