"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { BASE_PATH } from "@/lib/base-path";

type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
};

const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: "/images/aboutme/cavendish-farms.jpg",
    alt: "Mila jumping for joy in front of the Cavendish Farms sign on a sunny day",
    caption: "Cavendish Farms",
  },
  {
    src: "/images/aboutme/pei-coastline.jpg",
    alt: "A person standing where a dirt path meets the ocean, framed by tall dune grass",
    caption: "PEI coastline",
  },
  {
    src: "/images/aboutme/redwoods-train.jpg",
    alt: "Two friends standing on a graffiti-covered abandoned train car in a redwood forest",
    caption: "Abandoned train, redwoods",
  },
  {
    src: "/images/aboutme/japan-lawson.jpg",
    alt: "A group in pink rain ponchos posing outside a Lawson convenience store in Japan",
    caption: "Rainy day in Japan",
  },
  {
    src: "/images/aboutme/whistler-ski.jpg",
    alt: "A snowy mountain slope at Whistler with skiers and snowboarders descending",
    caption: "Whistler in winter",
  },
  {
    src: "/images/aboutme/cat-selfie.jpg",
    alt: "A close-up selfie with a tabby and white cat",
    caption: "My cat",
  },
  {
    src: "/images/aboutme/lab-thumbs-up.jpg",
    alt: "Mila giving a thumbs up in a lab, wearing safety glasses, a mask, and gloves",
    caption: "In the lab",
  },
];

type HoverState = { caption: string; x: number; y: number } | null;

function GalleryTile({
  item,
  onHover,
}: {
  item: GalleryItem;
  onHover: (state: HoverState) => void;
}) {
  function track(event: MouseEvent<HTMLDivElement>) {
    onHover({ caption: item.caption, x: event.clientX, y: event.clientY });
  }

  return (
    <div
      className="relative overflow-hidden border border-black bg-white"
      onMouseEnter={track}
      onMouseMove={track}
      onMouseLeave={() => onHover(null)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE_PATH}${item.src}`}
        alt={item.alt}
        className="block w-full select-none"
        draggable={false}
      />
    </div>
  );
}

// Matches the ticker on marcmasgoret.ca/about: the column scrolls itself
// at a steady 21px/s and loops seamlessly, but any manual scroll input
// (wheel, touch, drag) holds it still until things go quiet again.
const SPEED = 21;
const IDLE_DELAY = 1400;

export default function AboutGallery() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const loopItems = [...GALLERY_ITEMS, ...GALLERY_ITEMS];
  const [hover, setHover] = useState<HoverState>(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    const track = trackRef.current;
    if (!gallery || !track) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const children = Array.from(track.children) as HTMLElement[];
    const originals = children.slice(0, GALLERY_ITEMS.length);
    const copies = children.slice(GALLERY_ITEMS.length);
    const period = () => copies[0].offsetTop - originals[0].offsetTop;

    let paused = false;
    let resumeTimer: ReturnType<typeof setTimeout>;
    const pause = () => {
      paused = true;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        paused = false;
      }, IDLE_DELAY);
    };

    const pauseEvents = ["touchstart", "touchmove", "pointerdown", "wheel"];
    pauseEvents.forEach((ev) => gallery.addEventListener(ev, pause, { passive: true }));

    let inView = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.intersectionRatio >= 0.2;
      },
      { threshold: [0, 0.2] }
    );
    observer.observe(gallery);

    let at = gallery.scrollTop || 1;
    let lastTime = 0;
    let frameId: number;

    const step = (now: number) => {
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = now;
      const len = period();
      if (len > 0) {
        if (Math.abs(gallery.scrollTop - at) > 2) {
          at = gallery.scrollTop;
        }
        if (!paused && inView) {
          at += SPEED * dt;
        }
        const wrap = at >= len ? -len : at < 0.5 ? len : 0;
        at += wrap;
        gallery.scrollTop = at;
      }
      frameId = requestAnimationFrame(step);
    };

    gallery.scrollTop = at;
    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(resumeTimer);
      observer.disconnect();
      pauseEvents.forEach((ev) => gallery.removeEventListener(ev, pause));
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={galleryRef}
        className="no-scrollbar h-[80vh] overflow-y-auto overscroll-contain"
      >
        <div ref={trackRef} className="flex flex-col gap-4">
          {loopItems.map((item, index) => (
            <GalleryTile key={`${item.src}-${index}`} item={item} onHover={setHover} />
          ))}
        </div>
      </div>
      {hover ? (
        <div
          className="pointer-events-none fixed z-20 flex items-center gap-1 whitespace-nowrap border border-black bg-white px-2 py-1 text-xs font-medium text-foreground shadow-sm"
          style={{ left: hover.x, top: hover.y, transform: "translate(10px, 10px)" }}
        >
          {hover.caption}
        </div>
      ) : null}
    </div>
  );
}
