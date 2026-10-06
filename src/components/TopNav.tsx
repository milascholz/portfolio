"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Home as HomeIcon } from "lucide-react";
import { useProjectNav } from "@/context/ProjectNavContext";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

function normalizePath(path: string) {
  return path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
}

export default function TopNav() {
  const pathname = usePathname();
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
    return () => observer.disconnect();
  }, [projectNav]);

  return (
    <header className="flex h-12 w-full max-w-[400px] shrink-0 items-center justify-between gap-2 rounded-[22px] border border-black bg-white pl-4 pr-1.5">
      <Link
        href="/"
        aria-label="Mila Scholz — home"
        className="flex h-7 w-7 shrink-0 items-center justify-center text-foreground"
      >
        <HomeIcon className="h-5 w-5" strokeWidth={2} />
      </Link>

      <div className="min-w-0 flex-1">
        {isProjectMode && projectNav ? (
          <div className="flex items-center gap-4 pl-2">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
              Back
            </Link>
            <span className="hidden shrink-0 text-sm font-semibold capitalize text-foreground sm:inline">
              {projectNav.title}
            </span>
            <nav className="no-scrollbar flex min-w-0 items-center gap-4 overflow-x-auto">
              {projectNav.sections.map((section) => {
                const isActive = activeSectionId === section.id;
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group flex shrink-0 items-center gap-2 text-sm"
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff66eb] transition-opacity duration-200 ${
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                      }`}
                    />
                    <span
                      className={`whitespace-nowrap capitalize transition-colors ${
                        isActive ? "font-semibold text-foreground" : "text-foreground/60 group-hover:text-foreground"
                      }`}
                    >
                      {section.label}
                    </span>
                  </a>
                );
              })}
            </nav>
          </div>
        ) : (
          <nav className="flex items-center justify-end gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = normalizePath(pathname) === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`btn-win rounded-full px-3.5 py-1.5 text-sm font-medium text-black ${
                    isActive ? "btn-win-active" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href="mailto:mscholz5@uwo.ca"
              className="btn-win rounded-full px-3.5 py-1.5 text-sm font-medium text-black"
            >
              Contact
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
