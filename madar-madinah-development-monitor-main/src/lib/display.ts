import type { ProjectCategory, ProjectStatus } from "@/data/projects";

const STATUS_LABELS: Record<string, ProjectStatus> = {
  completed: "مكتمل",
  in_progress: "قيد التنفيذ",
  planned: "مخطط",
  "قيد التنفيذ": "قيد التنفيذ",
  مكتمل: "مكتمل",
  مخطط: "مخطط",
};

const CATEGORY_LABELS: Record<string, ProjectCategory> = {
  health: "صحي",
  commercial: "تجاري",
  transportation: "نقل و مواصلات",
  transport: "نقل و مواصلات",
  "نقل ومواصلات": "نقل و مواصلات",
  heritage_tourism: "تراثي و سياحي",
  heritage: "تراثي و سياحي",
  tourism: "تراثي و سياحي",
  education: "تعليم",
  recreational: "ترفيهي",
  investment: "استثماري",
  residential_investment: "سكني استثماري",
  hotel: "فندقي",
  infrastructure: "بنية تحتية",
  reserve: "محمية",
  "تراثي و سياحي": "تراثي و سياحي",
  "تراثي وسياحي": "تراثي و سياحي",
  صحي: "صحي",
  تجاري: "تجاري",
  "نقل و مواصلات": "نقل و مواصلات",
  تعليم: "تعليم",
  ترفيهي: "ترفيهي",
  محمية: "محمية",
  استثماري: "استثماري",
  "سكني استثماري": "سكني استثماري",
  فندقي: "فندقي",
  "بنية تحتية": "بنية تحتية",
};

function normalizeKey(value: unknown) {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s+و\s+/g, " و ")
    .trim();
}

export function getStatusLabel(status: unknown): ProjectStatus {
  const label = STATUS_LABELS[normalizeKey(status)];
  return label ?? (String(status) as ProjectStatus);
}

export function getCategoryLabel(category: unknown): ProjectCategory {
  const normalizedKey = normalizeKey(category);
  const label = CATEGORY_LABELS[normalizedKey];
  return label ?? (String(category) as ProjectCategory);
}

export function statusColor(status: unknown) {
  const label = getStatusLabel(status);
  // Use the same colors as the map legend to keep UI consistent
  if (label === "مكتمل") return "#3f7358"; // green
  if (label === "قيد التنفيذ") return "#c9a961"; // yellow (matches legend)
  if (label === "مخطط") return "#8a8a8a"; // gray (matches legend)
  return "#8a8a8a";
}

function formatPlainNumber(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    useGrouping: false,
  }).format(value);
}

export function formatArea(area: unknown, unit: string) {
  const number = typeof area === "number" ? area : Number(String(area).replace(/[,\s]+/g, ""));
  const hasValue = Number.isFinite(number) && number !== 0;
  const formattedNumber = hasValue
    ? formatPlainNumber(number, Number.isInteger(number) ? 0 : 2)
    : String(area);

  const normalizedUnit = unit.trim().toLowerCase();
  const unitLabel =
    /square[_\s]?meter(s)?/i.test(normalizedUnit) || normalizedUnit === "m²" ? "m²" : "m²";

  return `${formattedNumber} ${unitLabel}`.trim();
}
