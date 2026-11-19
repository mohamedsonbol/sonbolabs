import type { Locale } from "@/content/site";

export type PlatformKey = "woocommerce" | "shopify";

type PlatformStep = { title: string; description: string };

type PlatformCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  scopeNote: string;
  offer: { heading: string; items: string[] };
  process: { heading: string; steps: PlatformStep[] };
  proof?: { label: string; name: string; description: string; linkLabel: string };
  cta: { title: string; copy: string; label: string };
  meta: { title: string; description: string };
};

export const platformPages: Record<Locale, Record<PlatformKey, PlatformCopy>> = {
  en: {
    woocommerce: {
      eyebrow: "WooCommerce",
      title: "WooCommerce stores built around how you actually sell.",
      intro: "We design, build and maintain WooCommerce stores for businesses that need more than a template: local payment gateways, Arabic and English storefronts, and integrations with the systems behind the shop.",
      scopeNote: "Platform work is quoted separately as a Custom quote, based on scope and integrations.",
      offer: {
        heading: "What we do",
        items: [
          "New store builds (catalog, cart, checkout)",
          "Payment gateway integration, including regional gateways",
          "Bilingual Arabic/English setup with proper RTL",
          "Custom plugins and theme work",
          "Migrations from other platforms or from a custom build",
          "API and backend integrations",
          "Ongoing care: updates, monitoring, minor fixes",
        ],
      },
      process: {
        heading: "How it works",
        steps: [
          { title: "Discovery", description: "We map products, customers, payments and the systems that need to connect." },
          { title: "Build", description: "We design and build the catalog, cart and checkout around the way you sell." },
          { title: "Connect", description: "We integrate payments, bilingual content and the systems behind the shop." },
          { title: "Launch", description: "We test the full purchase flow before the store goes live." },
          { title: "Care", description: "We handle updates, monitoring and minor fixes after launch." },
        ],
      },
      proof: {
        label: "Relevant work",
        name: "DR. CHOICE",
        description: "A bilingual commerce platform for the Omani market with OMPay integration.",
        linkLabel: "Explore the DR. CHOICE case study",
      },
      cta: {
        title: "Have a WooCommerce project in mind?",
        copy: "Tell us what you sell, where you sell it and what needs to connect. We'll agree on the scope and come back with a Custom quote.",
        label: "Discuss your WooCommerce project",
      },
      meta: {
        title: "WooCommerce Stores & Development | Sonbolabs",
        description: "WooCommerce store builds, regional payment gateways, bilingual Arabic/English storefronts and integrations. See the DR. CHOICE case study.",
      },
    },
    shopify: {
      eyebrow: "Shopify",
      title: "Shopify stores set up around how you sell.",
      intro: "We set up and customize Shopify stores for businesses that need a clear starting point: store configuration, theme customization, apps, payments and migration from WooCommerce or other platforms.",
      scopeNote: "Platform work is quoted separately as a Custom quote, based on scope and integrations.",
      offer: {
        heading: "What we set up",
        items: [
          "Store setup and configuration",
          "Theme customization",
          "App selection and integration",
          "Payment setup",
          "Migration from WooCommerce or other platforms",
        ],
      },
      process: {
        heading: "How we work",
        steps: [
          { title: "Discovery", description: "We agree on the store, the products and the scope of the work." },
          { title: "Setup", description: "We configure the store, theme, apps and payments." },
          { title: "Migration", description: "We move products, customers and orders from the existing platform where needed." },
          { title: "Launch", description: "We test checkout and the customer journey before going live." },
          { title: "Handover", description: "We hand over the store and agree on any ongoing care." },
        ],
      },
      cta: {
        title: "Have a Shopify project in mind?",
        copy: "Tell us what you're selling and what you need set up. We'll agree on the scope and come back with a Custom quote.",
        label: "Discuss your Shopify project",
      },
      meta: {
        title: "Shopify Store Setup & Customization | Sonbolabs",
        description: "Shopify store setup, theme customization, apps, payments and migration from WooCommerce or other platforms. Scoped work with a Custom quote.",
      },
    },
  },
  ar: {
    woocommerce: {
      eyebrow: "WooCommerce",
      title: "متاجر WooCommerce مبنية حول طريقة بيعك الفعلية.",
      intro: "نصمم ونبني ونصون متاجر WooCommerce للشركات التي تحتاج إلى أكثر من قالب جاهز: بوابات دفع محلية، واجهات عربية وإنجليزية، وتكاملات مع الأنظمة التي تعمل خلف المتجر.",
      scopeNote: "يُسعّر العمل على المنصات بشكل منفصل عبر عرض سعر مخصص، بناءً على النطاق والتكاملات.",
      offer: {
        heading: "ما نقوم به",
        items: [
          "بناء متاجر جديدة (الكتالوج والسلة وإتمام الطلب)",
          "تكامل بوابات الدفع، بما في ذلك البوابات الإقليمية",
          "إعداد ثنائي اللغة بالعربية والإنجليزية مع دعم RTL صحيح",
          "إضافات وتطوير قوالب مخصصة",
          "النقل من منصات أخرى أو من بناء مخصص",
          "تكاملات API والخلفية",
          "عناية مستمرة: تحديثات ومراقبة وإصلاحات بسيطة",
        ],
      },
      process: {
        heading: "كيف نعمل",
        steps: [
          { title: "الاستكشاف", description: "نرسم المنتجات والعملاء والمدفوعات والأنظمة التي تحتاج إلى ربط." },
          { title: "البناء", description: "نصمم الكتالوج والسلة وإتمام الطلب حول طريقة بيعك." },
          { title: "الربط", description: "نربط المدفوعات والمحتوى ثنائي اللغة والأنظمة خلف المتجر." },
          { title: "الإطلاق", description: "نختبر رحلة الشراء الكاملة قبل إطلاق المتجر." },
          { title: "العناية", description: "نتولى التحديثات والمراقبة والإصلاحات البسيطة بعد الإطلاق." },
        ],
      },
      proof: {
        label: "عمل ذو صلة",
        name: "DR. CHOICE",
        description: "منصة تجارة ثنائية اللغة للسوق العُماني مع تكامل OMPay.",
        linkLabel: "استكشف دراسة حالة DR. CHOICE",
      },
      cta: {
        title: "لديك مشروع WooCommerce؟",
        copy: "أخبرنا بما تبيعه وأين تبيعه وما الذي يحتاج إلى ربط. سنحدد النطاق ونعود إليك بعرض سعر مخصص.",
        label: "ناقش مشروع WooCommerce الخاص بك",
      },
      meta: {
        title: "متاجر WooCommerce وتطويرها | Sonbolabs",
        description: "بناء متاجر WooCommerce وبوابات دفع إقليمية وواجهات عربية وإنجليزية وتكاملات. راجع دراسة حالة DR. CHOICE.",
      },
    },
    shopify: {
      eyebrow: "Shopify",
      title: "متاجر Shopify تُعدّ حول طريقة بيعك.",
      intro: "نُعدّ متاجر Shopify ونخصّصها للشركات التي تحتاج إلى نقطة بداية واضحة: إعداد المتجر، وتخصيص القالب، والتطبيقات، والمدفوعات، والنقل من WooCommerce أو منصات أخرى.",
      scopeNote: "يُسعّر العمل على المنصات بشكل منفصل عبر عرض سعر مخصص، بناءً على النطاق والتكاملات.",
      offer: {
        heading: "ما نُعدّه",
        items: [
          "إعداد المتجر وتهيئته",
          "تخصيص القالب",
          "اختيار التطبيقات وتكاملها",
          "إعداد المدفوعات",
          "النقل من WooCommerce أو منصات أخرى",
        ],
      },
      process: {
        heading: "طريقة عملنا",
        steps: [
          { title: "الاستكشاف", description: "نتفق على المتجر والمنتجات ونطاق العمل." },
          { title: "الإعداد", description: "نهيئ المتجر والقالب والتطبيقات والمدفوعات." },
          { title: "النقل", description: "ننقل المنتجات والعملاء والطلبات من المنصة الحالية عند الحاجة." },
          { title: "الإطلاق", description: "نختبر إتمام الطلب ورحلة العميل قبل الإطلاق." },
          { title: "التسليم", description: "نسلّم المتجر ونتفق على أي عناية مستمرة." },
        ],
      },
      cta: {
        title: "لديك مشروع Shopify؟",
        copy: "أخبرنا بما تبيعه وما تحتاج إلى إعداده. سنحدد النطاق ونعود إليك بعرض سعر مخصص.",
        label: "ناقش مشروع Shopify الخاص بك",
      },
      meta: {
        title: "إعداد متاجر Shopify وتخصيصها | Sonbolabs",
        description: "إعداد متاجر Shopify وتخصيص القالب والتطبيقات والمدفوعات والنقل من WooCommerce. عمل محدد النطاق عبر عرض سعر مخصص.",
      },
    },
  },
};
