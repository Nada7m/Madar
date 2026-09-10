import { PROJECT_STORIES } from "./projectStories";
import { PROJECT_VISIT_INFO } from "./projectVisitInfo";

export type ProjectStatus = "مكتمل" | "قيد التنفيذ" | "مخطط";

export const CATEGORIES = [
  "صحي",
  "تجاري",
  "نقل و مواصلات",
  "تراثي و سياحي",
  "تعليم",
  "ترفيهي",
  "ترفيهي و أنسنة",
  "محمية",
  "استثماري",
  "سكني استثماري",
  "فندقي",
  "بنية تحتية",
  "مطاعم ومقاهي",
] as const;

export type ProjectCategory = (typeof CATEGORIES)[number];

export const STATUSES: ProjectStatus[] = ["مكتمل", "قيد التنفيذ", "مخطط"];

export interface MenuSection {
  title: string;
  items?: string[];
}

export type VisitDay =
  "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";

export interface VisitHours {
  day: VisitDay;
  open?: string;
  close?: string;
  closed?: boolean;
  noteAr?: string;
  noteEn?: string;
}

export interface Project {
  id: string;
  name: string;
  name_en?: string;
  category: ProjectCategory;
  description: string;
  description_en?: string;
  visitor_description?: string;
  visitor_description_en?: string;
  main_features?: string[];
  main_features_en?: string[];
  services?: string[];
  services_en?: string[];
  project_importance?: string[];
  project_importance_en?: string[];
  official_url?: string;
  booking_url?: string;
  map_url?: string;
  location_description?: string;
  location_description_en?: string;
  placeType?: "مطعم" | "مقهى" | "مقهى مختص" | "مخبز ومقهى";
  openingHours?: string;
  openingHours_en?: string;
  menuUrl?: string;
  menuImages?: string[];
  menuSections?: MenuSection[];
  reservationUrl?: string;
  instagramUrl?: string;
  contactPhone?: string;
  progress: number;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  durationYears: number;
  ownerEntity: string;
  executorEntity?: string;
  area: string;
  areaUnit: string;
  projectLink?: string;
  lng?: number;
  lat?: number;
  images: string[];
  accessibility?: "full" | "partial" | "no" | "unknown";
  childrenPolicy?: "allowed" | "conditional" | "notAllowed" | "unknown";
  visitOpeningHours?: VisitHours[];
  visitNotesAr?: string[];
  visitNotesEn?: string[];
  reservationRequired?: boolean | "unknown";
  entryFee?: number | "free" | "unknown";
  parkingAvailable?: boolean | "unknown";
  storyTitleAr?: string;
  storyTitleEn?: string;
  storyAr?: string;
  storyEn?: string;
  storyFactAr?: string;
  storyFactEn?: string;
  storySourceUrl?: string;
}

type OfficialProjectLink = {
  name: string;
  url: string;
};

export const OFFICIAL_PROJECT_LINKS: OfficialProjectLink[] = [
  { name: "مشروع رؤى المدينة", url: "https://www.ruaalmadinah.com/ar/مشروع-رؤى-المدينة/" },
  { name: "مشروع سفن المدينة", url: "https://seven.sa/home" },
  { name: "الجامعة الإسلامية", url: "https://iu.edu.sa/" },
  {
    name: "الجامعة العربية المفتوحة",
    url: "https://www.arabou.edu.sa/ar/Pages/default.aspx",
  },
  { name: "جامعة طيبة", url: "https://www.taibahu.edu.sa/" },
  { name: "جامعة الأمير مقرن", url: "https://upm.edu.sa/ar/home" },
  {
    name: "مستشفى الدكتور سليمان فقيه",
    url: "https://dsfhmadinah.fakeeh.care/",
  },
  {
    name: "مستشفى الملك فيصل التخصصي",
    url: "https://services.kfshrc.edu.sa/ar/home/hospitals/madinah",
  },
  {
    name: "مستشفى المواساة الجديد",
    url: "https://www.mouwasat.com/ar/hospital/mouwasat-hospital-madinah",
  },
  {
    name: "مدينة المعرفة الاقتصادية",
    url: "https://ecza.gov.sa/ar/knowledge-economic-city",
  },
  {
    name: "مشروع ملتقى المدينة",
    url: "https://ecza.gov.sa/ar/knowledge-economic-city",
  },
  {
    name: "مشروع بوابة المدينة",
    url: "https://www.amana-md.gov.sa/NewsCenter/Details/2455",
  },
  {
    name: "جادة العالم الإسلامي",
    url: "https://ecza.gov.sa/ar/knowledge-economic-city",
  },
  {
    name: "قطار الحرمين السريع",
    url: "https://sar.com.sa/ar/about-sar/railnetwork/",
  },
  { name: "العالية مول", url: "https://www.kinan.com.sa/" },
  { name: "النور مول", url: "https://centers.cenomi.com/sa-ar/malls/al-noor-mall/" },
  { name: "مستشفى الحرس الوطني", url: "https://ngha.med.sa/" },
  { name: "كلية السياحة والفندقة", url: "https://tvtc.gov.sa/" },
  { name: "محطة تحويل شرق المدينة", url: "https://www.se.com.sa/" },
  { name: "مطار الأمير محمد بن عبدالعزيز", url: "https://www.saudiairports.com.sa/" },
  { name: "ضاحية واجهة الغروب", url: "https://sakani.sa/" },
  { name: "واجهة المكيمن", url: "https://nhc.sa/" },
  { name: "درة المدينة", url: "https://sakani.sa/" },
];

