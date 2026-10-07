"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import Fishtank from "@/components/Fishtank";
import LinkedInIcon from "@/components/LinkedInIcon";
import LocalClock from "@/components/LocalClock";
import { BASE_PATH } from "@/lib/base-path";
import { getFishPoked, incrementFishPoked } from "@/lib/cookie-counter";

export default function ProfileSidebar() {
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
      {/* name / tagline / clock / bio */}
      <div className="panel-grey flex shrink-0 flex-col rounded-[22px] border border-[#6e6e6e]">
        <div className="well-inset flex flex-col gap-14 px-6 py-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              {/* The photo-frame PNG's bezel has a transparent cutout
                  (photo-frame-overlay.png) over the same inset the photo
                  used to occupy, so the looping video sits behind it,
                  cropped/positioned to match the old photo's framing. */}
              <div className="relative h-[162px] w-[162px] shrink-0">
                <video
                  src={`${BASE_PATH}/images/profile/pfp-video.mp4`}
                  poster={`${BASE_PATH}/images/profile/pfp-poster.jpg`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute rounded-[4px] object-cover"
                  style={{ top: 13, left: 14, width: 133, height: 134 }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${BASE_PATH}/images/profile/photo-frame-overlay.png`}
                  alt=""
                  className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col items-end gap-3">
                <LocalClock />
                {/* Bracketed quick links, retro-terminal style — shown at
                    every breakpoint, not just mobile. */}
                <div className="flex flex-col items-end gap-1.5">
                  <a
                    href={`${BASE_PATH}/files/mila-scholz-resume.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[#221898] hover:underline"
                  >
                    [Resume]
                  </a>
                  <a
                    href="mailto:mscholz5@uwo.ca"
                    className="text-sm font-medium text-[#221898] hover:underline"
                  >
                    [Email]
                  </a>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-[28px] font-semibold leading-tight text-foreground">
                Mila Scholz
              </h1>
              <p className="mt-2 text-sm italic text-foreground/50">Design, Engineering, &amp; AI @ UWO</p>
            </div>
          </div>

          <p className="text-[15px] leading-[23px] text-foreground/75">
            I design apps, interfaces, and mechanical components, and I&apos;ve worked in a
            manufacturing plant, so I know what it takes to get an idea into production. When
            I&apos;m not designing, I&apos;m working on my model train set or reading about
            floorplans.
          </p>
        </div>
      </div>

      {/* status */}
      <div className="panel-grey flex shrink-0 flex-col rounded-[22px] border border-[#6e6e6e]">
        <div className="well-inset flex items-center gap-2.5 p-3">
          <span aria-hidden className="btn-pill btn-pill-green btn-pill-static h-4 w-4 shrink-0" />
          <p className="text-sm font-medium text-foreground">
            Looking for Summer 2027 opportunities
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
          the name caption) on the left, LinkedIn/Email on the right. Only
          makes sense alongside the fishtank above it, so it shares its
          desktop-only visibility. */}
      <div className="panel-grey flex shrink-0 items-center justify-between rounded-[22px] border border-[#6e6e6e] p-1.5">
        <span className="hidden pl-2.5 text-sm italic text-foreground/50 lg:inline">
          {fishPoked !== null ? `${fishPoked.toLocaleString()} fish pokes` : null}
        </span>
        <div className="flex items-center gap-2">
          <a
            href="https://www.linkedin.com/in/mila-scholz-a4094730b/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="btn-pill flex h-9 w-9 items-center justify-center"
          >
            <LinkedInIcon className="h-4 w-4" />
          </a>
          <a
            href="mailto:mscholz5@uwo.ca"
            aria-label="Email"
            className="btn-pill flex h-9 w-9 items-center justify-center"
          >
            <Mail className="h-4 w-4" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </div>
  );
}
