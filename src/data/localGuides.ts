export interface LocalGuide {
  id: string;
  nameAr: string;
  nameEn: string;
  gender: "female" | "male";
  titleAr: string;
  titleEn: string;
  bioAr: string;
  bioEn: string;
  specialtiesAr: string[];
  specialtiesEn: string[];
  languagesAr: string[];
  languagesEn: string[];
  experienceTypesAr: string[];
  experienceTypesEn: string[];
  availableDurationsAr: string[];
  availableDurationsEn: string[];
  priceFrom?: number;
  rating?: number;
  reviewCount?: number;
  isAvailable?: boolean;
}

export const localGuides: LocalGuide[] = [
  {
    id: "nada-mohammed",
    nameAr: "ندى محمد",
    nameEn: "Nada Mohammed",
    gender: "female",
    titleAr: "جولات الذاكرة والتجارب المحلية",
    titleEn: "Heritage & Local Experiences",
    bioAr:
      "تهتم بتعريف الزوار بذاكرة المدينة ومواقعها التاريخية، وتفضل تقديم جولات تربط قصة المكان بالتجربة المحلية.",
    bioEn:
      "She enjoys introducing visitors to Madinah's memory and historic places through tours connecting place stories with local experiences.",
    specialtiesAr: ["التاريخ والتراث", "المواقع التاريخية", "تجارب محلية"],
    specialtiesEn: ["History & heritage", "Historic places", "Local experiences"],
    languagesAr: ["العربية", "الإنجليزية"],
    languagesEn: ["Arabic", "English"],
    experienceTypesAr: ["جولة تراثية", "قصة المكان"],
    experienceTypesEn: ["Heritage tour", "Place stories"],
    availableDurationsAr: ["ساعتان", "نصف يوم"],
    availableDurationsEn: ["2 hours", "Half day"],
    priceFrom: 180,
    isAvailable: true,
  },
  {
    id: "sarah-ahmed",
    nameAr: "سارة أحمد",
    nameEn: "Sarah Ahmed",
    gender: "female",
    titleAr: "تجارب عائلية ومذاقات محلية",
    titleEn: "Family Tours & Local Flavors",
    bioAr:
      "تركز جولاتها على التجارب المناسبة للعائلات، وتساعد الزوار على اكتشاف المطاعم والمقاهي والأماكن المحلية بهدوء.",
    bioEn:
      "Her tours focus on family-friendly experiences and relaxed discovery of local restaurants, cafés, and places.",
    specialtiesAr: ["جولات عائلية", "المطاعم والمقاهي", "تجارب محلية"],
    specialtiesEn: ["Family tours", "Restaurants & cafés", "Local experiences"],
    languagesAr: ["العربية", "الإنجليزية"],
    languagesEn: ["Arabic", "English"],
    experienceTypesAr: ["جولة عائلية", "تجربة مذاقات"],
    experienceTypesEn: ["Family tour", "Food experience"],
    availableDurationsAr: ["3 ساعات", "نصف يوم"],
    availableDurationsEn: ["3 hours", "Half day"],
    priceFrom: 200,
    isAvailable: true,
  },
  {
    id: "remas-hadi",
    nameAr: "ريماس هادي",
    nameEn: "Remas Hadi",
    gender: "female",
    titleAr: "جولات تصوير وأحياء المدينة",
    titleEn: "Photography & Neighborhood Walks",
    bioAr:
      "تفضل تقديم تجارب تركز على زوايا التصوير واستكشاف الأحياء والأماكن الحديثة ضمن إيقاع مريح للزائر.",
    bioEn:
      "She prefers experiences centered on photography viewpoints, neighborhoods, and modern places at a relaxed pace.",
    specialtiesAr: ["التصوير", "استكشاف الأحياء", "أماكن حديثة"],
    specialtiesEn: ["Photography", "Neighborhoods", "Modern places"],
    languagesAr: ["العربية"],
    languagesEn: ["Arabic"],
    experienceTypesAr: ["جولة تصوير", "جولة مشي"],
    experienceTypesEn: ["Photography tour", "Walking tour"],
    availableDurationsAr: ["ساعتان", "3 ساعات"],
    availableDurationsEn: ["2 hours", "3 hours"],
    priceFrom: 170,
    isAvailable: false,
  },
  {
    id: "layan-khalid",
    nameAr: "ليان خالد",
    nameEn: "Layan Khalid",
    gender: "female",
    titleAr: "قصص المكان والجولات القصيرة",
    titleEn: "Place Stories & Short Tours",
    bioAr: "تهتم بتقديم جولات قصيرة تعرّف الزائر بقصة المكان وتفاصيله دون الحاجة إلى برنامج طويل.",
    bioEn:
      "She focuses on concise tours that introduce visitors to a place's story and details without requiring a long itinerary.",
    specialtiesAr: ["التراث", "قصة المكان", "جولات قصيرة"],
    specialtiesEn: ["Heritage", "Place stories", "Short tours"],
    languagesAr: ["العربية", "الإنجليزية"],
    languagesEn: ["Arabic", "English"],
    experienceTypesAr: ["جولة قصيرة", "جولة قصصية"],
    experienceTypesEn: ["Short tour", "Story tour"],
    availableDurationsAr: ["ساعة", "ساعتان"],
    availableDurationsEn: ["1 hour", "2 hours"],
    priceFrom: 140,
    isAvailable: true,
  },
  {
    id: "abdulrahman-saad",
    nameAr: "عبدالرحمن سعد",
    nameEn: "Abdulrahman Saad",
    gender: "male",
    titleAr: "العمارة وتحولات المدينة",
    titleEn: "Architecture & Urban Change",
    bioAr:
      "يهتم بتعريف الزوار بالمشاريع والعمارة والتطوير الحضري، وربطها بصورة المدينة وتجربة التنقل فيها.",
    bioEn:
      "He introduces visitors to projects, architecture, and urban development while connecting them to the city's wider experience.",
    specialtiesAr: ["العمارة والتطوير الحضري", "المشاريع", "استكشاف المدينة"],
    specialtiesEn: ["Architecture & urban development", "Projects", "City exploration"],
    languagesAr: ["العربية", "الإنجليزية"],
    languagesEn: ["Arabic", "English"],
    experienceTypesAr: ["جولة عمرانية", "جولة مشاريع"],
    experienceTypesEn: ["Architecture tour", "Project tour"],
    availableDurationsAr: ["3 ساعات", "نصف يوم"],
    availableDurationsEn: ["3 hours", "Half day"],
    priceFrom: 210,
    isAvailable: true,
  },
  {
    id: "faisal-omar",
    nameAr: "فيصل عمر",
    nameEn: "Faisal Omar",
    gender: "male",
    titleAr: "جولات شاملة للزائر",
    titleEn: "Complete Visitor Experiences",
    bioAr:
      "يفضل تقديم تجارب متنوعة تجمع الأماكن التاريخية ومحطات المدينة الحديثة بما يناسب الزائر في رحلته الأولى.",
    bioEn:
      "He prefers varied experiences combining historic places with modern Madinah stops, especially for first-time visitors.",
    specialtiesAr: ["جولات شاملة", "الأماكن التاريخية", "تجارب الزائر"],
    specialtiesEn: ["Complete tours", "Historic places", "Visitor experiences"],
    languagesAr: ["العربية", "الإنجليزية"],
    languagesEn: ["Arabic", "English"],
    experienceTypesAr: ["جولة شاملة", "جولة للزيارة الأولى"],
    experienceTypesEn: ["Complete tour", "First-visit tour"],
    availableDurationsAr: ["نصف يوم", "يوم كامل"],
    availableDurationsEn: ["Half day", "Full day"],
    priceFrom: 260,
    isAvailable: true,
  },
];
