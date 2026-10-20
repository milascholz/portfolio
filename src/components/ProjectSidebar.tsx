"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useHoveredInfo, useProjectNav } from "@/context/ProjectNavContext";
import { formatSoftwareList } from "@/lib/software-icons";
import SoftwareIconRow from "@/components/SoftwareIconRow";

/**
 * Replaces ProfileSidebar in the sidebar column while viewing a case study
 * (or the Fun page). Tracks scroll position the same way the old
 * CaseStudyToc did, just as a vertical list instead of a horizontal pill
 * row, since it now lives in the sidebar rather than the top nav.
 */
export default function ProjectSidebar() {
  const projectNav = useProjectNav();
  const hoveredInfo = useHoveredInfo();
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (!projectNav) return;

    const sectionIds = projectNav.sections.flatMap((section) => [
      section.id,
      ...(section.subsections ?? []).map((sub) => sub.id),
    ]);
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

  function handleNavClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  }

  if (projectNav.hoverPanel) {
    return (
      <div className="panel-grey flex max-h-full flex-col rounded-[22px] border border-[#6e6e6e]">
        <div className="well-inset no-scrollbar flex flex-col overflow-y-auto px-6 py-8">
          <h2 className="text-lg font-semibold leading-snug text-foreground">
            {hoveredInfo ? hoveredInfo.title : projectNav.hoverPanel.defaultHeading}
          </h2>
          {hoveredInfo ? (
            <>
              <p className="mt-2 text-sm leading-relaxed text-foreground/60">{hoveredInfo.description}</p>
              {hoveredInfo.software && hoveredInfo.software.length > 0 ? (
                <>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                    Made with {formatSoftwareList(hoveredInfo.software)}.
                  </p>
                  <SoftwareIconRow software={hoveredInfo.software} />
                </>
              ) : null}
            </>
          ) : (
            <>
              <p className="mt-2 text-sm italic text-foreground/40">Hover over a project to learn more!</p>
              {projectNav.hoverPanel.defaultSoftware && projectNav.hoverPanel.defaultSoftware.length > 0 ? (
                <>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/60">Software I used</p>
                  <SoftwareIconRow software={projectNav.hoverPanel.defaultSoftware} filterable />
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="panel-grey flex h-full min-h-0 flex-col rounded-[22px] border border-[#6e6e6e]">
      <div className="well-inset no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-8">
        <nav className="flex flex-col gap-1">
          {projectNav.sections.map((section) => {
            const subsections = section.subsections ?? [];
            const isSubsectionActive = subsections.some((sub) => sub.id === activeSectionId);
            const isActive = activeSectionId === section.id || isSubsectionActive;
            return (
              <div key={section.id} className="flex flex-col gap-1">
                <a
                  href={`#${section.id}`}
                  onClick={(e) => handleNavClick(e, section.id)}
                  className={
                    isActive
                      ? "btn-pill btn-pill-blue px-3 py-1.5 text-sm font-semibold capitalize"
                      : "rounded-full px-3 py-1.5 text-sm capitalize text-foreground/55 transition-colors hover:text-foreground"
                  }
                >
                  {section.label}
                </a>
                {subsections.length > 0 ? (
                  // Animated collapse/expand: the grid-template-rows trick
                  // lets height transition smoothly without measuring the
                  // content, since the content's natural height is unknown
                  // ahead of time.
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                      isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-3 flex flex-col gap-0.5 border-l border-[#6e6e6e]/30 pl-3">
                        {subsections.map((sub) => {
                          const isSubActive = activeSectionId === sub.id;
                          return (
                            <a
                              key={sub.id}
                              href={`#${sub.id}`}
                              onClick={(e) => handleNavClick(e, sub.id)}
                              className={`px-2 py-1 text-xs leading-snug transition-colors ${
                                isSubActive
                                  ? "font-semibold text-[#221898]"
                                  : "text-foreground/50 hover:text-foreground"
                              }`}
                            >
                              {sub.label}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
