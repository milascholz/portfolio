"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import ProfileSidebar from "@/components/ProfileSidebar";

/**
 * Home and project/case-study pages share this persistent shell so the
 * profile sidebar can swipe out (rather than hard-unmount) when you click
 * into a project, and swipe back in when you return home — it lives here,
 * above the routed `children`, so it never remounts across navigations.
 * The "about" page is unrelated content in its own plain white card.
 */
export default function MainSurface({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";
  const isProject = pathname?.startsWith("/projects/") ?? false;

  if (!isHome && !isProject) {
    return <div className="h-full overflow-y-auto border border-black bg-white">{children}</div>;
  }

  return (
    <div className="no-scrollbar flex h-full flex-col gap-1.5 overflow-y-auto lg:h-full lg:min-h-0 lg:flex-row lg:items-stretch lg:overflow-visible">
      <div
        className={`${isProject ? "hidden lg:flex" : "flex"} shrink-0 flex-col lg:overflow-hidden lg:transition-[width] lg:duration-300 lg:ease-in-out ${
          isProject ? "lg:w-0" : "w-full lg:w-[400px]"
        }`}
      >
        <div
          className={`min-h-0 w-full flex-1 transition-transform duration-300 ease-in-out lg:w-[400px] ${
            isProject ? "lg:-translate-x-full" : "translate-x-0"
          }`}
        >
          <ProfileSidebar />
        </div>
      </div>

      <div className="min-w-0 min-h-0 flex-1">
        {isProject ? (
          <div className="panel-grey flex h-full min-h-0 flex-col rounded-[22px] border border-[#6e6e6e]">
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
