export type CaseStudyLocale = "en" | "ar";

type CaseStudyCopy = {
  eyebrow: string;
  title: string;
  summary: string;
  liveSite: string;
  liveSiteLabel: string;
  sections: {
    overview: { label: string; title: string; body: string };
    challenge: { label: string; title: string; body: string };
    solution: { label: string; title: string; body: string; points: string[] };
    features: { label: string; title: string; points: string[] };
    stack: { label: string; title: string; items: [string, string][] };
    engineering: { label: string; title: string; points: string[] };
    outcome: { label: string; title: string; body: string };
    screenshots: { label: string; title: string; note: string };
  };
  cta: { title: string; body: string; action: string };
};

export const drChoiceCaseStudy: Record<CaseStudyLocale, CaseStudyCopy> = {
  en: {
    eyebrow: "Selected work / DR. CHOICE",
    title: "Building a bilingual e-commerce experience for an Omani feminine-care brand.",
    summary: "A live Arabic and English commerce platform that brings product discovery, checkout and operations into one customer experience.",
    liveSite: "https://dr-choice.com",
    liveSiteLabel: "Visit dr-choice.com",
    sections: {
      overview: { label: "Project overview", title: "Commerce designed for the Omani market.", body: "DR. CHOICE is an Omani feminine-care brand founded by Dr. Rashida Al-Toorshi. Sonbolabs developed a custom bilingual storefront and connected commerce system for direct-to-consumer sales, product discovery and wholesale enquiries." },
      challenge: { label: "Client challenge", title: "More than a conventional product site.", body: "The experience needed to communicate the client’s medical-led brand positioning while helping Arabic and English customers understand the product range, compare options, shop in Omani rial and reach the right contact path. Brand and product statements are presented as DR. CHOICE’s own positioning." },
      solution: { label: "Technical solution", title: "A storefront and commerce operation that can evolve independently.", body: "The customer experience is built separately from the commerce backend, connecting a modern Next.js storefront with WordPress, WooCommerce and a custom commerce integration.", points: ["Arabic and English storefront with right-to-left presentation", "Guided product discovery, product detail and cart journeys", "WordPress and WooCommerce catalog, variation and order operations", "OMR pricing and server-side order verification", "OMPAY bank-hosted checkout in current production", "DOTOM payment integration transition in progress"] },
      features: { label: "Features delivered", title: "The tools customers and operations need.", points: ["Bilingual shopping experience", "BAMBOO, COMFORT and ECO product lines", "COMFORT size variations and localized OMR pricing", "Product finder for guided discovery", "Cart, checkout and order integration", "Customer and wholesale enquiry paths", "Brand and founder storytelling"] },
      stack: { label: "Technology stack", title: "Built as a connected commerce system.", items: [["Frontend", "Next.js · React · responsive Arabic RTL and English layouts"], ["Commerce", "WordPress · WooCommerce · custom DR. CHOICE Commerce plugin"], ["Payments", "OMPAY bank-hosted checkout · server-side payment-status inquiry and order verification"], ["Infrastructure", "Separate storefront and commerce-backend deployment workflows"]] },
      engineering: { label: "Engineering highlights", title: "Details that protect the commerce flow.", points: ["Separated customer experience from WooCommerce operations", "Custom catalog and commerce integration", "Bilingual product metadata and RTL interface support", "OMR currency precision handling", "Guarded WooCommerce order completion after server-side payment verification", "Independent storefront and backend deployment workflows"] },
      outcome: { label: "Outcome", title: "A live foundation for sales, discovery and future payment evolution.", body: "DR. CHOICE now operates a live bilingual e-commerce platform that connects its brand story, product range and shopping journey. The current development focus is the transition from OMPAY to DOTOM; DOTOM is not represented here as live functionality. Sales, conversion and testimonial claims are intentionally excluded pending verification and approval." },
      screenshots: { label: "Project screenshots", title: "The live customer experience.", note: "Client-supplied screenshots from the DR. CHOICE production experience." },
    },
    cta: { title: "Building a commerce experience that has to work across markets?", body: "Let’s talk about the customer journey, the systems behind it and the next practical step.", action: "Discuss a similar project" },
  },
  ar: {
    eyebrow: "من أعمالنا / DR. CHOICE",
    title: "بناء تجربة تجارة إلكترونية ثنائية اللغة لعلامة عُمانية للعناية النسائية.",
    summary: "منصة تجارة حية بالعربية والإنجليزية تجمع اكتشاف المنتجات والدفع والعمليات ضمن تجربة عميل واحدة.",
    liveSite: "https://dr-choice.com",
    liveSiteLabel: "زيارة dr-choice.com",
    sections: {
      overview: { label: "نظرة عامة على المشروع", title: "تجارة إلكترونية مصممة للسوق العُماني.", body: "DR. CHOICE علامة عُمانية للعناية النسائية أسستها الدكتورة رشيدة الطورشي. طوّرت Sonbolabs واجهة متجر مخصصة ثنائية اللغة ونظام تجارة مترابطًا للمبيعات المباشرة واكتشاف المنتجات واستفسارات الجملة." },
      challenge: { label: "تحدي العميل", title: "أكثر من موقع تقليدي للمنتجات.", body: "احتاجت التجربة إلى إيصال التموضع الطبي للعلامة كما تقدمه DR. CHOICE، مع مساعدة العملاء بالعربية والإنجليزية على فهم المنتجات ومقارنة الخيارات والتسوق بالريال العُماني والوصول إلى مسار التواصل المناسب. تُعرض ادعاءات العلامة والمنتجات بوصفها تموضعًا خاصًا بـ DR. CHOICE." },
      solution: { label: "الحل التقني", title: "واجهة متجر وعمليات تجارة يمكن أن تتطور بشكل مستقل.", body: "بُنيت تجربة العميل بشكل منفصل عن خلفية التجارة، لربط واجهة Next.js حديثة مع WordPress وWooCommerce وتكامل تجارة مخصص.", points: ["واجهة عربية وإنجليزية مع دعم RTL", "اكتشاف موجّه للمنتجات وصفحات تفصيلية وسلة شراء", "إدارة الكتالوج والخيارات والطلبات عبر WordPress وWooCommerce", "أسعار بالريال العُماني والتحقق من الطلبات على الخادم", "دفع مصرفي مستضاف عبر OMPAY في الإنتاج الحالي", "انتقال تكامل DOTOM قيد التنفيذ"] },
      features: { label: "الميزات المسلّمة", title: "ما يحتاجه العملاء والعمليات.", points: ["تجربة تسوق ثنائية اللغة", "خطوط BAMBOO وCOMFORT وECO", "خيارات مقاسات COMFORT وأسعار محلية بالريال العُماني", "أداة لاكتشاف المنتج المناسب", "تكامل السلة والدفع والطلبات", "مسارات لاستفسارات العملاء والجملة", "سرد قصة العلامة والمؤسسة"] },
      stack: { label: "المكدس التقني", title: "بنية تجارة إلكترونية مترابطة.", items: [["الواجهة", "Next.js · React · تصميم متجاوب بالعربية RTL والإنجليزية"], ["التجارة", "WordPress · WooCommerce · إضافة DR. CHOICE Commerce مخصصة"], ["المدفوعات", "دفع مصرفي مستضاف عبر OMPAY · استعلام حالة الدفع والتحقق من الطلب على الخادم"], ["البنية", "مسارات نشر مستقلة للواجهة وخلفية التجارة"]] },
      engineering: { label: "أبرز النقاط الهندسية", title: "تفاصيل تحمي تدفق التجارة.", points: ["فصل تجربة العميل عن عمليات WooCommerce", "تكامل مخصص للكتالوج والتجارة", "بيانات منتجات ثنائية اللغة ودعم واجهة RTL", "التعامل مع دقة العملة بالريال العُماني", "إكمال طلب WooCommerce محمي بعد التحقق من الدفع على الخادم", "مسارات نشر مستقلة للواجهة والخلفية"] },
      outcome: { label: "النتيجة", title: "أساس حي للمبيعات واكتشاف المنتجات وتطور المدفوعات.", body: "تشغّل DR. CHOICE اليوم منصة تجارة إلكترونية حية ثنائية اللغة تربط قصة العلامة ومجموعة المنتجات ورحلة الشراء. يركز التطوير الحالي على الانتقال من OMPAY إلى DOTOM؛ ولا يُعرض DOTOM هنا كوظيفة حية. استُبعدت عمدًا ادعاءات المبيعات والتحويلات والشهادات إلى حين التحقق والموافقة." },
      screenshots: { label: "لقطات من المشروع", title: "تجربة العميل الحية.", note: "لقطات مقدمة من العميل من تجربة DR. CHOICE الإنتاجية." },
    },
    cta: { title: "هل تبني تجربة تجارة يجب أن تعمل عبر أسواق متعددة؟", body: "دعنا نتحدث عن رحلة العميل والأنظمة التي تقف خلفها والخطوة العملية التالية.", action: "ناقش مشروعًا مشابهًا" },
  },
};

