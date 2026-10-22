"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import AboutPhotos from "@/components/AboutPhotos";
import { BASE_PATH } from "@/lib/base-path";
import { getSoftwareIcon } from "@/lib/software-icons";

const GREETINGS = ["Hi", "Hola", "Bonjour"];
const GREETING_INTERVAL_MS = 2200;

type ExperienceRow = { org: string; role: string };

const EXPERIENCE: ExperienceRow[] = [
  { org: "Women in Engineering Club @ UWO", role: "VP Design" },
  { org: "Geography Peoples' Society @ UWO", role: "AVP Social Media" },
  { org: "Cavendish Farms", role: "Project Engineering Intern" },
  { org: "BGC Engineering", role: "Research Laboratory Assistant" },
  { org: "Cornell UX Designathon 2026", role: "2nd Place" },
  { org: "FigBuild 2026", role: "Participant" },
];

type Hobby = { iconKey?: string; emoji?: string; text: string; href?: string; external?: boolean };

const HOBBIES: Hobby[] = [
  {
    iconKey: "youtube",
    text: "Growing my YouTube channel",
    href: "https://www.youtube.com/@QuickStaticsAnswers",
    external: true,
  },
  {
    iconKey: "instagram",
    text: "Designing graphics on Instagram",
    href: "https://www.instagram.com/miasdeck/",
    external: true,
  },
  {
    emoji: "🏔️",
    text: "Building paper mache mountains for my model train set",
  },
  { emoji: "💻", text: "Building more personal projects on my Fun page", href: "/fun" },
];

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">{children}</p>;
}

function Prose({ children }: { children: ReactNode }) {
  return <div className="mt-4 space-y-4 leading-relaxed text-foreground/70">{children}</div>;
}

export default function AboutPage() {
  const [greetingIndex, setGreetingIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setGreetingIndex((i) => (i + 1) % GREETINGS.length);
    }, GREETING_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    // Same card shell Home's own page supplies for itself, since About is
    // no longer in MainSurface's "expanded" path (it uses Home's sidebar
    // instead of ProjectSidebar).
    <div className="panel-grey flex h-full min-h-0 flex-col rounded-[22px] border border-[#6e6e6e] lg:-mt-[54px] lg:h-[calc(100%+54px)]">
      <div className="well-inset no-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="mx-auto w-full max-w-[1120px] p-6 md:p-10 lg:p-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
            {/* Left column: all text content */}
            <div>
              <h1 className="text-3xl font-semibold leading-tight text-foreground md:text-4xl">
                <span className="text-[#221898]">[{GREETINGS[greetingIndex]}]</span>, I&apos;m Mila.
              </h1>

              {/* Why Product Design */}
              <div className="mt-16">
                <h2 className="mt-2 text-3xl font-semibold leading-tight text-foreground">
                  From mechatronics to product design.
                </h2>
                <Prose>
                  <p>
                    I got into mechatronics because I love figuring out how things are built, and the
                    problem-solving that comes with it. But the more I built, the more I noticed nobody
                    was asking who it was for. Product design fills that gap. I want to build things that
                    are actually useful, and the best way to get there is to involve users while
                    I&apos;m building. I&apos;m looking for a product design role where I can pair my
                    engineering instincts with real user research.
                  </p>
                </Prose>
              </div>

              {/* Experience + Communities */}
              <div className="mt-16">
                <Eyebrow>Experience + Communities</Eyebrow>
                <div className="well-inset mt-6 p-2">
                  {EXPERIENCE.map((row) => (
                    <div
                      key={row.org}
                      className="flex items-center justify-between gap-4 border-b border-black/10 px-4 py-3.5 last:border-b-0"
                    >
                      <p className="font-semibold text-foreground">{row.org}</p>
                      <p className="text-right text-sm text-foreground/60">{row.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outside of Work */}
              <div className="mt-16">
                <h2 className="text-3xl font-semibold leading-tight text-foreground">
                  Outside of work you can find me:
                </h2>
                <div className="mt-6 flex flex-col gap-3">
                  {HOBBIES.map((hobby) => {
                    const icon = hobby.iconKey ? getSoftwareIcon(hobby.iconKey) : null;
                    const iconBadge = (
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#6e6e6e]/30 bg-white">
                        {icon ? (
                          icon.kind === "component" ? (
                            <icon.Icon size={14} color={icon.color} />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={`${BASE_PATH}${icon.src}`}
                              alt=""
                              className="h-4 w-4 rounded-sm"
                            />
                          )
                        ) : (
                          <span className="text-sm leading-none">{hobby.emoji}</span>
                        )}
                      </span>
                    );
                    const label = (
                      <p className="text-sm leading-relaxed text-foreground/70 underline decoration-foreground/25 underline-offset-2 transition-colors group-hover:text-foreground group-hover:decoration-foreground/60">
                        {hobby.text}
                      </p>
                    );
                    if (!hobby.href) {
                      return (
                        <div key={hobby.text} className="flex items-center gap-3">
                          {iconBadge}
                          <p className="text-sm leading-relaxed text-foreground/70">{hobby.text}</p>
                        </div>
                      );
                    }
                    return hobby.external ? (
                      <a
                        key={hobby.text}
                        href={hobby.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3"
                      >
                        {iconBadge}
                        {label}
                      </a>
                    ) : (
                      <Link key={hobby.text} href={hobby.href} className="group flex items-center gap-3">
                        {iconBadge}
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <Link
                href="/"
                className="mt-16 inline-block text-sm font-medium text-[#221898] hover:underline"
              >
                [See my work →]
              </Link>
            </div>

            {/* Right column: photos */}
            <AboutPhotos />
          </div>
        </div>
      </div>
    </div>
  );
}
