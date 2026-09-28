"use client";

import { useState, type MouseEvent } from "react";
import { BASE_PATH } from "@/lib/base-path";

type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
};

const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: "/images/aboutme/causa.jpg",
    alt: "Peruvian causa, a layered potato dish with chicken salad and egg",
    caption: "Causa, on repeat",
  },
  {
    src: "/images/aboutme/cheesecakemaracuya.jpeg",
    alt: "Passionfruit cheesecake with a glossy orange top",
    caption: "Maracuyá cheesecake, my usual order",
  },
  {
    src: "/images/aboutme/strangebook.webp",
    alt: "Cover of the book Strange Buildings by Uketsu",
    caption: "Currently reading",
  },
];

function GalleryTile({ item }: { item: GalleryItem }) {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setCursorPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  return (
    <div
      className="relative overflow-hidden border border-black bg-white"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE_PATH}${item.src}`}
        alt={item.alt}
        className="aspect-[4/3] w-full select-none object-cover"
        draggable={false}
      />
      {isHovering ? (
        <div
          className="pointer-events-none absolute z-20 flex items-center gap-1 whitespace-nowrap border border-black bg-white px-2 py-1 text-xs font-medium text-foreground shadow-sm"
          style={{ left: cursorPos.x, top: cursorPos.y, transform: "translate(10px, 10px)" }}
        >
          {item.caption}
        </div>
      ) : null}
    </div>
  );
}

export default function AboutGallery() {
  const [paused, setPaused] = useState(false);
  const loopItems = [...GALLERY_ITEMS, ...GALLERY_ITEMS];

  return (
    <div className="relative h-[420px] overflow-hidden md:h-[560px]">
      <div
        className="flex flex-col gap-4"
        style={{
          animation: "scroll-y 32s linear infinite",
          animationPlayState: paused ? "paused" : "running",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {loopItems.map((item, index) => (
          <GalleryTile key={`${item.src}-${index}`} item={item} />
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-20 backdrop-blur-sm"
        style={{ maskImage: "linear-gradient(to bottom, black, transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 backdrop-blur-sm"
        style={{ maskImage: "linear-gradient(to top, black, transparent)" }}
      />
    </div>
  );
}
