import { createFileRoute, Link } from "@tanstack/react-router";
import { getCategoryLabel, getStatusLabel, statusColor } from "@/lib/display";
import { CATEGORIES, getAllProjects, type Project } from "@/data/projects";
import { suggestedRoutes } from "@/data/routes";
import { mockDestinations } from "@/data/destinations";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MapPin,
  X,
  ImageIcon,
  ArrowRight,
  LocateFixed,
  Clock3,
  Route as RouteIcon,
  Search,
  BookOpen,
} from "lucide-react";
import type { Map as LeafletMap } from "leaflet";
import { useHistoryBack } from "@/hooks/useHistoryBack";
import { useLocale } from "@/lib/i18n";
import { t } from "@/lib/translations";
import { getAllProjectsWithLocal } from "@/lib/supabase";
import { PlaceStoryModal } from "@/components/PlaceStoryModal";

export const Route = createFileRoute("/map")({
  validateSearch: (search: Record<string, unknown>) => ({
    route: typeof search.route === "string" ? search.route : undefined,
  }),
  component: MapPage,
  head: () => ({
    meta: [
      { title: "الخريطة — مدار" },
      {
        name: "description",
        content: "خريطة تفاعلية بالأقمار الصناعية للمشاريع التنموية في المدينة المنورة",
      },
    ],
  }),
});

type ProjectMapItem = {
  project: Project;
  coordinates: { lat: number; lng: number };
};

type NearbyProject = {
  project: Project;
  distanceKm: number;
  etaMinutes: number;
};

type SortMode = "closest" | "suggested" | "alphabetical";

const CATEGORY_COLORS: Record<string, string> = {
  استثماري: "#d4b062",
  "بنية تحتية": "#7d8ea3",
  تجاري: "#a6744f",
  "تراثي و سياحي": "#b68b58",
  ترفيهي: "#4e9a62",
  "ترفيهي و أنسنة": "#7dbf8d",
  تعليم: "#7ca1c7",
  "سكني استثماري": "#d3b38e",
  صحي: "#5c8f9e",
  فندقي: "#9982b9",
  محمية: "#4e8d64",
  "مطاعم ومقاهي": "#d89a6a",
  "نقل و مواصلات": "#214d7a",
};

function normalizeName(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      // Keep brackets escaped here so the normalization class remains readable.
      // eslint-disable-next-line no-useless-escape
      .replace(/[()\[\]{},._/\\-]+/g, " ")
      .replace(/\s+/g, " ")
  );
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const radius = 6371;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return 2 * radius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getProjectCategoryColor(project: Project): string {
  return CATEGORY_COLORS[project.category] ?? "#7ca1c7";
}

function resolveProjectCoordinates(
  project: Project,
  referenceProjects: Project[],
): { lat: number; lng: number } | null {
  const lat = Number(project.lat);
  const lng = Number(project.lng);

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng };
  }

  const normalizedName = normalizeName(project.name);

  const match = referenceProjects.find((candidate) => {
    if (candidate.id === project.id) return false;
    if (
      candidate.lat !== undefined &&
      candidate.lng !== undefined &&
      normalizeName(candidate.name) === normalizedName
    ) {
      return true;
    }

    return false;
  });

  if (match && Number.isFinite(Number(match.lat)) && Number.isFinite(Number(match.lng))) {
    return {
      lat: Number(match.lat),
      lng: Number(match.lng),
    };
  }

  return null;
}

