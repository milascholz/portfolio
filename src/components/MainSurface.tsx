"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import ProfileExtras from "@/components/ProfileExtras";
import ProfileNameCard from "@/components/ProfileNameCard";
import ProjectSidebar from "@/components/ProjectSidebar";

/**
 * Home and project/case-study pages share this persistent shell so the
 * sidebar column stays a fixed width and swaps content (profile card vs.
 * case-study nav) instead of collapsing — the profile extras wipe left and
 * ProjectSidebar cross-fades in, while the content pane to its right
 * becomes the full-bleed case-study card. Lives above the routed
 * `children`, so it never remounts across navigations. About is treated
 * like Home (not "expanded"): it gets the same profile-card + ProfileExtras
 * sidebar as Home, and supplies its own panel-grey card around its content
 * the same way Home's own page does, rather than the ProjectSidebar/
 * full-bleed-card treatment case studies and Fun use.
 *
 * The name card is shown on Home, Fun, and About, so it's rendered once,
 * outside the crossfade below it — it stays mounted and unanimated across
 * that transition instead of fading out and a lookalike fading back in.
 */
export default function MainSurface({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";
  const isFun = pathname === "/fun" || pathname === "/fun/";
  const isAbout = pathname === "/about" || pathname === "/about/";
  const isExpanded = (pathname?.startsWith("/projects/") ?? false) || isFun;
  const showCard = isHome || isFun || isAbout;

  return (
    <div className="no-scrollbar flex h-full flex-col gap-1.5 overflow-y-auto lg:h-full lg:min-h-0 lg:flex-row lg:items-stretch lg:overflow-visible">
      <div
        className={`${isExpanded ? "hidden lg:flex" : "flex"} w-full shrink-0 flex-col gap-1.5 lg:w-[284px] ${
          isExpanded ? "lg:h-auto lg:max-h-full lg:self-start" : "lg:h-full lg:min-h-0"
        }`}
      >
        {showCard ? <ProfileNameCard showBio={isHome || isAbout} /> : null}

        <div className={`relative min-h-0 w-full ${isExpanded ? "lg:h-auto" : "flex-1 lg:h-full"}`}>
          <div
            className={`transition-all duration-300 ease-in-out ${
              isExpanded
                ? "absolute inset-0 -translate-x-6 opacity-0 pointer-events-none"
                : "lg:h-full translate-x-0 opacity-100"
            }`}
          >
            <ProfileExtras />
          </div>
          <div
            className={`transition-all duration-300 ease-in-out ${
              isExpanded
                ? "translate-x-0 opacity-100"
                : "absolute inset-0 translate-x-6 opacity-0 pointer-events-none"
            }`}
          >
            <ProjectSidebar />
          </div>
        </div>
      </div>

      <div className="min-w-0 min-h-0 flex-1">
        {isExpanded ? (
          // Pulled up by the nav's height + gap, same trick as the home
          // grid card, so the case-study banner starts flush with the top
          // of the nav pills instead of level with the sidebar below them.
          <div className="panel-grey flex h-full min-h-0 flex-col rounded-[22px] border border-[#6e6e6e] lg:-mt-[54px] lg:h-[calc(100%+54px)]">
            <div className="well-inset no-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
