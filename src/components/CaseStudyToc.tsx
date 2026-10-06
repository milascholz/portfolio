"use client";

import { useEffect, useState } from "react";
import { useProjectNav } from "@/context/ProjectNavContext";

export default function CaseStudyToc() {
  const projectNav = useProjectNav();
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (!projectNav) return;

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

  if (!projectNav) return null;

  return (
    <div className="no-scrollbar flex h-full min-w-0 flex-1 items-center gap-4 overflow-x-auto font-aqua">
      <span className="shrink-0 text-sm font-semibold capitalize text-foreground">
        {projectNav.title}
      </span>
      <nav className="flex min-w-0 shrink-0 items-center gap-1.5">
        {projectNav.sections.map((section) => {
          const isActive = activeSectionId === section.id;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={
                isActive
                  ? "btn-pill btn-pill-blue shrink-0 whitespace-nowrap px-3 py-1 text-xs font-semibold capitalize"
                  : "shrink-0 whitespace-nowrap rounded-full px-2 py-1 text-sm capitalize text-foreground/55 transition-colors hover:text-foreground"
              }
            >
              {section.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