export const drChoiceScreenshots: Array<{ src: string; alt: Record<CaseStudyLocale, string> }> = [
  { src: "/images/dr-choice/dr-choice-storefront-desktop.png", alt: { en: "DR. CHOICE contact and wholesale page in the English storefront", ar: "صفحة التواصل والجملة في واجهة متجر DR. CHOICE الإنجليزية" } },
  { src: "/images/dr-choice/dr-choice-brand-story.png", alt: { en: "DR. CHOICE brand-story page featuring the founder", ar: "صفحة قصة علامة DR. CHOICE وتظهر فيها المؤسسة" } },
  { src: "/images/dr-choice/dr-choice-product-catalog.png", alt: { en: "DR. CHOICE product catalog with BAMBOO, COMFORT and ECO product cards", ar: "كتالوج منتجات DR. CHOICE الذي يعرض بطاقات BAMBOO وCOMFORT وECO" } },
  { src: "/images/dr-choice/dr-choice-comfort-product.png", alt: { en: "DR. CHOICE COMFORT product page with size options and OMR pricing", ar: "صفحة منتج DR. CHOICE COMFORT مع خيارات المقاس والسعر بالريال العُماني" } },
  { src: "/images/dr-choice/dr-choice-mobile-product.png", alt: { en: "Mobile view of a DR. CHOICE product journey", ar: "عرض على الهاتف لمسار منتج من DR. CHOICE" } },
  { src: "/images/dr-choice/dr-choice-mobile-storefront.png", alt: { en: "Mobile view of the DR. CHOICE storefront", ar: "عرض على الهاتف لواجهة متجر DR. CHOICE" } },
  { src: "/images/dr-choice/dr-choice-mobile-product-detail.png", alt: { en: "Mobile view of a DR. CHOICE product detail page", ar: "عرض على الهاتف لصفحة تفاصيل منتج من DR. CHOICE" } },
];
