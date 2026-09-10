import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import { BookOpen, Compass, Route as RouteIcon, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { getLocale, type Locale } from "@/lib/i18n";
import MadarHero from "@/assets/madar-hero.jpg";
import PIC1 from "@/assets/PIC1.jpg";
import PIC3 from "@/assets/PIC3.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "عن مبادرة مدار — About Madar" },
      {
        name: "description",
        content: "مدار منصة رقمية لاكتشاف المدينة المنورة وفهم أماكنها وبناء تجربة زائر متكاملة.",
      },
    ],
  }),
});

type CardProps = {
  title: string;
  description: string;
  image: string;
  index: number;
};

function PremiumCard({ title, description, image, index }: CardProps) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsInView(true), index * 150);
    return () => window.clearTimeout(timer);
  }, [index]);

  return (
    <article
      className={`group relative transform overflow-hidden rounded-3xl border border-[#e2d6b8] bg-card shadow-lg transition-all duration-700 ${
        isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } hover:-translate-y-1 hover:shadow-2xl`}
    >
      <div className="relative h-60 overflow-hidden bg-secondary">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#183126]/55 to-transparent" />
      </div>
      <div className="space-y-4 p-7 sm:p-8">
        <h3 className="text-2xl font-bold text-primary">{title}</h3>
        <p className="text-base leading-8 text-foreground/75">{description}</p>
      </div>
      <div className="absolute bottom-0 start-0 h-1 w-14 bg-[#c9a961] transition-all duration-500 group-hover:w-28" />
    </article>
  );
}

const content = {
  ar: {
    heading: "عن مبادرة مدار",
    introduction:
      "مدار منصة رقمية لإثراء تجربة زائر المدينة المنورة، تجمع المشاريع والأماكن والتجارب في بيئة تفاعلية واحدة، لتساعد الزائر على اكتشاف المدينة، وفهم قيمة أماكنها، وبناء رحلة تناسب اهتماماته ووقته.",
    cards: [
      {
        title: "الرسالة",
        description:
          "تحويل معلومات المدينة ومشاريعها وأماكنها إلى تجربة رقمية تفاعلية تساعد الزائر على الاكتشاف، وتثري معرفته بالمكان، وتسهل عليه التخطيط لرحلته.",
        image: PIC3,
      },
      {
        title: "الرؤية",
        description:
          "أن يكون مدار بوابة رقمية موحّدة لاكتشاف المدينة المنورة، تربط بين المكان والمعلومة والقصة والتجربة.",
        image: PIC1,
      },
      {
        title: "النطاق",
        description:
          "يشمل مدار المشاريع التنموية والمعالم والوجهات والتجارب التي تثري رحلة الزائر داخل المدينة المنورة، ويعرضها ضمن تجربة رقمية مترابطة.",
        image: MadarHero,
      },
    ],
    visitorTitle: "ماذا يقدم مدار للزائر؟",
    visitorSubtitle: "من اكتشاف المكان إلى بناء تجربة متكاملة حوله.",
    pillars: [
      { title: "اكتشف", text: "استكشف المشاريع والأماكن والتجارب من خلال خريطة تفاعلية موحّدة." },
      { title: "تعرّف", text: "اكتشف قصة المكان ومعلوماته وما يميزه قبل زيارته." },
      { title: "خطط", text: "احصل على مسارات مقترحة تناسب اهتماماتك والوقت المتاح لك." },
      { title: "اسأل", text: "استعن بمساعد مدار الذكي للوصول إلى تجربة تناسبك." },
    ],
    ideaEyebrow: "فكرة مدار",
    ideaStatement: "من المعلومة إلى تجربة المكان",
    ideaText:
      "لا يكتفي مدار بعرض المكان على الخريطة؛ بل يربط موقعه ومعلوماته وقصته بالمسارات والتجارب المحيطة به، ليمنح الزائر صورة أعمق عن المدينة.",
    ctaTitle: "ابدأ رحلتك مع مدار",
    ctaText: "اكتشف المدينة من خلال أماكنها وقصصها ومساراتها.",
    mapButton: "استكشف الخريطة",
    routesButton: "اكتشف المسارات",
  },
  en: {
    heading: "About Madar",
    introduction:
      "Madar is a digital platform designed to enrich the visitor experience in Al Madinah by bringing projects, places, and local experiences together in one interactive environment—helping visitors discover the city, understand the value behind its places, and build journeys around their interests and time.",
    cards: [
      {
        title: "Mission",
        description:
          "To transform information about Madinah, its projects, and its places into an interactive digital experience that supports discovery, enriches visitors' understanding, and makes journey planning easier.",
        image: PIC3,
      },
      {
        title: "Vision",
        description:
          "To make Madar a unified digital gateway for discovering Al Madinah—connecting place, information, story, and experience.",
        image: PIC1,
      },
      {
        title: "Scope",
        description:
          "Madar covers development projects, landmarks, destinations, and experiences that enrich the visitor journey across Al Madinah, presenting them through one connected digital experience.",
        image: MadarHero,
      },
    ],
    visitorTitle: "What Does Madar Offer Visitors?",
    visitorSubtitle: "From discovering a place to building a complete experience around it.",
    pillars: [
      {
        title: "Discover",
        text: "Explore projects, places, and experiences through one interactive map.",
      },
      {
        title: "Understand",
        text: "Discover each place's story, information, and highlights before visiting.",
      },
      { title: "Plan", text: "Get suggested routes suited to your interests and available time." },
      { title: "Ask", text: "Use Madar's smart assistant to find an experience that suits you." },
    ],
    ideaEyebrow: "The Idea Behind Madar",
    ideaStatement: "From Information to Place Experience",
    ideaText:
      "Madar goes beyond placing destinations on a map. It connects location, information, story, routes, and surrounding experiences to give visitors a deeper understanding of the city.",
    ctaTitle: "Start Your Journey with Madar",
    ctaText: "Discover Madinah through its places, stories, and routes.",
    mapButton: "Explore the Map",
    routesButton: "Discover Routes",
  },
} as const;

