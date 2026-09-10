export type AssistantKnowledgeEntry = {
  question: string;
  keywords: string[];
  answer: string;
  projectId?: string;
};

export type AssistantReply = {
  answer: string;
  projectId?: string;
};

export const cityAssistantKnowledge: AssistantKnowledgeEntry[] = [
  {
    question: "ما الخدمات المتاحة للزائر؟",
    keywords: [
      "مرشد محلي",
      "مرشدك المحلي",
      "معلومات الزيارة",
      "إمكانية الوصول",
      "الأطفال",
      "أوقات الزيارة",
      "local guide",
      "visit information",
      "accessibility",
    ],
    answer:
      "توفر مدار خدمة «مرشدك المحلي» التجريبية لاستعراض مرشدين وطلب تجربة أولية دون دفع، كما تعرض «معلومات الزيارة» في ملفات الأماكن، ومنها إمكانية الوصول وملاءمة الأطفال وأوقات الزيارة عند توفر معلومات موثوقة.",
  },
  {
    question: "ما هو مشروع رؤى المدينة؟",
    keywords: ["رؤى المدينة", "مشروع", "تطوير", "مدينة", "رؤية"],
    answer:
      "مشروع رؤى المدينة هو أحد المشاريع التنموية الكبرى في المدينة المنورة، ويهدف إلى تعزيز الطاقة الاستيعابية للزوار وتطوير منظومة حضرية وفندقية متكاملة بالقرب من المسجد النبوي.",
  },
  {
    question: "ما أفضل الفنادق القريبة من المسجد النبوي؟",
    keywords: ["فندق", "فنادق", "قريب", "المسجد النبوي", "إقامة", "hotel"],
    answer:
      "يمكنك استكشاف مجموعة من الفنادق القريبة من المسجد النبوي مثل:\n- ذا أوبروي المدينة\n- أنوار المدينة موفنبيك\n- بولمان زمزم المدينة\n- دار التقوى\n\nيمكنك عرض تفاصيل كل فندق من خلال المنصة.",
    projectId: "the-oberoi-madina",
  },
  {
    question: "اقترح أماكن للزيارة في المدينة",
    keywords: ["أماكن", "زيارة", "مدينة", "أماكن للزيارة", "tourism", "معالم"],
    answer:
      "يمكنك زيارة:\n- المسجد النبوي\n- مسجد قباء\n- جبل أحد\n- متحف السيرة النبوية\n- محطة الحجاز",
  },
  {
    question: "ما المشاريع السياحية؟",
    keywords: ["مشاريع سياحية", "سياحية", "مشاريع", "tourist", "تراث", "سياحة"],
    answer:
      "في منصة مدار، توجد مشاريع سياحية وتراثية مثل تطوير المواقع التاريخية، الحزم السياحية، والمشروعات المرتبطة بالزيارة والضيافة في المدينة المنورة.",
  },
  {
    question: "ما أهم معالم المدينة؟",
    keywords: ["معالم", "مدينة", "أهم", "مواقع", "لزيارة"],
    answer:
      "من أهم معالم المدينة المنورة: المسجد النبوي الشريف، مسجد قباء، جبل أحد، متحف السيرة النبوية، ومواقع التراث والضيافة المحيطة بالحرم.",
  },
  {
    question: "ما المشاريع الجديدة؟",
    keywords: ["مشاريع جديدة", "جديدة", "حديثة", "مشاريع", "تحديث"],
    answer:
      "تشمل المشاريع الجديدة في منصة مدار مشاريع تطويرية في مجالات الضيافة، النقل، الخدمات، والبيئة العمرانية، مع تركيز على دعم الزوار والحجاج والارتقاء بالمدينة.",
  },
  {
    question: "ما الفنادق المتوفرة؟",
    keywords: ["فنادق", "فندق", "متوفرة", "إقامة", "hotel", "lodging"],
    answer:
      "تتوفر في المدينة المنورة مجموعة متنوعة من الفنادق مثل:\n- ذا أوبروي المدينة\n- أنوار المدينة موفنبيك\n- بولمان زمزم المدينة\n- كراون بلازا المدينة\n- فندق ماريوت المدينة",
    projectId: "the-oberoi-madina",
  },
  {
    question: "ما المشروع الأكثر شهرة في المدينة؟",
    keywords: ["مشروع", "شهرة", "أشهر", "معروف", "مدينة"],
    answer:
      "من أبرز المشاريع المعروفة في المدينة المنورة هي مشاريع التوسع السياحي والفندقي إلى جانب تطوير الخدمات والمرور حول المسجد النبوي الشريف.",
  },
  {
    question: "ما هو أفضل مشروع سياحي في المدينة؟",
    keywords: ["أفضل", "مشروع سياحي", "مدينة", "سياحة", "زيارة"],
    answer:
      "من المشاريع السياحية والأثرية المميزة في المدينة المنورة: تطوير المواقع التاريخية، البنية السياحية حول المسجد النبوي، والمشاريع المرتبطة بالزيارة والضيافة.",
  },
  {
    question: "كيف أستكشف المدينة؟",
    keywords: ["استكشف", "مدينة", "رحلة", "زيارة", "خريطة", "مواقع"],
    answer:
      "يمكنك استخدام خريطة المدينة، عرض المسارات المقترحة، واستعراض المشاريع والفنادق المتاحة داخل منصة مدار لتحقيق تجربة زيارة منظمة ومريحة.",
  },
  {
    question: "ما هي المشاريع الحالية؟",
    keywords: ["مشاريع الحالية", "حالية", "مشاريع", "الآن"],
    answer:
      "في منصة مدار، يتم متابعة مشاريع متعددة في مجالات التطوير العمراني، النقل، الخدمات الصحية، السياحة والتراث، والضيافة داخل المدينة المنورة.",
  },
  {
    question: "ما خدمات المدينة؟",
    keywords: ["خدمات", "مدينة", "سياحة", "إقامة", "خدمات المدينة"],
    answer:
      "تقدم المدينة خدمات متكاملة للزوار تشمل الإقامة الفندقية، النقل، الخدمات الصحية، السياحة، والمرافق الدينية والثقافية.",
  },
];

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ");
}

