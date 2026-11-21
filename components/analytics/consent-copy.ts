export type ConsentCopy = {
  title: string;
  body: string;
  accept: string;
  reject: string;
  change: string;
  privacy: string;
  privacyHref: string;
};

export const consentCopy: Record<"en" | "ar", ConsentCopy> = {
  en: {
    title: "Privacy choices",
    body: "We use essential technologies for site operation and security. Optional analytics stay off unless you accept them.",
    accept: "Accept analytics",
    reject: "Reject",
    change: "Privacy choices",
    privacy: "Privacy Notice",
    privacyHref: "/privacy",
  },
  ar: {
    title: "خيارات الخصوصية",
    body: "نستخدم تقنيات ضرورية لتشغيل الموقع وأمانه. تظل التحليلات الاختيارية متوقفة ما لم توافق عليها.",
    accept: "قبول التحليلات",
    reject: "رفض",
    change: "خيارات الخصوصية",
    privacy: "إشعار الخصوصية",
    privacyHref: "/ar/privacy",
  },
};