function MapPage() {
  const { goBack } = useHistoryBack("/");
  const locale = useLocale();
  const { route: selectedRouteId } = Route.useSearch();
  const [selected, setSelected] = useState<Project | null>(null);
  const [storyProject, setStoryProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [catFilter, setCatFilter] = useState<string>("");
  const [sortMode, setSortMode] = useState<SortMode>("suggested");
  const [nearbyEnabled, setNearbyEnabled] = useState(false);
  const [nearbyCategoryFilters, setNearbyCategoryFilters] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyProjects, setNearbyProjects] = useState<NearbyProject[]>([]);
  const [nearbyError, setNearbyError] = useState("");
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>(() => getAllProjects());
  const closeStory = useCallback(() => setStoryProject(null), []);

  useEffect(() => {
    let active = true;

    getAllProjectsWithLocal()
      .then((projects) => {
        if (!active) return;
        setAllProjects(projects);
      })
      .catch(() => {
        if (!active) return;
        setAllProjects(getAllProjects());
      });

    return () => {
      active = false;
    };
  }, []);

  const availableCategories = useMemo(
    () =>
      [...new Set([...allProjects.map((p) => p.category), ...CATEGORIES])].filter(Boolean).sort(),
    [allProjects],
  );

  const visibleProjects = useMemo<ProjectMapItem[]>(() => {
    const items = allProjects
      .map((project) => {
        const coordinates = resolveProjectCoordinates(project, allProjects);
        return coordinates ? { project, coordinates } : null;
      })
      .filter((item): item is ProjectMapItem => Boolean(item));

    const filtered = items.filter((item) => {
      const matchesCategory = !catFilter || item.project.category === catFilter;
      const matchesSearch =
        !searchTerm ||
        item.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.project.category.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sortMode === "alphabetical") {
      return [...filtered].sort((a, b) => a.project.name.localeCompare(b.project.name));
    }

    if (sortMode === "suggested") {
      const suggestedIds = new Map<string, number>();
      const route = suggestedRoutes.find((item) => item.id === selectedRouteId);

      if (route) {
        route.projectIds.forEach((id, index) => {
          suggestedIds.set(id, index);
        });
      }

      return [...filtered].sort((a, b) => {
        const aIndex = suggestedIds.get(a.project.id) ?? Number.MAX_SAFE_INTEGER;
        const bIndex = suggestedIds.get(b.project.id) ?? Number.MAX_SAFE_INTEGER;
        if (aIndex !== bIndex) return aIndex - bIndex;
        return a.project.name.localeCompare(b.project.name);
      });
    }

    return filtered;
  }, [allProjects, catFilter, searchTerm, selectedRouteId, sortMode]);

  const nearbySortedProjects = useMemo(() => {
    const sorted = [...nearbyProjects];

    if (sortMode === "alphabetical") {
      return sorted.sort((a, b) => a.project.name.localeCompare(b.project.name));
    }

    if (sortMode === "suggested") {
      const route = suggestedRoutes.find((item) => item.id === selectedRouteId);
      const routeOrder = new Map<string, number>();
      route?.projectIds.forEach((id, index) => {
        routeOrder.set(id, index);
      });

      return sorted.sort((a, b) => {
        const aIndex = routeOrder.get(a.project.id) ?? Number.MAX_SAFE_INTEGER;
        const bIndex = routeOrder.get(b.project.id) ?? Number.MAX_SAFE_INTEGER;
        if (aIndex !== bIndex) return aIndex - bIndex;
        return a.distanceKm - b.distanceKm;
      });
    }

    return sorted.sort((a, b) => a.distanceKm - b.distanceKm);
  }, [nearbyProjects, selectedRouteId, sortMode]);

  useEffect(() => {
    if (!mapContainer.current) return;

    let canceled = false;
    let localMap: LeafletMap | null = null;

    const initializeMap = async () => {
      const { default: L } = await import("leaflet");

      if (canceled || !mapContainer.current) return;

      const map = L.map(mapContainer.current, {
        center: [24.4867, 39.6142],
        zoom: 11,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
          maxZoom: 19,
        },
      ).addTo(map);

      if (visibleProjects.length > 0) {
        const bounds = L.latLngBounds(
          visibleProjects.map(
            ({ coordinates }) => [coordinates.lat, coordinates.lng] as [number, number],
          ),
        );
        map.fitBounds(bounds, { padding: [40, 40] });
      }

      visibleProjects.forEach(({ project, coordinates }) => {
        const color = getProjectCategoryColor(project);
        const shortName = project.name.length > 18 ? `${project.name.slice(0, 18)}…` : project.name;

        const icon = L.divIcon({
          className: "madar-project-marker",
          html: `
            <div style="position:relative;display:flex;flex-direction:column;align-items:center;transform:translateY(-4px);">
              <div style="padding:2px 6px;border-radius:999px;background:rgba(255,255,255,0.92);border:1px solid rgba(18,30,22,0.12);box-shadow:0 2px 8px rgba(0,0,0,0.2);font-size:10px;font-weight:700;color:#1b2e24;white-space:nowrap;line-height:1.2;max-width:120px;text-overflow:ellipsis;overflow:hidden;">${shortName}</div>
              <div style="margin-top:4px;width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.36);"></div>
            </div>
          `,
          iconSize: [120, 38],
          iconAnchor: [60, 18],
        });

        L.marker([coordinates.lat, coordinates.lng], { icon })
          .addTo(map)
          .on("click", () => {
            setSelected(project);
            setNearbyEnabled(false);
            map.flyTo([coordinates.lat, coordinates.lng], 14, {
              duration: 1.2,
            });
          });
      });

      const selectedRoute = suggestedRoutes.find((route) => route.id === selectedRouteId);

      if (selectedRoute) {
        const routeStops = [
          ...selectedRoute.projectIds.map((id) => {
            const project = allProjects.find((item) => item.id === id);
            const coords = project ? resolveProjectCoordinates(project, allProjects) : null;
            return project && coords
              ? { name: project.name, lat: coords.lat, lng: coords.lng }
              : null;
          }),
          ...(selectedRoute.destinationIds ?? []).map((id) => {
            const destination = mockDestinations.find((item) => item.id === id);
            return destination
              ? { name: destination.name, lat: destination.lat, lng: destination.lng }
              : null;
          }),
        ].filter((stop): stop is { name: string; lat: number; lng: number } => stop !== null);

        if (routeStops.length > 1) {
          const routeCoordinates = routeStops.map(
            (stop) => [stop.lat, stop.lng] as [number, number],
          );

          routeStops.forEach((stop, index) => {
            const stopIcon = L.divIcon({
              className: "madar-route-stop",
              html: `<div style="width:28px;height:28px;border-radius:50%;background:#c9a961;color:#1f3829;border:2px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px">${index + 1}</div>`,
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            });
            L.marker([stop.lat, stop.lng], { icon: stopIcon, zIndexOffset: 500 })
              .addTo(map)
              .bindTooltip(stop.name, { direction: "top", offset: [0, -12] });
          });

          L.polyline(routeCoordinates, {
            weight: 5,
            opacity: 0.9,
            color: "#c9a961",
            lineCap: "round",
            lineJoin: "round",
          }).addTo(map);

          map.fitBounds(routeCoordinates, {
            padding: [60, 60],
          });
        }
      }

      mapRef.current = map;
      localMap = map;
    };

    initializeMap().catch((error) => {
      console.error("Failed to initialize map:", error);
    });

    return () => {
      canceled = true;

      if (localMap) {
        localMap.remove();
      }

      mapRef.current = null;
    };
  }, [allProjects, selectedRouteId, visibleProjects]);

  useEffect(() => {
    if (!userLocation || !nearbyEnabled) {
      setNearbyProjects([]);
      return;
    }

    const matches = allProjects
      .map((project) => {
        const coordinates = resolveProjectCoordinates(project, allProjects);
        if (!coordinates) return null;

        const distanceKm = haversineKm(
          userLocation.lat,
          userLocation.lng,
          coordinates.lat,
          coordinates.lng,
        );

        if (nearbyCategoryFilters.length > 0 && !nearbyCategoryFilters.includes(project.category)) {
          return null;
        }

        return {
          project,
          distanceKm,
          etaMinutes: Math.max(3, Math.round(distanceKm * 5.5)),
        } satisfies NearbyProject;
      })
      .filter((item): item is NearbyProject => item !== null)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 6);

    setNearbyProjects(matches);
  }, [allProjects, nearbyCategoryFilters, nearbyEnabled, userLocation]);

  const toggleNearbyCategory = (category: string) => {
    setNearbyCategoryFilters((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  const handleNearbyClick = () => {
    if (nearbyEnabled && userLocation) {
      setNearbyEnabled(false);
      setNearbyError("");
      return;
    }

    if (!navigator.geolocation) {
      setNearbyError("المتصفح لا يدعم تحديد الموقع الحالي.");
      return;
    }

    setNearbyError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setNearbyEnabled(true);
      },
      () => {
        setNearbyError("تعذّر الوصول إلى موقعك الحالي. حاول مرة أخرى أو اختر نقطة يدويًا.");
        setNearbyEnabled(false);
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  return (
    <div className="fixed inset-0 bg-background">
      <div ref={mapContainer} className="absolute inset-0" style={{ background: "#0a0a0a" }} />

      <div className="pointer-events-none absolute top-4 left-1/2 z-[500] w-[min(94vw,980px)] -translate-x-1/2">
        <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/95 px-4 py-3 shadow-[var(--shadow-elegant)] backdrop-blur">
          <button
            onClick={goBack}
            className="inline-flex shrink-0 items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowRight className="h-4 w-4" />
            {t("button.back", locale)}
          </button>

          <div className="flex min-w-[180px] flex-1 items-center gap-2 rounded-xl border border-border/70 bg-background/80 px-2.5 py-2 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن مشروع أو فندق"
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleNearbyClick}
              className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-2 text-[11px] font-semibold text-primary hover:bg-primary/10"
            >
              <LocateFixed className="h-3.5 w-3.5" />
              {nearbyEnabled ? "إيقاف الأماكن القريبة" : "الأماكن القريبة مني"}
            </button>

            {availableCategories.length > 0 && (
              <select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                className="rounded-lg border border-input bg-background px-2.5 py-2 text-[11px] text-foreground"
              >
                <option value="">كل التصنيفات</option>
                {availableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}

            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="rounded-lg border border-input bg-background px-2.5 py-2 text-[11px] text-foreground"
            >
              <option value="suggested">المقترح</option>
              <option value="closest">الأقرب</option>
              <option value="alphabetical">أبجديًا</option>
            </select>

            <Link
              to="/projects"
              className="whitespace-nowrap text-[11px] font-semibold text-primary hover:underline"
            >
              كل المشاريع
            </Link>
          </div>
        </div>

        {nearbyEnabled && availableCategories.length > 0 && (
          <div className="pointer-events-auto mt-3 flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-card/95 px-3 py-2 shadow-[var(--shadow-soft)] backdrop-blur">
            {availableCategories.map((category) => {
              const isActive = nearbyCategoryFilters.includes(category);

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleNearbyCategory(category)}
                  className={`rounded-full border px-2.5 py-1.5 text-[10px] font-medium transition ${
                    isActive
                      ? "border-primary bg-primary text-white"
                      : "border-border/80 bg-muted/30 text-foreground"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-4 z-[500] w-[min(220px,calc(100vw-2rem))] rounded-xl border border-border bg-card/95 p-2.5 shadow-[var(--shadow-soft)] backdrop-blur">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-[10px] font-bold text-foreground">تصنيفات الخريطة</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-[9px] text-muted-foreground">
          {Object.entries(CATEGORY_COLORS).map(([label, color]) => (
            <div
              key={label}
              className="flex items-center gap-1.5 rounded-md bg-background/60 px-1.5 py-1"
            >
              <span
                className="inline-block h-2 w-2 rounded-full border border-white/80"
                style={{ background: color }}
              />
              <span className="truncate">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {nearbyEnabled && !selected && (
        <div className="absolute right-4 top-24 z-[500] w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-border bg-card/96 p-3 shadow-[var(--shadow-elegant)] backdrop-blur">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <RouteIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">الأماكن القريبة مني</span>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {nearbySortedProjects.length} مشروع
            </span>
          </div>

          {nearbyError ? (
            <p className="text-xs text-destructive">{nearbyError}</p>
          ) : nearbySortedProjects.length === 0 ? (
            <p className="text-xs text-muted-foreground">لا توجد نتائج قريبة في الوقت الحالي.</p>
          ) : (
            <div className="space-y-2">
              {nearbySortedProjects.map(({ project, distanceKm, etaMinutes }) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelected(project)}
                  className="flex w-full items-center gap-3 rounded-xl border border-border/70 bg-background/80 p-2 text-right transition hover:border-primary/40"
                >
                  <img
                    src={
                      project.images?.[0] ??
                      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80"
                    }
                    alt={project.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[11px] font-semibold text-foreground">
                      {project.name}
                    </div>
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      {project.placeType ?? project.category}
                    </div>
                  </div>

                  <div className="shrink-0 text-[10px] text-primary-soft">
                    <div className="flex items-center gap-1 font-semibold">
                      <MapPin className="h-3 w-3" />
                      {distanceKm.toFixed(1)} كم
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <Clock3 className="h-3 w-3" />
                      {etaMinutes} د
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selected && (
        <div className="absolute top-24 right-4 z-[500] w-[min(360px,calc(100vw-2rem))] animate-fade-up rounded-2xl border border-border bg-card shadow-[var(--shadow-elegant)]">
          <div className="relative h-40 overflow-hidden rounded-t-2xl bg-muted">
            {selected.images.length > 0 ? (
              <img
                src={selected.images[0]}
                alt={selected.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-muted text-muted-foreground">
                <ImageIcon className="h-8 w-8 opacity-50" />
                <span className="text-[11px]">No image available</span>
              </div>
            )}

            <button
              onClick={() => setSelected(null)}
              className="absolute left-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
              aria-label="إغلاق"
            >
              <X className="h-4 w-4" />
            </button>

            <span
              className="absolute bottom-2 right-2 rounded-full px-3 py-1 text-xs font-semibold text-white shadow"
              style={{ background: statusColor(selected.status) }}
            >
              {getStatusLabel(selected.status)}
            </span>
          </div>

          <div className="p-4">
            <div className="text-[11px] font-medium text-primary-soft">
              {getCategoryLabel(selected.category)}
            </div>

            <h3 className="mt-1 text-base font-bold leading-snug text-foreground">
              {selected.name}
            </h3>

            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>نسبة الإنجاز</span>
                <span className="font-semibold text-foreground">{selected.progress}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${selected.progress}%`,
                    background: statusColor(selected.status),
                  }}
                />
              </div>
            </div>

            {selected.storyAr || selected.storyEn ? (
              <button
                type="button"
                onClick={() => setStoryProject(selected)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#c9a961]/70 bg-[#c9a961]/10 px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-[#c9a961] hover:bg-[#c9a961]/20 focus:outline-none focus:ring-2 focus:ring-[#c9a961] focus:ring-offset-2"
              >
                <BookOpen className="h-4 w-4" />
                {locale === "ar" ? "قصة المكان" : "Discover the Story"}
              </button>
            ) : null}

            <Link
              to="/projects/$id"
              params={{ id: selected.id }}
              className={`${selected.storyAr || selected.storyEn ? "mt-2" : "mt-4"} btn-primary flex w-full items-center justify-center gap-2 text-sm`}
            >
              <MapPin className="h-4 w-4" />
              {locale === "ar" ? "عرض التفاصيل الكاملة" : "View Full Details"}
            </Link>
          </div>
        </div>
      )}

      {storyProject && (
        <PlaceStoryModal project={storyProject} locale={locale} onClose={closeStory} />
      )}
    </div>
  );
}