function normalizeProjectNameForMatch(value: string): string {
  return (
    value
      .trim()
      // Square brackets must be escaped inside this character class.
      // eslint-disable-next-line no-useless-escape
      .replace(/[()\[\]{}\-_/]/g, " ")
      .replace(/[\u064B-\u0652]/g, "")
      .replace(/^(محطة|مشروع|مشروع تطوير|تطوير)\s+/u, "")
      .replace(/\s+/g, " ")
      .toLowerCase()
  );
}
export function getProjectByNameMatch(name: string): Project | undefined {
  const normalizedSearchName = normalizeProjectNameForMatch(name);

  return [...projects, ...hotelProjects, ...getUserProjects()].find((project) => {
    const normalizedProjectName = normalizeProjectNameForMatch(project.name);
    return (
      normalizedProjectName === normalizedSearchName ||
      normalizedProjectName.includes(normalizedSearchName) ||
      normalizedSearchName.includes(normalizedProjectName)
    );
  });
}
export function getOfficialProjectLinkByName(projectName: string): string | undefined {
  const normalizedProjectName = normalizeProjectNameForMatch(projectName);

  const match = OFFICIAL_PROJECT_LINKS.find((entry) => {
    const normalizedEntryName = normalizeProjectNameForMatch(entry.name);
    return (
      normalizedProjectName === normalizedEntryName ||
      normalizedProjectName.includes(normalizedEntryName) ||
      normalizedEntryName.includes(normalizedProjectName)
    );
  });

  return match?.url;
}

function mergeProjectRecords(current: Project, incoming: Project): Project {
  const hasValue = (value: unknown) => value !== undefined && value !== null && value !== "";
  const currentCompleteness = Object.values(current).filter(hasValue).length;
  const incomingCompleteness = Object.values(incoming).filter(hasValue).length;
  const preferred = incomingCompleteness > currentCompleteness ? incoming : current;

  return {
    ...current,
    ...incoming,
    ...preferred,
    id: current.id || incoming.id,
    name: current.name || incoming.name,
    images: incoming.images?.length ? incoming.images : current.images,
    projectLink: incoming.projectLink || current.projectLink,
    lat: typeof incoming.lat === "number" ? incoming.lat : current.lat,
    lng: typeof incoming.lng === "number" ? incoming.lng : current.lng,
  };
}

export function consolidateProjects(projectsToMerge: Project[]): Project[] {
  const byId = new Map<string, Project>();
  const withoutId: Project[] = [];

  for (const project of projectsToMerge) {
    if (!project.id) {
      withoutId.push(project);
      continue;
    }
    const current = byId.get(project.id);
    byId.set(project.id, current ? mergeProjectRecords(current, project) : project);
  }

  const byName = new Map<string, Project>();
  for (const project of [...byId.values(), ...withoutId]) {
    const key = normalizeProjectNameForMatch(project.name || project.id || "");
    if (!key) continue;
    const current = byName.get(key);
    byName.set(key, current ? mergeProjectRecords(current, project) : project);
  }

  return Array.from(byName.values());
}

