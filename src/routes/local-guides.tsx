import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Languages,
  MapPin,
  SlidersHorizontal,
  UserRound,
  X,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { localGuides, type LocalGuide } from "@/data/localGuides";
import { getProjectById } from "@/data/projects";
import { getLocale, type Locale } from "@/lib/i18n";

export const Route = createFileRoute("/local-guides")({
  validateSearch: (search: Record<string, unknown>) => ({
    place: typeof search.place === "string" ? search.place : undefined,
  }),
  component: LocalGuidesPage,
  head: () => ({
    meta: [
      { title: "مرشدك المحلي — مدار" },
      { name: "description", content: "مرشدون محليون لاكتشاف المدينة المنورة بعيون أهلها" },
    ],
  }),
});

const ui = {
  ar: {
    eyebrow: "تجربة أقرب للمدينة",
    title: "اكتشف المدينة بعيون أهلها",
    description:
      "استعن بمرشد محلي يصاحبك في جولة تناسب اهتماماتك ووقتك، ويعرّفك بأماكن المدينة وقصصها وتفاصيلها.",
    how: "كيف تعمل الخدمة؟",
    steps: [
      ["اختر مرشدك", "تعرّف على المرشدين واختر من يناسب اهتماماتك."],
      ["حدد تجربتك", "اختر نوع الجولة والمدة التي تناسب زيارتك."],
      ["أرسل طلبك", "أرسل طلب مرشد لمراجعة تفاصيل التجربة."],
    ],
    specialty: "التخصص",
    language: "اللغة",
    duration: "مدة الجولة",
    all: "الكل",
    available: "متاح الآن",
    guides: "المرشدون المتاحون",
    from: "ابتداءً من",
    currency: "ر.س",
    profile: "عرض الملف",
    request: "طلب مرشد",
    unavailable: "غير متاح الآن",
    noResults: "لا توجد نتائج مطابقة للمرشحات الحالية.",
  },
  en: {
    eyebrow: "A More Local Experience",
    title: "Discover Madinah Through Local Eyes",
    description:
      "Explore Madinah with a local guide through an experience tailored to your interests and available time.",
    how: "How Does It Work?",
    steps: [
      ["Choose Your Guide", "Explore available guides and find one that matches your interests."],
      [
        "Choose Your Experience",
        "Select the type and duration of experience that suits your visit.",
      ],
      ["Send a Request", "Send a guide request to review the experience details."],
    ],
    specialty: "Specialty",
    language: "Language",
    duration: "Tour Duration",
    all: "All",
    available: "Available now",
    guides: "Available Guides",
    from: "From",
    currency: "SAR",
    profile: "View Profile",
    request: "Request Guide",
    unavailable: "Currently unavailable",
    noResults: "No guides match the current filters.",
  },
} as const;

