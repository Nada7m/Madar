import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeInfo,
  BookOpen,
  MapPinned,
  MessageCircleMore,
  Route as RouteIcon,
} from "lucide-react";
import PIC4 from "@/assets/PIC4.png";
import { SiteHeader } from "@/components/SiteHeader";
import { getLocale, type Locale } from "@/lib/i18n";

export const Route = createFileRoute("/")({ component: HomePage });

const copy = {
  ar: {
    eyebrow: "اكتشف المدينة بطريقة مختلفة",
    description:
      "منصة رقمية تثري تجربة زائر المدينة المنورة، وتجمع المشاريع والأماكن والتجارب في خريطة تفاعلية تساعدك على الاكتشاف، ومعرفة قصة المكان، وبناء رحلة تناسب اهتماماتك.",
    start: "ابدأ الاستكشاف",
    plan: "خطط رحلتك",
    featuresTitle: "اكتشف المدينة مع مدار",
    featuresSubtitle: "كل ما تحتاجه لاكتشاف المدينة وفهم أماكنها وصناعة تجربة تناسبك.",
    journeyTitle: "رحلتك تبدأ من مدار",
    journeySubtitle: "من اختيار ما يناسبك إلى اكتشاف قصة المكان.",
    finalTitle: "المدينة أمامك... ابدأ من مدار",
    finalDescription: "اكتشف أماكن جديدة، تعرّف على قصصها، وابنِ تجربة تناسب وقتك واهتماماتك.",
    exploreCity: "استكشف المدينة",
    discoverRoutes: "اكتشف المسارات",
    footer: "منصة رقمية لاكتشاف المدينة المنورة وفهم أماكنها وتجاربها.",
  },
  en: {
    eyebrow: "Discover Madinah Differently",
    description:
      "A digital platform that enriches the Madinah visitor experience by bringing projects, places, and local experiences together on an interactive map—helping you discover the city, uncover the story behind each place, and build a journey around your interests.",
    start: "Start Exploring",
    plan: "Plan Your Journey",
    featuresTitle: "Discover Madinah with Madar",
    featuresSubtitle:
      "Everything you need to explore the city, understand its places, and shape an experience around you.",
    journeyTitle: "Your Journey Starts with Madar",
    journeySubtitle: "From choosing what interests you to uncovering the story of each place.",
    finalTitle: "Madinah Is Yours to Discover",
    finalDescription:
      "Discover new places, uncover their stories, and build an experience around your time and interests.",
    exploreCity: "Explore Madinah",
    discoverRoutes: "Discover Routes",
    footer: "A digital platform for discovering Madinah, its places, and its experiences.",
  },
} as const;

function features(locale: Locale) {
  const ar = locale === "ar";
  return [
    {
      icon: MapPinned,
      title: ar ? "خريطة تفاعلية للاستكشاف" : "An Interactive Exploration Map",
      description: ar
        ? "استكشف المشاريع والمعالم والفنادق والمطاعم والمقاهي على خريطة واحدة، وتعرّف على ما يحيط بك بسهولة."
        : "Explore projects, landmarks, hotels, restaurants, and cafés on one map, and easily discover what is around you.",
      label: ar ? "استكشف الخريطة" : "Explore the Map",
      to: "/map" as const,
    },
    {
      icon: RouteIcon,
      title: ar ? "مسارات مخصصة لك" : "Routes Tailored to You",
      description: ar
        ? "احصل على مسارات مقترحة بناءً على اهتماماتك، والوقت المتاح لك، وطبيعة التجربة التي تبحث عنها."
        : "Get suggested routes based on your interests, available time, and the kind of experience you are looking for.",
      label: ar ? "خطط رحلتك" : "Plan Your Journey",
      to: "/routes" as const,
    },
    {
      icon: BookOpen,
      title: ar ? "قصة المكان" : "Place Story",
      description: ar
        ? "اكتشف الحكاية خلف المكان، وتعرّف على قيمته وتاريخه ودوره في تجربة المدينة قبل زيارته."
        : "Uncover the story behind a place and understand its value, history, and role in the Madinah experience before you visit.",
      label: ar ? "اكتشف القصص" : "Discover Stories",
      to: "/map" as const,
    },
    {
      icon: MessageCircleMore,
      title: ar ? "مساعد ذكي للزائر" : "A Smart Visitor Assistant",
      description: ar
        ? "اسأل عن الأماكن والتجارب، واحصل على مساعدة لاختيار ما يناسب اهتماماتك وتنظيم زيارتك للمدينة."
        : "Ask about places and experiences, and get help choosing what suits your interests and organizing your visit.",
      label: ar ? "اسأل مساعد مدار" : "Ask Madar",
      action: () => window.dispatchEvent(new Event("madar-open-city-assistant")),
    },
    {
      icon: BadgeInfo,
      title: ar ? "ملف تعريفي متكامل" : "Complete Place Profiles",
      description: ar
        ? "تعرّف على كل مكان من خلال معلوماته وصوره وموقعه وأبرز ما يميزه، في تجربة موحّدة وسهلة."
        : "Learn about every place through its information, images, location, and highlights in one clear, consistent experience.",
      label: ar ? "استكشف الأماكن" : "Explore Places",
      to: "/projects" as const,
    },
  ];
}