export const projects: Project[] = [
  {
    id: "hospital-nga",
    name: "مستشفى الأمير محمد بن عبدالعزيز للشؤون الصحية بالحرس الوطني",
    category: "صحي",
    description:
      "مستشفى الحرس الوطني بالمدينة المنورة منشأة صحية تابعة للشؤون الصحية بوزارة الحرس الوطني، تقدم خدمات طبية متقدمة لمنسوبي الحرس الوطني وذويهم، إضافة إلى خدمات تخصصية في مختلف المجالات الطبية، ويُعد أحد المرافق الصحية المهمة في المنطقة.",
    progress: 100,
    status: "مكتمل",
    startDate: "2007م",
    endDate: "2013م",
    durationYears: 6,
    ownerEntity: "الشؤون الصحية بوزارة الحرس الوطني",
    area: "150,000",
    areaUnit: "م²",
    lng: 39.637865,
    lat: 24.533174,
    images: [],
  },
  {
    id: "haramain-station",
    name: "محطة قطار الحرمين السريع",
    category: "نقل و مواصلات",
    description:
      "قطار الحرمين السريع مشروع نقل سككي كهربائي يربط بين مكة المكرمة والمدينة المنورة عبر خط حديدي سريع، بهدف تسهيل تنقل الحجاج والمعتمرين والزوار، ورفع كفاءة النقل بين المدن الرئيسية في المنطقة الغربية. يضم المشروع خمس محطات رئيسية: مكة، جدة، مطار الملك عبدالعزيز، مدينة الملك عبدالله الاقتصادية، والمدينة المنورة.",
    progress: 100,
    status: "مكتمل",
    startDate: "2009م",
    endDate: "2018م",
    durationYears: 9,
    ownerEntity: "الخطوط الحديدية السعودية (سار)",
    area: "147,000",
    areaUnit: "م²",
    projectLink: "https://sar.hhr.sa/ar/home#",
    lng: 39.699436,
    lat: 24.472678,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Haramain_High_Speed_Railway_Station_Interior_2022.jpg/1280px-Haramain_High_Speed_Railway_Station_Interior_2022.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Haramain_high-speed_railway.png/1280px-Haramain_high-speed_railway.png",
    ],
  },
  {
    id: "airport-mma",
    name: "مطار الأمير محمد بن عبدالعزيز الدولي",
    category: "نقل و مواصلات",
    description:
      "مطار الأمير محمد بن عبدالعزيز الدولي هو المطار الرئيسي الذي يخدم المدينة المنورة والمناطق المحيطة بها، ويستقبل ملايين الحجاج والمعتمرين والزوار سنوياً، ويُعدّ أحد أهم البوابات الجوية في المملكة العربية السعودية.",
    progress: 100,
    status: "مكتمل",
    startDate: "",
    endDate: "",
    durationYears: 0,
    ownerEntity: "الهيئة العامة للطيران المدني",
    area: "",
    areaUnit: "",
    lng: 39.705,
    lat: 24.5534,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Bandar_Udara_Internasional_Prince_Mohammad_bin_Abdul_Aziz.jpg/1280px-Bandar_Udara_Internasional_Prince_Mohammad_bin_Abdul_Aziz.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Madina_international_Airport_2025.jpg/1280px-Madina_international_Airport_2025.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/HAJ_TERMINAL.MADINAH_-_panoramio.jpg/1280px-HAJ_TERMINAL.MADINAH_-_panoramio.jpg",
    ],
  },
  {
    id: "mughaisilah",
    name: "مشروع تطوير المغيسلة",
    category: "تراثي و سياحي",
    description:
      "مشروع تطوير المغيسلة يستهدف تأهيل أحد المواقع التاريخية في المدينة المنورة ذات الأبعاد الدينية والتراثية، من خلال تحسين البيئة المحيطة وتهيئة الموقع للزوار وإبراز قيمته التاريخية والثقافية.",
    progress: 100,
    status: "مكتمل",
    startDate: "2021م",
    endDate: "2023م",
    durationYears: 2,
    ownerEntity: "هيئة تطوير منطقة المدينة المنورة",
    area: "",
    areaUnit: "",
    lng: 39.6142,
    lat: 24.4869,
    images: ["/uploads/projects/mughaisilah/mughaisilah-main.jpg"],
  },
  {
    id: "bir-alfaqir",
    name: "مشروع تطوير بئر الفقير وسلمان الفارسي",
    category: "تراثي و سياحي",
    description:
      "مشروع تطوير يهدف إلى تأهيل الموقع التاريخي المرتبط بسلمان الفارسي رضي الله عنه في المدينة المنورة، ويأتي تطوير الموقع ضمن جهود المحافظة على المواقع التاريخية وإبرازها للزوار من خلال تحسين البيئة المحيطة وتهيئة الموقع للزيارة والتعريف بقيمته التاريخية.",
    progress: 100,
    status: "مكتمل",
    startDate: "2022م",
    endDate: "2024م",
    durationYears: 2,
    ownerEntity: "هيئة تطوير منطقة المدينة المنورة بالتكامل مع هيئة التراث",
    area: "3,500",
    areaUnit: "م²",
    lng: 39.627566,
    lat: 24.445119,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Mosque_Salman_Al_farissi.jpg/1280px-Mosque_Salman_Al_farissi.jpg",
    ],
  },
  {
    id: "bir-ghars",
    name: "مشروع تطوير بئر غرس التاريخي",
    category: "تراثي و سياحي",
    description:
      "مشروع تطوير بئر غرس التاريخي يهدف إلى تأهيل أحد المواقع التاريخية والدينية في المدينة المنورة، والمحافظة على قيمته التراثية وتهيئته للزوار ضمن جهود إبراز المواقع التاريخية في المدينة المنورة.",
    progress: 100,
    status: "مكتمل",
    startDate: "",
    endDate: "",
    durationYears: 0,
    ownerEntity: "هيئة تطوير منطقة المدينة المنورة",
    area: "",
    areaUnit: "",
    lng: 39.6289,
    lat: 24.4611,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/%D8%A8%D8%A6%D8%B1_%D8%BA%D8%B1%D8%B3.jpg/1280px-%D8%A8%D8%A6%D8%B1_%D8%BA%D8%B1%D8%B3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/%D8%A8%D8%A6%D8%B1_%D8%BA%D8%B1%D8%B3_2.jpg/1280px-%D8%A8%D8%A6%D8%B1_%D8%BA%D8%B1%D8%B3_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/%D8%AA%D8%B9%D8%B1%D9%8A%D9%81_%D8%A8%D8%A8%D8%A6%D8%B1_%D8%BA%D8%B1%D8%B3.jpg/1280px-%D8%AA%D8%B9%D8%B1%D9%8A%D9%81_%D8%A8%D8%A8%D8%A6%D8%B1_%D8%BA%D8%B1%D8%B3.jpg",
    ],
  },
];

