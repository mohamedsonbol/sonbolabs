import type { Locale } from "@/content/site";
import type { ProjectType } from "@/lib/contact/validation";

type ServicePackage = {
  id: string;
  number: string;
  title: string;
  headline: string;
  description: string;
  price: string;
  delivery: string;
  deliverables: string[];
  idealCustomer: string;
  scopeNote: string;
  cta: string;
  projectType: ProjectType;
};

type ServicesPageCopy = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    supporting: string;
    discuss: string;
    explore: string;
  };
  packages: {
    eyebrow: string;
    title: string;
    priceLabel: string;
    deliveryLabel: string;
    deliverablesLabel: string;
    idealCustomerLabel: string;
    packages: ServicePackage[];
  };
  support: {
    eyebrow: string;
    title: string;
    description: string;
    scopeNote: string;
    items: { title: string; price: string; description: string }[];
  };
  approach: {
    eyebrow: string;
    title: string;
    steps: { number: string; title: string; description: string }[];
  };
  faq: {
    eyebrow: string;
    title: string;
    items: { question: string; answer: string }[];
  };
  finalCta: {
    title: string;
    description: string;
    supporting: string;
    discuss: string;
    emailLead: string;
    contact: string;
  };
};

export const servicesPageCopy: Record<Locale, ServicesPageCopy> = {
  en: {
    hero: {
      eyebrow: "Our services",
      title: "Digital solutions built for business growth.",
      description: "We build professional websites, connect business systems, and automate repetitive work. Sonbolabs helps businesses turn digital challenges into practical, measurable solutions.",
      supporting: "From your first website to smarter business workflows, we combine web development, e-commerce, analytics, and AI-powered automation to help your business work better online.",
      discuss: "Discuss Your Project",
      explore: "Explore Our Services",
    },
    packages: {
      eyebrow: "Clear starting points",
      title: "Practical services, clearly scoped.",
      priceLabel: "Starting price",
      deliveryLabel: "Estimated delivery",
      deliverablesLabel: "What’s included",
      idealCustomerLabel: "A good fit for",
      packages: [
        {
          id: "business-website",
          number: "01",
          title: "Business Websites",
          headline: "A professional online presence built around your business.",
          description: "Your website should do more than look good. It should communicate your value, build trust, and make it easy for potential customers to take the next step.",
          price: "From €900",
          delivery: "7–14 business days",
          deliverables: [
            "Custom website design and development",
            "Up to 5 core pages",
            "Mobile-responsive layouts",
            "Contact forms and enquiry notifications",
            "Basic on-page SEO",
            "Google Analytics 4 integration",
            "Performance and accessibility checks",
            "Deployment and handover",
          ],
          idealCustomer: "Small businesses, consultants, professional services, and growing brands.",
          scopeNote: "One language, up to five core pages, and standard contact-form functionality. E-commerce, additional languages, custom applications, professional copywriting, and extensive migrations are quoted separately.",
          cta: "Get a Website Quote",
          projectType: "digital_product",
        },
        {
          id: "lead-automation",
          number: "02",
          title: "Lead Automation",
          headline: "Spend less time managing enquiries. More time growing your business.",
          description: "We connect your website, customer information, and business tools to create more efficient workflows, organize enquiries, and reduce repetitive administrative work.",
          price: "From €500",
          delivery: "5–10 business days",
          deliverables: [
            "Website form or lead-source integration",
            "One CRM or lead database connection",
            "Automated lead notifications",
            "Basic lead classification",
            "Follow-up reminders",
            "AI-assisted response drafting where appropriate",
            "Workflow testing and documentation",
            "Handover and implementation guidance",
          ],
          idealCustomer: "Service businesses, consultants, real estate companies, and teams managing customer enquiries.",
          scopeNote: "The starting package covers one lead source, one CRM or lead database, up to two straightforward workflows, and one notification channel. Complex integrations, custom CRM development, and extensive migrations are quoted separately. AI-generated external communications are never sent automatically without explicit client authorization and appropriate safeguards.",
          cta: "Automate Your Workflow",
          projectType: "ai_automation",
        },
        {
          id: "ecommerce-growth",
          number: "03",
          title: "E-commerce Growth Infrastructure",
          headline: "A better technical foundation for your online store.",
          description: "We help existing Shopify and WooCommerce businesses identify technical issues, improve measurement, and implement practical operational improvements.",
          price: "From €900",
          delivery: "10–20 business days",
          deliverables: [
            "Technical store assessment",
            "Review of the customer journey and mobile experience",
            "Analytics and conversion-tracking review",
            "Implementation or correction of agreed tracking events",
            "One agreed operational automation",
            "Technical testing and validation",
            "Implementation documentation",
            "Handover and recommendations",
          ],
          idealCustomer: "Existing online shops seeking better technical reliability, clearer performance data, or more efficient operations.",
          scopeNote: "One existing store, one primary language, one agreed analytics implementation or correction scope, and one operational automation. Replatforming, custom payment gateway development, extensive catalogue migration, and large integrations are quoted separately. No sales or conversion-rate outcomes are guaranteed.",
          cta: "Improve Your Online Store",
          projectType: "ecommerce",
        },
      ],
    },
    support: {
      eyebrow: "Beyond launch",
      title: "More Than Development. A Long-Term Digital Partner.",
      description: "We believe digital solutions should continue delivering value after launch. Our ongoing technical services help keep websites, integrations, and workflows maintained and supported.",
      scopeNote: "Monthly fees cover only the agreed services. Additional development and third-party costs are separate unless explicitly included.",
      items: [
        { title: "Website Care & Technical Support", price: "Starting at €150/month", description: "Maintenance, monitoring, and technical support under an agreed scope." },
        { title: "Analytics & Tracking", price: "Standalone or project-based", description: "Measurement implementation, tracking validation, and reporting." },
        { title: "AI & Business Automation", price: "Scope-based quotation", description: "Practical automation for repetitive business processes and existing software systems." },
      ],
    },
    approach: {
      eyebrow: "How we work",
      title: "Our Approach",
      steps: [
        { number: "01", title: "Understand", description: "We learn about your business, your challenges, and what you want to achieve." },
        { number: "02", title: "Plan", description: "We recommend a practical solution, define the scope, and agree on deliverables, pricing, and timelines." },
        { number: "03", title: "Build", description: "We implement your solution, test the functionality, and keep you informed throughout the process." },
        { number: "04", title: "Support", description: "We hand over the completed work and can continue supporting and improving it as your business evolves." },
      ],
    },
    faq: {
      eyebrow: "Frequently asked questions",
      title: "Good to know before we begin.",
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
      title: "Let’s Build Something That Works for Your Business.",
      description: "Whether you need a new website, a more efficient lead-management process, or a better technical foundation for your online store, we’ll help you identify the right next step.",
      supporting: "Tell us what you’re building, what isn’t working, or what you’d like to improve. We’ll discuss your requirements and recommend a practical approach.",
      discuss: "Discuss Your Project",
      emailLead: "Prefer email?",
      contact: "Contact us with a brief description of your project, and we’ll take it from there.",
    },
  },
  ar: {
    hero: {
      eyebrow: "خدماتنا",
      title: "حلول رقمية تدعم نمو أعمالك.",
      description: "نطوّر مواقع احترافية، ونربط أنظمة الأعمال، ونؤتمت المهام المتكررة. تساعد Sonbol Labs الشركات على تحويل التحديات الرقمية إلى حلول عملية قابلة للقياس.",
      supporting: "من موقعك الأول إلى سير عمل أكثر ذكاءً، نجمع بين تطوير الويب والتجارة الإلكترونية والتحليلات والأتمتة المدعومة بالذكاء الاصطناعي لمساعدة أعمالك على العمل بفاعلية أكبر عبر الإنترنت.",
      discuss: "ناقش مشروعك",
      explore: "استكشف خدماتنا",
    },
    packages: {
      eyebrow: "بدايات واضحة",
      title: "خدمات عملية بنطاق محدد.",
      priceLabel: "السعر الابتدائي",
      deliveryLabel: "مدة التنفيذ التقديرية",
      deliverablesLabel: "ما يتضمنه المشروع",
      idealCustomerLabel: "مناسب لـ",
      packages: [
        {
          id: "business-website",
          number: "01",
          title: "مواقع الأعمال",
          headline: "حضور احترافي على الإنترنت مصمم حول طبيعة عملك.",
          description: "ينبغي لموقعك أن يفعل أكثر من مجرد الظهور بمظهر جميل؛ عليه أن يوضح قيمة عملك، ويبني الثقة، ويسهّل على العملاء المحتملين اتخاذ الخطوة التالية.",
          price: "ابتداءً من €900",
          delivery: "من 7 إلى 14 يوم عمل",
          deliverables: [
            "تصميم موقع مخصص وتطويره",
            "حتى 5 صفحات أساسية",
            "تصميم متجاوب مع الهواتف والأجهزة المختلفة",
            "نماذج تواصل وإشعارات بالاستفسارات",
            "تهيئة أساسية لمحركات البحث داخل الصفحة",
            "تكامل Google Analytics 4",
            "فحوصات الأداء وإمكانية الوصول",
            "النشر والتسليم",
          ],
          idealCustomer: "الشركات الصغيرة والاستشاريون ومقدمو الخدمات المهنية والعلامات التجارية النامية.",
          scopeNote: "تشمل الباقة لغة واحدة، وما يصل إلى خمس صفحات أساسية، ووظائف نموذج تواصل قياسية. تُسعّر التجارة الإلكترونية واللغات الإضافية والتطبيقات المخصصة وكتابة المحتوى الاحترافية وعمليات النقل الموسعة بشكل منفصل.",
          cta: "اطلب عرضًا لموقعك",
          projectType: "digital_product",
        },
        {
          id: "lead-automation",
          number: "02",
          title: "أتمتة العملاء المحتملين",
          headline: "وقت أقل لإدارة الاستفسارات، ووقت أكبر لتنمية أعمالك.",
          description: "نربط موقعك وبيانات العملاء وأدوات العمل لإنشاء سير عمل أكثر كفاءة، وتنظيم الاستفسارات، وتقليل المهام الإدارية المتكررة.",
          price: "ابتداءً من €500",
          delivery: "من 5 إلى 10 أيام عمل",
          deliverables: [
            "تكامل نموذج الموقع أو مصدر العملاء المحتملين",
            "ربط نظام CRM واحد أو قاعدة بيانات للعملاء المحتملين",
            "إشعارات آلية بالاستفسارات الجديدة",
            "تصنيف أساسي للعملاء المحتملين",
            "تذكيرات للمتابعة",
            "صياغة أولية للردود بمساعدة الذكاء الاصطناعي عند ملاءمتها",
            "اختبار سير العمل وتوثيقه",
            "التسليم وإرشادات التنفيذ",
          ],
          idealCustomer: "شركات الخدمات والاستشاريون وشركات العقارات والفرق التي تدير استفسارات العملاء.",
          scopeNote: "تشمل الباقة الابتدائية مصدرًا واحدًا للعملاء المحتملين، ونظام CRM واحدًا أو قاعدة بيانات واحدة، وما يصل إلى سيرَي عمل بسيطين، وقناة إشعارات واحدة. تُسعّر التكاملات المعقدة وتطوير أنظمة CRM المخصصة وعمليات النقل الموسعة بشكل منفصل. ولا تُرسل الاتصالات الخارجية المُنشأة بالذكاء الاصطناعي تلقائيًا دون تفويض صريح من العميل وضوابط مناسبة.",
          cta: "أتمت سير عملك",
          projectType: "ai_automation",
        },
        {
          id: "ecommerce-growth",
          number: "03",
          title: "البنية التقنية لنمو التجارة الإلكترونية",
          headline: "أساس تقني أفضل لمتجرك الإلكتروني.",
          description: "نساعد متاجر Shopify وWooCommerce القائمة على اكتشاف المشكلات التقنية وتحسين القياس وتنفيذ تحسينات عملية للعمليات.",
          price: "ابتداءً من €900",
          delivery: "من 10 إلى 20 يوم عمل",
          deliverables: [
            "تقييم تقني للمتجر",
            "مراجعة رحلة العميل وتجربة الهاتف المحمول",
            "مراجعة التحليلات وتتبع التحويلات",
            "تنفيذ أحداث التتبع المتفق عليها أو تصحيحها",
            "أتمتة تشغيلية واحدة متفق عليها",
            "اختبارات تقنية للتحقق من التنفيذ",
            "توثيق التنفيذ",
            "التسليم والتوصيات",
          ],
          idealCustomer: "المتاجر الإلكترونية القائمة التي تسعى إلى موثوقية تقنية أفضل أو بيانات أداء أوضح أو عمليات أكثر كفاءة.",
          scopeNote: "تشمل الباقة متجرًا قائمًا واحدًا ولغة أساسية واحدة ونطاقًا واحدًا متفقًا عليه لتنفيذ التحليلات أو تصحيحها وأتمتة تشغيلية واحدة. تُسعّر إعادة بناء المنصة وتطوير بوابات الدفع المخصصة ونقل كتالوجات المنتجات الموسع والتكاملات الكبيرة بشكل منفصل. ولا نضمن زيادة المبيعات أو معدلات التحويل.",
          cta: "حسّن متجرك الإلكتروني",
          projectType: "ecommerce",
        },
      ],
    },
    support: {
      eyebrow: "ما بعد الإطلاق",
      title: "أكثر من مجرد تطوير. شريك رقمي على المدى الطويل.",
      description: "نؤمن بأن الحلول الرقمية يجب أن تواصل تقديم قيمة بعد إطلاقها. تساعد خدماتنا التقنية المستمرة على صيانة المواقع والتكاملات وسير العمل ودعمها.",
      scopeNote: "تشمل الرسوم الشهرية الخدمات المتفق عليها فقط. وتُحاسب أعمال التطوير الإضافية وتكاليف الجهات الخارجية بشكل منفصل ما لم يُذكر صراحةً أنها مشمولة.",
      items: [
        { title: "العناية بالموقع والدعم التقني", price: "ابتداءً من €150 شهريًا", description: "صيانة ومراقبة ودعم تقني ضمن نطاق متفق عليه." },
        { title: "التحليلات والتتبع", price: "بشكل مستقل أو ضمن مشروع", description: "تنفيذ القياس والتحقق من التتبع وإعداد التقارير." },
        { title: "الذكاء الاصطناعي وأتمتة الأعمال", price: "عرض سعر حسب النطاق", description: "أتمتة عملية للمهام المتكررة وأنظمة البرامج الحالية." },
      ],
    },
    approach: {
      eyebrow: "طريقة عملنا",
      title: "منهجنا",
      steps: [
        { number: "01", title: "الفهم", description: "نتعرف إلى عملك والتحديات التي تواجهها وما تسعى إلى تحقيقه." },
        { number: "02", title: "التخطيط", description: "نقترح حلًا عمليًا، ونحدد النطاق، ونتفق على المخرجات والأسعار والجداول الزمنية." },
        { number: "03", title: "التنفيذ", description: "ننفّذ الحل ونختبر وظائفه ونبقيك على اطلاع طوال مراحل العمل." },
        { number: "04", title: "الدعم", description: "نسلّم العمل المكتمل، ويمكننا مواصلة دعمه وتحسينه مع تطور أعمالك." },
      ],
    },
    faq: {
      eyebrow: "الأسئلة الشائعة",
      title: "إجابات تساعدك قبل أن نبدأ.",
      items: [
        { question: "كم تبلغ تكلفة المشروع؟", answer: "تبدأ مواقع الأعمال من €900، وأتمتة العملاء المحتملين من €500، والبنية التقنية لنمو التجارة الإلكترونية من €900. يعتمد السعر النهائي على النطاق والتكاملات ومستوى التعقيد المتفق عليه." },
        { question: "كم يستغرق تنفيذ المشروع؟", answer: "تتراوح المدة المعتادة بين 5 و20 يوم عمل بحسب نوع الخدمة. وتفترض هذه المدد إتاحة الأنظمة والمحتوى اللازمين وتقديم ملاحظات العميل في الوقت المناسب." },
        { question: "هل يمكنكم العمل على موقعنا الحالي؟", answer: "نعم. يمكننا تقييم مواقع WordPress وWooCommerce وShopify الحالية وتحسينها دون افتراض الحاجة إلى إعادة بنائها بالكامل." },
        { question: "هل يتعين علينا استخدام الذكاء الاصطناعي؟", answer: "لا. نوصي باستخدام الذكاء الاصطناعي فقط عندما يقدم فائدة عملية؛ فقد يكون التكامل المباشر أو الأتمتة البسيطة خيارًا أفضل أحيانًا." },
        { question: "هل تقدمون دعمًا مستمرًا؟", answer: "نعم. نقدم الصيانة والدعم التقني بموجب اتفاقيات شهرية منفصلة تحدد المخرجات وحدود الخدمة بوضوح." },
        { question: "هل تشمل الأسعار اشتراكات الجهات الخارجية؟", answer: "عادةً ما تُحاسب تكاليف الاستضافة والبرامج المدفوعة واستخدام واجهات API والخدمات الخارجية الأخرى بشكل منفصل، ما لم يُذكر صراحةً أنها مشمولة في عرضك." },
      ],
    },
    finalCta: {
      title: "لنبنِ حلًا يخدم أعمالك فعليًا.",
      description: "سواء كنت تحتاج إلى موقع جديد أو إدارة أكثر كفاءة للعملاء المحتملين أو أساس تقني أفضل لمتجرك الإلكتروني، سنساعدك على تحديد الخطوة التالية المناسبة.",
      supporting: "أخبرنا بما تعمل عليه، أو ما لا يسير كما ينبغي، أو ما ترغب في تحسينه. سنناقش متطلباتك ونقترح نهجًا عمليًا.",
      discuss: "ناقش مشروعك",
      emailLead: "تفضّل التواصل عبر البريد الإلكتروني؟",
      contact: "تواصل معنا مع نبذة موجزة عن مشروعك، وسنتولى الخطوة التالية.",
    },
  },
};
