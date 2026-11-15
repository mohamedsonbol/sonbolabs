import type { Locale } from "@/content/site";
import { company } from "@/content/company";

export type LegalSection = { heading: string; paragraphs: string[] };
export type LegalNotice = { label: string; title: string; status: string; sections: LegalSection[] };

const email = company.email;

const english: LegalNotice = {
  label: "Legal",
  title: "Legal notice",
  status: "Approval draft — legal review and business confirmation are required before publication.",
  sections: [
    { heading: "1. Website operator", paragraphs: [`This website is operated under the Sonbol Labs brand by Mohamed Sonbol Business Consulting. Public privacy enquiries can be sent to ${email}.`] },
    { heading: "2. Business details requiring confirmation", paragraphs: ["TODO — Before publication, confirm the operator’s legally required registered name, business address, registration details and any VAT details that must appear for the applicable Polish business structure. No address, registration number or VAT number is asserted here."] },
    { heading: "3. Website content and intellectual property", paragraphs: ["Unless stated otherwise, website text, design, branding and original materials are owned by or used with permission by the operator. Do not reproduce, redistribute or commercially use them without appropriate permission. Legal review should confirm the final ownership and licensing wording for all third-party materials."] },
    { heading: "4. External links and services", paragraphs: ["The website may link to external websites or services. Those services operate under their own terms and privacy notices. The operator does not control their content or processing and does not endorse every external service merely by linking to it."] },
    { heading: "5. Availability and responsibility", paragraphs: ["The website is provided for general information about Sonbol Labs services. Information may change and is not a substitute for a signed proposal, contract or professional legal advice. TODO — Legal counsel should confirm any permitted limitation-of-liability and warranty wording before publication."] },
    { heading: "6. Governing law and disputes", paragraphs: ["TODO — Confirm the applicable governing law, court or dispute-resolution wording with qualified Polish legal counsel. No final jurisdiction clause is asserted in this approval draft."] },
    { heading: "7. Related privacy information", paragraphs: ["For information about contact enquiries, consent choices, analytics and personal data rights, read the Privacy Notice. It is a separate approval draft and also requires legal and operational review before publication."] },
  ],
};

const arabic: LegalNotice = {
  label: "قانوني",
  title: "إشعار قانوني",
  status: "مسودة بانتظار الاعتماد — يلزم إجراء المراجعة القانونية وتأكيد بيانات النشاط قبل النشر.",
  sections: [
    { heading: "1. مشغل الموقع", paragraphs: [`يُشغَّل هذا الموقع تحت العلامة التجارية Sonbol Labs بواسطة Mohamed Sonbol Business Consulting. يمكن إرسال الاستفسارات العامة المتعلقة بالخصوصية إلى ${email}.`] },
    { heading: "2. بيانات النشاط التي تحتاج إلى تأكيد", paragraphs: ["مطلوب — قبل النشر، يجب تأكيد الاسم القانوني المسجل لمشغل الموقع، وعنوان النشاط، وبيانات التسجيل وأي بيانات ضريبية يجب إظهارها وفق الهيكل القانوني البولندي المنطبق. لا يثبت هذا النص أي عنوان أو رقم تسجيل أو رقم ضريبة القيمة المضافة."] },
    { heading: "3. المحتوى والملكية الفكرية", paragraphs: ["ما لم يُذكر خلاف ذلك، يملك مشغل الموقع نصوص الموقع وتصميمه وعلامته ومواده الأصلية أو يستخدمها بإذن. لا يجوز إعادة إنتاجها أو إعادة توزيعها أو استخدامها تجاريًا دون الإذن المناسب. يجب أن تؤكد المراجعة القانونية الصياغة النهائية للملكية والتراخيص الخاصة بمواد الأطراف الثالثة."] },
    { heading: "4. الروابط والخدمات الخارجية", paragraphs: ["قد يحتوي الموقع على روابط إلى مواقع أو خدمات خارجية. وتخضع تلك الخدمات لشروطها وإشعارات الخصوصية الخاصة بها. لا يسيطر المشغل على محتواها أو معالجتها، ولا يعني وضع رابط إليها اعتماد كل خدمة خارجية."] },
    { heading: "5. الإتاحة والمسؤولية", paragraphs: ["يُقدَّم الموقع للحصول على معلومات عامة عن خدمات Sonbol Labs. وقد تتغير المعلومات، ولا تحل محل عرض موقع أو عقد موقّع أو استشارة قانونية مهنية. مطلوب — يجب أن يؤكد المستشار القانوني أي صياغة نهائية مسموحة بشأن حدود المسؤولية والضمانات قبل النشر."] },
    { heading: "6. القانون وتسوية النزاعات", paragraphs: ["مطلوب — يجب تأكيد القانون الواجب التطبيق وصياغة المحكمة أو تسوية النزاعات مع مستشار قانوني بولندي مؤهل. لا يثبت هذا النص شرط اختصاص نهائيًا في مسودة الاعتماد هذه."] },
    { heading: "7. معلومات الخصوصية ذات الصلة", paragraphs: ["للاطلاع على استفسارات التواصل وخيارات الموافقة والتحليلات وحقوق البيانات الشخصية، راجعوا إشعار الخصوصية. وهو مسودة اعتماد منفصلة تتطلب أيضًا مراجعة قانونية وتشغيلية قبل النشر."] },
  ],
};

export const legalNotices: Record<Locale, LegalNotice> = { en: english, ar: arabic };
