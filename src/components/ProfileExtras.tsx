"use client";

import { useEffect, useState } from "react";
import Fishtank from "@/components/Fishtank";
import { getFishPoked, incrementFishPoked } from "@/lib/cookie-counter";

export default function ProfileExtras() {
  // All-time, shared across every visitor — backed by the same counter
  // API/Redis instance as the cookie-click counter, just a different key.
  const [fishPoked, setFishPoked] = useState<number | null>(null);

  useEffect(() => {
    getFishPoked()
      .then(setFishPoked)
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-1.5 lg:h-full lg:min-h-0">
      {/* status */}
      <div className="panel-grey flex shrink-0 flex-col rounded-[22px] border border-[#6e6e6e]">
        <div className="well-inset flex items-center gap-2.5 p-3">
          <span aria-hidden className="btn-pill btn-pill-green btn-pill-static h-4 w-4 shrink-0" />
          <p className="text-sm font-medium text-foreground">
            Looking for Summer 2027 roles
          </p>
        </div>
      </div>

      {/* experience — "mila's fishtank": a macOS-chrome aquarium frame
          (grey bezel / blue water / grey bezel, per the MacOS-buttons-in-
          retrospect Figma "Fishtank" component), grows to fill the
          remaining height above the footer pill. */}
      <Fishtank
        onPoke={() => {
          incrementFishPoked()
            .then(setFishPoked)
            .catch(() => {});
        }}
      />

      {/* footer — the all-time fish-poked count (plain italic text, like
          the name caption). Only makes sense alongside the fishtank above
          it, so it shares its desktop-only visibility. */}
      <div className="panel-grey flex shrink-0 items-center rounded-[22px] border border-[#6e6e6e] p-1.5">
        <span className="hidden pl-2.5 text-sm italic text-foreground/50 lg:inline">
          {fishPoked !== null ? `${fishPoked.toLocaleString()} fish pokes` : null}
        </span>
      </div>
    </div>
  );
}
