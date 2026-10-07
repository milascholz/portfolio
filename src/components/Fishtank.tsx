"use client";

import { useEffect, useRef } from "react";

// Decor that sits fixed on the tank floor, all aligned to the same
// ground line as the anchor — never moves.
const GROUND_TOP = "82%";
const ANCHORED = [
  { emoji: "🪸", top: GROUND_TOP, left: "12%", size: "18px", rotate: "0deg" },
  { emoji: "🪨", top: GROUND_TOP, left: "24%", size: "16px", rotate: "0deg" },
  { emoji: "⚓", top: GROUND_TOP, left: "34%", size: "16px", rotate: "0deg" },
  { emoji: "🌿", top: GROUND_TOP, left: "58%", size: "18px", rotate: "0deg" },
  { emoji: "🪸", top: GROUND_TOP, left: "72%", size: "16px", rotate: "0deg" },
  { emoji: "🗿", top: GROUND_TOP, left: "88%", size: "20px", rotate: "0deg" },
  { emoji: "🪨", top: GROUND_TOP, left: "95%", size: "14px", rotate: "0deg" },
];

// Sits in its original corner and just bobs gently in place — doesn't
// patrol like the swimmers below.
const FLOATER = { emoji: "🛟", top: "16%", left: "88%", size: "22px" };

type Swimmer = {
  emoji: string;
  size: string;
  top: number; // home center, % of tank height
  left: number; // home center, % of tank width
  range: number; // patrol half-width, in %
  speed: number; // patrol speed, %/sec
  bobAmp: number; // vertical bob amplitude, %
  bobSpeed: number; // bob angular speed, rad/sec
  phase: number; // bob phase offset
};

// Everything else — drifts slowly back and forth, bobbing, and turns
// around at the edges of its own lane instead of crossing the whole tank.
// top (home center) keeps at least bobAmp + a margin clear of 0% so
// no swimmer's bob can carry it up behind the top chrome bezel.
const SWIMMERS: Swimmer[] = [
  { emoji: "🐠", size: "30px", top: 16, left: 8, range: 16, speed: 3.4, bobAmp: 3, bobSpeed: 1.6, phase: 0 },
  { emoji: "🐟", size: "28px", top: 19, left: 68, range: 18, speed: 3, bobAmp: 3, bobSpeed: 1.3, phase: 1.1 },
  { emoji: "🐡", size: "32px", top: 52, left: 18, range: 16, speed: 2.4, bobAmp: 4, bobSpeed: 1.1, phase: 2.3 },
  { emoji: "🪼", size: "24px", top: 20, left: 42, range: 14, speed: 2, bobAmp: 3, bobSpeed: 0.9, phase: 0.6 },
  { emoji: "🪼", size: "22px", top: 28, left: 52, range: 14, speed: 2.2, bobAmp: 3, bobSpeed: 1.0, phase: 3.0 },
  { emoji: "🦑", size: "30px", top: 58, left: 78, range: 16, speed: 2.8, bobAmp: 3, bobSpeed: 1.2, phase: 1.8 },
];

// How much a poke multiplies a fish's speed, and how fast that burst
// decays back to normal (higher = faster decay).
const POKE_BOOST = 7;
const POKE_DECAY_RATE = 2.5;

export default function Fishtank({ onPoke }: { onPoke?: () => void }) {
  const critterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const swimStateRef = useRef(
    SWIMMERS.map((s, i) => ({
      x: s.left,
      // Deterministic alternating start direction — avoids calling an
      // impure RNG during render.
      dir: (i % 2 === 0 ? 1 : -1) as 1 | -1,
      minX: Math.max(4, s.left - s.range),
      maxX: Math.min(94, s.left + s.range),
      boost: 1,
    }))
  );

  const lastTimeRef = useRef<number | null>(null);

  function pokeFish(i: number) {
    swimStateRef.current[i].boost = POKE_BOOST;
    onPoke?.();
  }

  useEffect(() => {
    let rafId: number;

    function frame(t: number) {
      const last = lastTimeRef.current ?? t;
      const dt = Math.min((t - last) / 1000, 0.05);
      lastTimeRef.current = t;

      SWIMMERS.forEach((cfg, i) => {
        const st = swimStateRef.current[i];

        st.boost = 1 + (st.boost - 1) * Math.exp(-dt * POKE_DECAY_RATE);
        st.x += st.dir * cfg.speed * st.boost * dt;
        if (st.x >= st.maxX) {
          st.x = st.maxX;
          st.dir = -1;
        } else if (st.x <= st.minX) {
          st.x = st.minX;
          st.dir = 1;
        }
        const y = cfg.top + Math.sin((t / 1000) * cfg.bobSpeed + cfg.phase) * cfg.bobAmp;
        const facingRight = st.dir === 1;

        const el = critterRefs.current[i];
        if (el) {
          el.style.left = `${st.x}%`;
          el.style.top = `${y}%`;
          el.style.transform = `translate(-50%, -50%) scaleX(${facingRight ? -1 : 1})`;
        }
      });

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="panel-grey hidden min-h-0 flex-1 flex-col overflow-hidden rounded-[22px] border border-[#6e6e6e] lg:flex">
      {/* top chrome bezel */}
      <div
        className="btn-win btn-win-static relative z-10 shrink-0"
        style={{ height: "21.33px", borderRadius: "22px 22px 0 0" }}
      />

      {/* water */}
      <div
        className="btn-win btn-win-blue btn-win-static fishtank-water relative min-h-0 flex-1"
        style={{ borderRadius: 0 }}
      >
        {ANCHORED.map((d, i) => (
          <span
            key={`anchored-${i}`}
            aria-hidden
            className="pointer-events-none absolute select-none opacity-90"
            style={{ top: d.top, left: d.left, fontSize: d.size, transform: `rotate(${d.rotate})` }}
          >
            {d.emoji}
          </span>
        ))}

        <span
          aria-hidden
          className="animate-soft-bounce pointer-events-none absolute select-none opacity-90"
          style={{ top: FLOATER.top, left: FLOATER.left, fontSize: FLOATER.size }}
        >
          {FLOATER.emoji}
        </span>

        {SWIMMERS.map((s, i) => (
          <span
            key={`swimmer-${i}`}
            role="button"
            tabIndex={0}
            aria-label="Poke fish"
            ref={(el) => {
              critterRefs.current[i] = el;
            }}
            onClick={() => pokeFish(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                pokeFish(i);
              }
            }}
            className="absolute cursor-pointer select-none opacity-90 will-change-transform"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              fontSize: s.size,
              transform: "translate(-50%, -50%)",
            }}
          >
            {s.emoji}
          </span>
        ))}

        {/* bottom soft glow, matching .btn-win's ::after — btn-win-blue
            disables its own so this is added back explicitly. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-[6%] bottom-[10%] h-[40%] rounded-full opacity-90 blur-[3px]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 75%)",
          }}
        />
      </div>

      {/* bottom chrome bezel */}
      <div
        className="btn-win btn-win-static relative flex shrink-0 items-center"
        style={{ height: "28px", borderRadius: "0 0 22px 22px" }}
      >
        <span className="relative pl-3 text-[11px] font-semibold tracking-wide text-black/55">
          the fishtank
        </span>
      </div>
    </div>
  );
}
