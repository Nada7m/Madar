import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getRole, setRole, isEmployee } from "@/lib/auth";
import { getLocale, setLocale, getLocaleToggleLabel } from "@/lib/i18n";
import { t } from "@/lib/translations";
import { Plus, LogIn, LogOut, Menu, X, Globe } from "lucide-react";

const links: { to: string; label: Parameters<typeof t>[0]; exact?: boolean }[] = [
  { to: "/", label: "nav.home", exact: true },
  { to: "/about", label: "nav.about" },
  { to: "/map", label: "nav.map" },
  { to: "/projects", label: "nav.projects" },
  { to: "/routes", label: "nav.routes" },
  { to: "/local-guides", label: "nav.local_guides" },
  { to: "/statistics", label: "nav.statistics" },
  { to: "/reports", label: "nav.reports" },
];

function BrandLogo({ className = "h-9 w-9" }: { className?: string }) {
  return <img src="/madarLogo.png" alt="Madar logo" className={`object-contain ${className}`} />;
}

export function SiteHeader() {
  const [role, setR] = useState<string>("guest");
  const [open, setOpen] = useState(false);
  const [locale, setL] = useState<"ar" | "en">("ar");
  const navigate = useNavigate();

  useEffect(() => {
    setR(getRole());
    setL(getLocale());
    const h = () => setR(getRole());
    const l = () => setL(getLocale());
    window.addEventListener("madar-role-change", h);
    window.addEventListener("madar-language-change", l);
    return () => {
      window.removeEventListener("madar-role-change", h);
      window.removeEventListener("madar-language-change", l);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const employee = role === "employee" || role === "admin";
  const isEnglish = locale === "en";
  const visibleLinks = links.filter((link) => {
    if (link.to === "/routes") return !employee;
    return link.to !== "/statistics" && link.to !== "/reports" ? true : employee;
  });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <BrandLogo className="h-9 w-9 shrink-0 rounded-lg" />
          <div className="leading-tight">
            <div className="text-base font-bold text-foreground">مدار</div>
            <div className="text-[10px] text-muted-foreground tracking-widest">MADAR</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {visibleLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
              activeOptions={l.exact ? { exact: true } : undefined}
              activeProps={{ className: "!text-primary bg-secondary" }}
            >
              {t(l.label, locale)}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setLocale(isEnglish ? "ar" : "en")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-input px-2.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            aria-label="Toggle language"
          >
            <Globe className="h-3.5 w-3.5" />
            {getLocaleToggleLabel(locale)}
          </button>
          {employee && (
            <Link
              to="/projects/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" /> إضافة مشروع
            </Link>
          )}
          {employee ? (
            <button
              onClick={() => {
                setRole("guest");
                navigate({ to: "/" });
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-input px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              <LogOut className="h-3.5 w-3.5" /> تسجيل الخروج
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-lg border border-input px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              <LogIn className="h-3.5 w-3.5" /> تسجيل الدخول
            </Link>
          )}
        </div>

        <button
          className="lg:hidden rounded-md p-2 text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1 text-sm">
            <div className="mb-2 flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/40 px-3 py-2">
              <BrandLogo className="h-8 w-8 shrink-0 rounded-md" />
              <div className="leading-tight">
                <div className="text-sm font-bold text-foreground">مدار</div>
                <div className="text-[10px] tracking-widest text-muted-foreground">MADAR</div>
              </div>
            </div>
            {visibleLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 font-medium text-muted-foreground hover:bg-secondary hover:text-primary"
                activeOptions={l.exact ? { exact: true } : undefined}
                activeProps={{ className: "!text-primary bg-secondary" }}
              >
                {t(l.label, locale)}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setLocale(isEnglish ? "ar" : "en")}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-input px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              <Globe className="h-3.5 w-3.5" />
              {getLocaleToggleLabel(locale)}
            </button>
            <div className="mt-2 flex flex-col gap-2">
              {isEmployee() && (
                <Link
                  to="/projects/new"
                  onClick={() => setOpen(false)}
                  className="btn-primary text-center text-xs"
                >
                  {isEnglish ? "Add project" : "إضافة مشروع"}
                </Link>
              )}
              {employee ? (
                <button
                  onClick={() => {
                    setRole("guest");
                    setOpen(false);
                    navigate({ to: "/" });
                  }}
                  className="btn-outline text-xs"
                >
                  {isEnglish ? "Logout" : "تسجيل الخروج"}
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="btn-outline text-center text-xs"
                >
                  {isEnglish ? "Login" : "تسجيل الدخول"}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
