import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllProjectsWithLocal } from "@/lib/supabase";
import { getCategoryLabel, getStatusLabel, statusColor } from "@/lib/display";
import { CATEGORIES, STATUSES, type Project } from "@/data/projects";
import { useMemo, useState, useEffect } from "react";
import { ImageIcon, Filter, Search } from "lucide-react";
import { useLocale, getLocale } from "@/lib/i18n";

export const Route = createFileRoute("/projects/")({
  component: ProjectsPage,
  head: () => {
    const locale = getLocale();
    const isEnglish = locale === "en";
    return {
      meta: [
        { title: isEnglish ? "Discover the city — Madar" : "اكتشف المدينة" },
        {
          name: "description",
          content: isEnglish
            ? "Explore development projects, services, and experiences across Madinah."
            : "استكشف الأماكن والمعالم والتجارب والخدمات في مكان واحد.",
        },
      ],
    };
  },
});

function ProjectsPage() {
  const locale = useLocale();
  const isEnglish = locale === "en";
  const [all, setAll] = useState<Project[]>([]);
  const [cat, setCat] = useState<string>("");
  const [st, setSt] = useState<string>("");
  const [q, setQ] = useState<string>("");

  // Derive available categories from loaded projects and normalize them to a single canonical label
  const availableCategories = useMemo(() => {
    const categories = all
      .map((p) => getCategoryLabel(p.category))
      .filter(Boolean)
      .map((category) => String(category).trim());

    return [...new Set([...categories, ...CATEGORIES])].sort((a, b) => a.localeCompare(b, "ar"));
  }, [all]);

  useEffect(() => {
    getAllProjectsWithLocal().then(setAll).catch(console.error);
  }, []);

  // Status sort order: completed first, then in_progress, then planned
  const statusSortOrder = useMemo(
    () => ({
      مكتمل: 0,
      "قيد التنفيذ": 1,
      مخطط: 2,
    }),
    [],
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const filtered = all.filter(
      (p) =>
        (!cat || getCategoryLabel(p.category) === cat) &&
        (!st || p.status === st) &&
        (!term ||
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)),
    );

    // Sort: projects with images first, then by status
    return filtered.sort((a, b) => {
      // Primary: has images (1) > no images (0)
      const hasImagesA = a.images.length > 0 ? 0 : 1;
      const hasImagesB = b.images.length > 0 ? 0 : 1;
      if (hasImagesA !== hasImagesB) return hasImagesA - hasImagesB;
      // Secondary: completed first, then in_progress, then planned
      const orderA = statusSortOrder[a.status as keyof typeof statusSortOrder] ?? 999;
      const orderB = statusSortOrder[b.status as keyof typeof statusSortOrder] ?? 999;
      return orderA - orderB;
    });
  }, [all, cat, st, q, statusSortOrder]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="gold-divider" />
            <h1 className="mt-3 text-3xl font-bold text-foreground">
              {isEnglish ? "Discover the city" : "اكتشف المدينة"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isEnglish
                ? "Browse projects, filter them by category, and explore their current status."
                : "استكشف الأماكن والمعالم والتجارب والخدمات في مكان واحد."}
            </p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={isEnglish ? "Search project name..." : "ابحث باسم المشروع..."}
              className="w-full rounded-lg border border-input bg-background pr-10 pl-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">{isEnglish ? "All categories" : "كل التصنيفات"}</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={st}
              onChange={(e) => setSt(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">{isEnglish ? "All statuses" : "كل الحالات"}</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="text-xs text-muted-foreground mr-auto">
            {filtered.length} {isEnglish ? "of" : "من"} {all.length}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Link
              key={p.id}
              to="/projects/$id"
              params={{ id: p.id }}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="relative h-44 bg-muted overflow-hidden">
                {p.images.length > 0 ? (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-muted text-muted-foreground">
                    <ImageIcon className="h-8 w-8 opacity-50" />
                    <span className="text-[11px]">{isEnglish ? "No image available" : "لا توجد صورة"}</span>
                  </div>
                )}
                <span
                  className="absolute bottom-2 right-2 rounded-full px-3 py-1 text-[10px] font-semibold text-white shadow"
                  style={{ background: statusColor(p.status) }}
                >
                  {getStatusLabel(p.status)}
                </span>
              </div>
              <div className="p-4">
                <div className="text-[11px] font-medium text-primary-soft">
                  {getCategoryLabel(p.category)}
                </div>
                <h3 className="mt-1 text-sm font-bold leading-snug text-foreground line-clamp-2 min-h-[2.5rem]">
                  {p.name}
                </h3>
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{isEnglish ? "Progress" : "نسبة الإنجاز"}</span>
                    <span className="font-semibold text-foreground">{p.progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${p.progress}%`, background: statusColor(p.status) }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center text-sm text-muted-foreground">
            {isEnglish ? "No matching projects found." : "لا توجد مشاريع مطابقة."}
          </div>
        )}
      </div>
    </div>
  );
}
