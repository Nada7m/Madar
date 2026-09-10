import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock3, LocateFixed, MapPinned, Route as RouteIcon, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useHistoryBack } from "@/hooks/useHistoryBack";
import { getLocale } from "@/lib/i18n";
import { t } from "@/lib/translations";
import { SiteHeader } from "@/components/SiteHeader";
import {
  INTERESTS,
  EXPERIENCE_TYPES,
  suggestedRoutes,
  type AvailableTime,
  type ExperienceType,
  type RouteInterest,
} from "@/data/routes";
import { manualStartingPoints, mockDestinations } from "@/data/destinations";
import { getAllProjects } from "@/data/projects";
import { recommendRoutes, type Coordinates, type RankedRoute } from "@/lib/routeRecommendations";

export const Route = createFileRoute("/routes")({
  component: SuggestedRoutesPage,
  head: () => ({
    meta: [
      { title: "المسارات المقترحة — مدار" },
      {
        name: "description",
        content: "مسارات مقترحة لاستكشاف المشاريع والمواقع في المدينة المنورة",
      },
    ],
  }),
});

const timeOptions: Array<{ value: AvailableTime; label: string }> = [
  { value: "under-two", label: "أقل من ساعتين" },
  { value: "two-four", label: "2–4 ساعات" },
  { value: "half-day", label: "نصف يوم" },
  { value: "full-day", label: "يوم كامل" },
  { value: "two-days", label: "يومان" },
  { value: "three-days", label: "3 أيام أو أكثر" },
];

