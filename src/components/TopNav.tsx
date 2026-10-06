"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home as HomeIcon, Mail } from "lucide-react";
import CaseStudyToc from "./CaseStudyToc";
import { useProjectNav } from "@/context/ProjectNavContext";

const NAV_ITEMS = [
  { href: "/about", label: "About", disabled: true },
  { href: "/", label: "Projects", disabled: false },
];

function normalizePath(path: string) {
  return path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
}

// Disabled nav pill that tracks the cursor with a "Coming soon" bubble
// instead of navigating.
function ComingSoonPill({ label }: { label: string }) {
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <span
      className="relative inline-flex shrink-0"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
    >
      <span
        aria-disabled="true"
        className="btn-pill btn-pill-static cursor-not-allowed px-3.5 py-1.5 text-sm font-medium text-foreground/40"
      >
        {label}
      </span>
      {hover && (
        <span
          aria-hidden
          className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap rounded-full border border-black/80 bg-[#2b2b2b] px-2.5 py-1 text-[11px] font-medium text-white shadow-[0_6px_16px_rgba(0,0,0,0.25)]"
          style={{ left: pos.x, top: pos.y }}
        >
          Coming soon
        </span>
      )}
    </span>
  );
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
            if (item.disabled) {
              return <ComingSoonPill key={item.href} label={item.label} />;
            }
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
