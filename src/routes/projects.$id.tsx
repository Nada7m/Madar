import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { deleteProject, getProjectByIdWithLocal } from "@/lib/supabase";
import { getCategoryLabel, getStatusLabel, formatArea, statusColor } from "@/lib/display";
import { type Project } from "@/data/projects";
import { isEmployee } from "@/lib/auth";
import ReviewsSection from "@/components/ReviewsSection";
import { EditProjectModal } from "@/components/EditProjectModal";
import { VisitInformation } from "@/components/VisitInformation";
import { ProjectImageFrame } from "@/components/ProjectImageFrame";
import { useHistoryBack } from "@/hooks/useHistoryBack";
import { getLocale } from "@/lib/i18n";
import { t } from "@/lib/translations";
import {
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  Building2,
  Ruler,
  FileSpreadsheet,
  X,
  Pencil,
  Trash2,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { exportProjectExcel } from "@/lib/exports";

export const Route = createFileRoute("/projects/$id")({
  loader: async ({ params }) => {
    const project = await getProjectByIdWithLocal(params.id);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.project.name} - مدار` },
          { name: "description", content: loaderData.project.description.slice(0, 155) },
        ]
      : [{ title: "المشروع غير موجود - مدار" }],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-bold">المشروع غير موجود</h1>
        <Link to="/projects" className="btn-primary mt-6 inline-block">
          العودة للقائمة
        </Link>
      </div>
    </div>
  ),
  component: ProjectDetail,
});

function formatDateYearOnly(value: string) {
  if (!value) return "";
  const match = value.match(/(\d{4})/);
  return match ? `${match[1]} م` : value;
}

function getDurationYears(durationYears: number, startDate: string, endDate: string) {
  if (durationYears > 0) return durationYears;
  const start = Number((startDate.match(/(\d{4})/) || [])[1]);
  const end = Number((endDate.match(/(\d{4})/) || [])[1]);
  if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
    return Math.max(1, end - start);
  }
  return 0;
}

function formatDuration(durationYears: number, startDate: string, endDate: string) {
  const years = getDurationYears(durationYears, startDate, endDate);
  if (!years) return "";
  if (years === 1) return "سنة واحدة";
  if (years === 2) return "سنتان";
  return `${years} سنوات`;
}

function formatCoordinates(lat?: number, lng?: number) {
  if (lat == null || lng == null) return "لا توجد إحداثيات";
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

function ProjectDetail() {
  const { project } = Route.useLoaderData() as { project: Project };
  const navigate = useNavigate();
  const { goBack } = useHistoryBack("/projects");
  const [locale, setLocale] = useState(getLocale);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentProject, setCurrentProject] = useState(project);
  useEffect(() => {
    const updateLocale = () => setLocale(getLocale());
    window.addEventListener("madar-language-change", updateLocale);
    return () => window.removeEventListener("madar-language-change", updateLocale);
  }, []);

  const statusLabel = getStatusLabel(currentProject.status);
  const categoryLabel = getCategoryLabel(currentProject.category);
  const isRestaurantCafe = currentProject.category === "مطاعم ومقاهي";
  const durationLabel = formatDuration(
    currentProject.durationYears,
    currentProject.startDate,
    currentProject.endDate,
  );

  const handleDeleteProject = async () => {
    if (!window.confirm(t("project.delete_confirm", locale))) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProject(currentProject.id);
      await navigate({ to: "/projects" });
    } catch (error) {
      console.error("Failed to delete project", error);
      window.alert("فشل حذف المشروع. يرجى المحاولة لاحقًا.");
    } finally {
      setIsDeleting(false);
    }
  };

  const infoItems: { icon: LucideIcon; label: string; value: string }[] = (
    isRestaurantCafe
      ? [
          { icon: MapPin, label: "نوع المكان", value: currentProject.placeType || "" },
          { icon: MapPin, label: "الموقع", value: currentProject.location_description || "" },
          {
            icon: MapPin,
            label: "الإحداثيات",
            value: formatCoordinates(currentProject.lat, currentProject.lng),
          },
        ]
      : [
          { icon: Building2, label: "الجهة المسؤولة", value: currentProject.ownerEntity },
          { icon: Building2, label: "الجهة المنفذة", value: currentProject.executorEntity || "—" },
          {
            icon: Calendar,
            label: "تاريخ البداية",
            value: formatDateYearOnly(currentProject.startDate),
          },
          {
            icon: Calendar,
            label: "تاريخ النهاية",
            value: formatDateYearOnly(currentProject.endDate),
          },
          { icon: Clock, label: "مدة المشروع", value: durationLabel },
          {
            icon: Ruler,
            label: "المساحة",
            value: currentProject.area
              ? formatArea(currentProject.area, currentProject.areaUnit)
              : "",
          },
          {
            icon: MapPin,
            label: "الإحداثيات",
            value: formatCoordinates(currentProject.lat, currentProject.lng),
          },
        ]
  ).filter((i) => i.value && i.value !== "—");

  const projectLink = currentProject.projectLink;
  const officialUrl = currentProject.official_url || projectLink;
  const bookingUrl = currentProject.booking_url;
  const mapUrl = currentProject.map_url;
  const visitorFeatures = currentProject.main_features?.filter(Boolean) ?? [];
  const visitorServices = currentProject.services?.filter(Boolean) ?? [];
  const visitorImportance = currentProject.project_importance?.filter(Boolean) ?? [];
  const galleryImages = currentProject.images.slice(1);
  const menuImages = currentProject.menuImages ?? [];
  const menuSections = currentProject.menuSections ?? [];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <button
          onClick={goBack}
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          العودة للمشاريع
        </button>

        <header className="mt-6 border-b border-border pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ background: statusColor(currentProject.status) }}
              >
                {statusLabel}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {categoryLabel}
              </span>
            </div>
            {isEmployee() && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary/90"
                >
                  <Pencil className="h-4 w-4" />
                  تعديل المشروع
                </button>
                <button
                  onClick={handleDeleteProject}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Trash2 className="h-4 w-4" />
                  {isDeleting ? "جاري الحذف..." : "حذف المشروع"}
                </button>
              </div>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {currentProject.name}
          </h1>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 min-w-[240px]">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">نسبة الإنجاز</span>
                <span className="font-semibold text-foreground">{currentProject.progress}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${currentProject.progress}%`,
                    background: statusColor(currentProject.status),
                  }}
                />
              </div>
            </div>
            <button
              onClick={() => exportProjectExcel(currentProject)}
              className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-secondary"
            >
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </button>
          </div>
        </header>

        {currentProject.images[0] && (
          <button
            type="button"
            onClick={() => setLightbox(0)}
            className="group mt-8 block w-full rounded-2xl text-start focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={locale === "ar" ? "عرض الصورة الرئيسية" : "View main image"}
          >
            <ProjectImageFrame
              src={currentProject.images[0]}
              alt={currentProject.name}
              variant="hero"
              loading="eager"
              interactive
            />
          </button>
        )}

        <div className="grid gap-10 py-10 lg:grid-cols-3">
          <div className="flex flex-col lg:col-span-2">
            <div className="order-1">
              <h2 className="text-lg font-bold text-foreground">
                {isRestaurantCafe ? "نبذة عن المكان" : "وصف المشروع"}
              </h2>
              <div className="gold-divider mt-2" />
              <p className="mt-4 leading-loose text-foreground/85">{currentProject.description}</p>
            </div>

            <div className={isRestaurantCafe ? "order-11" : "order-2"}>
              <ReviewsSection projectId={currentProject.id} />
            </div>

            {galleryImages.length > 0 && (
              <section className={isRestaurantCafe ? "order-9 mt-10" : "order-3 mt-12"}>
                <h2 className="text-lg font-bold text-foreground">
                  {locale === "ar" ? "معرض الصور" : "Photo Gallery"}
                </h2>
                <div className="gold-divider mt-2" />
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {galleryImages.map((src, i) => (
                    <button
                      key={src}
                      onClick={() => setLightbox(i + 1)}
                      className="group block w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <ProjectImageFrame
                        src={src}
                        alt={`${currentProject.name} ${i + 2}`}
                        variant="gallery"
                        interactive
                      />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {isRestaurantCafe && (
              <section className="order-8 mt-10">
                <h2 className="text-lg font-bold text-foreground">
                  {locale === "ar" ? "المنيو" : "Menu"}
                </h2>
                <div className="gold-divider mt-2" />
                {menuImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {menuImages.map((src, i) => (
                      <button
                        key={src}
                        onClick={() => setLightbox(i + currentProject.images.length)}
                        className="group block w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        <ProjectImageFrame
                          src={src}
                          alt={`${currentProject.name} منيو ${i + 1}`}
                          variant="menu"
                        />
                      </button>
                    ))}
                  </div>
                )}
                {menuSections.length > 0 && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {menuSections.map((section) => (
                      <article key={section.title} className="rounded-xl border bg-card p-4">
                        <h3 className="font-bold">{section.title}</h3>
                        {section.items?.length ? (
                          <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-muted-foreground">
                            {section.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        ) : null}
                      </article>
                    ))}
                  </div>
                )}
                {currentProject.menuUrl && (
                  <a
                    href={currentProject.menuUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline mt-4 inline-flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {locale === "ar" ? "عرض المنيو" : "View Menu"}
                  </a>
                )}
                {!menuImages.length && !menuSections.length && !currentProject.menuUrl && (
                  <p className="mt-4 rounded-xl border border-dashed bg-muted/30 p-5 text-sm text-muted-foreground">
                    {locale === "ar" ? "لم تتم إضافة المنيو بعد" : "Menu has not been added yet"}
                  </p>
                )}
              </section>
            )}

            {(currentProject.visitor_description ||
              visitorFeatures.length > 0 ||
              visitorServices.length > 0 ||
              visitorImportance.length > 0 ||
              officialUrl ||
              bookingUrl ||
              mapUrl) && (
              <section className="contents">
                {currentProject.visitor_description && (
                  <div className="order-3 mt-10">
                    <h2 className="text-lg font-bold text-foreground">نبذة للزائر</h2>
                    <div className="gold-divider mt-2" />
                    <p className="mt-4 leading-loose text-foreground/85">
                      {currentProject.visitor_description}
                    </p>
                  </div>
                )}

                {visitorFeatures.length > 0 && (
                  <div className="order-4 mt-10">
                    <h2 className="text-lg font-bold text-foreground">المزايا الرئيسية</h2>
                    <div className="gold-divider mt-2" />
                    <ul className="mt-4 list-disc space-y-2 pr-5 text-sm leading-relaxed text-foreground/85">
                      {visitorFeatures.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {visitorServices.length > 0 && (
                  <div className="order-5 mt-10">
                    <h2 className="text-lg font-bold text-foreground">الخدمات</h2>
                    <div className="gold-divider mt-2" />
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {visitorServices.map((service) => (
                        <li
                          key={service}
                          className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-foreground"
                        >
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!isRestaurantCafe && visitorImportance.length > 0 && (
                  <div className="order-6 mt-10">
                    <h2 className="text-lg font-bold text-foreground">أهمية المشروع</h2>
                    <div className="gold-divider mt-2" />
                    <ul className="mt-4 list-disc space-y-2 pr-5 text-sm leading-relaxed text-foreground/85">
                      {visitorImportance.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {(officialUrl ||
                  bookingUrl ||
                  mapUrl ||
                  currentProject.instagramUrl ||
                  currentProject.reservationUrl) && (
                  <div className={isRestaurantCafe ? "order-10 mt-10" : "order-8 mt-10"}>
                    <h2 className="text-lg font-bold text-foreground">
                      {isRestaurantCafe ? "روابط المكان" : "روابط المشروع"}
                    </h2>
                    <div className="gold-divider mt-2" />
                    <div className="mt-4 flex flex-wrap gap-3">
                      {officialUrl && (
                        <a
                          href={officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {isRestaurantCafe ? "الموقع" : "الموقع الرسمي"}
                        </a>
                      )}
                      {mapUrl && (
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          الموقع على الخريطة
                        </a>
                      )}
                      {currentProject.instagramUrl && (
                        <a
                          href={currentProject.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          إنستجرام
                        </a>
                      )}
                      {currentProject.reservationUrl && (
                        <a
                          href={currentProject.reservationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          الحجز
                        </a>
                      )}
                      {bookingUrl && (
                        <a
                          href={bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          الحجز
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}
            <div className={isRestaurantCafe ? "order-7" : "order-7"}>
              <VisitInformation project={currentProject} locale={locale} />
            </div>
          </div>

          <aside className="space-y-4">
            {infoItems.map((i) => (
              <InfoCard key={i.label} icon={i.icon} label={i.label} value={i.value} />
            ))}
          </aside>
        </div>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            <X className="h-5 w-5" />
          </button>
          {lightbox < currentProject.images.length ? (
            <img
              src={currentProject.images[lightbox]}
              alt=""
              className="max-h-full max-w-full rounded-lg"
            />
          ) : currentProject.menuImages &&
            currentProject.menuImages[lightbox - currentProject.images.length] ? (
            <img
              src={currentProject.menuImages[lightbox - currentProject.images.length]}
              alt=""
              className="max-h-full max-w-full rounded-lg"
            />
          ) : null}
        </div>
      )}

      <EditProjectModal
        project={currentProject}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          // Refresh the page to show updated data
          window.location.reload();
        }}
      />
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1.5 text-sm font-semibold text-foreground" dir="auto">
        {value}
      </div>
    </div>
  );
}
