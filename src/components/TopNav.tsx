"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home as HomeIcon } from "lucide-react";

const NAV_ITEMS = [
  { href: "/about", label: "About", disabled: false },
  { href: "/fun", label: "Fun", disabled: false },
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

// Stays the same compact width and the same About/Fun/Projects pills on
// every route, including case studies — the project-specific nav (title +
// section links) lives in the sidebar instead, via ProjectSidebar.
export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="panel-grey self-start flex h-12 shrink-0 items-center gap-2 rounded-[22px] border border-black pl-1.5 pr-1.5">
      <Link
        href="/"
        aria-label="Mila Scholz — home"
        className="btn-pill flex h-9 w-9 shrink-0 items-center justify-center text-foreground"
      >
        <HomeIcon className="h-4 w-4" strokeWidth={2} />
      </Link>

      <nav className="flex items-center gap-2.5">
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
    </header>
  );
}
