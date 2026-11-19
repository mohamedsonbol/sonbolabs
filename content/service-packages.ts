import type { Locale } from "@/content/site";
import type { ProjectType } from "@/lib/contact/validation";

export type ServicePackage = {
  title: string;
  price: string;
  description: string;
  deliverables: string[];
  projectType: ProjectType;
  caseStudy?: { href: string; label: string };
};

type ServicePackageCopy = {
  label: string;
  title: string;
  scopeNote: string;
  cta: string;
  caseStudyPrefix: string;
  packages: ServicePackage[];
};

export const servicePackages: Record<Locale, ServicePackageCopy> = {
  en: {
    label: "Service packages",
    title: "Clear starting points. Built around the work that matters.",
    scopeNote: "Final pricing depends on project scope, content, integrations and delivery requirements. Anything beyond the listed scope is quoted separately.",
    cta: "Discuss Your Project",
    caseStudyPrefix: "Relevant work:",
    packages: [
      { title: "Business Websites", price: "From €900", description: "A focused, credible website for a business that needs to be easy to understand and easy to act on.", deliverables: ["Up to five standard pages", "Responsive design", "Contact form", "Technical SEO foundations", "Deployment"], projectType: "digital_product" },
      { title: "E-commerce Solutions", price: "Custom quote", description: "A commerce experience designed around products, checkout and the operational systems behind them.", deliverables: ["WooCommerce and Shopify", "Product catalog", "Shopping cart and checkout", "Payment gateway integration", "Optional bilingual localization", "API and backend integrations"], projectType: "ecommerce", caseStudy: { href: "/work/dr-choice", label: "Explore the DR. CHOICE case study" } },
      { title: "AI & Automation", price: "Custom quote", description: "Clearly scoped workflows that connect systems and reduce repetitive operational work.", deliverables: ["Business workflow scoping", "Lead qualification", "AI-assisted customer support", "API integrations", "Operational automation"], projectType: "ai_automation" },
      { title: "Care & Growth", price: "From €150/month", description: "Ongoing technical care for a website that needs attention after launch.", deliverables: ["Website maintenance and updates", "Monitoring and minor fixes", "Defined monthly support allocation", "Additional work quoted separately"], projectType: "integrations" },
    ],
  },
  ar: {
    label: "باقات الخدمات",
    title: "نقاط بداية واضحة، مبنية حول العمل الذي يهم.",
    scopeNote: "يعتمد السعر النهائي على نطاق المشروع والمحتوى والتكاملات ومتطلبات التسليم. ويُسعّر أي عمل خارج النطاق المذكور بشكل منفصل.",
    cta: "ناقش مشروعك",
    caseStudyPrefix: "عمل ذو صلة:",
    packages: [
      { title: "مواقع الأعمال", price: "ابتداءً من €900", description: "موقع واضح وموثوق لشركة تحتاج إلى أن تكون سهلة الفهم وسهلة التواصل معها.", deliverables: ["حتى خمس صفحات قياسية", "تصميم متجاوب", "نموذج تواصل", "أسس تقنية لتحسين الظهور في البحث", "النشر"], projectType: "digital_product" },
      { title: "حلول التجارة الإلكترونية", price: "عرض سعر مخصص", description: "تجربة تجارة مصممة حول المنتجات والدفع والأنظمة التشغيلية التي تقف خلفها.", deliverables: ["WooCommerce وShopify", "كتالوج منتجات", "سلة شراء وإتمام الطلب", "تكامل بوابة دفع", "تعريب ثنائي اللغة اختياري", "تكاملات API والخلفية"], projectType: "ecommerce", caseStudy: { href: "/ar/work/dr-choice", label: "استكشف دراسة حالة DR. CHOICE" } },
      { title: "الذكاء الاصطناعي والأتمتة", price: "عرض سعر مخصص", description: "سير عمل محدد بوضوح يربط الأنظمة ويقلل العمل التشغيلي المتكرر.", deliverables: ["تحديد نطاق سير عمل الأعمال", "تأهيل العملاء المحتملين", "دعم عملاء بمساعدة الذكاء الاصطناعي", "تكاملات API", "أتمتة العمليات"], projectType: "ai_automation" },
      { title: "العناية والنمو", price: "ابتداءً من €150 شهريًا", description: "عناية تقنية مستمرة لموقع يحتاج إلى متابعة بعد الإطلاق.", deliverables: ["صيانة الموقع وتحديثاته", "المراقبة والإصلاحات البسيطة", "تخصيص دعم شهري محدد", "يُسعّر العمل الإضافي بشكل منفصل"], projectType: "integrations" },
    ],
  },
};