const pillarIcons: ComponentType<{ className?: string; strokeWidth?: number }>[] = [
  Compass,
  BookOpen,
  RouteIcon,
  Sparkles,
];

function AboutPage() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [locale, setLocale] = useState<Locale>(getLocale);
  const text = content[locale];
  const isArabic = locale === "ar";

  useEffect(() => {
    setHeroVisible(true);
    const updateLocale = () => setLocale(getLocale());
    window.addEventListener("madar-language-change", updateLocale);
    return () => window.removeEventListener("madar-language-change", updateLocale);
  }, []);

  return (
    <div className="min-h-screen bg-background" dir={isArabic ? "rtl" : "ltr"}>
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:px-8">
          <header
            className={`transform text-center transition-all duration-1000 ${
              heroVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <div className="gold-divider mx-auto" />
            <h1 className="mt-6 text-4xl font-bold text-foreground sm:text-5xl">{text.heading}</h1>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-foreground/80">
              {text.introduction}
            </p>
          </header>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {text.cards.map((card, index) => (
              <PremiumCard key={card.title} {...card} index={index} />
            ))}
          </div>
        </section>

        <section className="border-y border-[#e2d6b8] bg-secondary/35">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <header className="mx-auto max-w-2xl text-center">
              <div className="gold-divider mx-auto" />
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{text.visitorTitle}</h2>
              <p className="mt-3 text-muted-foreground">{text.visitorSubtitle}</p>
            </header>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {text.pillars.map((pillar, index) => {
                const Icon = pillarIcons[index];
                return (
                  <article
                    key={pillar.title}
                    className="rounded-2xl border border-[#e2d6b8] bg-card p-6 shadow-[var(--shadow-soft)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-primary">{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{pillar.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#c9a961]/45 bg-primary px-6 py-12 text-center text-primary-foreground shadow-[var(--shadow-elegant)] sm:px-12 sm:py-16">
            <div
              className="absolute -end-16 -top-16 h-48 w-48 rounded-full border border-[#c9a961]/20"
              aria-hidden="true"
            />
            <p className="text-sm font-bold tracking-wide text-[#dcc384]">{text.ideaEyebrow}</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
              {text.ideaStatement}
            </h2>
            <p className="mx-auto mt-5 max-w-3xl leading-8 text-white/80">{text.ideaText}</p>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="gold-divider mx-auto" />
            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">{text.ctaTitle}</h2>
            <p className="mt-3 text-muted-foreground">{text.ctaText}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/map" search={{ route: undefined }} className="btn-primary text-center">
                {text.mapButton}
              </Link>
              <Link to="/routes" className="btn-outline text-center">
                {text.routesButton}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
