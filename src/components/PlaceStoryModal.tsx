import { useEffect, useId, useRef } from "react";
import { BookOpen, ExternalLink, Lightbulb, MapPin, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Project } from "@/data/projects";
import type { Locale } from "@/lib/i18n";
import { getCategoryLabel, getStatusLabel, statusColor } from "@/lib/display";
import { getProjectDisplayName } from "@/lib/i18n";

type Props = {
  project: Project;
  locale: Locale;
  onClose: () => void;
};

function eyebrow(category: Project["category"], locale: Locale) {
  const labels: Partial<Record<Project["category"], [string, string]>> = {
    "تراثي و سياحي": ["من ذاكرة المدينة", "From Madinah's Memory"],
    "نقل و مواصلات": ["رحلة غيّرت الوصول", "A Journey That Changed Access"],
    فندقي: ["إقامة في قلب الرحلة", "A Stay at the Heart of the Journey"],
    "مطاعم ومقاهي": ["حكاية المكان والمذاق", "A Story of Place & Taste"],
    صحي: ["في خدمة المدينة وزوارها", "Serving Madinah and Its Visitors"],
  };
  const value = labels[category] ?? ["اكتشف الحكاية", "Discover the Story"];
  return locale === "ar" ? value[0] : value[1];
}

const categoryEn: Partial<Record<Project["category"], string>> = {
  صحي: "Healthcare",
  تجاري: "Commercial",
  "نقل و مواصلات": "Transport",
  "تراثي و سياحي": "Heritage & Tourism",
  تعليم: "Education",
  ترفيهي: "Leisure",
  "ترفيهي و أنسنة": "Leisure & Placemaking",
  محمية: "Nature Reserve",
  استثماري: "Investment",
  "سكني استثماري": "Residential Investment",
  فندقي: "Hotel",
  "بنية تحتية": "Infrastructure",
  "مطاعم ومقاهي": "Restaurants & Cafes",
};

function contextLabel(project: Project, locale: Locale) {
  if (locale === "ar") return getCategoryLabel(project.category);
  return categoryEn[project.category] ?? project.category;
}

function statusLabel(project: Project, locale: Locale) {
  const status = getStatusLabel(project.status);
  if (locale === "ar") return status;
  return status === "مكتمل" ? "Completed" : status === "قيد التنفيذ" ? "In Progress" : "Planned";
}

export function PlaceStoryModal({ project, locale, onClose }: Props) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const isArabic = locale === "ar";
  const title = isArabic ? project.storyTitleAr : project.storyTitleEn;
  const story = isArabic ? project.storyAr : project.storyEn;
  const fact = isArabic ? project.storyFactAr : project.storyFactEn;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="story-backdrop fixed inset-0 z-[1000] flex items-end justify-center bg-[#10271d]/70 p-0 backdrop-blur-[3px] sm:items-center sm:p-6"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        dir={isArabic ? "rtl" : "ltr"}
        className="story-dialog relative flex max-h-[calc(100dvh-1rem)] w-full flex-col overflow-hidden rounded-t-[2rem] border border-[#d8c79c]/60 bg-[#fbf7ed] text-[#183126] shadow-2xl sm:max-h-[min(88vh,820px)] sm:max-w-4xl sm:rounded-[2rem]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute start-4 top-4 z-10 rounded-full border border-white/40 bg-[#183126]/85 p-2.5 text-white shadow-lg transition hover:bg-[#183126] focus:outline-none focus:ring-2 focus:ring-[#c9a961]"
          aria-label={isArabic ? "إغلاق قصة المكان" : "Close place story"}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto overscroll-contain">
          {project.images?.[0] && (
            <div className="relative h-52 sm:h-72">
              <img src={project.images[0]} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#183126]/75 via-transparent to-black/15" />
            </div>
          )}

          <article
            className={`mx-auto max-w-3xl px-6 pb-8 sm:px-10 sm:pb-10 ${project.images?.[0] ? "-mt-7 relative" : "pt-16 sm:pt-12"}`}
          >
            <div className="rounded-[1.5rem] border border-[#dfd2ad] bg-[#fffdf8] p-6 shadow-[0_16px_50px_rgba(24,49,38,0.11)] sm:p-9">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-[#183126] px-3 py-1.5 font-semibold text-white">
                  {contextLabel(project, locale)}
                </span>
                <span
                  className="rounded-full border px-3 py-1.5 font-semibold"
                  style={{
                    color: statusColor(project.status),
                    borderColor: `${statusColor(project.status)}55`,
                  }}
                >
                  {statusLabel(project, locale)}
                </span>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9b7933]">
                <BookOpen className="h-4 w-4" />
                <span>{eyebrow(project.category, locale)}</span>
              </div>
              <h2
                id={titleId}
                className="mt-3 text-2xl font-bold leading-tight text-[#183126] sm:text-4xl"
              >
                {title}
              </h2>
              <p className="mt-2 text-sm font-medium text-[#718078]">
                {getProjectDisplayName(project, locale)}
              </p>
              <p className="mt-5 whitespace-pre-line text-[15px] leading-8 text-[#405248] sm:text-lg sm:leading-9">
                {story}
              </p>

              {fact && (
                <aside className="mt-7 rounded-2xl border border-[#d7bd76] bg-[#f8f0d9] p-5">
                  <div className="flex items-center gap-2 font-bold text-[#7d5f20]">
                    <Lightbulb className="h-5 w-5" />
                    <h3>{isArabic ? "هل تعلم؟" : "Did you know?"}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[#594c31]">{fact}</p>
                </aside>
              )}

              <div className="mt-7 flex flex-col gap-3 border-t border-[#e7dcc0] pt-6 sm:flex-row sm:items-center sm:justify-between">
                {project.storySourceUrl ? (
                  <a
                    href={project.storySourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#8b6a28] hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {isArabic ? "المصدر" : "Source"}
                  </a>
                ) : (
                  <span />
                )}
                <Link
                  to="/projects/$id"
                  params={{ id: project.id }}
                  className="btn-primary inline-flex items-center justify-center gap-2 text-sm"
                >
                  <MapPin className="h-4 w-4" />
                  {isArabic ? "عرض التفاصيل الكاملة" : "View Full Details"}
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