function SuggestedRoutesPage() {
  const { goBack } = useHistoryBack("/");
  const [locale, setLocale] = useState(getLocale);
  const [location, setLocation] = useState<Coordinates | undefined>();
  const [locationLabel, setLocationLabel] = useState("");
  const [interests, setInterests] = useState<RouteInterest[]>([]);
  const [experienceType, setExperienceType] = useState<ExperienceType | "">("");
  const [availableTime, setAvailableTime] = useState<AvailableTime | "">("");
  const [recommendations, setRecommendations] = useState<RankedRoute[] | null>(null);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    const updateLocale = () => setLocale(getLocale());
    window.addEventListener("madar-language-change", updateLocale);
    return () => window.removeEventListener("madar-language-change", updateLocale);
  }, []);

  const toggleInterest = (interest: RouteInterest) => {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
  };

  const useCurrentLocation = () => {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("تعذر الوصول إلى الموقع. اختر نقطة بداية من القائمة.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ lat: coords.latitude, lng: coords.longitude });
        setLocationLabel("موقعك الحالي");
      },
      () => setLocationError("لم نتمكن من الوصول إلى موقعك. يمكنك اختيار نقطة بداية يدوياً."),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };

  const submitPreferences = () => {
    if (!availableTime || !locationLabel || !experienceType) return;
    setRecommendations(
      recommendRoutes({ interests, availableTime, experienceType, currentCoordinates: location }),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="max-w-2xl">
          <div className="gold-divider" />
          <h1 className="mt-3 text-3xl font-bold text-foreground">اكتشف مسارك في المدينة</h1>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            أخبرنا عن موقعك واهتماماتك والوقت المتاح لديك، وسنقترح لك المسارات الأنسب.
          </p>
        </div>

        <section className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-7">
          <h2 className="text-xl font-bold text-foreground">صمّم مسارك</h2>
          <div className="mt-6 grid gap-7 lg:grid-cols-4">
            <fieldset>
              <legend className="text-sm font-bold text-foreground">من أين تبدأ؟</legend>
              <button
                type="button"
                onClick={useCurrentLocation}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary px-3 py-2.5 text-sm font-semibold text-primary transition hover:bg-secondary"
              >
                <LocateFixed className="h-4 w-4" />
                استخدام موقعي الحالي
              </button>
              <select
                value={locationLabel.startsWith("موقعك") ? "" : locationLabel}
                onChange={(event) => {
                  const point = manualStartingPoints.find((item) => item.id === event.target.value);
                  setLocationLabel(point?.id ?? "");
                  setLocation(point ? { lat: point.lat, lng: point.lng } : undefined);
                  setLocationError("");
                }}
                className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground"
              >
                <option value="">اختر نقطة بداية يدوياً</option>
                {manualStartingPoints.map((point) => (
                  <option key={point.id} value={point.id}>
                    {point.name}
                  </option>
                ))}
              </select>
              {locationLabel.startsWith("موقعك") && (
                <p className="mt-2 text-xs text-primary">تم تحديد موقعك الحالي</p>
              )}
              {locationError && <p className="mt-2 text-xs text-destructive">{locationError}</p>}
            </fieldset>

            <fieldset>
              <legend className="text-sm font-bold text-foreground">نوع التجربة</legend>
              <div className="mt-3 grid gap-2">
                {EXPERIENCE_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={experienceType === type}
                    onClick={() => setExperienceType(type)}
                    className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${experienceType === type ? "border-primary bg-secondary text-primary" : "border-border text-muted-foreground hover:border-primary"}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-bold text-foreground">ما الذي يهمك؟</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {INTERESTS.map((interest) => {
                  const selected = interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleInterest(interest)}
                      className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-bold text-foreground">كم لديك من الوقت؟</legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {timeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={availableTime === option.value}
                    onClick={() => setAvailableTime(option.value)}
                    className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${availableTime === option.value ? "border-primary bg-secondary text-primary" : "border-border text-muted-foreground hover:border-primary"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
          <button
            type="button"
            disabled={!locationLabel || !interests.length || !experienceType || !availableTime}
            onClick={submitPreferences}
            className="btn-primary mt-7 inline-flex items-center gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RouteIcon className="h-4 w-4" />
            اقترح لي مسارات
          </button>
        </section>

        {recommendations && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-foreground">المسارات المناسبة لك</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map(({ route, score, matchedTags }) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  score={score}
                  matchedTags={matchedTags}
                  recommended
                />
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground">استكشف جميع المسارات</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {suggestedRoutes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-[#d7bd76] bg-[#f8f0d9] p-6 text-center sm:p-8">
          <h2 className="text-xl font-bold text-foreground">
            {locale === "ar"
              ? "تفضل استكشاف المسار مع أحد أهل المدينة؟"
              : "Prefer to Explore with a Local?"}
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {locale === "ar"
              ? "استعن بمرشد محلي يعرف تفاصيل المنطقة وقصصها."
              : "Discover the route with a local guide familiar with the area's places and stories."}
          </p>
          <Link
            to="/local-guides"
            search={{ place: undefined }}
            className="btn-primary mt-5 inline-flex text-sm"
          >
            {locale === "ar" ? "استعرض المرشدين" : "Browse Local Guides"}
          </Link>
        </section>

        <div className="my-8 flex justify-center">
          <button
            onClick={goBack}
            className="group inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition hover:bg-secondary"
          >
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            {t("button.back", locale)}
          </button>
        </div>
      </main>
    </div>
  );
}

function RouteCard({
  route,
  score,
  matchedTags = [],
  recommended = false,
}: {
  route: (typeof suggestedRoutes)[number];
  score?: number;
  matchedTags?: RouteInterest[];
  recommended?: boolean;
}) {
  const stopCount = route.projectIds.length + (route.destinationIds?.length ?? 0);
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
            <RouteIcon className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground">{route.name}</h3>
        </div>
        {recommended && (
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-primary">
            {(score ?? 0) >= 70 ? "مناسب جداً لك" : "مناسب لك"}
          </span>
        )}
      </div>
      <p className="mt-3 min-h-14 text-sm leading-7 text-muted-foreground">{route.description}</p>
      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MapPinned className="h-4 w-4 text-primary-soft" />
          {stopCount} محطات
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="h-4 w-4 text-primary-soft" />
          {route.durationLabel}
        </span>
      </div>
      <div className="mt-4 border-t border-border/70 pt-3 text-xs text-muted-foreground">
        <div className="mb-2 font-semibold text-foreground">محطات المسار</div>
        <ol className="list-inside list-decimal space-y-1">
          {[...route.projectIds, ...(route.destinationIds ?? [])].map((stopId) => (
            <li key={stopId}>{getStopName(stopId)}</li>
          ))}
        </ol>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {(matchedTags.length ? matchedTags : route.tags).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-muted px-2 py-1 text-[10px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
      <Link
        to="/map"
        search={{ route: route.id }}
        className="btn-primary mt-5 inline-flex items-center justify-center gap-2 text-sm"
      >
        عرض المسار
      </Link>
    </article>
  );
}

function getStopName(stopId: string): string {
  const project = getAllProjects().find((item) => item.id === stopId);
  if (project) return project.name;
  return mockDestinations.find((item) => item.id === stopId)?.name ?? "وجهة محلية";
}
