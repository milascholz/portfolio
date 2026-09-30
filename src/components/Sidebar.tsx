"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import CookieButton from "./CookieButton";
import CalloutBox from "./CalloutBox";
import LinkedInIcon from "./LinkedInIcon";
import { BASE_PATH } from "@/lib/base-path";
import { useProjectNav } from "@/context/ProjectNavContext";

const NAV_ITEMS = [
  { href: "/", label: "projects" },
  { href: "/about", label: "about" },
];

function normalizePath(path: string) {
  return path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
}

const SELECTOR_OPTIONS = [1, 7, 38, 34];
const SELECTOR_STORAGE_KEY = "mila-portfolio:selector-cookie";
const CUSTOMIZE_CLOSE_DELAY_MS = 300;

export default function Sidebar() {
  const pathname = usePathname();
  const [selectorCookie, setSelectorCookie] = useState(SELECTOR_OPTIONS[0]);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const projectNav = useProjectNav();
  const isProjectMode = Boolean(projectNav);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(SELECTOR_STORAGE_KEY);
    const parsed = stored ? parseInt(stored, 10) : NaN;
    if (SELECTOR_OPTIONS.includes(parsed)) {
      setSelectorCookie(parsed);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

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

  function openCustomize() {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setCustomizeOpen(true);
  }

  function scheduleCloseCustomize() {
    closeTimeoutRef.current = setTimeout(() => {
      setCustomizeOpen(false);
    }, CUSTOMIZE_CLOSE_DELAY_MS);
  }

  function selectCookie(n: number) {
    setSelectorCookie(n);
    window.localStorage.setItem(SELECTOR_STORAGE_KEY, String(n));
  }

  return (
    <aside className="w-full shrink-0 border border-black bg-white md:w-72 md:sticky md:top-6 md:h-[calc(100vh-3rem)]">
      <div className="flex h-full flex-col justify-between px-7 py-8">
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="flex items-baseline overflow-hidden text-2xl font-bold tracking-tight text-black">
              <span>M</span>
              <span className="inline-block max-w-[2.5rem] overflow-hidden whitespace-nowrap opacity-100">
                ila
              </span>
              <span className="inline-block max-w-[0.4rem] overflow-hidden whitespace-nowrap opacity-100">
                &nbsp;
              </span>
              <span>S</span>
              <span className="inline-block max-w-[6rem] overflow-hidden whitespace-nowrap opacity-100">
                cholz
              </span>
            </h1>
            <div className="relative mt-0.5 h-[1.375rem]">
              <p
                className={`absolute inset-0 italic text-black transition-opacity duration-300 ${
                  isProjectMode ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
              >
                Created to create
              </p>
              <Link
                href="/"
                className={`absolute inset-0 flex items-center gap-1.5 text-[15px] font-medium capitalize text-foreground/70 transition-opacity duration-300 hover:text-foreground ${
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
                    className={`relative flex h-3.5 w-3.5 items-center justify-center shrink-0 transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                    }`}
                  >
                    <Image
                      src={`${BASE_PATH}/images/cookies/cookie-${selectorCookie}.png`}
                      alt=""
                      width={64}
                      height={64}
                      className="h-3.5 w-3.5 object-contain"
                    />
                  </span>
                  <span
                    className={`capitalize transition-colors ${
                      isActive
                        ? "font-semibold text-foreground"
                        : "text-foreground/60 group-hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}

            <div
              className="group relative"
              onMouseEnter={openCustomize}
              onMouseLeave={scheduleCloseCustomize}
            >
              <div className="flex w-full items-center gap-2.5 text-[15px]">
                <span
                  className={`relative flex h-3.5 w-3.5 shrink-0 items-center justify-center transition-opacity duration-200 ${
                    customizeOpen ? "opacity-40" : "opacity-0"
                  }`}
                >
                  <Image
                    src={`${BASE_PATH}/images/cookies/cookie-${selectorCookie}.png`}
                    alt=""
                    width={64}
                    height={64}
                    className="h-3.5 w-3.5 object-contain"
                  />
                </span>
                <span
                  className={`relative capitalize transition-colors ${
                    customizeOpen ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  customize
                </span>
              </div>

              <div
                className={`absolute left-0 top-full z-10 transition-opacity duration-200 ${
                  customizeOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <CalloutBox width={218} height={62} tailCenterX={59} contentClassName="gap-2">
                  {SELECTOR_OPTIONS.map((n) => {
                    const isSelected = selectorCookie === n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => selectCookie(n)}
                        aria-label={`Use cookie ${n} as the page selector`}
                        aria-pressed={isSelected}
                        className={`relative h-11 w-11 shrink-0 overflow-hidden bg-white transition-opacity ${
                          isSelected ? "opacity-100" : "opacity-40 hover:opacity-70"
                        }`}
                      >
                        <Image
                          src={`${BASE_PATH}/images/cookies/cookie-${n}.png`}
                          alt=""
                          fill
                          sizes="44px"
                          className="object-contain"
                        />
                      </button>
                    );
                  })}
                </CalloutBox>
              </div>
            </div>
          </nav>

            <div
              className={`col-start-1 row-start-1 flex flex-col gap-4 transition-all duration-300 ease-in-out ${
                isProjectMode
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-3 opacity-0"
              }`}
            >
              {projectNav ? (
                <>
                  <h2 className="text-[15px] font-semibold capitalize text-foreground">
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
                            className={`relative flex h-3.5 w-3.5 items-center justify-center shrink-0 transition-opacity duration-200 ${
                              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                            }`}
                          >
                            <Image
                              src={`${BASE_PATH}/images/cookies/cookie-${selectorCookie}.png`}
                              alt=""
                              width={64}
                              height={64}
                              className="h-3.5 w-3.5 object-contain"
                            />
                          </span>
                          <span
                            className={`capitalize transition-colors ${
                              isActive
                                ? "font-semibold text-foreground"
                                : "text-foreground/60 group-hover:text-foreground"
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

        <div className="flex items-center">
          <div
            className={`transition-[max-width,opacity] duration-300 ease-in-out ${
              isProjectMode ? "max-w-0 opacity-0" : "max-w-[5rem] opacity-100"
            }`}
          >
            <CookieButton />
          </div>

          <div
            aria-hidden="true"
            className={`transition-[flex-grow] duration-300 ease-in-out ${
              isProjectMode ? "grow-0" : "grow"
            }`}
          />

          <div className="flex translate-y-1.5 items-center gap-4">
            <a
              href="https://www.linkedin.com/in/mila-scholz-a4094730b/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
            <a
              href="mailto:mscholz5@uwo.ca"
              aria-label="Email"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              <Mail className="h-5 w-5" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
