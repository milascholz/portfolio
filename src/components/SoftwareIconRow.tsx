"use client";

import { useState } from "react";
import { useSetHoveredSoftwareKey } from "@/context/ProjectNavContext";
import { getUniqueSoftwareIcons } from "@/lib/software-icons";
import { BASE_PATH } from "@/lib/base-path";

// `filterable` is only set on the aggregate "Software I used" row (shown
// when no project is hovered, on the Fun page) — hovering an icon there
// fades out entries on the page that don't use it. Everywhere else (a
// single project's row) it's omitted, since there's nothing to filter.
export default function SoftwareIconRow({ software, filterable }: { software: string[]; filterable?: boolean }) {
  const icons = getUniqueSoftwareIcons(software);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const setHoveredSoftwareKey = useSetHoveredSoftwareKey();
  if (icons.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {icons.map(({ icon, label }) => (
        <span
          key={icon.key}
          onMouseEnter={() => {
            setHoveredKey(icon.key);
            if (filterable) setHoveredSoftwareKey(icon.key);
          }}
          onMouseLeave={() => {
            setHoveredKey((current) => (current === icon.key ? null : current));
            if (filterable) setHoveredSoftwareKey(null);
          }}
          className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#6e6e6e]/30 bg-white"
        >
          {icon.kind === "component" ? (
            <icon.Icon size={13} color={icon.color} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`${BASE_PATH}${icon.src}`} alt={label} className="h-4 w-4 rounded-sm" />
          )}
          {hoveredKey === icon.key ? (
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-sm"
            >
              {label}
            </span>
          ) : null}
        </span>
      ))}
    </div>
  );
}
