"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home as HomeIcon, Mail } from "lucide-react";
import CaseStudyToc from "./CaseStudyToc";
import { useProjectNav } from "@/context/ProjectNavContext";

const NAV_ITEMS = [
  { href: "/about", label: "About" },
  { href: "/", label: "Projects" },
];

function normalizePath(path: string) {
  return path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
}

export default function TopNav() {
  const pathname = usePathname();
  const projectNav = useProjectNav();
  const isProjectMode = Boolean(projectNav);

  return (
    <header
      className={`panel-grey flex h-12 w-full shrink-0 items-center gap-2 rounded-[22px] border border-black pl-1.5 pr-1.5 transition-[max-width] duration-300 ease-in-out ${
        isProjectMode ? "max-w-full" : "max-w-[400px]"
      }`}
    >
      <Link
        href="/"
        aria-label="Mila Scholz — home"
        className="btn-pill flex h-9 w-9 shrink-0 items-center justify-center text-foreground"
      >
        <HomeIcon className="h-4 w-4" strokeWidth={2} />
      </Link>

      {/* Two layers cross-fade/slide over each other: the default About/Contact
          bubbles exit left when a case study registers its nav, and the
          full-width table of contents slides in from the right to replace them. */}
      <div className="relative h-9 min-w-0 flex-1">
        <nav
          className={`absolute inset-0 flex min-w-0 items-center justify-end gap-2.5 transition-all duration-300 ease-in-out ${
            isProjectMode
              ? "-translate-x-4 opacity-0 pointer-events-none"
              : "translate-x-0 opacity-100"
          }`}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = normalizePath(pathname) === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`btn-pill px-3.5 py-1.5 text-sm font-medium ${isActive ? "btn-pill-blue" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div
          className={`absolute inset-0 flex min-w-0 items-center justify-end gap-2 pl-3 transition-all duration-300 ease-in-out ${
            isProjectMode
              ? "translate-x-0 opacity-100"
              : "translate-x-4 opacity-0 pointer-events-none"
          }`}
        >
          <CaseStudyToc />
          <a
            href="mailto:mscholz5@uwo.ca"
            aria-label="Email"
            className="btn-pill btn-pill-blue flex h-9 w-9 shrink-0 items-center justify-center"
          >
            <Mail className="h-4 w-4" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </header>
  );
}
