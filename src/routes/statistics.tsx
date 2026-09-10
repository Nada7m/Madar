import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { getProjects } from "@/lib/supabase";
import { CATEGORIES, STATUSES, type Project } from "@/data/projects";
import { isEmployee } from "@/lib/auth";
import { useMemo, useState, useEffect, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { LayoutGrid, CheckCircle2, TrendingUp, X, Ruler, CalendarClock } from "lucide-react";
import type { Map as LeafletMap } from "leaflet";

export const Route = createFileRoute("/statistics")({
  beforeLoad: () => {
    if (!isEmployee()) {
      throw redirect({ to: "/" });
    }
  },
  component: StatsPage,
  head: () => ({ meta: [{ title: "الإحصائيات — مدار" }] }),
});

const PALETTE = [
  "#2d5a3f",
  "#c9a961",
  "#7a9a7f",
  "#a68a5c",
  "#3f7358",
  "#d4b87a",
  "#5a8064",
  "#8b7042",
  "#6b8f75",
  "#b09968",
  "#456d4e",
  "#e0c98b",
];

const STATUS_COLORS: Record<string, string> = {
  مكتمل: "#3f7358",
  "قيد التنفيذ": "#c9a961",
  مخطط: "#8a8a8a",
};

const MAP_TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

const KM2_IN_M2 = 1_000_000;
const MADINAH_CITY_AREA_M2 = 709 * KM2_IN_M2;
const NEIGHBORHOOD_CLUSTER_STEP = 0.01;
const MIN_PROJECT_YEAR = 1980;
const MAX_PROJECT_YEAR = 2100;

function parseAreaToSquareMeters(rawArea: string, rawUnit: string): number | null {
  const parsedArea = Number(String(rawArea).replace(/[^\d.-]+/g, ""));
  if (!Number.isFinite(parsedArea) || parsedArea <= 0) return null;

  const unit = String(rawUnit || "").trim().toLowerCase();
  if (/km|كيلو/.test(unit)) {
    return parsedArea * KM2_IN_M2;
  }

  if (/m2|م²|متر|meter|square[_\s]?meter/.test(unit)) {
    return parsedArea;
  }

  // Default to square meters when unit is missing or represented as m2/m².
  return parsedArea;
}

function formatPlainNumber(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    useGrouping: false,
  }).format(value);
}

function formatAreaValue(squareMeters: number | null): string {
  if (squareMeters === null || !Number.isFinite(squareMeters) || squareMeters <= 0) {
    return "غير متاح";
  }

  const millionValue = squareMeters / KM2_IN_M2;
  const rounded = Number(millionValue.toFixed(1));
  return `${formatPlainNumber(rounded).replace(/,/g, "")} مليون م²`;
}

function formatCoveragePercent(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "0%";
  const rounded = Number(value.toFixed(2));
  return `${rounded}%`;
}

function isReasonableProjectYear(year: number): boolean {
  return Number.isInteger(year) && year >= MIN_PROJECT_YEAR && year <= MAX_PROJECT_YEAR;
}

