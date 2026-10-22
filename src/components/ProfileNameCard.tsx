"use client";

import { BASE_PATH } from "@/lib/base-path";

export default function ProfileNameCard({ showBio = true }: { showBio?: boolean }) {
  return (
    <div className="panel-grey flex shrink-0 flex-col rounded-[22px] border border-[#6e6e6e]">
      <div className="well-inset flex flex-col px-6 py-6">
        <div className="flex flex-col gap-4">
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
          <div>
            <h1 className="text-[28px] font-semibold leading-tight text-foreground">
              Mila Scholz
            </h1>
            <p className="mt-2 text-sm italic text-foreground/50">Design, Engineering, &amp; AI @ UWO</p>

            {/* Bracketed quick links, retro-terminal style — shown at
                every breakpoint, not just mobile. Sits right below the
                degree line now, stacked and left-aligned. */}
            <div className="mt-2 flex flex-col items-start gap-1">
              <a
                href={`${BASE_PATH}/files/mila-scholz-resume.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#221898] hover:underline"
              >
                [Resume]
              </a>
              <a
                href="https://www.linkedin.com/in/mila-scholz-a4094730b/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#221898] hover:underline"
              >
                [LinkedIn]
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

        {/* Collapses/expands (instead of unmounting) so switching between
            Home and Fun animates the card's height up/down rather than
            snapping. Grid-rows + margin both animate together so the gap
            above the bio collapses away fully instead of leaving a gap. */}
        <div
          className={`grid overflow-hidden transition-[grid-template-rows,margin-top] duration-300 ease-in-out ${
            showBio ? "mt-6 grid-rows-[1fr]" : "mt-0 grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <p className="text-[15px] leading-[23px] text-foreground/75">
              Product designer and engineer, building beautiful things you&apos;ll actually want to use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