export const restaurantCafeProjects: Project[] = [
  {
    id: "bait-saaf",
    name: "بيت سعف",
    category: "مطاعم ومقاهي",
    description: "مأكولات سعودية وتجربة تراثية.",
    visitor_description:
      "مطعم يقدم الأطباق السعودية التقليدية في أجواء عائلية دافئة، مناسب للعائلات والمجموعات.",
    placeType: "مطعم",
    main_features: ["مأكولات سعودية أصلية", "أجواء تراثية", "موقع مميز"],
    services: ["وجبات رئيسية", "جلسات عائلية", "خدمة متكاملة"],
    progress: 100,
    status: "مكتمل",
    startDate: "",
    endDate: "",
    durationYears: 0,
    ownerEntity: "",
    executorEntity: "",
    area: "",
    areaUnit: "",
    lat: 24.442266954437166,
    lng: 39.52028787035678,
    images: ["/uploads/projects/bait-saaf/bait-saaf-main.jpg"],
  },
  {
    id: "row-farm",
    name: "Row Farm / مزرعة رو",
    category: "مطاعم ومقاهي",
    description: "تجربة قهوة مختصة في أجواء مزرعة مميزة.",
    visitor_description:
      "مقهى متخصص في تقديم القهوة المختصة عالية الجودة بأجواء ريفية هادئة وجلسات مريحة.",
    placeType: "مقهى مختص",
    main_features: ["قهوة مختصة عالية الجودة", "أجواء ريفية مميزة", "خدمة احترافية"],
    services: ["قهوة مختصة", "مشروبات", "جلسات داخلية وخارجية"],
    progress: 100,
    status: "مكتمل",
    startDate: "",
    endDate: "",
    durationYears: 0,
    ownerEntity: "",
    executorEntity: "",
    area: "",
    areaUnit: "",
    lat: 24.442775458192934,
    lng: 39.628016648961754,
    images: [
      "/uploads/projects/row-farm/row-farm-hero.png",
      "/uploads/projects/row-farm/row-farm-atmosphere.png",
    ],
  },
  {
    id: "soul-specialty-coffee",
    name: "Soul Specialty Coffee",
    category: "مطاعم ومقاهي",
    description: "مقهى مختص حديث مناسب لجلسة هادئة.",
    visitor_description:
      "مقهى حديث يتميز بتقديم القهوة المختصة والمشروبات المتنوعة في جو هادئ وراقي مناسب للعمل والاسترخاء.",
    placeType: "مقهى مختص",
    main_features: ["قهوة مختصة فاخرة", "جو هادئ وراقي", "تصميم حديث"],
    services: ["قهوة مختصة", "مشروبات ساخنة وباردة", "مقاعد مريحة"],
    progress: 100,
    status: "مكتمل",
    startDate: "",
    endDate: "",
    durationYears: 0,
    ownerEntity: "",
    executorEntity: "",
    area: "",
    areaUnit: "",
    lat: 24.45134510297601,
    lng: 39.62147630324327,
    images: ["/uploads/projects/soul-specialty-coffee/soul-main.jpg"],
  },
  {
    id: "duo-bakery-coffee",
    name: "Duo Bakery & Coffee",
    category: "مطاعم ومقاهي",
    description: "تجربة قهوة مختصة ومخبوزات بطابع عصري.",
    visitor_description:
      "مخبزة ومقهى حديثة تجمع بين القهوة المختصة والمخبوزات الطازجة بطابع معاصر أنيق.",
    placeType: "مخبز ومقهى",
    main_features: ["قهوة مختصة وجودة عالية", "مخبوزات طازجة يومياً", "تصميم عصري أنيق"],
    services: ["قهوة مختصة", "مخبوزات", "جلسات داخلية"],
    progress: 100,
    status: "مكتمل",
    startDate: "",
    endDate: "",
    durationYears: 0,
    ownerEntity: "",
    executorEntity: "",
    area: "",
    areaUnit: "",
    lat: 24.422957310285486,
    lng: 39.64017609129023,
    images: [
      "/uploads/projects/duo-bakery-coffee/duo-hero.png",
      "/uploads/projects/duo-bakery-coffee/duo-interior.png",
    ],
  },
  {
    id: "taqmira-neighborhood",
    name: "تقميرة – مشروع الحي",
    category: "مطاعم ومقاهي",
    description: "تجربة مرتبطة بالمدينة القديمة داخل مبنى مديني تاريخي.",
    visitor_description:
      "مخبزة ومقهى تتميز بموقعها المميز في مبنى تاريخي وسط مشروع الحي، تجمع بين الطابع التراثي والخدمات الحديثة.",
    placeType: "مخبز ومقهى",
    main_features: ["موقع في مبنى تاريخي", "ربط بالمدينة القديمة", "أجواء تراثية معاصرة"],
    services: ["قهوة", "مخبوزات تقليدية", "جلسات عائلية"],
    progress: 100,
    status: "مكتمل",
    startDate: "",
    endDate: "",
    durationYears: 0,
    ownerEntity: "",
    executorEntity: "",
    area: "",
    areaUnit: "",
    lat: 24.465740387224244,
    lng: 39.60132349922454,
    images: ["/uploads/projects/taqmira-neighborhood/taqmera-main.jpg"],
  },
  {
    id: "into-sushi",
    name: "إنتو سوشي",
    category: "مطاعم ومقاهي",
    description: "تجربة طعام حديثة في أجواء مدينية مميزة.",
    visitor_description:
      "مطعم يتخصص في تقديم الطعام الآسيوي الحديث والسوشي الطازج في أجواء مدينية معاصرة.",
    placeType: "مطعم",
    main_features: ["سوشي طازج يومياً", "طعام آسيوي معاصر", "أجواء مدينية راقية"],
    services: ["سوشي", "وجبات آسيوية", "جلسات داخلية"],
    progress: 100,
    status: "مكتمل",
    startDate: "",
    endDate: "",
    durationYears: 0,
    ownerEntity: "",
    executorEntity: "",
    area: "",
    areaUnit: "",
    lat: 24.459014954869524,
    lng: 39.60198062973323,
    images: [
      "/uploads/projects/into-sushi/into-sushi-main.jpg",
      "/uploads/projects/into-sushi/into-sushi-02.jpg",
    ],
  },
];

export const getProjectById = (id: string) => getAllProjects().find((p) => p.id === id);

function dedupeHotels(projects: Project[]): Project[] {
  const map = new Map<string, Project>();

  for (const project of projects) {
    const key = normalizeProjectNameForMatch(project.name || project.id);
    const existing = map.get(key);

    if (!existing) {
      map.set(key, project);
      continue;
    }

    const existingHasImages = (existing.images?.length ?? 0) > 0;
    const incomingHasImages = (project.images?.length ?? 0) > 0;

    if (incomingHasImages && !existingHasImages) {
      map.set(key, project);
      continue;
    }

    if (
      incomingHasImages === existingHasImages &&
      (project.progress ?? 0) > (existing.progress ?? 0)
    ) {
      map.set(key, project);
    }
  }

  return Array.from(map.values());
}

