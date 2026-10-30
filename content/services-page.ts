import type { Locale } from "@/content/site";
import type { ProjectType } from "@/lib/contact/validation";

type ServiceId = "business-website" | "lead-automation" | "ecommerce-growth";

type ServicePackage = {
  id: ServiceId;
  projectType: ProjectType;
  number: string;
  title: string;
  headline: string;
  description: string;
  price: string;
  delivery: string;
  deliverables: string[];
  idealCustomer: string;
  cta: string;
  scopeNote: string;
};

type ServicesPageContent = {
  metadata: { title: string; description: string; openGraphLocale: string };
  hero: { eyebrow: string; title: string; description: string; supporting: string; primary: string; secondary: string };
  packages: { eyebrow: string; title: string; services: ServicePackage[] };
  support: { eyebrow: string; title: string; description: string; items: { title: string; price: string; description: string }[] };
  approach: { eyebrow: string; title: string; steps: { number: string; title: string; description: string }[] };
  faq: { eyebrow: string; title: string; items: { question: string; answer: string }[] };
  finalCta: { title: string; description: string; supporting: string; primary: string; emailLead: string };
};

export const servicesPageContent: Record<Locale, ServicesPageContent> = {
  en: {
    metadata: {
      title: "Services | Sonbolabs — Web Development & Automation",
      description: "Explore Sonbolabs services: professional websites from €900, lead automation from €500, and e-commerce growth infrastructure from €900.",
      openGraphLocale: "en_GB",
    },
    hero: {
      eyebrow: "OUR SERVICES",
      title: "Digital solutions built for business growth.",
      description: "We build professional websites, connect business systems, and automate repetitive work. Sonbolabs helps businesses turn digital challenges into practical, measurable solutions.",
      supporting: "From your first website to smarter business workflows, we combine web development, e-commerce, analytics, and AI-powered automation to help your business work better online.",
      primary: "Discuss Your Project",
      secondary: "Explore Our Services",
    },
    packages: {
      eyebrow: "OUR SERVICES",
      title: "Clear scope. Practical solutions.",
      services: [
        {
          id: "business-website",
          projectType: "digital_product",
          number: "01",
          title: "Business Websites",
          headline: "A professional online presence built around your business.",
          description: "Your website should do more than look good. It should communicate your value, build trust, and make it easy for potential customers to take the next step.",
          price: "From €900",
          delivery: "7–14 business days",
          deliverables: ["Custom website design and development", "Up to 5 core pages", "Mobile-responsive layouts", "Contact forms and enquiry notifications", "Basic on-page SEO", "Google Analytics 4 integration", "Performance and accessibility checks", "Deployment and handover"],
          idealCustomer: "Small businesses, consultants, professional services, and growing brands.",
          cta: "Get a Website Quote",
          scopeNote: "One language, up to five core pages, and standard contact-form functionality. E-commerce, additional languages, custom applications, professional copywriting, and extensive migrations are quoted separately.",
        },
        {
          id: "lead-automation",
          projectType: "ai_automation",
          number: "02",
          title: "Lead Automation",
          headline: "Spend less time managing enquiries. More time growing your business.",
          description: "We connect your website, customer information, and business tools to create more efficient workflows, organize enquiries, and reduce repetitive administrative work.",
          price: "From €500",
          delivery: "5–10 business days",
          deliverables: ["Website form or lead-source integration", "One CRM or lead database connection", "Automated lead notifications", "Basic lead classification", "Follow-up reminders", "AI-assisted response drafting where appropriate", "Workflow testing and documentation", "Handover and implementation guidance"],
          idealCustomer: "Service businesses, consultants, real estate companies, and teams managing customer enquiries.",
          cta: "Automate Your Workflow",
          scopeNote: "The starting package covers one lead source, one CRM or lead database, up to two straightforward workflows, and one notification channel. Complex integrations, custom CRM development, and extensive migrations are quoted separately. AI-generated external communications are never sent automatically without explicit client authorization and appropriate safeguards.",
        },
        {
          id: "ecommerce-growth",
          projectType: "ecommerce",
          number: "03",
          title: "E-commerce Growth Infrastructure",
          headline: "A better technical foundation for your online store.",
          description: "We help existing Shopify and WooCommerce businesses identify technical issues, improve measurement, and implement practical operational improvements.",
          price: "From €900",
          delivery: "10–20 business days",
          deliverables: ["Technical store assessment", "Review of the customer journey and mobile experience", "Analytics and conversion-tracking review", "Implementation or correction of agreed tracking events", "One agreed operational automation", "Technical testing and validation", "Implementation documentation", "Handover and recommendations"],
          idealCustomer: "Existing online shops seeking better technical reliability, clearer performance data, or more efficient operations.",
          cta: "Improve Your Online Store",
          scopeNote: "One existing store, one primary language, one agreed analytics implementation or correction scope, and one operational automation. Replatforming, custom payment gateway development, extensive catalogue migration, and large integrations are quoted separately.",
        },
      ],
    },
    support: {
      eyebrow: "ONGOING SUPPORT",
      title: "More Than Development. A Long-Term Digital Partner.",
      description: "We believe digital solutions should continue delivering value after launch. Our ongoing technical services help keep websites, integrations, and workflows maintained and supported.",
      items: [
        { title: "Website Care & Technical Support", price: "Starting at €150/month", description: "Maintenance, monitoring, and technical support under an agreed scope." },
        { title: "Analytics & Tracking", price: "Standalone or project-based", description: "Measurement implementation, tracking validation, and reporting." },
        { title: "AI & Business Automation", price: "Scope-based quotation", description: "Practical automation for repetitive business processes and existing software systems." },
      ],
    },
    approach: {
      eyebrow: "HOW WE WORK",
      title: "Our Approach",
      steps: [
        { number: "01", title: "Understand", description: "We learn about your business, your challenges, and what you want to achieve." },
        { number: "02", title: "Plan", description: "We recommend a practical solution, define the scope, and agree on deliverables, pricing, and timelines." },
        { number: "03", title: "Build", description: "We implement your solution, test the functionality, and keep you informed throughout the process." },
        { number: "04", title: "Support", description: "We hand over the completed work and can continue supporting and improving it as your business evolves." },
      ],
    },
    faq: {
      eyebrow: "COMMON QUESTIONS",
      title: "Frequently Asked Questions",
      items: [
        { question: "How much does a project cost?", answer: "Business websites start at €900, lead automation at €500, and e-commerce growth infrastructure at €900. Final pricing depends on the agreed scope, integrations, and complexity." },
        { question: "How long does a project take?", answer: "Typical delivery times range from 5 to 20 business days, depending on the service. Timelines assume timely access to the necessary systems, content, and client feedback." },
        { question: "Can you work with our existing website?", answer: "Yes. We can assess and improve existing WordPress, WooCommerce, and Shopify websites without automatically requiring a complete rebuild." },
        { question: "Do we need to use AI?", answer: "No. We recommend AI only when it provides a practical benefit. Sometimes a straightforward integration or automation is the better solution." },
        { question: "Do you provide ongoing support?", answer: "Yes. We offer maintenance and technical support under separate monthly agreements with clearly defined deliverables and service boundaries." },
        { question: "Are third-party subscriptions included?", answer: "Hosting, premium software, API usage, and other third-party costs are generally billed separately unless explicitly included in your proposal." },
      ],
    },
    finalCta: {
      title: "Let's Build Something That Works for Your Business.",
      description: "Whether you need a new website, a more efficient lead-management process, or a better technical foundation for your online store, we'll help you identify the right next step.",
      supporting: "Tell us what you're building, what isn't working, or what you'd like to improve. We'll discuss your requirements and recommend a practical approach.",
      primary: "Discuss Your Project",
      emailLead: "Prefer email? Contact us with a brief description of your project, and we'll take it from there.",
    },
  },
  ar: {
    metadata: {
      title: "الخدمات | Sonbolabs — تطوير الويب والأتمتة",
      description: "اكتشف خدمات Sonbolabs: مواقع احترافية ابتداءً من €900، وأتمتة العملاء المحتملين ابتداءً من €500، وبنية تقنية لنمو التجارة الإلكترونية ابتداءً من €900.",
      openGraphLocale: "ar_AR",
    },
    hero: {
      eyebrow: "خدماتنا",
      title: "حلول رقمية تدعم نمو أعمالك.",
      description: "نطوّر مواقع احترافية، ونربط أنظمة الأعمال، ونؤتمت المهام المتكررة. تساعد Sonbolabs الشركات على تحويل التحديات الرقمية إلى حلول عملية قابلة للقياس.",
      supporting: "من موقعك الأول إلى سير عمل أكثر ذكاءً، نجمع بين تطوير الويب والتجارة الإلكترونية والتحليلات والأتمتة المدعومة بالذكاء الاصطناعي لمساعدة أعمالك على العمل بكفاءة أكبر عبر الإنترنت.",
      primary: "ناقش مشروعك",
      secondary: "استكشف خدماتنا",
    },
    packages: {
      eyebrow: "خدماتنا",
      title: "نطاق واضح. حلول عملية.",
      services: [
        {
          id: "business-website",
          projectType: "digital_product",
          number: "01",
          title: "مواقع الأعمال",
          headline: "حضور احترافي عبر الإنترنت يعكس طبيعة أعمالك.",
          description: "ينبغي لموقعك أن يتجاوز المظهر الجميل؛ فعليه أن يوضح قيمة ما تقدمه، ويبني الثقة، وييسّر على العملاء المحتملين اتخاذ الخطوة التالية.",
          price: "ابتداءً من €900",
          delivery: "من 7 إلى 14 يوم عمل",
          deliverables: ["تصميم الموقع وتطويره وفق احتياجاتك", "حتى 5 صفحات أساسية", "تصميم متجاوب مع الهواتف والأجهزة المختلفة", "نماذج تواصل وإشعارات بالاستفسارات", "أساسيات تحسين محركات البحث داخل الصفحة", "تكامل Google Analytics 4", "فحوصات الأداء وإمكانية الوصول", "النشر والتسليم"],
          idealCustomer: "الشركات الصغيرة، والاستشاريون، ومقدمو الخدمات المهنية، والعلامات التجارية النامية.",
          cta: "اطلب عرضًا لموقعك",
          scopeNote: "يشمل السعر لغة واحدة، وما يصل إلى خمس صفحات أساسية، ووظائف نموذج تواصل قياسية. تُسعّر التجارة الإلكترونية واللغات الإضافية والتطبيقات المخصصة وكتابة المحتوى الاحترافية وعمليات النقل الموسعة بشكل منفصل.",
        },
        {
          id: "lead-automation",
          projectType: "ai_automation",
          number: "02",
          title: "أتمتة العملاء المحتملين",
          headline: "وقت أقل لإدارة الاستفسارات، ووقت أكبر لتنمية أعمالك.",
          description: "نربط موقعك ومعلومات العملاء وأدوات العمل لديك لإنشاء سير عمل أكثر كفاءة، وتنظيم الاستفسارات، وتقليل المهام الإدارية المتكررة.",
          price: "ابتداءً من €500",
          delivery: "من 5 إلى 10 أيام عمل",
          deliverables: ["تكامل نموذج الموقع أو مصدر العملاء المحتملين", "ربط نظام CRM واحد أو قاعدة بيانات للعملاء المحتملين", "إشعارات آلية بالاستفسارات الجديدة", "تصنيف أساسي للعملاء المحتملين", "تذكيرات بالمتابعة", "صياغة أولية للردود بمساعدة الذكاء الاصطناعي عند ملاءمتها", "اختبار سير العمل وتوثيقه", "التسليم وإرشادات التنفيذ"],
          idealCustomer: "شركات الخدمات والاستشاريون والشركات العقارية والفرق التي تدير استفسارات العملاء.",
          cta: "أتمت سير عملك",
          scopeNote: "تشمل الباقة الأساسية مصدرًا واحدًا للعملاء المحتملين ونظام CRM واحدًا أو قاعدة بيانات واحدة، وما يصل إلى سيرَي عمل مباشرين، وقناة إشعارات واحدة. تُسعّر التكاملات المعقدة وتطوير أنظمة CRM المخصصة وعمليات النقل الموسعة بشكل منفصل. ولا تُرسل أي مراسلات خارجية مولدة بالذكاء الاصطناعي تلقائيًا من دون موافقة صريحة من العميل وضوابط مناسبة.",
        },
        {
          id: "ecommerce-growth",
          projectType: "ecommerce",
          number: "03",
          title: "البنية التقنية لنمو التجارة الإلكترونية",
          headline: "أساس تقني أفضل لمتجرك الإلكتروني.",
          description: "نساعد متاجر Shopify وWooCommerce القائمة على اكتشاف المشكلات التقنية، وتحسين القياس، وتنفيذ تحسينات عملية للعمليات.",
          price: "ابتداءً من €900",
          delivery: "من 10 إلى 20 يوم عمل",
          deliverables: ["تقييم تقني للمتجر", "مراجعة رحلة العميل وتجربة الهاتف", "مراجعة التحليلات وتتبع التحويلات", "تنفيذ أحداث التتبع المتفق عليها أو تصحيحها", "أتمتة تشغيلية واحدة متفق عليها", "اختبارات تقنية للتحقق من التنفيذ", "توثيق التنفيذ", "التسليم والتوصيات"],
          idealCustomer: "المتاجر الإلكترونية القائمة التي تسعى إلى موثوقية تقنية أفضل أو بيانات أداء أوضح أو عمليات أكثر كفاءة.",
          cta: "طوّر متجرك الإلكتروني",
          scopeNote: "يشمل متجرًا قائمًا واحدًا ولغة أساسية واحدة ونطاقًا متفقًا عليه لتنفيذ التحليلات أو تصحيحها، إضافة إلى أتمتة تشغيلية واحدة. تُسعّر إعادة بناء المنصة وتطوير بوابات دفع مخصصة ونقل كتالوجات كبيرة والتكاملات الموسعة بشكل منفصل.",
        },
      ],
    },
    support: {
      eyebrow: "دعم مستمر",
      title: "أكثر من تطوير. شريك رقمي على المدى الطويل.",
      description: "نؤمن بأن الحلول الرقمية ينبغي أن تواصل تقديم القيمة بعد الإطلاق. تساعد خدماتنا التقنية المستمرة على صيانة المواقع والتكاملات وسير العمل ودعمها.",
      items: [
        { title: "العناية بالموقع والدعم التقني", price: "ابتداءً من €150 شهريًا", description: "صيانة ومراقبة ودعم تقني ضمن نطاق متفق عليه." },
        { title: "التحليلات والتتبع", price: "خدمة مستقلة أو ضمن مشروع", description: "تنفيذ القياس والتحقق من التتبع وإعداد التقارير." },
        { title: "الذكاء الاصطناعي وأتمتة الأعمال", price: "عرض سعر حسب النطاق", description: "أتمتة عملية للمهام المتكررة وأنظمة البرامج الحالية." },
      ],
    },
    approach: {
      eyebrow: "آلية عملنا",
      title: "منهجنا",
      steps: [
        { number: "01", title: "نفهم", description: "نتعرف إلى أعمالك والتحديات التي تواجهها وما تسعى إلى تحقيقه." },
        { number: "02", title: "نخطط", description: "نوصي بحل عملي، ونحدد النطاق، ونتفق على المخرجات والأسعار والجداول الزمنية." },
        { number: "03", title: "نبني", description: "ننفذ الحل ونختبر وظائفه ونطلعك على المستجدات طوال مراحل العمل." },
        { number: "04", title: "ندعم", description: "نسلّم العمل المكتمل، ويمكننا مواصلة دعمه وتطويره مع تطور أعمالك." },
      ],
    },
    faq: {
      eyebrow: "إجابات عن أسئلة شائعة",
      title: "الأسئلة الشائعة",
      items: [
        { question: "كم تبلغ تكلفة المشروع؟", answer: "تبدأ تكلفة مواقع الأعمال من €900، وأتمتة العملاء المحتملين من €500، والبنية التقنية لنمو التجارة الإلكترونية من €900. ويعتمد السعر النهائي على النطاق والتكاملات ومستوى التعقيد المتفق عليها." },
        { question: "كم يستغرق تنفيذ المشروع؟", answer: "تتراوح مدة التنفيذ المعتادة بين 5 و20 يوم عمل بحسب الخدمة. وتعتمد هذه المدة على إتاحة الأنظمة والمحتوى اللازمين وتلقي ملاحظات العميل في الوقت المناسب." },
        { question: "هل يمكنكم العمل على موقعنا الحالي؟", answer: "نعم. يمكننا تقييم مواقع WordPress وWooCommerce وShopify الحالية وتحسينها من دون افتراض الحاجة إلى إعادة بنائها بالكامل." },
        { question: "هل علينا استخدام الذكاء الاصطناعي؟", answer: "لا. نوصي باستخدام الذكاء الاصطناعي عندما يحقق فائدة عملية فقط؛ فقد يكون التكامل المباشر أو الأتمتة البسيطة هو الحل الأنسب أحيانًا." },
        { question: "هل تقدمون دعمًا مستمرًا؟", answer: "نعم. نقدم الصيانة والدعم التقني بموجب اتفاقيات شهرية منفصلة تحدد المخرجات وحدود الخدمة بوضوح." },
        { question: "هل تشمل الأسعار اشتراكات الخدمات الأخرى؟", answer: "تُحاسب تكاليف الاستضافة والبرامج المدفوعة واستخدام API والخدمات الخارجية الأخرى بشكل منفصل عادةً، ما لم ينص عرض السعر صراحةً على شمولها." },
      ],
    },
    finalCta: {
      title: "لنبنِ حلًا يخدم أعمالك.",
      description: "سواء كنت تحتاج إلى موقع جديد أو إدارة أكثر كفاءة للعملاء المحتملين أو أساس تقني أفضل لمتجرك الإلكتروني، سنساعدك على تحديد الخطوة المناسبة.",
      supporting: "أخبرنا بما تعمل على بنائه، أو ما لا يسير كما ينبغي، أو ما ترغب في تحسينه. سنناقش متطلباتك ونوصي بنهج عملي.",
      primary: "ناقش مشروعك",
      emailLead: "تفضّل التواصل عبر البريد الإلكتروني؟ راسلنا بوصف موجز لمشروعك وسنتابع معك.",
    },
  },
};

export function serviceContactHref(locale: Locale, projectType: ProjectType) {
  const contactPath = locale === "ar" ? "/ar/contact" : "/contact";
  return `${contactPath}?projectType=${encodeURIComponent(projectType)}`;
}
