"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { BASE_PATH } from "@/lib/base-path";

type ShapeId = "circle" | "triangle" | "star" | "square" | "heart" | "hexagon";

const SLOTS: { id: ShapeId; x: number; y: number }[] = [
  { id: "circle", x: 32, y: 40 },
  { id: "triangle", x: 68, y: 38 },
  { id: "star", x: 50, y: 68 },
];

type TrayItem =
  | { key: string; kind: "shape"; id: ShapeId }
  | { key: string; kind: "image"; id: string; src: string; alt: string };

const shape = (id: ShapeId, key: string): TrayItem => ({ key, kind: "shape", id });
const photo = (id: string, key: string, src: string, alt: string): TrayItem => ({
  key,
  kind: "image",
  id,
  src,
  alt,
});

// Five items per row, four rows: food together, books together, shapes fill the rest.
// causa/cheesecake repeat and the book cover repeats as placeholders until more photos are added.
const TRAY_ITEMS: TrayItem[] = [
  photo("causa-1", "food-1", "/images/aboutme/causa-cutout.png", "Causa"),
  photo("cheesecake-1", "food-2", "/images/aboutme/cheesecake-cutout.png", "Maracuyá cheesecake"),
  photo("causa-2", "food-3", "/images/aboutme/causa-cutout.png", "Causa"),
  photo("cheesecake-2", "food-4", "/images/aboutme/cheesecake-cutout.png", "Maracuyá cheesecake"),
  photo("causa-3", "food-5", "/images/aboutme/causa-cutout.png", "Causa"),

  photo("book-1", "book-1", "/images/aboutme/strangebook.webp", "Strange Buildings"),
  photo("book-2", "book-2", "/images/aboutme/strangebook.webp", "Strange Buildings"),
  photo("book-3", "book-3", "/images/aboutme/strangebook.webp", "Strange Buildings"),
  photo("book-4", "book-4", "/images/aboutme/strangebook.webp", "Strange Buildings"),
  photo("book-5", "book-5", "/images/aboutme/strangebook.webp", "Strange Buildings"),

  shape("square", "shape-1"),
  shape("circle", "shape-2"),
  shape("heart", "shape-3"),
  shape("hexagon", "shape-4"),
  shape("star", "shape-5"),

  shape("triangle", "shape-6"),
  shape("square", "shape-7"),
  shape("circle", "shape-8"),
  shape("heart", "shape-9"),
  shape("hexagon", "shape-10"),
];

function ShapeIcon({
  id,
  className,
  strokeWidth,
  strokeDasharray,
}: {
  id: ShapeId;
  className?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}) {
  const common = { className, strokeWidth, strokeDasharray };
  switch (id) {
    case "circle":
      return <circle cx={50} cy={50} r={42} {...common} />;
    case "square":
      return <rect x={12} y={12} width={76} height={76} rx={8} {...common} />;
    case "triangle":
      return <polygon points="50,10 92,86 8,86" {...common} />;
    case "star":
      return (
        <polygon
          points="50,4 61,36 96,36 68,57 79,90 50,70 21,90 32,57 4,36 39,36"
          {...common}
        />
      );
    case "heart":
      return (
        <path
          d="M50 86 C14 62 6 34 26 20 C40 10 50 20 50 30 C50 20 60 10 74 20 C94 34 86 62 50 86 Z"
          {...common}
        />
      );
    case "hexagon":
      return <polygon points="27,6 73,6 97,50 73,94 27,94 3,50" {...common} />;
  }
}

