"use client";

import { useState, type MouseEvent } from "react";

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="11"
      height="11"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="shrink-0"
    >
      <path d="M4 12L12 4M12 4H5M12 4V11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Tracks hover + cursor position for a `cursor-none` link, so a custom
 * label tag (e.g. "See on Devpost") can follow the pointer instead. */
export function useCursorTag() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  function onMouseMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  return {
    position,
    visible,
    handlers: {
      onMouseEnter: () => setVisible(true),
      onMouseLeave: () => setVisible(false),
      onMouseMove,
    },
  };
}

export function CursorTag({
  visible,
  position,
  label,
  external,
}: {
  visible: boolean;
  position: { x: number; y: number };
  label?: string;
  external?: boolean;
}) {
  if (!visible || !label) return null;

  return (
    <div
      className="pointer-events-none absolute z-20 flex items-center gap-1 whitespace-nowrap rounded-full border border-black bg-white px-2 py-1 text-xs font-medium text-foreground shadow-sm"
      style={{ left: position.x, top: position.y, transform: "translate(10px, 10px)" }}
    >
      {label}
      {external ? <ArrowUpRight /> : null}
    </div>
  );
}