function GuideMark({ guide }: { guide: LocalGuide }) {
  const initials = guide.nameEn
    .split(" ")
    .map((part) => part[0])
    .join("");
  return (
    <span
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#b9cfbf] bg-[#edf5ef] text-sm font-bold text-primary"
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

function GuideDialog({
  guide,
  locale,
  mode,
  onClose,
}: {
  guide: LocalGuide;
  locale: Locale;
  mode: "profile" | "request";
  onClose: () => void;
}) {
  const [requesting, setRequesting] = useState(mode === "request");
  const [sent, setSent] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const ar = locale === "ar";
  const name = ar ? guide.nameAr : guide.nameEn;
  const durations = ar ? guide.availableDurationsAr : guide.availableDurationsEn;
  useEffect(() => {
    closeRef.current?.focus();
    const key = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", key);
    };
  }, [onClose]);

  let body;
  if (!requesting) {
    body = (
      <div className="mt-7 space-y-6">
        <p className="leading-8 text-foreground/80">{ar ? guide.bioAr : guide.bioEn}</p>
        <Detail
          title={ar ? "التخصصات" : "Specialties"}
          values={ar ? guide.specialtiesAr : guide.specialtiesEn}
        />
        <Detail
          title={ar ? "اللغات" : "Languages"}
          values={ar ? guide.languagesAr : guide.languagesEn}
        />
        <Detail
          title={ar ? "أنواع التجارب" : "Experience Types"}
          values={ar ? guide.experienceTypesAr : guide.experienceTypesEn}
        />
        <Detail title={ar ? "المدد المتاحة" : "Available Durations"} values={durations} />
        <button onClick={() => setRequesting(true)} className="btn-primary w-full">
          {ui[locale].request}
        </button>
      </div>
    );
  } else if (sent) {
    body = (
      <div
        role="status"
        className="mt-10 rounded-2xl border border-[#a7c4ae] bg-[#edf5ef] p-8 text-center"
      >
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <p className="mt-4 font-bold">
          {ar
            ? "تم إرسال طلبك بنجاح، وسيتم التواصل معك لاستكمال تفاصيل الجولة."
            : "Your request has been sent successfully. You will be contacted to complete the tour details."}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {ar ? "لم يتم تحصيل أي دفعة." : "No payment has been collected."}
        </p>
      </div>
    );
  } else {
    body = (
      <form
        className="mt-7 grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}
      >
        <Field label={ar ? "المرشد المختار" : "Selected Guide"}>
          <input value={name} readOnly className="input-field" />
        </Field>
        <Field label={ar ? "التاريخ المفضل" : "Preferred Date"}>
          <input type="date" required className="input-field" />
        </Field>
        <Field label={ar ? "الوقت المفضل" : "Preferred Time"}>
          <input type="time" required className="input-field" />
        </Field>
        <Field label={ar ? "عدد الزوار" : "Number of Visitors"}>
          <input type="number" min="1" defaultValue="1" required className="input-field" />
        </Field>
        <Field label={ar ? "المدة المفضلة" : "Preferred Duration"}>
          <select required className="input-field">
            <option value="">{ar ? "اختر المدة" : "Choose duration"}</option>
            {durations.map((duration) => (
              <option key={duration}>{duration}</option>
            ))}
          </select>
        </Field>
        <Field label={ar ? "الاهتمامات" : "Interests"}>
          <input
            required
            className="input-field"
            placeholder={ar ? "التراث، التصوير..." : "Heritage, photography..."}
          />
        </Field>
        <Field label={ar ? "ملاحظات اختيارية" : "Optional Notes"} wide>
          <textarea rows={3} className="input-field resize-none" />
        </Field>
        <button className="btn-primary sm:col-span-2">{ar ? "إرسال الطلب" : "Send Request"}</button>
      </form>
    );
  }
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end justify-center bg-[#10271d]/70 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-dialog-title"
        dir={ar ? "rtl" : "ltr"}
        className="relative max-h-[95dvh] w-full overflow-y-auto rounded-t-3xl bg-[#fbf7ed] p-6 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-8"
      >
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute end-4 top-4 rounded-full border bg-white p-2"
          aria-label={ar ? "إغلاق" : "Close"}
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-4 pe-10">
          <GuideMark guide={guide} />
          <div>
            <h2 id="guide-dialog-title" className="text-2xl font-bold">
              {name}
            </h2>
            <p className="text-sm text-muted-foreground">{ar ? guide.titleAr : guide.titleEn}</p>
          </div>
        </div>
        {body}
      </section>
    </div>
  );
}

function Detail({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((v) => (
          <span key={v} className="rounded-full bg-secondary px-3 py-1.5 text-xs">
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}
function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`grid gap-1.5 text-sm font-semibold ${wide ? "sm:col-span-2" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function LocalGuidesPage() {
  const { place } = Route.useSearch();
  const [locale, setLocale] = useState<Locale>(getLocale);
  const [specialty, setSpecialty] = useState("");
  const [language, setLanguage] = useState("");
  const [duration, setDuration] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [dialog, setDialog] = useState<{ guide: LocalGuide; mode: "profile" | "request" } | null>(
    null,
  );
  useEffect(() => {
    const update = () => setLocale(getLocale());
    window.addEventListener("madar-language-change", update);
    return () => window.removeEventListener("madar-language-change", update);
  }, []);
  const ar = locale === "ar";
  const text = ui[locale];
  const selectedPlace = place ? getProjectById(place) : undefined;
  const options = useMemo(
    () => ({
      specialties: [
        ...new Set(localGuides.flatMap((g) => (ar ? g.specialtiesAr : g.specialtiesEn))),
      ],
      languages: [...new Set(localGuides.flatMap((g) => (ar ? g.languagesAr : g.languagesEn)))],
      durations: [
        ...new Set(
          localGuides.flatMap((g) => (ar ? g.availableDurationsAr : g.availableDurationsEn)),
        ),
      ],
    }),
    [ar],
  );
  const filtered = localGuides.filter(
    (g) =>
      (!specialty || (ar ? g.specialtiesAr : g.specialtiesEn).includes(specialty)) &&
      (!language || (ar ? g.languagesAr : g.languagesEn).includes(language)) &&
      (!duration || (ar ? g.availableDurationsAr : g.availableDurationsEn).includes(duration)) &&
      (!availableOnly || g.isAvailable),
  );
  return (
    <div className="min-h-screen bg-background" dir={ar ? "rtl" : "ltr"}>
      <SiteHeader />
      <main>
        <section className="border-b border-[#cbdccf] bg-[#edf5ef]">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
            <p className="text-sm font-bold text-[#9b7933]">{text.eyebrow}</p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{text.title}</h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-9 text-muted-foreground">
              {text.description}
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-3xl font-bold">{text.how}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {text.steps.map((step, i) => (
              <article
                key={step[0]}
                className="rounded-2xl border border-[#d3e1d6] bg-card p-6 text-center"
              >
                <span className="text-sm font-extrabold text-primary">0{i + 1}</span>
                <h3 className="mt-2 text-lg font-bold">{step[0]}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{step[1]}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          {selectedPlace && (
            <div className="mb-5 rounded-2xl border border-[#d7bd76] bg-[#f8f0d9] p-4 text-center text-sm font-semibold">
              {ar
                ? `مرشدون مناسبون لزيارة: ${selectedPlace.name}`
                : `Guides for visiting: ${selectedPlace.name_en || selectedPlace.name}`}
            </div>
          )}
          <div className="rounded-2xl border border-[#cbdccf] bg-[#f3f8f4] p-5">
            <div className="mb-4 flex items-center gap-2 font-bold">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              {ar ? "تصفية المرشدين" : "Filter Guides"}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Filter
                label={text.specialty}
                value={specialty}
                set={setSpecialty}
                options={options.specialties}
                all={text.all}
              />
              <Filter
                label={text.language}
                value={language}
                set={setLanguage}
                options={options.languages}
                all={text.all}
              />
              <Filter
                label={text.duration}
                value={duration}
                set={setDuration}
                options={options.durations}
                all={text.all}
              />
              <label className="flex items-end">
                <span className="flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                  />
                  {text.available}
                </span>
              </label>
            </div>
          </div>
          <h2 className="mt-10 text-2xl font-bold">{text.guides}</h2>
          {filtered.length ? (
            <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((g) => (
                <article
                  key={g.id}
                  className="rounded-2xl border border-[#d3e1d6] bg-card shadow-[var(--shadow-soft)] transition hover:border-[#9fbea7]"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <GuideMark guide={g} />
                        <div>
                          <h3 className="text-xl font-bold">{ar ? g.nameAr : g.nameEn}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {ar ? g.titleAr : g.titleEn}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold ${g.isAvailable ? "bg-[#edf5ef] text-primary" : "bg-muted text-muted-foreground"}`}
                      >
                        {g.isAvailable ? text.available : text.unavailable}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {(ar ? g.specialtiesAr : g.specialtiesEn).slice(0, 3).map((s) => (
                        <span key={s} className="rounded-full bg-secondary px-2.5 py-1 text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <Languages className="h-4 w-4" />
                        {(ar ? g.languagesAr : g.languagesEn).join("، ")}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />
                        {(ar ? g.availableDurationsAr : g.availableDurationsEn).join("، ")}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {text.from} {g.priceFrom} {text.currency}
                      </p>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setDialog({ guide: g, mode: "profile" })}
                        className="btn-outline px-3 py-2 text-xs"
                      >
                        {text.profile}
                      </button>
                      <button
                        onClick={() => setDialog({ guide: g, mode: "request" })}
                        className="btn-primary px-3 py-2 text-xs"
                      >
                        {text.request}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
              {text.noResults}
            </p>
          )}
        </section>
      </main>
      {dialog && <GuideDialog {...dialog} locale={locale} onClose={() => setDialog(null)} />}
    </div>
  );
}

function Filter({
  label,
  value,
  set,
  options,
  all,
}: {
  label: string;
  value: string;
  set: (v: string) => void;
  options: string[];
  all: string;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-bold">
      <span>{label}</span>
      <select
        value={value}
        onChange={(e) => set(e.target.value)}
        className="rounded-xl border bg-background px-3 py-2.5 text-sm font-normal"
      >
        <option value="">{all}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