export function getCityAssistantReply(input: string): AssistantReply {
  const normalizedInput = normalizeText(input);

  if (!normalizedInput) {
    return {
      answer:
        "يمكنني مساعدتك في معرفة مشاريع المدينة المنورة والفنادق والمعالم السياحية. جرّب سؤالًا مثل: ما المشاريع السياحية؟ أو ما أفضل الفنادق القريبة من المسجد النبوي؟",
    };
  }

  let bestMatch: AssistantKnowledgeEntry | undefined;
  let bestScore = 0;

  for (const entry of cityAssistantKnowledge) {
    let score = 0;
    const normalizedQuestion = normalizeText(entry.question);
    const normalizedKeywords = entry.keywords.map(normalizeText);

    if (
      normalizedQuestion.includes(normalizedInput) ||
      normalizedInput.includes(normalizedQuestion)
    ) {
      score += 80;
    }

    for (const keyword of normalizedKeywords) {
      if (!keyword) continue;
      if (normalizedInput.includes(keyword)) {
        score += 25;
      }
    }

    const questionTokens = normalizedQuestion.split(" ").filter(Boolean);
    const inputTokens = normalizedInput.split(" ").filter(Boolean);
    const overlap = questionTokens.filter((token) => inputTokens.includes(token)).length;
    score += overlap * 8;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (!bestMatch || bestScore <= 10) {
    return {
      answer:
        "يمكنني مساعدتك في معلومات المدينة المنورة، مثل مشاريع التنمية، الفنادق، والمعالم السياحية. جرّب أحد الأسئلة التالية:\n- ما أهم معالم المدينة؟\n- ما المشاريع السياحية؟\n- ما أفضل الفنادق القريبة من المسجد النبوي؟",
    };
  }

  return {
    answer: bestMatch.answer,
    projectId: bestMatch.projectId,
  };
}
