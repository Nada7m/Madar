import {
  Accessibility,
  Baby,
  CalendarClock,
  Car,
  CircleDollarSign,
  Phone,
  TicketCheck,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Project, VisitDay } from "@/data/projects";
import type { Locale } from "@/lib/i18n";

const days: VisitDay[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
const labels = {
  ar: {
    title: "معلومات الزيارة",
    access: "إمكانية الوصول",
    children: "الأطفال",
    hours: "أوقات الزيارة",
    parking: "مواقف السيارات",
    reservation: "الحجز",
    fee: "رسوم الدخول",
    notes: "قبل زيارتك",
    unknown: "المعلومة غير متوفرة",
    closed: "مغلق",
    yes: "متوفر",
    no: "غير متوفر",
    required: "مطلوب",
    notRequired: "غير مطلوب",
    free: "مجاني",
    dayNames: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  },
  en: {
    title: "Visit Information",
    access: "Accessibility",
    children: "Children",
    hours: "Opening Hours",
    parking: "Parking",
    reservation: "Reservation",
    fee: "Entry Fee",
    notes: "Before You Visit",
    unknown: "Information unavailable",
    closed: "Closed",
    yes: "Available",
    no: "Unavailable",
    required: "Required",
    notRequired: "Not required",
    free: "Free",
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },
} as const;

export function VisitInformation({ project, locale }: { project: Project; locale: Locale }) {
  const text = labels[locale];
  const access = {
    full: locale === "ar" ? "مهيأ لذوي الإعاقة" : "Accessible",
    partial: locale === "ar" ? "مهيأ جزئيًا" : "Partially accessible",
    no: locale === "ar" ? "غير مهيأ" : "Not accessible",
    unknown: text.unknown,
  }[project.accessibility ?? "unknown"];
  const children = {
    allowed: locale === "ar" ? "مناسب للأطفال" : "Child-friendly",
    conditional: locale === "ar" ? "مسموح بشروط" : "Allowed with conditions",
    notAllowed: locale === "ar" ? "غير مناسب للأطفال" : "Not suitable for children",
    unknown: text.unknown,
  }[project.childrenPolicy ?? "unknown"];
  const notes = locale === "ar" ? project.visitNotesAr : project.visitNotesEn;
  const infoCards: { icon: LucideIcon; label: string; value: string; href?: string }[] = [
    { icon: Accessibility, label: text.access, value: access },
    { icon: Baby, label: text.children, value: children },
    {
      icon: Car,
      label: text.parking,
      value:
        project.parkingAvailable === true
          ? text.yes
          : project.parkingAvailable === false
            ? text.no
            : text.unknown,
    },
  ];
  if (project.reservationRequired !== undefined)
    infoCards.push({
      icon: TicketCheck,
      label: text.reservation,
      value:
        project.reservationRequired === true
          ? text.required
          : project.reservationRequired === false
            ? text.notRequired
            : text.unknown,
    });
  if (project.entryFee !== undefined)
    infoCards.push({
      icon: CircleDollarSign,
      label: text.fee,
      value:
        typeof project.entryFee === "number"
          ? `${project.entryFee} ${locale === "ar" ? "ر.س" : "SAR"}`
          : project.entryFee === "free"
            ? text.free
            : text.unknown,
    });
  if (project.contactPhone)
    infoCards.push({
      icon: Phone,
      label: locale === "ar" ? "التواصل" : "Contact",
      value: project.contactPhone,
      href: `tel:${project.contactPhone}`,
    });
  return (
    <section className="mt-10" aria-labelledby="visit-information-title">
      <h2 id="visit-information-title" className="text-lg font-bold text-foreground">
        {text.title}
      </h2>
      <div className="gold-divider mt-2" />
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {infoCards.map(({ icon: Icon, label, value, href }) => (
          <article key={label} className="rounded-xl border border-[#cfe0d3] bg-card p-4">
            <div className="flex items-center gap-2 text-primary">
              <span className="rounded-lg bg-[#edf5ef] p-2">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-sm font-bold">{label}</h3>
            </div>
            {href ? (
              <a href={href} className="mt-2 block text-sm text-primary hover:underline">
                {value}
              </a>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">{value}</p>
            )}
          </article>
        ))}
      </div>
      <article className="mt-3 rounded-xl border border-[#cfe0d3] bg-card p-4">
        <div className="flex items-center gap-2 text-primary">
          <span className="rounded-lg bg-[#edf5ef] p-2">
            <CalendarClock className="h-5 w-5" />
          </span>
          <h3 className="text-sm font-bold">{text.hours}</h3>
        </div>
        {project.openingHours && (
          <p className="mt-3 rounded-lg bg-secondary/60 px-3 py-2 text-sm text-foreground">
            <span className="font-semibold">
              {locale === "ar" ? "المعلومات الحالية: " : "Current information: "}
            </span>
            {locale === "en"
              ? project.openingHours_en || project.openingHours
              : project.openingHours}
          </p>
        )}
        <div className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {days.map((day, index) => {
            const hours = project.visitOpeningHours?.find((item) => item.day === day);
            const value = !hours
              ? text.unknown
              : hours.closed
                ? text.closed
                : hours.open && hours.close
                  ? `${hours.open} – ${hours.close}`
                  : text.unknown;
            const note = locale === "ar" ? hours?.noteAr : hours?.noteEn;
            return (
              <div key={day} className="border-b border-border/60 py-2">
                <div className="flex justify-between gap-4">
                  <span className="font-semibold">{text.dayNames[index]}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
                {note && <p className="mt-1 text-xs text-[#8b6a28]">{note}</p>}
              </div>
            );
          })}
        </div>
      </article>
      {notes?.length ? (
        <article className="mt-3 rounded-xl border border-[#d7bd76] bg-[#f8f0d9] p-4">
          <h3 className="font-bold text-[#7d5f20]">{text.notes}</h3>
          <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-[#594c31]">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </article>
      ) : null}
      <div className="mt-4 rounded-xl border border-[#cfe0d3] bg-[#edf5ef] p-4 text-center">
        <p className="text-sm font-semibold">
          {locale === "ar" ? "اكتشف المكان مع مرشد محلي" : "Explore with a Local Guide"}
        </p>
        <LinkButton locale={locale} projectId={project.id} />
      </div>
    </section>
  );
}

function LinkButton({ locale, projectId }: { locale: Locale; projectId: string }) {
  return (
    <Link
      to="/local-guides"
      search={{ place: projectId }}
      className="mt-3 inline-flex rounded-lg border border-primary px-4 py-2 text-xs font-bold text-primary hover:bg-secondary"
    >
      {locale === "ar" ? "استعرض المرشدين" : "Browse Local Guides"}
    </Link>
  );
}
