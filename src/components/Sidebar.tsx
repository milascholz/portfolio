"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import LinkedInIcon from "./LinkedInIcon";
import PoolBalls from "./PoolBalls";
import PoolCueStick from "./PoolCueStick";
import { BASE_PATH } from "@/lib/base-path";
import { useProjectNav } from "@/context/ProjectNavContext";

const NAV_ITEMS = [
  { href: "/", label: "projects" },
  { href: "/about", label: "about" },
];

function normalizePath(path: string) {
  return path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
}

export default function Sidebar() {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const projectNav = useProjectNav();
  const isProjectMode = Boolean(projectNav);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (!projectNav) {
      setActiveSectionId(null);
      return;
    }

    const sectionIds = projectNav.sections.map((section) => section.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    setActiveSectionId(sectionIds[0] ?? null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveSectionId(topMost.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));

    // The IntersectionObserver's trigger band can miss a trailing section
    // (e.g. the last one) if the page can't scroll far enough for that band
    // to ever cross it. Hovering directly over a section's content is a
    // reliable fallback/override that always works, regardless of scroll.
    function handlePointerMove(event: PointerEvent) {
      const y = event.clientY;
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (y >= rect.top && y <= rect.bottom) {
          setActiveSectionId(el.id);
          return;
        }
      }
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [projectNav]);

  return (
    <aside className="w-full shrink-0 border border-black bg-[#1e3a26] text-white md:w-72 md:sticky md:top-6 md:h-[calc(100vh-3rem)]">
      <div ref={contentRef} className="relative flex h-full flex-col justify-between px-7 py-8">
        <div className="relative z-10 flex flex-col gap-10">
          <div data-pool-obstacle>
            <h1 className="overflow-hidden">
              <Image
                src={`${BASE_PATH}/images/pool/name-wordmark.png`}
                alt="Mila Scholz"
                width={747}
                height={109}
                className="h-auto w-[13.5rem]"
                priority
              />
            </h1>
            <PoolCueStick className="mt-1.5 h-4 w-[13.5rem]" />
            <div className="relative mt-2 h-[1.375rem]">
              <p
                className={`absolute inset-0 italic text-white/80 transition-opacity duration-300 ${
                  isProjectMode ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
              >
                Created to create
              </p>
              <Link
                href="/"
                className={`absolute inset-0 flex items-center gap-1.5 text-[15px] font-medium capitalize text-white/70 transition-opacity duration-300 hover:text-white ${
                  isProjectMode ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
                back
              </Link>
            </div>
          </div>

          <div className="grid">
          <nav
            data-pool-obstacle={isProjectMode ? undefined : true}
            className={`col-start-1 row-start-1 flex flex-col gap-4 transition-all duration-300 ease-in-out ${
              isProjectMode
                ? "pointer-events-none -translate-y-3 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = normalizePath(pathname) === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-2.5 text-[15px]"
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full bg-white transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                    }`}
                  />
                  <span
                    className={`capitalize transition-colors ${
                      isActive
                        ? "font-semibold text-white"
                        : "text-white/60 group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

            <div
              data-pool-obstacle={isProjectMode ? true : undefined}
              className={`col-start-1 row-start-1 flex flex-col gap-4 transition-all duration-300 ease-in-out ${
                isProjectMode
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-3 opacity-0"
              }`}
            >
              {projectNav ? (
                <>
                  <h2 className="text-[15px] font-semibold capitalize text-white">
                    {projectNav.title}
                  </h2>
                  <nav className="flex flex-col gap-3.5">
                    {projectNav.sections.map((section) => {
                      const isActive = activeSectionId === section.id;
                      return (
                        <a
                          key={section.id}
                          href={`#${section.id}`}
                          className="group flex items-center gap-2.5 text-[15px]"
                        >
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full bg-white transition-opacity duration-200 ${
                              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                            }`}
                          />
                          <span
                            className={`capitalize transition-colors ${
                              isActive
                                ? "font-semibold text-white"
                                : "text-white/60 group-hover:text-white"
                            }`}
                          >
                            {section.label}
                          </span>
                        </a>
                      );
                    })}
                  </nav>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div data-pool-obstacle className="relative z-10 flex items-center justify-end">
          <div className="flex translate-y-1.5 items-center gap-4">
            <a
              href="https://www.linkedin.com/in/mila-scholz-a4094730b/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-white/70 hover:text-white transition-colors"
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
            <a
              href="mailto:mscholz5@uwo.ca"
              aria-label="Email"
              className="text-white/70 hover:text-white transition-colors"
            >
              <Mail className="h-5 w-5" strokeWidth={1.75} />
            </a>
          </div>
        </div>

        <PoolBalls obstacleContainerRef={contentRef} layoutVersion={isProjectMode} />
      </div>
    </aside>
  );
}
