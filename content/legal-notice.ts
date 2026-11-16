import type { Locale } from "@/content/site";
import { company } from "@/content/company";

export type LegalSection = { heading: string; paragraphs: string[] };
export type LegalNotice = { label: string; title: string; status: string; sections: LegalSection[] };

const email = company.email;

const english: LegalNotice = {
  label: "Legal",
  title: "Legal notice",
  status: "This notice provides general information about the operation of this website.",
  sections: [
    { heading: "1. Website operator", paragraphs: [`This website is operated under the Sonbolabs brand by Mohamed Sonbol Business Consulting. Public privacy enquiries can be sent to ${email}.`] },
    { heading: "2. Website content and intellectual property", paragraphs: ["Unless stated otherwise, website text, design, branding and original materials are owned by or used with permission by the operator. Do not reproduce, redistribute or commercially use them without appropriate permission. Third-party materials remain subject to their applicable licences."] },
    { heading: "3. External links and services", paragraphs: ["The website may link to external websites or services. Those services operate under their own terms and privacy notices. The operator does not control their content or processing and does not endorse every external service merely by linking to it."] },
    { heading: "4. Website information", paragraphs: ["The website provides general information about Sonbolabs services. Information may change and is not a substitute for a signed proposal, contract or professional legal advice."] },
    { heading: "5. Related privacy information", paragraphs: ["For information about contact enquiries, consent choices, analytics and personal data rights, read the Privacy Notice."] },
  ],
};

const arabic: LegalNotice = {
  label: "قانوني",
  title: "إشعار قانوني",
  status: "يقدم هذا الإشعار معلومات عامة عن تشغيل هذا الموقع.",
  sections: [
    { heading: "1. مشغل الموقع", paragraphs: [`يُشغَّل هذا الموقع تحت العلامة التجارية Sonbolabs بواسطة Mohamed Sonbol Business Consulting. يمكن إرسال الاستفسارات العامة المتعلقة بالخصوصية إلى ${email}.`] },
    { heading: "2. المحتوى والملكية الفكرية", paragraphs: ["ما لم يُذكر خلاف ذلك، يملك مشغل الموقع نصوص الموقع وتصميمه وعلامته ومواده الأصلية أو يستخدمها بإذن. لا يجوز إعادة إنتاجها أو إعادة توزيعها أو استخدامها تجاريًا دون الإذن المناسب. وتظل مواد الأطراف الثالثة خاضعة للتراخيص المنطبقة عليها."] },
    { heading: "3. الروابط والخدمات الخارجية", paragraphs: ["قد يحتوي الموقع على روابط إلى مواقع أو خدمات خارجية. وتخضع تلك الخدمات لشروطها وإشعارات الخصوصية الخاصة بها. لا يسيطر المشغل على محتواها أو معالجتها، ولا يعني وضع رابط إليها اعتماد كل خدمة خارجية."] },
    { heading: "4. معلومات الموقع", paragraphs: ["يقدم الموقع معلومات عامة عن خدمات Sonbolabs. وقد تتغير المعلومات، ولا تحل محل عرض موقع أو عقد موقّع أو استشارة قانونية مهنية."] },
    { heading: "5. معلومات الخصوصية ذات الصلة", paragraphs: ["للاطلاع على استفسارات التواصل وخيارات الموافقة والتحليلات وحقوق البيانات الشخصية، راجعوا إشعار الخصوصية."] },
  ],
};

export const legalNotices: Record<Locale, LegalNotice> = { en: english, ar: arabic };
