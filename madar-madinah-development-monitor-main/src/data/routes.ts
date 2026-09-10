export const INTERESTS = [
  "تاريخي وتراثي",
  "ترفيهي",
  "سياحي",
  "ثقافي",
  "تسوق",
  "إقامة وفنادق",
  "مشاريع وتنمية",
  "تجول في المدينة",
  "عائلي",
  "نقل وتجربة وصول",
  "مطاعم ومقاهي",
] as const;

export type RouteInterest = (typeof INTERESTS)[number];

export const EXPERIENCE_TYPES = [
  "جولة سريعة",
  "جولة داخل المدينة",
  "يوم سياحي",
  "إقامة وزيارة عدة مواقع",
  "استكشاف شامل للمدينة",
] as const;

export type ExperienceType = (typeof EXPERIENCE_TYPES)[number];

export type AvailableTime =
  | "under-two"
  | "two-four"
  | "half-day"
  | "full-day"
  | "two-days"
  | "three-days";

export interface SuggestedRoute {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  durationLabel: string;
  tags: RouteInterest[];
  experienceTypes: ExperienceType[];
  projectIds: string[];
  destinationIds?: string[];
  recommendedFor: string;
  pace?: "هادئ" | "متوازن" | "مكثف";
}

export const suggestedRoutes: SuggestedRoute[] = [
  {
    id: "heritage-route",
    name: "المسار التاريخي",
    description: "اكتشف عدداً من المواقع التاريخية والتراثية في المدينة المنورة.",
    durationMinutes: 165,
    durationLabel: "2–3 ساعات",
    tags: ["تاريخي وتراثي", "سياحي"],
    experienceTypes: ["جولة داخل المدينة", "يوم سياحي", "استكشاف شامل للمدينة"],
    projectIds: ["bir-ghars", "bir-alfaqir", "mughaisilah", "taqmira-neighborhood"],
    recommendedFor: "للمهتمين بالتاريخ والتراث",
    pace: "متوازن",
  },
  {
    id: "short-madinah-tour",
    name: "جولة المدينة القصيرة",
    description: "جولة خفيفة تمنحك مقدمة مركزة عن وجهات المدينة ومشاريعها.",
    durationMinutes: 150,
    durationLabel: "2–3 ساعات",
    tags: ["تجول في المدينة", "سياحي"],
    experienceTypes: ["جولة سريعة", "جولة داخل المدينة"],
    projectIds: ["mughaisilah", "bir-ghars"],
    destinationIds: ["madinah-cultural-center"],
    recommendedFor: "للزيارة الأولى والوقت المحدود",
    pace: "متوازن",
  },
  {
    id: "day-in-madinah",
    name: "يوم في المدينة",
    description: "يوم متنوع يجمع بين التجول والتجربة الثقافية ومشاهدة المشاريع.",
    durationMinutes: 480,
    durationLabel: "يوم كامل",
    tags: ["تجول في المدينة", "سياحي", "ثقافي", "مطاعم ومقاهي"],
    experienceTypes: ["يوم سياحي", "استكشاف شامل للمدينة"],
    projectIds: ["mughaisilah", "bir-alfaqir", "airport-mma", "bait-saaf"],
    destinationIds: ["madinah-cultural-center"],
    recommendedFor: "لمن يريد تجربة متنوعة خلال يوم واحد",
    pace: "مكثف",
  },
  {
    id: "arrival-and-mobility",
    name: "مسار الوصول والتنقل",
    description: "تعرّف على بوابات الوصول الرئيسية وخيارات التنقل في المدينة.",
    durationMinutes: 180,
    durationLabel: "2–3 ساعات",
    tags: ["نقل وتجربة وصول", "تجول في المدينة"],
    experienceTypes: ["جولة سريعة", "جولة داخل المدينة"],
    projectIds: ["airport-mma", "haramain-station"],
    destinationIds: ["madinah-transport-hub"],
    recommendedFor: "للقادمين إلى المدينة لأول مرة",
    pace: "هادئ",
  },
  {
    id: "development-projects",
    name: "مسار المشاريع التنموية",
    description: "نظرة على مجموعة من المشاريع التي ترسم مستقبل المدينة المنورة.",
    durationMinutes: 360,
    durationLabel: "نصف يوم",
    tags: ["مشاريع وتنمية", "سياحي"],
    experienceTypes: ["جولة داخل المدينة", "يوم سياحي"],
    projectIds: ["hospital-nga", "airport-mma", "haramain-station"],
    recommendedFor: "للمهتمين بالتنمية والتحول الحضري",
    pace: "متوازن",
  },
  {
    id: "stay-and-hotels",
    name: "مسار الإقامة",
    description: "تجربة محلية للتعرف على خيارات الإقامة ومرافق الضيافة حول المدينة.",
    durationMinutes: 240,
    durationLabel: "نصف يوم",
    tags: ["إقامة وفنادق", "سياحي"],
    experienceTypes: ["إقامة وزيارة عدة مواقع", "استكشاف شامل للمدينة"],
    projectIds: ["the-oberoi-madina", "anwar-al-madinah-moevenpick-hotel"],
    destinationIds: ["madinah-hospitality", "oasis-hotel"],
    recommendedFor: "للزوار الذين يخططون لإقامتهم",
    pace: "هادئ",
  },
  {
    id: "leisure-route",
    name: "مسار ترفيهي",
    description: "وقت ممتع للعائلة بين وجهات الترفيه والتسوق والأنشطة الخفيفة.",
    durationMinutes: 300,
    durationLabel: "نصف يوم",
    tags: ["ترفيهي", "عائلي", "تسوق", "مطاعم ومقاهي"],
    experienceTypes: ["جولة داخل المدينة", "يوم سياحي"],
    projectIds: ["row-farm"],
    destinationIds: ["family-park"],
    recommendedFor: "للعائلات ومحبي الأنشطة الخفيفة",
    pace: "متوازن",
  },
  {
    id: "two-days-madinah",
    name: "مسار يومين في المدينة",
    description: "خطة ممتدة تمنحك وقتاً أوسع لاستكشاف التاريخ والثقافة والمدينة.",
    durationMinutes: 960,
    durationLabel: "يومان",
    tags: ["تجول في المدينة", "تاريخي وتراثي", "سياحي", "ثقافي"],
    experienceTypes: ["إقامة وزيارة عدة مواقع", "استكشاف شامل للمدينة"],
    projectIds: ["bir-ghars", "bir-alfaqir", "mughaisilah", "hospital-nga"],
    destinationIds: ["madinah-cultural-center"],
    recommendedFor: "لمن لديه وقت كاف لتجربة أعمق",
    pace: "هادئ",
  },
];
