export interface ReviewData {
  overall: number; // out of 5
  count: number;
  breakdown: { label: string; value: number }[]; // label in Arabic
  comments: string[];
}

export const reviewsByProjectId: Record<string, ReviewData> = {
  // 1. قطار الحرمين
  "haramain-station": {
    overall: 4.8,
    count: 156,
    breakdown: [
      { label: "سهولة الوصول", value: 4.9 },
      { label: "قابلية المشي", value: 4.6 },
      { label: "جودة الخدمة", value: 4.9 },
      { label: "الراحة", value: 4.8 },
    ],
    comments: [
      "الموقع ممتاز وسهل الوصول، والتجربة كانت مريحة.",
      "التجربة مريحة والوصول إلى المحطة سهل.",
      "خيار ممتاز للتنقل بين المدن بسرعة وراحة.",
    ],
  },

  // 2. مشروع تطوير بئر غرس التاريخي
  "bir-ghars": {
    overall: 4.7,
    count: 84,
    breakdown: [
      { label: "سهولة الوصول", value: 4.5 },
      { label: "قابلية المشي", value: 4.6 },
      { label: "جودة الموقع", value: 4.8 },
      { label: "التجربة التاريخية", value: 4.9 },
    ],
    comments: [
      "موقع تاريخي مميز وتجربة جميلة للتعرف على أحد المعالم التاريخية في المدينة.",
      "المكان جميل وتجربة المشي فيه ممتعة.",
      "موقع مناسب للزوار المهتمين بالمعالم التاريخية.",
    ],
  },

  // 3. فندق دار التقوى
  "dar-al-taqwa-hotel": {
    overall: 4.8,
    count: 213,
    breakdown: [
      { label: "سهولة الوصول", value: 4.9 },
      { label: "قابلية المشي", value: 4.7 },
      { label: "جودة الفندق", value: 4.9 },
      { label: "الخدمات", value: 4.8 },
    ],
    comments: [
      "موقع ممتاز وقريب من المسجد النبوي، والوصول إلى الأماكن المحيطة سهل.",
      "الموقع مميز جدًا وقابلية المشي ممتازة.",
      "خيار مناسب للزوار بسبب سهولة الوصول والموقع.",
    ],
  },

  // 4. فندق أنوار المدينة موفنبيك
  "anwar-al-madinah-moevenpick-hotel": {
    overall: 4.6,
    count: 178,
    breakdown: [
      { label: "سهولة الوصول", value: 4.8 },
      { label: "قابلية المشي", value: 4.7 },
      { label: "جودة الفندق", value: 4.6 },
      { label: "الخدمات", value: 4.5 },
    ],
    comments: [
      "الموقع قريب من المسجد النبوي والوصول إليه سهل، خاصة لكبار السن.",
      "الغرف مريحة والخدمات جيدة، مع قرب واضح من المطاعم والمرافق المحيطة.",
      "تجربة مناسبة للزوار، والموقع المركزي يجعل التنقل إلى الأماكن المهمة مريحًا.",
    ],
  },

  // 5. ذا أوبروي المدينة
  "the-oberoi-madina": {
    overall: 4.9,
    count: 187,
    breakdown: [
      { label: "سهولة الوصول", value: 4.8 },
      { label: "قابلية المشي", value: 4.6 },
      { label: "جودة الفندق", value: 5.0 },
      { label: "الخدمات", value: 4.9 },
    ],
    comments: [
      "موقع مميز جدًا وخيار مناسب للزوار الباحثين عن الراحة والقرب من المسجد النبوي.",
      "الوصول للموقع سهل جدًا والموقع ممتاز.",
      "تجربة مريحة وموقع مناسب للزوار.",
    ],
  },
};

reviewsByProjectId["8a3d6c0f-5b6f-492f-a1a8-14597541df19"] = reviewsByProjectId["dar-al-taqwa-hotel"];

export function getReviewsForProject(id: string) {
  return reviewsByProjectId[id];
}