function parseDateValue(raw: string): Date | null {
  if (!raw) return null;

  const normalized = String(raw)
    .trim()
    .replace(/[\u0660-\u0669]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0));

  const ymd = normalized.match(/\b((?:19|20)\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
  if (ymd) {
    const year = Number(ymd[1]);
    const month = Number(ymd[2]);
    const day = Number(ymd[3]);
    if (isReasonableProjectYear(year) && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const candidate = new Date(year, month - 1, day);
      if (!Number.isNaN(candidate.getTime())) return candidate;
    }
  }

  const ym = normalized.match(/\b((?:19|20)\d{2})[-/.](\d{1,2})\b/);
  if (ym) {
    const year = Number(ym[1]);
    const month = Number(ym[2]);
    if (isReasonableProjectYear(year) && month >= 1 && month <= 12) {
      const candidate = new Date(year, month - 1, 1);
      if (!Number.isNaN(candidate.getTime())) return candidate;
    }
  }

  const yearMatch = normalized.match(/\b((?:19|20)\d{2})\b/);
  if (yearMatch) {
    const year = Number(yearMatch[1]);
    if (isReasonableProjectYear(year)) {
      return new Date(year, 0, 1);
    }
  }

  return null;
}

function isCompletedStatus(status: string): boolean {
  const normalized = status.trim().toLowerCase().replace(/\s+/g, "_");
  return normalized === "completed" || normalized === "مكتمل";
}

function isInProgressStatus(status: string): boolean {
  const normalized = status.trim().toLowerCase().replace(/\s+/g, "_");
  return normalized === "in_progress" || normalized === "قيد_التنفيذ";
}

function durationInMonths(startDate: string, endDate: string): number | null {
  const start = parseDateValue(startDate);
  const end = parseDateValue(endDate);
  if (!start || !end) return null;

  const diff = end.getTime() - start.getTime();
  if (diff <= 0) return null;
  return diff / (1000 * 60 * 60 * 24 * 30.4375);
}

function formatDuration(months: number | null): string {
  if (months === null || !Number.isFinite(months) || months <= 0) return "غير متاح";

  const roundedMonths = Math.max(1, Math.round(months));
  const years = Math.floor(roundedMonths / 12);
  const remainingMonths = roundedMonths % 12;

  const formatYears = (value: number) => {
    if (value === 1) return "سنة واحدة";
    if (value === 2) return "سنتان";
    if (value >= 3 && value <= 10) return `${formatPlainNumber(value)} سنوات`;
    return `${formatPlainNumber(value)} سنة`;
  };

  const formatMonths = (value: number) => {
    if (value === 1) return "شهر واحد";
    if (value === 2) return "شهران";
    if (value >= 3 && value <= 10) return `${formatPlainNumber(value)} أشهر`;
    return `${formatPlainNumber(value)} شهرًا`;
  };

  if (years > 0 && remainingMonths > 0) {
    return `${formatYears(years)} و${formatMonths(remainingMonths)}`;
  }

  if (years > 0) {
    return formatYears(years);
  }

  return formatMonths(remainingMonths || roundedMonths);
}

function normalizeNeighborhoodName(rawName: string): string {
  const clean = rawName.trim().replace(/^حي\s*/u, "");
  return `حي ${clean}`;
}

function coordinateKey(lat: number, lng: number): string {
  return `${lat.toFixed(5)},${lng.toFixed(5)}`;
}

function neighborhoodClusterKey(lat: number, lng: number): string {
  const latBand = Math.round(lat / NEIGHBORHOOD_CLUSTER_STEP);
  const lngBand = Math.round(lng / NEIGHBORHOOD_CLUSTER_STEP);
  return `${latBand}:${lngBand}`;
}

function loadNeighborhoodCache(): Record<string, string> {
  if (typeof window === "undefined") return {};

  try {
    const parsed = JSON.parse(window.localStorage.getItem("madar_neighborhood_cache_v1") || "{}");
    if (typeof parsed !== "object" || parsed === null) return {};
    return parsed as Record<string, string>;
  } catch {
    return {};
  }
}

function saveNeighborhoodCache(cache: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("madar_neighborhood_cache_v1", JSON.stringify(cache));
}

async function reverseGeocodeNeighborhood(lat: number, lng: number): Promise<string | null> {
  let timeout: number | undefined;
  try {
    const url = new URL("/api/reverse-geocode", window.location.origin);
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lng", String(lng));
    const controller = new AbortController();
    timeout = window.setTimeout(() => controller.abort(), 7000);

    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { name?: string | null };
    const candidate = data.name;

    if (!candidate || !candidate.trim()) return null;

    return normalizeNeighborhoodName(candidate);
  } catch {
    return null;
  } finally {
    if (timeout !== undefined) window.clearTimeout(timeout);
  }
}

function formatProjectsCountLabel(count: number): string {
  if (count === 1) return "مشروع";
  if (count === 2) return "مشروعان";
  if (count >= 3 && count <= 10) return "مشاريع";
  return "مشروع";
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const r = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return r * c;
}

function getStringProperty(value: unknown, property: string): string | null {
  if (typeof value !== "object" || value === null) return null;

  const candidate = (value as Record<string, unknown>)[property];
  return typeof candidate === "string" ? candidate : null;
}

function StatsPage() {
  const [all, setAll] = useState<Project[]>([]);
  const [selCat, setSelCat] = useState<string | null>(null);
  const [selStatus, setSelStatus] = useState<string | null>(null);
  const densityMapContainer = useRef<HTMLDivElement | null>(null);
  const densityMapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      try {
        const projects = await getProjects();
        if (!mounted) return;
        setAll(projects);
      } catch (error) {
        console.error(error);
      }
    };

    loadProjects();
    const interval = window.setInterval(loadProjects, 60_000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  // All 12 categories, always shown
  const catData = useMemo(
    () => CATEGORIES.map((c) => ({ name: c, value: all.filter((p) => p.category === c).length })),
    [all],
  );
  const catDataForChart = useMemo(() => catData.filter((d) => d.value > 0), [catData]);
  const statusData = useMemo(
    () => STATUSES.map((s) => ({ name: s, value: all.filter((p) => p.status === s).length })),
    [all],
  );

  const totalProjects = all.length;
  const completedProjects = all.filter((p) => isCompletedStatus(p.status));
  const completed = completedProjects.length;
  const avgProgress = totalProjects
    ? Math.round(all.reduce((s, p) => s + p.progress, 0) / totalProjects)
    : 0;

  const areaStats = useMemo(() => {
    let totalAreaM2 = 0;
    let completedAreaM2 = 0;
    let validAreaCount = 0;
    let validCompletedAreaCount = 0;

    all.forEach((project) => {
      const areaM2 = parseAreaToSquareMeters(project.area, project.areaUnit);
      if (areaM2 === null) return;

      totalAreaM2 += areaM2;
      validAreaCount += 1;

      if (isCompletedStatus(project.status)) {
        completedAreaM2 += areaM2;
        validCompletedAreaCount += 1;
      }
    });

    return {
      totalAreaM2: validAreaCount > 0 ? totalAreaM2 : null,
      completedAreaM2: validCompletedAreaCount > 0 ? completedAreaM2 : null,
      validAreaCount,
      validCompletedAreaCount,
    };
  }, [all]);

  const areaKpis = useMemo(() => {
    const values = [
      { label: "إجمالي مساحة المشاريع", value: formatAreaValue(areaStats.totalAreaM2) },
      { label: "مساحة المشاريع المكتملة", value: formatAreaValue(areaStats.completedAreaM2) },
    ];

    return values.sort((a, b) => {
      const aNum = Number(String(a.value).replace(/[^\d.]/g, "")) || 0;
      const bNum = Number(String(b.value).replace(/[^\d.]/g, "")) || 0;
      return aNum - bNum;
    });
  }, [areaStats.completedAreaM2, areaStats.totalAreaM2]);

  const cityCoveragePercent = useMemo(() => {
    if (areaStats.totalAreaM2 === null || !Number.isFinite(areaStats.totalAreaM2)) return null;
    return (areaStats.totalAreaM2 / MADINAH_CITY_AREA_M2) * 100;
  }, [areaStats.totalAreaM2]);

  const durationStats = useMemo(() => {
    const durationCandidates = all.filter(
      (project) => isCompletedStatus(project.status) || isInProgressStatus(project.status),
    );

    const months = durationCandidates
      .map((project) => durationInMonths(project.startDate, project.endDate))
      .filter((value): value is number => value !== null);

    if (months.length === 0) {
      return { averageMonths: null, validCount: 0 };
    }

    const totalMonths = months.reduce((sum, value) => sum + value, 0);
    return {
      averageMonths: totalMonths / months.length,
      validCount: months.length,
    };
  }, [completedProjects]);

  const growthData = useMemo(() => {
    const counts = new Map<number, { inProgress: number; completed: number }>();

    all.forEach((project) => {
      if (isInProgressStatus(project.status)) {
        const start = parseDateValue(project.startDate);
        if (!start) return;
        const year = start.getFullYear();
        const bucket = counts.get(year) ?? { inProgress: 0, completed: 0 };
        bucket.inProgress += 1;
        counts.set(year, bucket);
      }

      if (isCompletedStatus(project.status)) {
        const end = parseDateValue(project.endDate);
        if (end) {
          const year = end.getFullYear();
          const bucket = counts.get(year) ?? { inProgress: 0, completed: 0 };
          bucket.completed += 1;
          counts.set(year, bucket);
        }
      }
    });

    return Array.from(counts.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([year, values]) => ({
        year: String(year),
        inProgress: values.inProgress,
        completed: values.completed,
      }));
  }, [all]);

  const densityPoints = useMemo(() => {
    const points = all.filter(
      (project): project is Project & { lat: number; lng: number } =>
        typeof project.lat === "number" && typeof project.lng === "number",
    );

    if (points.length === 0) return [];

    const densities = points.map((point) => {
      const neighborsWithin3Km = points.reduce((count, other) => {
        const distance = haversineKm(point.lat, point.lng, other.lat, other.lng);
        return distance <= 3 ? count + 1 : count;
      }, 0);

      return {
        ...point,
        density: neighborsWithin3Km,
      };
    });

    const maxDensity = Math.max(...densities.map((item) => item.density), 1);

    return densities.map((item) => ({
      ...item,
      weight: item.density / maxDensity,
    }));
  }, [all]);

  useEffect(() => {
    if (!densityMapContainer.current) return;

    let canceled = false;
    let localMap: LeafletMap | null = null;

    const initDensityMap = async () => {
      const { default: L } = await import("leaflet");
      if (canceled || !densityMapContainer.current) return;

      const map = L.map(densityMapContainer.current, {
        center: [24.4867, 39.6142],
        zoom: 11,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer(MAP_TILE_URL, {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
        maxZoom: 19,
      }).addTo(map);

      densityPoints.forEach((point) => {
        const radiusMeters = 280 + point.weight * 1400;
        const fillOpacity = 0.2 + point.weight * 0.45;

        L.circle([point.lat, point.lng], {
          radius: radiusMeters,
          color: "#c9a961",
          weight: 1,
          fillColor: "#2d5a3f",
          fillOpacity,
        }).addTo(map);
      });

      densityPoints.forEach((point) => {
        L.circleMarker([point.lat, point.lng], {
          radius: 4,
          color: "#ffffff",
          weight: 1,
          fillColor: "#c9a961",
          fillOpacity: 0.95,
        })
          .bindTooltip(point.name, {
            direction: "top",
            offset: [0, -6],
          })
          .addTo(map);
      });

      if (densityPoints.length > 0) {
        const bounds = L.latLngBounds(densityPoints.map((point) => [point.lat, point.lng] as [number, number]));
        map.fitBounds(bounds.pad(0.12));
      }

      densityMapRef.current = map;
      localMap = map;
    };

    initDensityMap().catch((error) => {
      console.error("Failed to initialize density map:", error);
    });

    return () => {
      canceled = true;
      if (localMap) localMap.remove();
      densityMapRef.current = null;
    };
  }, [densityPoints]);

  const filteredByCat = selCat ? all.filter((p) => p.category === selCat) : [];
  const filteredByStatus = selStatus ? all.filter((p) => p.status === selStatus) : [];
  const activeList = selCat ? filteredByCat : filteredByStatus;

  const kpiCards = [
    { icon: LayoutGrid, label: "إجمالي المشاريع", value: totalProjects, accent: "#2d5a3f" },
    { icon: CheckCircle2, label: "المشاريع المكتملة", value: completed, accent: "#3f7358" },
    { icon: TrendingUp, label: "متوسط التقدم", value: `${avgProgress}%`, accent: "#c9a961" },
    {
      icon: Ruler,
      label: "إجمالي مساحة المشاريع",
      value: areaStats.totalAreaM2 === null ? "غير متاح" : formatAreaValue(areaStats.totalAreaM2),
      accent: "#7a9a7f",
    },
    {
      icon: Ruler,
      label: "مساحة المشاريع المكتملة",
      value: areaStats.completedAreaM2 === null ? "غير متاح" : formatAreaValue(areaStats.completedAreaM2),
      accent: "#a68a5c",
    },
    {
      icon: CalendarClock,
      label: "نسبة نطاق المشاريع من مساحة المدينة",
      value: cityCoveragePercent === null ? "غير متاح" : formatCoveragePercent(cityCoveragePercent),
      accent: "#c9a961",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="gold-divider" />
        <h1 className="mt-3 text-3xl font-bold text-foreground">الإحصائيات</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          لمحة سريعة عن المشاريع التنموية وتوزيعها.
        </p>

        {/* KPI cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {kpiCards.map((card) => (
            <KpiCard
              key={card.label}
              icon={card.icon}
              label={card.label}
              value={card.value}
              accent={card.accent}
            />
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-bold text-foreground">
              التوزيع حسب التصنيف (12 تصنيفاً)
            </h2>
            <div className="mt-4 h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={catDataForChart}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={120}
                    onClick={(data) => setSelCat(getStringProperty(data, "name"))}
                  >
                    {catDataForChart.map((d) => (
                      <Cell
                        key={d.name}
                        fill={PALETTE[CATEGORIES.indexOf(d.name) % PALETTE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${String(value)} مشروع`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-1.5 text-[11px]">
              {catData.map((d, i) => (
                <button
                  key={d.name}
                  onClick={() => d.value > 0 && setSelCat(d.name)}
                  className={`flex items-center gap-2 rounded px-2 py-1 text-right transition ${d.value > 0 ? "hover:bg-secondary cursor-pointer" : "opacity-40 cursor-default"}`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-sm shrink-0"
                    style={{ background: PALETTE[i % PALETTE.length] }}
                  />
                  <span className="text-muted-foreground truncate">{d.name}</span>
                  <span className="mr-auto font-semibold text-foreground">{d.value}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-bold text-foreground">التوزيع حسب الحالة</h2>
            <div className="mt-4 h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusData}
                  onClick={(event) => setSelStatus(getStringProperty(event, "activeLabel"))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`${String(value)} مشروع`, "العدد"]} />
                  <Legend />
                  <Bar dataKey="value" name="عدد المشاريع" radius={[8, 8, 0, 0]}>
                    {statusData.map((d) => (
                      <Cell key={d.name} fill={STATUS_COLORS[d.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-foreground">التوزيع الزمني للمشاريع</h2>
            <div className="text-xs font-semibold text-primary">
              متوسط مدة إنجاز المشروع: {formatDuration(durationStats.averageMonths)}
            </div>
          </div>
          <div className="mt-4 h-[320px]">
            {growthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`${String(value)} مشروع`, "العدد"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="inProgress"
                    name="المشاريع قيد التنفيذ"
                    stroke="#2d5a3f"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#c9a961", stroke: "#2d5a3f", strokeWidth: 1 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    name="المشاريع المكتملة"
                    stroke="#c9a961"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#2d5a3f", stroke: "#c9a961", strokeWidth: 1 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                لا توجد تواريخ صالحة لعرض التوزيع الزمني.
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-foreground">خريطة كثافة المشاريع</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              {densityPoints.length} نقطة جغرافية
            </div>
          </div>
          <div className="mt-4">
            <div className="overflow-hidden rounded-xl border border-border">
              <div ref={densityMapContainer} className="h-[360px] w-full" style={{ background: "#0a0a0a" }} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#2d5a3f" }} />
              كثافة أعلى
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#c9a961" }} />
              كثافة أقل
            </div>
          </div>
        </div>

        {(selCat || selStatus) && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">
                {selCat ? `مشاريع تصنيف: ${selCat}` : `مشاريع بحالة: ${selStatus}`}
                <span className="mr-2 text-sm text-muted-foreground">
                  ({activeList.length} مشروع)
                </span>
              </h3>
              <button
                onClick={() => {
                  setSelCat(null);
                  setSelStatus(null);
                }}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary"
              >
                <X className="h-3 w-3" /> إغلاق
              </button>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {activeList.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                  <Link
                    to="/projects/$id"
                    params={{ id: p.id }}
                    className="text-foreground hover:text-primary hover:underline"
                  >
                    {p.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {p.status} · {p.progress}%
                  </span>
                </li>
              ))}
              {activeList.length === 0 && (
                <li className="py-4 text-center text-sm text-muted-foreground">لا توجد مشاريع.</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  accent = "#2d5a3f",
  unit,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  accent?: string;
  unit?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </div>
          <div className="mt-3 flex items-end gap-1.5 flex-wrap">
            <span className="text-[1.6rem] font-extrabold leading-none text-foreground">
              {value}
            </span>
            {unit && <span className="text-sm font-semibold leading-none text-muted-foreground">{unit}</span>}
          </div>
        </div>
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${accent}18`, color: accent }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
