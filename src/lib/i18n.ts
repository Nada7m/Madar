import { useEffect, useState } from "react";

export type Locale = "ar" | "en";

const LOCALE_KEY = "madar_locale";

export function getLocale(): Locale {
  if (typeof window === "undefined") return "ar";
  const saved = window.localStorage.getItem(LOCALE_KEY);
  return saved === "en" ? "en" : "ar";
}

export function setLocale(locale: Locale) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCALE_KEY, locale);
  window.dispatchEvent(new Event("madar-language-change"));
}

export function useLocale(): Locale {
  const [locale, setLocaleState] = useState<Locale>("ar");

  useEffect(() => {
    const syncLocale = () => setLocaleState(getLocale());
    syncLocale();
    window.addEventListener("madar-language-change", syncLocale);
    return () => window.removeEventListener("madar-language-change", syncLocale);
  }, []);

  return locale;
}

export function getLocaleToggleLabel(locale: Locale) {
  return locale === "ar" ? "English" : "العربية";
}

export function resolveLocalizedText(
  valueAr?: string | null,
  valueEn?: string | null,
  locale: Locale = getLocale(),
) {
  if (!valueAr && !valueEn) return "";
  return locale === "en" ? (valueEn || valueAr || "") : (valueAr || valueEn || "");
}

export function resolveLocalizedList(
  listAr?: string[] | null,
  listEn?: string[] | null,
  locale: Locale = getLocale(),
): string[] {
  if (locale === "en") {
    return listEn && listEn.length > 0 ? listEn : listAr ?? [];
  }
  return listAr && listAr.length > 0 ? listAr : listEn ?? [];
}

export function getProjectDisplayName(project: { name: string; name_en?: string }, locale: Locale = getLocale()) {
  return locale === "en" ? (project.name_en || project.name) : project.name;
}

export function getProjectDisplayDescription(
  project: { description: string; description_en?: string; visitor_description?: string; visitor_description_en?: string },
  locale: Locale = getLocale(),
) {
  if (locale === "en") {
    return project.description_en || project.visitor_description_en || project.description;
  }
  return project.visitor_description || project.description;
}
