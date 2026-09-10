import type { Project, VisitHours } from "./projects";

// Illustrative university-prototype data. These values are not asserted as verified operating facts.
type DemoVisitInfo = Pick<
  Project,
  | "accessibility"
  | "childrenPolicy"
  | "visitOpeningHours"
  | "visitNotesAr"
  | "visitNotesEn"
  | "reservationRequired"
  | "entryFee"
  | "parkingAvailable"
>;

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;
const everyDay = (open: string, close: string): VisitHours[] =>
  days.map((day) => ({ day, open, close }));
const allDay = (): VisitHours[] => everyDay("00:00", "24:00");
const byDay = (
  values: Record<(typeof days)[number], [string, string] | { ar: string; en: string }>,
): VisitHours[] =>
  days.map((day) => {
    const value = values[day];
    return Array.isArray(value)
      ? { day, open: value[0], close: value[1] }
      : { day, noteAr: value.ar, noteEn: value.en };
  });

const base = (hours: VisitHours[], overrides: Partial<DemoVisitInfo> = {}): DemoVisitInfo => ({
  accessibility: "full",
  childrenPolicy: "allowed",
  visitOpeningHours: hours,
  parkingAvailable: true,
  reservationRequired: false,
  entryFee: "free",
  ...overrides,
});

export const PROJECT_VISIT_INFO: Record<string, DemoVisitInfo> = {
  "taqmira-neighborhood": base(
    byDay({
      sunday: ["08:00", "23:30"],
      monday: ["08:00", "23:30"],
      tuesday: ["08:00", "23:30"],
      wednesday: ["08:00", "23:30"],
      thursday: ["08:00", "00:30"],
      friday: ["13:00", "00:30"],
      saturday: ["08:00", "00:30"],
    }),
    {
      accessibility: "partial",
      visitNotesAr: ["قد تختلف أوقات العمل خلال المواسم والإجازات."],
      visitNotesEn: ["Opening hours may vary during seasonal periods and holidays."],
    },
  ),
  "bait-saaf": base(
    byDay({
      sunday: ["13:00", "23:30"],
      monday: ["13:00", "23:30"],
      tuesday: ["13:00", "23:30"],
      wednesday: ["13:00", "23:30"],
      thursday: ["13:00", "00:30"],
      friday: ["13:00", "00:30"],
      saturday: ["13:00", "00:30"],
    }),
    {
      accessibility: "partial",
      visitNotesAr: ["يُنصح بالتأكد من توفر الجلسات خلال أوقات الذروة."],
      visitNotesEn: ["Checking seating availability during peak periods is recommended."],
    },
  ),
  "row-farm": base(
    byDay({
      sunday: ["16:00", "00:00"],
      monday: ["16:00", "00:00"],
      tuesday: ["16:00", "00:00"],
      wednesday: ["16:00", "00:00"],
      thursday: ["16:00", "01:00"],
      friday: ["16:00", "01:00"],
      saturday: ["16:00", "01:00"],
    }),
    {
      accessibility: "partial",
      visitNotesAr: ["تتميز التجربة بجلسات خارجية، وقد تتأثر بعض المساحات بحالة الطقس."],
      visitNotesEn: [
        "The experience includes outdoor seating, and some areas may be affected by weather conditions.",
      ],
    },
  ),
  "soul-specialty-coffee": base(
    byDay({
      sunday: ["07:00", "00:00"],
      monday: ["07:00", "00:00"],
      tuesday: ["07:00", "00:00"],
      wednesday: ["07:00", "00:00"],
      thursday: ["07:00", "00:00"],
      friday: ["13:00", "01:00"],
      saturday: ["07:00", "01:00"],
    }),
  ),
  "duo-bakery-coffee": base(
    byDay({
      sunday: ["07:00", "23:30"],
      monday: ["07:00", "23:30"],
      tuesday: ["07:00", "23:30"],
      wednesday: ["07:00", "23:30"],
      thursday: ["07:00", "23:30"],
      friday: ["13:00", "00:30"],
      saturday: ["07:00", "00:30"],
    }),
    {
      visitNotesAr: ["قد يختلف توفر بعض المخبوزات خلال اليوم."],
      visitNotesEn: ["Availability of some baked items may vary throughout the day."],
    },
  ),
  "into-sushi": base(
    byDay({
      sunday: ["13:00", "23:30"],
      monday: ["13:00", "23:30"],
      tuesday: ["13:00", "23:30"],
      wednesday: ["13:00", "23:30"],
      thursday: ["13:00", "00:30"],
      friday: ["16:00", "00:30"],
      saturday: ["13:00", "00:30"],
    }),
    { accessibility: "partial" },
  ),
  "hospital-nga": base(allDay(), {
    childrenPolicy: "conditional",
    visitNotesAr: ["تخضع الزيارة لتعليمات المنشأة وأوقات الأقسام."],
    visitNotesEn: ["Visits are subject to facility and department guidance."],
  }),
  "haramain-station": base(
    byDay(
      Object.fromEntries(
        days.map((day) => [
          day,
          { ar: "متاح حسب مواعيد الرحلات", en: "Available according to train schedules" },
        ]),
      ) as Record<(typeof days)[number], { ar: string; en: string }>,
    ),
    {
      visitNotesAr: ["يتوفر الدخول حسب مواعيد الرحلات."],
      visitNotesEn: ["Access is available according to train schedules."],
    },
  ),
  "airport-mma": base(allDay()),
  mughaisilah: base(everyDay("08:00", "22:00"), { accessibility: "partial" }),
  "bir-alfaqir": base(everyDay("08:00", "21:00"), {
    accessibility: "partial",
    parkingAvailable: "unknown",
  }),
  "bir-ghars": base(everyDay("08:00", "21:00"), {
    accessibility: "partial",
    parkingAvailable: "unknown",
  }),
  "the-oberoi-madina": base(allDay()),
  "anwar-al-madinah-moevenpick-hotel": base(allDay()),
  "pullman-zamzam-madina": base(allDay()),
  "shaza-al-madina": base(allDay()),
  "dar-al-taqwa-hotel": base(allDay()),
  "sofitel-shahd-al-madinah": base(allDay()),
  "madinah-hilton": base(allDay()),
  "crowne-plaza-madinah": base(allDay()),
  "madinah-marriott-hotel": base(allDay()),
  "taiba-madinah-hotel": base(allDay()),
};