const hotelSeedProjects: Project[] = [
  {
    id: "the-oberoi-madina",
    name: "ذا أوبروي المدينة",
    name_en: "The Oberoi Madina",
    category: "فندقي",
    description:
      "فندق ذا أوبروي المدينة هو أحد الفنادق الفاخرة في المدينة المنورة، ويقدم تجربة إقامة راقية تجمع بين الخدمات العالمية والهوية الدينية للمكان.",
    description_en:
      "The Oberoi Madina is a luxury hotel in Madinah offering a refined stay with world-class hospitality and a graceful atmosphere suited to pilgrims and visitors.",
    visitor_description:
      "فندق فاخر يتميز بتصميم أنيق، خدمات متكاملة، وموقع مميز يجعل الوصول إلى الأماكن المقدسة سهلاً ومريحًا للزوار.",
    visitor_description_en:
      "A premium hotel with elegant design, comprehensive services, and a strategic location that makes it easy and comfortable for visitors to access key religious landmarks.",
    main_features: ["خدمة فاخرة", "موقع مميز", "غرف أنيقة", "مرافق عائلية"],
    main_features_en: [
      "Luxury service",
      "Prime location",
      "Elegant rooms",
      "Family-friendly amenities",
    ],
    services: ["إقامة فاخرة", "مطاعم", "خدمة الغرف", "مواقف سيارات"],
    services_en: ["Luxury accommodation", "Restaurants", "Room service", "Parking"],
    project_importance: ["مناسب للزوار الباحثين عن الراحة والهدوء", "مرتكز على خدمة عالية الجودة"],
    project_importance_en: [
      "Ideal for visitors seeking comfort and serenity",
      "Built around premium service standards",
    ],
    official_url: "https://www.oberoihotels.com/en/hotels/the-oberoi-madina",
    booking_url: "https://www.booking.com/searchresults.html?ss=The+Oberoi+Madina",
    progress: 100,
    status: "مكتمل",
    startDate: "2019م",
    endDate: "2023م",
    durationYears: 4,
    ownerEntity: "مجموعة أوبروي",
    executorEntity: "The Oberoi Hotels & Resorts",
    area: "",
    areaUnit: "",
    lng: 39.5755,
    lat: 24.4667,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "anwar-al-madinah-moevenpick-hotel",
    name: "أنوار المدينة موفنبيك",
    name_en: "Anwar Al Madinah Mövenpick Hotel",
    category: "فندقي",
    description:
      "فندق أنوار المدينة موفنبيك هو أحد الفنادق الرائدة في المدينة المنورة، ويجمع بين موقعه المميز والخدمات الحديثة لتلبية احتياجات الزوار والحجاج.",
    description_en:
      "Anwar Al Madinah Mövenpick Hotel is a leading hotel in Madinah, combining a prime location with modern facilities and high-quality service for visitors and pilgrims.",
    visitor_description:
      "فندق حديث ومريح يوفر إقامات مميزة بالقرب من الأماكن الدينية مع خدمات مرافقة وواجهة حديثة للضيوف.",
    visitor_description_en:
      "A modern and comfortable hotel offering excellent accommodation near religious sites with responsive services and a contemporary guest experience.",
    main_features: ["موقع مناسب", "خدمة ممتازة", "غرف حديثة", "مطاعم متعددة"],
    main_features_en: [
      "Convenient location",
      "Excellent service",
      "Modern rooms",
      "Multiple dining options",
    ],
    services: ["إقامة", "مطاعم", "خدمة نقل", "مركز أعمال"],
    services_en: ["Accommodation", "Restaurants", "Shuttle service", "Business center"],
    project_importance: ["يوفر تجربة إقامة مريحة للزوار", "يخدم حركة السياحة والدين"],
    project_importance_en: [
      "Provides a comfortable stay for visitors",
      "Supports religious and tourism traffic",
    ],
    official_url:
      "https://www.movenpick.com/en/saudi-arabia/madinah/anwar-al-madinah-moevenpick-hotel",
    booking_url: "https://www.booking.com/searchresults.html?ss=Anwar+Al+Madinah+Moevenpick+Hotel",
    progress: 100,
    status: "مكتمل",
    startDate: "2010م",
    endDate: "2016م",
    durationYears: 6,
    ownerEntity: "Mövenpick Hotels & Resorts",
    executorEntity: "Accor",
    area: "",
    areaUnit: "",
    lng: 39.6112,
    lat: 24.4726,
    images: [
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "pullman-zamzam-madina",
    name: "بولمان زمزم المدينة",
    name_en: "Pullman Zamzam Madina",
    category: "فندقي",
    description:
      "فندق بولمان زمزم المدينة يقدم إقامة فاخرة في قلب المدينة، مع خدمات عالية الجودة ومرافق حديثة تلبي احتياجات الزوار والحجاج.",
    description_en:
      "Pullman Zamzam Madina delivers a premium stay in the heart of Madinah with quality services and modern amenities suitable for visitors and pilgrims.",
    visitor_description:
      "فندق فاخر في مركز المدينة يوفر الراحة والسهولة للوصول إلى مواقع الحج والزيارة مع خدمات أنيقة ومرافق متكاملة.",
    visitor_description_en:
      "A premium city-center hotel that offers convenience, serenity, and access to prayer and visitation destinations with elegant service and complete amenities.",
    main_features: ["مركزية الموقع", "خدمة فندقية متميزة", "غرف واسعة", "مرافق حديثة"],
    main_features_en: [
      "Central location",
      "Exceptional hotel service",
      "Spacious rooms",
      "Modern facilities",
    ],
    services: ["إقامة", "غرف عائلية", "مطاعم", "خدمة الاستقبال"],
    services_en: ["Accommodation", "Family rooms", "Restaurants", "Reception"],
    project_importance: [
      "يخدم الزوار والباحثين عن الراحة في المدينة",
      "يستوعب حركة السفر المتزايدة",
    ],
    project_importance_en: [
      "Serves visitors seeking comfort in Madinah",
      "Covers rising travel demand",
    ],
    official_url: "https://all.accor.com/hotel/6537/index.en.shtml",
    booking_url: "https://www.booking.com/searchresults.html?ss=Pullman+Zamzam+Madina",
    progress: 100,
    status: "مكتمل",
    startDate: "2014م",
    endDate: "2020م",
    durationYears: 6,
    ownerEntity: "Accor",
    executorEntity: "Accor Hotels",
    area: "",
    areaUnit: "",
    lng: 39.5976,
    lat: 24.4695,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068e97eabc1f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "shaza-al-madina",
    name: "شازا المدينة",
    name_en: "Shaza Al Madina",
    category: "فندقي",
    description:
      "فندق شازا المدينة يقدم تجربة فندقية فاخرة ذات طابع خاص، مع خدمات موجهة لرواد الحرم والضيوف الزائرين للمدينة المنورة.",
    description_en:
      "Shaza Al Madina offers a distinctive luxury stay with carefully designed guest services tailored for visitors and pilgrims to Madinah.",
    visitor_description:
      "فندق مميز بتصميمه الفاخر وموقعه المريح، ويعد خيارًا مفضلًا للضيوف الباحثين عن تجربة إقامة أنيقة.",
    visitor_description_en:
      "A distinctive hotel with refined design and a comfortable location, favored by guests seeking a refined and convenient stay.",
    main_features: ["تصميم فاخر", "خدمة شخصية", "إقامة مريحة", "موقع مناسب"],
    main_features_en: [
      "Luxury design",
      "Personalized service",
      "Comfortable stay",
      "Suitable location",
    ],
    services: ["إقامة", "قهوة ومشروبات", "خدمة غرفة", "مواقف"],
    services_en: ["Accommodation", "Coffee and beverages", "Room service", "Parking"],
    project_importance: ["يدعم الزائرين الباحثين عن مستوى راقٍ", "يساهم في تنويع خدمات الإقامة"],
    project_importance_en: [
      "Supports visitors seeking a premium lodging experience",
      "Contributes to diversified accommodation services",
    ],
    official_url: "https://www.shazahotels.com/en/shaza-al-madina",
    booking_url: "https://www.booking.com/searchresults.html?ss=Shaza+Al+Madina",
    progress: 100,
    status: "مكتمل",
    startDate: "2011م",
    endDate: "2017م",
    durationYears: 6,
    ownerEntity: "Shaza Hotels",
    executorEntity: "Shaza Hotels",
    area: "",
    areaUnit: "",
    lng: 39.5844,
    lat: 24.4743,
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "dar-al-taqwa-hotel",
    name: "دار التقوى للفندقة",
    name_en: "Dar Al Taqwa Hotel",
    category: "فندقي",
    description:
      "فندق دار التقوى يوفر إقامة مناسبة للزوار والضيوف مع خدمات أساسية متكاملة في بيئة هادئة ومريحة داخل المدينة المنورة.",
    description_en:
      "Dar Al Taqwa Hotel offers a suitable stay for visitors with integrated core services in a calm and comfortable environment in Madinah.",
    visitor_description:
      "إقامة عمليّة ومريحة مناسبة للزوار الباحثين عن خدمات موثوقة وسهولة الوصول إلى مناطق المدينة الرئيسية.",
    visitor_description_en:
      "A practical and comfortable stay suited to visitors seeking reliable services and convenient access to key areas of the city.",
    main_features: ["إقامة مناسبة", "خدمة متكاملة", "هدوء", "موقع مريح"],
    main_features_en: [
      "Suitable accommodation",
      "Integrated service",
      "Quiet setting",
      "Comfortable location",
    ],
    services: ["إقامة", "خدمة استقبال", "مواقف", "خدمة الإفطار"],
    services_en: ["Accommodation", "Reception", "Parking", "Breakfast service"],
    project_importance: ["يوفر خيارًا عمليًا للزوار", "يدعم السياحة الدينية والزيارة"],
    project_importance_en: [
      "Provides a practical option for visitors",
      "Supports religious tourism and visits",
    ],
    official_url: "https://www.daraltaqwahotel.com/",
    booking_url: "https://www.booking.com/searchresults.html?ss=Dar+Al+Taqwa+Hotel",
    progress: 100,
    status: "مكتمل",
    startDate: "2010م",
    endDate: "2018م",
    durationYears: 8,
    ownerEntity: "دار التقوى",
    executorEntity: "دار التقوى للفندقة",
    area: "",
    areaUnit: "",
    lng: 39.6001,
    lat: 24.4708,
    images: [
      "https://images.unsplash.com/photo-1542314831-068e97eabc1f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "sofitel-shahd-al-madinah",
    name: "صوفيتل شهد المدينة",
    name_en: "Sofitel Shahd Al Madinah",
    category: "فندقي",
    description:
      "فندق صوفيتل شهد المدينة يوفر تجربة فندقية راقية في المدينة المنورة، مع خدمات متعددة ومرافق حديثة تليق بالعناية بالزوار والضيوف.",
    description_en:
      "Sofitel Shahd Al Madinah provides a premium hotel experience in Madinah with diverse services and modern facilities designed to meet the needs of visiting guests.",
    visitor_description:
      "فندق فاخر ومريح يُبرز طابع المدينة في تجربة إقامة أنيقة تجمع بين الراحة والاهتمام بالتفاصيل.",
    visitor_description_en:
      "A refined and comfortable hotel that captures the atmosphere of the city through a stylish stay with attention to detail and guest comfort.",
    main_features: ["فاخر", "مناسب للضيوف", "خدمات متكاملة", "موقع جيد"],
    main_features_en: ["Luxury", "Guest-friendly", "Complete services", "Good location"],
    services: ["إقامة", "مطاعم", "مركز صحي", "خدمة غرفة"],
    services_en: ["Accommodation", "Restaurants", "Wellness center", "Room service"],
    project_importance: ["يساهم في رفع جودة الخدمات الفندقية", "يوفر تجربة ضيافة راقية"],
    project_importance_en: [
      "Contributes to elevated hotel standards",
      "Offers a premium hospitality experience",
    ],
    official_url: "https://www.sofitel-madinah.com/",
    booking_url: "https://www.booking.com/searchresults.html?ss=Sofitel+Shahd+Al+Madinah",
    progress: 100,
    status: "مكتمل",
    startDate: "2012م",
    endDate: "2019م",
    durationYears: 7,
    ownerEntity: "Accor",
    executorEntity: "Sofitel",
    area: "",
    areaUnit: "",
    lng: 39.5852,
    lat: 24.4727,
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "madinah-hilton",
    name: "هيلتون المدينة",
    name_en: "Madinah Hilton",
    category: "فندقي",
    description:
      "فندق هيلتون المدينة يعد أحد أهم الفنادق في المدينة المنورة، ويُعرف بخدماته الراقية وتقديم تجربة إقامة مناسبة للحجاج والزوار.",
    description_en:
      "Madinah Hilton is one of the key hotels in Madinah, recognized for its premium services and comfortable accommodation for pilgrims and visitors.",
    visitor_description:
      "ملتقى الراحة والتميز يوفر إقامة أنيقة وتسهيلات واسعة للضيوف القادمين إلى المدينة المنورة.",
    visitor_description_en:
      "A blend of comfort and excellence offering an elegant stay and broad conveniences for visitors coming to Madinah.",
    main_features: ["علامة Hilton", "خدمة عالمية", "إقامة مريحة", "نقطة اتصال قوية"],
    main_features_en: ["Hilton brand", "Global service", "Comfortable stay", "Strong connectivity"],
    services: ["إقامة", "مطاعم", "صالون", "خدمة نقل"],
    services_en: ["Accommodation", "Restaurants", "Salon", "Transport"],
    project_importance: ["يلبي احتياجات السياحة الدينية", "يخدم السياح والزوار بكفاءة"],
    project_importance_en: [
      "Meets religious tourism needs",
      "Serves tourists and visitors efficiently",
    ],
    official_url: "https://www.hilton.com/en/hotels/medahhh-hilton-madinah/",
    booking_url: "https://www.booking.com/searchresults.html?ss=Madinah+Hilton",
    progress: 100,
    status: "مكتمل",
    startDate: "2010م",
    endDate: "2019م",
    durationYears: 9,
    ownerEntity: "Hilton Hotels",
    executorEntity: "Hilton Worldwide",
    area: "",
    areaUnit: "",
    lng: 39.5838,
    lat: 24.4689,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "crowne-plaza-madinah",
    name: "كراون بلازا المدينة",
    name_en: "Crowne Plaza Madinah",
    category: "فندقي",
    description:
      "فندق كراون بلازا المدينة يقدم تجربة إقامة أنيقة في المدينة المنورة، مع خدمات ممتازة ومرافق حديثة تستوعب احتياجات الزوار والبنود السياحية المتعددة.",
    description_en:
      "Crowne Plaza Madinah offers a refined stay in Madinah with excellent services and modern facilities for varied visitor needs.",
    visitor_description:
      "فندق يحظى بسمعة جيدة في الضيافة، ويقدم تجربة إقامة مناسبة للضيوف الباحثين عن الراحة والأمان.",
    visitor_description_en:
      "A well-regarded hotel that provides a comfortable and secure stay for guests seeking convenience and quality hospitality.",
    main_features: ["معايير عالمية", "خدمة مميزة", "غرف واسعة", "مرافق مناسبة"],
    main_features_en: [
      "Global standards",
      "Outstanding service",
      "Spacious rooms",
      "Suitable facilities",
    ],
    services: ["إقامة", "مطاعم", "قاعة اجتماعات", "خدمة صف السيارات"],
    services_en: ["Accommodation", "Restaurants", "Meeting hall", "Valet service"],
    project_importance: ["يدعم السياحة ذات الجودة", "يوفر إقامات مناسبة للزوار المتنوعين"],
    project_importance_en: [
      "Supports quality tourism",
      "Provides suitable accommodation for diverse visitors",
    ],
    official_url: "https://www.ihg.com/crowneplaza/hotels/us/en/madinah/medcp/hoteldetail",
    booking_url: "https://www.booking.com/searchresults.html?ss=Crowne+Plaza+Madinah",
    progress: 100,
    status: "مكتمل",
    startDate: "2012م",
    endDate: "2020م",
    durationYears: 8,
    ownerEntity: "IHG",
    executorEntity: "Crowne Plaza",
    area: "",
    areaUnit: "",
    lng: 39.5924,
    lat: 24.4681,
    images: [
      "https://images.unsplash.com/photo-1542314831-068e97eabc1f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "madinah-marriott-hotel",
    name: "فندق ماريوت المدينة",
    name_en: "Madinah Marriott Hotel",
    category: "فندقي",
    description:
      "فندق ماريوت المدينة يوفر فرصة إقامة مريحة مع خدمات عالمية، ويُعد من الخيارات المميزة للزوار القادمين إلى المدينة المنورة.",
    description_en:
      "Madinah Marriott Hotel provides a comfortable stay with global standards and is a distinguished option for visitors to Madinah.",
    visitor_description:
      "فندق راقٍ ومريح يجمع بين الراحة المنزلية والخدمات الفندقية الاحترافية في قلب المدينة.",
    visitor_description_en:
      "A premium and comfortable hotel combining home-like comfort with professional hospitality services in the heart of the city.",
    main_features: ["علامة ماريوت", "خدمة عالمية", "غرف عصرية", "موقع مركزي"],
    main_features_en: ["Marriott brand", "Global service", "Modern rooms", "Central location"],
    services: ["إقامة", "مطاعم", "مكتبة", "خدمة غرف"],
    services_en: ["Accommodation", "Restaurants", "Library", "Room service"],
    project_importance: ["يخدم السياح والزوار بكفاءة", "يدعم نمو خدمات الضيافة"],
    project_importance_en: [
      "Serves tourists and visitors efficiently",
      "Supports hospitality service growth",
    ],
    official_url: "https://www.marriott.com/en-us/hotels/medmc-madinah-marriott-hotel/overview/",
    booking_url: "https://www.booking.com/searchresults.html?ss=Madinah+Marriott+Hotel",
    progress: 100,
    status: "مكتمل",
    startDate: "2011م",
    endDate: "2019م",
    durationYears: 8,
    ownerEntity: "Marriott International",
    executorEntity: "Marriott",
    area: "",
    areaUnit: "",
    lng: 39.5825,
    lat: 24.4732,
    images: [
      "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "taiba-madinah-hotel",
    name: "طيبة المدينة فندق",
    name_en: "Taiba Madinah Hotel",
    category: "فندقي",
    description:
      "فندق طيبة المدينة يقدم خدمات إقامة مناسبة للزوار في المدينة المنورة، مع مرافق عملية وتوازن جيد بين السعر وجودة الخدمة.",
    description_en:
      "Taiba Madinah Hotel offers practical accommodation for visitors with functional amenities and a good balance between value and service quality.",
    visitor_description:
      "إقامة عملية ومريحة تناسب الزوار الذين يريدون خدمات موثوقة وبيئة مناسبة في المدينة المنورة.",
    visitor_description_en:
      "A practical and comfortable stay suited to visitors seeking reliable services and a convenient environment in Madinah.",
    main_features: ["مناسب للزوار", "خدمة ثقة", "تجهيزات عملية", "قرب من المدينة"],
    main_features_en: [
      "Visitor-friendly",
      "Trustworthy service",
      "Functional setup",
      "Close to city access",
    ],
    services: ["إقامة", "خدمة استقبال", "مطاعم", "موقف للمركارات"],
    services_en: ["Accommodation", "Reception", "Restaurant", "Vehicle parking"],
    project_importance: ["يوفر بديلًا عمليًا للزوار", "يدعم حركة السياحة المؤقتة"],
    project_importance_en: [
      "Provides a practical alternative for visitors",
      "Supports short-stay tourism",
    ],
    official_url: "https://www.taibahotel.com/",
    booking_url: "https://www.booking.com/searchresults.html?ss=Taiba+Madinah+Hotel",
    progress: 100,
    status: "مكتمل",
    startDate: "2014م",
    endDate: "2022م",
    durationYears: 8,
    ownerEntity: "مجموعة طيبة",
    executorEntity: "Taiba Group",
    area: "",
    areaUnit: "",
    lng: 39.5979,
    lat: 24.4714,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

export const hotelProjects: Project[] = dedupeHotels(hotelSeedProjects);

const DELETED_LOCAL_PROJECTS_KEY = "madar_deleted_project_ids";

export function getDeletedProjectIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(DELETED_LOCAL_PROJECTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markProjectDeleted(projectId: string) {
  if (!projectId || typeof window === "undefined") return;

  const deleted = new Set(getDeletedProjectIds());
  deleted.add(projectId);
  window.localStorage.setItem(DELETED_LOCAL_PROJECTS_KEY, JSON.stringify([...deleted]));
}

export function isProjectDeletedLocally(projectId: string): boolean {
  return Boolean(projectId && getDeletedProjectIds().includes(projectId));
}

// User-added projects (client-side only, localStorage)
const USER_KEY = "madar_user_projects";

export function getUserProjects(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(USER_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getUserProjectById(id: string): Project | undefined {
  return getUserProjects().find((p) => p.id === id);
}

export function saveUserProject(p: Project) {
  if (typeof window === "undefined") return;
  const list = getUserProjects();
  list.push(p);
  window.localStorage.setItem(USER_KEY, JSON.stringify(list));
}

export function removeUserProject(projectId: string) {
  if (typeof window === "undefined") return;
  const list = getUserProjects().filter((project) => project.id !== projectId);
  window.localStorage.setItem(USER_KEY, JSON.stringify(list));
}

export function getAllProjects(): Project[] {
  return consolidateProjects(
    [...projects, ...restaurantCafeProjects, ...hotelProjects, ...getUserProjects()].filter(
      (project) => !isProjectDeletedLocally(project.id),
    ),
  ).map((project) => ({
    ...project,
    ...PROJECT_STORIES[project.id],
    ...PROJECT_VISIT_INFO[project.id],
  }));
}