function steps(locale: Locale) {
  const ar = locale === "ar";
  return [
    {
      number: "01",
      title: ar ? "اختر ما يهمك" : "Choose What Matters",
      description: ar
        ? "حدد اهتماماتك والوقت المتاح لك."
        : "Select your interests and the time available to you.",
    },
    {
      number: "02",
      title: ar ? "اكتشف مسارك" : "Discover Your Route",
      description: ar
        ? "استكشف الأماكن والمسارات المقترحة على الخريطة."
        : "Explore places and suggested routes on the map.",
    },
    {
      number: "03",
      title: ar ? "عِش التجربة" : "Experience the City",
      description: ar
        ? "تعرّف على قصة كل مكان، ثم انطلق لاكتشافه."
        : "Learn the story of each place, then set out to discover it.",
    },
  ];
}

function HomePage() {
  const [offset, setOffset] = useState(0);
  const [locale, setLocale] = useState(getLocale);
  const text = copy[locale];
  const ar = locale === "ar";
  const Arrow = ar ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const scroll = () => setOffset(window.scrollY * 0.3);
    const language = () => setLocale(getLocale());
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("madar-language-change", language);
    return () => {
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("madar-language-change", language);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground" dir={ar ? "rtl" : "ltr"}>
      <SiteHeader />
      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden">
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translate3d(0, ${offset}px, 0)` }}
        >
          <img
            src={PIC4}
            alt={ar ? "منظر جوي للمدينة المنورة" : "Aerial view of Madinah"}
            className="h-[110%] w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[#1f3829]/45" />
        <div
          className="absolute inset-0"
          style={{
            background: ar
              ? "linear-gradient(90deg,transparent 20%,rgba(31,56,41,.58) 62%,rgba(31,56,41,.94))"
              : "linear-gradient(270deg,transparent 20%,rgba(31,56,41,.58) 62%,rgba(31,56,41,.94))",
          }}
        />
        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl items-center px-6 py-20 sm:px-10 lg:px-16">
          <div className="max-w-xl animate-fade-up text-start">
            <div className="mb-6 h-[3px] w-16 rounded-full bg-gold" />
            <p className="text-sm font-bold tracking-wide text-[#eadba9] sm:text-base">
              {text.eyebrow}
            </p>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight text-white sm:text-6xl">
              <span>مـدار</span>
              <span className="mx-3 opacity-60">|</span>
              <span className="text-[#eadba9]">Madar</span>
            </h1>
            <p className="mt-7 max-w-[58ch] text-base leading-8 text-white/95 sm:text-lg sm:leading-9">
              {text.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/map" search={{ route: undefined }} className="btn-primary text-center">
                {text.start}
              </Link>
              <Link
                to="/routes"
                className="btn-outline border-white/75 bg-white/10 text-center !text-white hover:!bg-white hover:!text-primary"
              >
                {text.plan}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <header className="mx-auto max-w-2xl text-center">
            <div className="gold-divider mx-auto" />
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{text.featuresTitle}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{text.featuresSubtitle}</p>
          </header>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-6">
            {features(locale).map((item, index) => (
              <article
                key={item.title}
                className={`group flex flex-col rounded-2xl border border-[#e2d6b8] bg-card p-7 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-[#c9a961] hover:shadow-[var(--shadow-elegant)] ${index < 3 ? "lg:col-span-2" : index === 3 ? "lg:col-span-2 lg:col-start-2" : "lg:col-span-2"}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
                  <item.icon className="h-6 w-6" strokeWidth={1.7} />
                </div>
                <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
                {item.to ? (
                  <Link
                    to={item.to}
                    search={item.to === "/map" ? { route: undefined } : undefined}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-soft"
                  >
                    {item.label}
                    <Arrow className="h-4 w-4" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={item.action}
                    className="mt-5 inline-flex items-center gap-2 self-start text-sm font-bold text-primary hover:text-primary-soft"
                  >
                    {item.label}
                    <Arrow className="h-4 w-4" />
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[#e2d6b8] bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <header className="mx-auto max-w-2xl text-center">
              <div className="gold-divider mx-auto" />
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{text.journeyTitle}</h2>
              <p className="mt-3 text-muted-foreground">{text.journeySubtitle}</p>
            </header>
            <div className="relative mt-12 grid gap-8 md:grid-cols-3">
              <div
                className="absolute inset-x-[16%] top-7 hidden border-t border-dashed border-[#c9a961]/60 md:block"
                aria-hidden="true"
              />
              {steps(locale).map((step) => (
                <article key={step.number} className="relative text-center">
                  <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#c9a961] bg-background text-sm font-extrabold text-primary shadow-sm">
                    {step.number}
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-center text-primary-foreground shadow-[var(--shadow-elegant)] sm:px-12 sm:py-16">
            <div className="mx-auto h-[3px] w-14 rounded-full bg-[#c9a961]" />
            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">{text.finalTitle}</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-8 text-white/80">
              {text.finalDescription}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/map"
                search={{ route: undefined }}
                className="rounded-xl bg-[#c9a961] px-6 py-3 font-bold text-[#183126] transition hover:bg-[#dcc384]"
              >
                {text.exploreCity}
              </Link>
              <Link
                to="/routes"
                className="rounded-xl border border-white/60 px-6 py-3 font-bold text-white transition hover:bg-white hover:text-primary"
              >
                {text.discoverRoutes}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} مدار | Madar — {text.footer}
        </div>
      </footer>
    </div>
  );
}
