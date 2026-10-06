"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The home page builds its own white bordered cards against the black page
 * background. Every other page (about, case studies) is plain content with
 * no card of its own, so it needs a white surface wrapped around it here —
 * otherwise its dark text sits unreadable directly on black.
 */
export default function MainSurface({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";

  if (isHome) return <>{children}</>;

  return (
    <div className="h-full overflow-y-auto border border-black bg-white">{children}</div>
  );
}