function TrayCell({
  item,
  onDropAttempt,
}: {
  item: TrayItem;
  onDropAttempt: (id: string, currentRect: DOMRect, homeRect: DOMRect) => { x: number; y: number } | null;
}) {
  const cellRef = useRef<HTMLDivElement>(null);
  const homeRectRef = useRef<DOMRect | null>(null);
  const dragOrigin = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [stuck, setStuck] = useState(false);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (stuck || !cellRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    homeRectRef.current = cellRef.current.getBoundingClientRect();
    dragOrigin.current = { x: event.clientX, y: event.clientY };
    setDragging(true);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setOffset({
      x: event.clientX - dragOrigin.current.x,
      y: event.clientY - dragOrigin.current.y,
    });
  }

  function handlePointerUp() {
    if (!dragging || !cellRef.current || !homeRectRef.current) return;
    setDragging(false);
    const currentRect = cellRef.current.getBoundingClientRect();
    const result = onDropAttempt(item.id, currentRect, homeRectRef.current);
    if (result) {
      setOffset(result);
      setStuck(true);
    } else {
      setOffset({ x: 0, y: 0 });
    }
  }

  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
      {item.kind === "shape" ? (
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-25">
          <ShapeIcon id={item.id} className="fill-none stroke-black/40" strokeWidth={5} strokeDasharray="6 6" />
        </svg>
      ) : null}
      <div
        ref={cellRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`relative h-12 w-12 touch-none select-none ${
          stuck ? "pointer-events-none" : "cursor-grab active:cursor-grabbing"
        }`}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${dragging ? 1.12 : 1})`,
          transition: dragging ? "none" : "transform 0.4s cubic-bezier(.34,1.56,.64,1)",
          zIndex: dragging ? 50 : 10,
        }}
      >
        <div className={stuck ? "animate-shape-stick" : ""}>
          {item.kind === "shape" ? (
            <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-sm">
              <ShapeIcon id={item.id} className="fill-foreground" />
            </svg>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${BASE_PATH}${item.src}`}
              alt={item.alt}
              className="h-full w-full object-contain drop-shadow-sm"
              draggable={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShapeBasketGame() {
  const slotRefs = useRef<Partial<Record<ShapeId, HTMLDivElement>>>({});
  const [placed, setPlaced] = useState<Set<ShapeId>>(new Set());

  function handleDropAttempt(
    id: string,
    currentRect: DOMRect,
    homeRect: DOMRect,
  ): { x: number; y: number } | null {
    if (placed.has(id as ShapeId)) return null;
    const isSlotShape = SLOTS.some((slot) => slot.id === id);
    if (!isSlotShape) return null;

    const slotEl = slotRefs.current[id as ShapeId];
    if (!slotEl) return null;
    const slotRect = slotEl.getBoundingClientRect();

    const pieceCenterX = currentRect.left + currentRect.width / 2;
    const pieceCenterY = currentRect.top + currentRect.height / 2;
    const margin = 28;
    const hit =
      pieceCenterX >= slotRect.left - margin &&
      pieceCenterX <= slotRect.right + margin &&
      pieceCenterY >= slotRect.top - margin &&
      pieceCenterY <= slotRect.bottom + margin;
    if (!hit) return null;

    const homeCenterX = homeRect.left + homeRect.width / 2;
    const homeCenterY = homeRect.top + homeRect.height / 2;
    const slotCenterX = slotRect.left + slotRect.width / 2;
    const slotCenterY = slotRect.top + slotRect.height / 2;

    setPlaced((prev) => new Set(prev).add(id as ShapeId));
    return { x: slotCenterX - homeCenterX, y: slotCenterY - homeCenterY };
  }

  const allFound = placed.size === SLOTS.length;

  return (
    <div className="border border-black bg-white p-6 md:p-8">
      <h2 className="text-xl font-semibold text-foreground">Get to know me...</h2>

      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
        <div>
          <div className="relative mx-auto aspect-square w-full max-w-sm md:mx-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE_PATH}/images/aboutme/shoppingcart.jpg`}
              alt="A wire shopping basket, seen from above"
              className="absolute inset-0 h-full w-full select-none object-contain"
              draggable={false}
            />
            {SLOTS.map((slot) => (
              <div
                key={slot.id}
                ref={(el) => {
                  if (el) slotRefs.current[slot.id] = el;
                }}
                className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              >
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <ShapeIcon
                    id={slot.id}
                    className={placed.has(slot.id) ? "fill-none stroke-none" : "fill-black/5 stroke-black/50"}
                    strokeWidth={5}
                    strokeDasharray="6 6"
                  />
                </svg>
              </div>
            ))}
          </div>

          <p className="mt-6 max-w-sm text-sm leading-relaxed text-foreground/50">
            {allFound
              ? "Nice — every shape found its spot."
              : "Drag a shape into the basket. It'll stick once you've got the right match. Not everything here has a home."}
          </p>
        </div>

        <div className="grid grid-cols-5 place-items-center gap-x-4 gap-y-8">
          {TRAY_ITEMS.map((item) => (
            <TrayCell key={item.key} item={item} onDropAttempt={handleDropAttempt} />
          ))}
        </div>
      </div>
    </div>
  );
}
