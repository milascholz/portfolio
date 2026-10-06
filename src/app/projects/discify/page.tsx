"use client";

import { useEffect, useRef, useState, ViewTransition, type ReactNode } from "react";
import type { RefObject } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BASE_PATH } from "@/lib/base-path";
import { useRegisterProjectNav } from "@/context/ProjectNavContext";

const TAGS = ["Personal Project", "Shipped 2026"];

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "design-process", label: "Design Process" },
  { id: "design-decisions", label: "Design Decisions" },
  { id: "core-flows", label: "Core Flows" },
  { id: "final-product", label: "Final Product" },
  { id: "reflection", label: "Reflection" },
];

const ROLE_DETAILS = [
  { label: "Role", value: "Product Designer + Developer" },
  { label: "Team", value: "Solo" },
  { label: "Timeline", value: "September 2026" },
  { label: "Skills", value: "Product & Interaction Design, Product Strategy" },
];

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
      {children}
    </p>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return <div className="mt-4 max-w-[960px] space-y-4 leading-relaxed text-foreground/70">{children}</div>;
}

function Figure({
  src,
  alt,
  caption,
  maxWidth,
}: {
  src: string;
  alt: string;
  caption: string;
  maxWidth?: number;
}) {
  return (
    <div
      className="well-inset mt-6 p-6"
      style={maxWidth ? { maxWidth } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${BASE_PATH}${src}`} alt={alt} className="w-full rounded-lg border border-black/10" />
      <p className="mt-2 text-xs text-foreground/50">{caption}</p>
    </div>
  );
}

type ImagePairItem = {
  src: string;
  alt: string;
  caption: string;
};

function FigurePair({ items }: { items: [ImagePairItem, ImagePairItem] }) {
  return (
    <div className="well-inset p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BASE_PATH}${item.src}`} alt={item.alt} className="w-full rounded-lg border border-black/10" />
            <p className="mt-2 text-xs text-foreground/50">{item.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MediaBoxVideo({
  src,
  caption,
  maxWidth,
}: {
  src: string;
  caption: string;
  maxWidth?: number;
}) {
  return (
    <div className="well-inset mt-6 p-6" style={maxWidth ? { maxWidth } : undefined}>
      <video
        className="w-full rounded-lg border border-black/10"
        src={`${BASE_PATH}${src}`}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
      <p className="mt-2 text-xs text-foreground/50">{caption}</p>
    </div>
  );
}

function MediaPair({
  videoSrc,
  videoCaption,
  videoAspect,
  imageSrc,
  imageAlt,
  imageCaption,
  imageAspect,
}: {
  videoSrc: string;
  videoCaption: string;
  videoAspect?: string;
  imageSrc: string;
  imageAlt: string;
  imageCaption: string;
  imageAspect?: string;
}) {
  return (
    <div className="well-inset mt-6 p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-stretch">
        <div className="flex flex-col">
          <video
            className="w-full rounded-lg border border-black/10 object-cover object-left"
            style={videoAspect ? { aspectRatio: videoAspect } : undefined}
            src={`${BASE_PATH}${videoSrc}`}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
          <p className="mt-2 text-xs text-foreground/50">{videoCaption}</p>
        </div>
        <div className="flex flex-col">
          {imageAspect ? (
            // Stretches to match the video column's height (instead of a
            // fixed aspect ratio) so any leftover space below the image
            // fills with its own black background, not blank white.
            <div className="w-full flex-1 overflow-hidden rounded-lg border border-black/10 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE_PATH}${imageSrc}`}
                alt={imageAlt}
                className="h-full w-full object-contain object-top"
              />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`${BASE_PATH}${imageSrc}`} alt={imageAlt} className="w-full rounded-lg border border-black/10" />
          )}
          <p className="mt-2 text-xs text-foreground/50">{imageCaption}</p>
        </div>
      </div>
    </div>
  );
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[960px] border-l-2 border-black/25 pl-4">
      <p className="leading-relaxed text-foreground">{children}</p>
    </div>
  );
}
type Decision = {
  title: string;
  decision: string;
  why: string;
  rejected?: string;
};

const DECISIONS: Decision[] = [
  {
    title: "Completion threshold: 90% per track",
    decision:
      "A track counts as “listened” once 90% of it is played. An album completes when every track clears that threshold.",
    why: "100% is problematic if there is a buffering glitch, if a user skips back to replay a lyric, or if they close the app two seconds early, because it would wrongly disqualify an otherwise real listen. The 90% threshold absorbs that noise while still landing past the point where skipping “pays off”; if a user listens to 90% of a track, they’ve essentially heard the whole thing.",
  },
  {
    title: "No discs for singles",
    decision: "Only albums earn discs.",
    why: "Singles originally earned discs too, which meant that for every single song played on Spotify, a new completed disc or “in progress” disc would be generated. This overpopulated the collected discs section, giving the user a cluttered overview of their album listening history. It also missed the point of Discify: a single has no sequencing or transitions to appreciate.",
  },
  {
    title: "“In progress” = 3 tracks, not a percentage listened",
    decision:
      "An album shows as “in progress” after 3 tracks, not after listening to a set percentage of an album.",
    why: "I started with 30% of tracks listened being the threshold for generating an “in progress” disc for an album, but that treats albums unevenly. 30% of a 20-track album is 6 songs, whereas 30% of a 7-track album is 2. Short albums landed on the shelf almost by accident, while long ones took longer to show up. A fixed count means the same effort grants any album an “in progress” disc, no matter its length.",
    rejected:
      "Showing every album you've played one song from, since it would clutter the shelf and make progress difficult to track for a user.",
  },
  {
    title: "Discs are private, not social",
    decision: "Friends can't see your discs.",
    why: "Public disc badges would encourage people to listen to an album for the badge instead of the music. That's disingenuous for the user and for the artist, and doesn’t align with Discify's goal. It also doesn't match Spotify's core product. Followers exist, but Spotify is built around individual listening, not an audience.",
    rejected: "Shareable disc collections on public profiles (see hand-drawn sketch for this concept work).",
  },
  {
    title: "Progress bar stalls at 80%",
    decision:
      "A disc in progress fills clockwise from grayscale to color, but stalls at 80% until every track is complete.",
    why: "The clockwise progress bar originally responded directly to the percentage of an album listened, but due to the small icons within the app, an album at 95% looked the same as an album at 100%. You couldn't tell a nearly done disc from a complete one, so the payoff of finishing an album disappeared. Stalling the progress bar at 80% leaves a gap visible at all disc sizes until the last track is complete. This clearly distinguishes a finished album.",
  },
  {
    title: "Filter between in-progress and complete",
    decision: "Filter pills on the “Show all” view.",
    why: "At first, every disc was included in the same section. As collections grew, finished and in-progress albums were difficult to separate, and the collection stopped feeling like a collection. The one thing worth seeing, what you've actually finished, was buried. Filters let you view completed discs on their own, or view what's still in progress when you're picking what to listen to next.",
  },
  {
    title: "Disc placement: album page only",
    decision: "The disc badge lives on the album page only.",
    why: "A disc beside every album was too messy on search results and library lists, as they were screens built for finding music, not celebrating a finished one. It also diluted the feature by putting it everywhere an album appears. The album page ties the badge to the listening experience itself, sitting where your eye naturally goes when you open or play an album.",
    rejected: "Search results, library lists — both too cluttered and off-purpose.",
  },
];

function DecisionCard({
  index,
  decision,
  media,
}: {
  index: number;
  decision: Decision;
  media?: ReactNode;
}) {
  return (
    <div className="panel-grey panel-flat mt-6 w-full overflow-hidden rounded-[22px] border border-[#6e6e6e]">
      <div
        className="btn-pill btn-pill-static finding-header flex items-center gap-3 px-5 py-3"
        style={{ borderRadius: "21px 21px 0 0" }}
      >
        <span className="text-sm font-semibold text-foreground/50">
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="text-sm font-semibold text-foreground">{decision.title}</p>
      </div>
      <div className="divide-y divide-black/10 px-5">
        <div className="py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">Decision</p>
          <p className="mt-1.5 text-base font-medium leading-relaxed text-foreground">{decision.decision}</p>
        </div>
        <div className="py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">Why</p>
          <p className="mt-1.5 leading-relaxed text-foreground/70">{decision.why}</p>
        </div>
        {decision.rejected ? (
          <div className="py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground/30">Rejected</p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/40">{decision.rejected}</p>
          </div>
        ) : null}
        {media ? <div className="py-5">{media}</div> : null}
      </div>
    </div>
  );
}

const DISC_TOTAL_TRACKS = 14;

// Matches the disc renderer from the "Disc progress render" artifact:
// a real cover-art annulus between the hub and outer rim, greyscale
// underneath, with true colour painted back in over a clock-hand sweep
// that stops advancing at 80% and only closes on the jump to done.
const DISC_INNER_RATIO = 0.29;
const DISC_OUTER_RATIO = 0.95;
const DISC_PLATEAU_START = 0.8;
const DISC_START_OFFSET_RAD = (10 * Math.PI) / 180;

function discSourceSize(source: HTMLImageElement | HTMLCanvasElement) {
  if (source instanceof HTMLImageElement) {
    return { width: source.naturalWidth, height: source.naturalHeight };
  }
  return { width: source.width, height: source.height };
}

function drawDiscCover(
  ctx: CanvasRenderingContext2D,
  source: HTMLImageElement | HTMLCanvasElement,
  cx: number,
  cy: number,
  boxSize: number,
) {
  const { width: iw, height: ih } = discSourceSize(source);
  if (!iw || !ih) return;
  const scale = Math.max(boxSize / iw, boxSize / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(source, cx - dw / 2, cy - dh / 2, dw, dh);
}

function renderDiscToCanvas(
  canvas: HTMLCanvasElement,
  cdImg: HTMLImageElement,
  artImg: HTMLImageElement,
  grayArt: HTMLCanvasElement,
  progress: number,
) {
  const size = canvas.width;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const R = size / 2;
  const cx = R;
  const cy = R;

  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(cdImg, 0, 0, size, size);

  const innerR = R * DISC_INNER_RATIO;
  const outerR = R * DISC_OUTER_RATIO;
  const midR = (innerR + outerR) / 2;
  const ringWidth = outerR - innerR;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2, false);
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
  ctx.clip("evenodd");

  drawDiscCover(ctx, grayArt, cx, cy, outerR * 2);

  const raw = Math.min(1, Math.max(0, progress));
  const full = raw >= 1;
  const sweep = full ? Math.PI * 2 : Math.min(raw, DISC_PLATEAU_START) * Math.PI * 2;

  if (sweep > 0) {
    const mask = document.createElement("canvas");
    mask.width = size;
    mask.height = size;
    const mctx = mask.getContext("2d");
    if (mctx) {
      const start = -Math.PI / 2 + DISC_START_OFFSET_RAD;
      const end = start + sweep;
      mctx.lineCap = "round";
      mctx.lineWidth = ringWidth;
      mctx.strokeStyle = "#000";
      mctx.beginPath();
      mctx.arc(cx, cy, midR, start, end, false);
      mctx.stroke();

      mctx.globalCompositeOperation = "source-in";
      drawDiscCover(mctx, artImg, cx, cy, outerR * 2);

      ctx.drawImage(mask, 0, 0);
    }
  }

  ctx.restore();
}

type DiscAssets = {
  ready: boolean;
  cdImgRef: RefObject<HTMLImageElement | null>;
  artImgRef: RefObject<HTMLImageElement | null>;
  grayArtRef: RefObject<HTMLCanvasElement | null>;
};

function useDiscAssets(): DiscAssets {
  const [ready, setReady] = useState(false);
  const cdImgRef = useRef<HTMLImageElement | null>(null);
  const artImgRef = useRef<HTMLImageElement | null>(null);
  const grayArtRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cdImg = new Image();
    const artImg = new Image();
    let loaded = 0;

    function onEach() {
      loaded++;
      if (loaded !== 2 || cancelled) return;
      const gray = document.createElement("canvas");
      gray.width = artImg.naturalWidth;
      gray.height = artImg.naturalHeight;
      const gctx = gray.getContext("2d");
      if (gctx) {
        gctx.filter = "grayscale(1) brightness(0.6) contrast(0.92)";
        gctx.drawImage(artImg, 0, 0);
      }
      cdImgRef.current = cdImg;
      artImgRef.current = artImg;
      grayArtRef.current = gray;
      setReady(true);
    }

    cdImg.onload = onEach;
    artImg.onload = onEach;
    cdImg.src = `${BASE_PATH}/images/discify-disc-cd.png`;
    artImg.src = `${BASE_PATH}/images/discify-disc-art.jpg`;

    return () => {
      cancelled = true;
    };
  }, []);

  return { ready, cdImgRef, artImgRef, grayArtRef };
}

function DiscCanvas({
  progress,
  size,
  displaySize,
  assets,
}: {
  progress: number;
  size: number;
  displaySize: number;
  assets: DiscAssets;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cdImg = assets.cdImgRef.current;
    const artImg = assets.artImgRef.current;
    const grayArt = assets.grayArtRef.current;
    if (!assets.ready || !canvas || !cdImg || !artImg || !grayArt) return;
    renderDiscToCanvas(canvas, cdImg, artImg, grayArt, progress);
  }, [assets, progress]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ width: displaySize, height: displaySize }}
      aria-hidden="true"
    />
  );
}

const DISC_GLANCE_STEPS = [0, 25, 50, 80, 95, 100];

function DiscDemo() {
  const assets = useDiscAssets();
  const [percent, setPercent] = useState(62);
  const tracks = Math.round((percent / 100) * DISC_TOTAL_TRACKS);

  return (
    <div className="space-y-4">
      <div className="well-inset p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">Progress Preview</p>
        <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
          <DiscCanvas progress={percent / 100} size={280} displaySize={200} assets={assets} />
          <div className="w-full flex-1">
            <p className="text-3xl font-semibold text-foreground">
              {percent}%
              <span className="ml-2 text-sm font-normal text-foreground/50">
                {tracks} / {DISC_TOTAL_TRACKS} tracks
              </span>
            </p>
            <input
              type="range"
              min={0}
              max={100}
              value={percent}
              onChange={(event) => setPercent(Number(event.target.value))}
              className="mt-4 w-full accent-black"
              aria-label="Album listen progress"
            />
            <p className="mt-4 text-sm leading-relaxed text-foreground/60">
              Slide this progress bar to visualize this design decision.
            </p>
          </div>
        </div>
      </div>

      <div className="well-inset p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
          Progress disc states
        </p>
        <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {DISC_GLANCE_STEPS.map((step) => (
            <div
              key={step}
              className="flex flex-col items-center gap-2 rounded-lg border border-black/10 bg-white p-4"
            >
              <DiscCanvas progress={step / 100} size={140} displaySize={64} assets={assets} />
              <p className="text-xs text-foreground/50">{step}%</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-foreground/60">
          Notice for yourself the challenge of discerning between the 80%, 95%, and 100% disc states.
        </p>
      </div>
    </div>
  );
}

type ProcessStep = {
  title: string;
};

const PROCESS_STEPS: ProcessStep[] = [
  { title: "1. Sketches" },
  { title: "2. Functional MVP" },
  { title: "3. Redesigning the MVP" },
  { title: "4. Final Product" },
];

type PlacementOption = {
  title: string;
  verdict: "Chosen" | "Rejected";
  imageSrc: string;
  imageAlt: string;
  imagePosition: string;
};

const PLACEMENT_IMAGE_ASPECT = "aspect-[624/587]";

const PLACEMENT_OPTIONS: PlacementOption[] = [
  {
    title: "Search results",
    verdict: "Rejected",
    imageSrc: "/images/discify/search-results.png",
    imageAlt:
      "Spotify search page with recent searches, each result showing a small disc badge next to the album art",
    imagePosition: "object-center",
  },
  {
    title: "Library lists",
    verdict: "Rejected",
    imageSrc: "/images/discify/search-results2.png",
    imageAlt: "Your Library view with Albums filter, showing a small disc badge next to each album",
    imagePosition: "object-top",
  },
  {
    title: "Album page",
    verdict: "Chosen",
    imageSrc: "/images/discify/album-placement.png",
    imageAlt: "Album page for 'Do That Again' with a disc badge icon beside the play button",
    imagePosition: "object-[center_78%]",
  },
];

function PlacementCard({ option }: { option: PlacementOption }) {
  const isChosen = option.verdict === "Chosen";
  return (
    <div
      className={`w-full overflow-hidden rounded-[18px] border ${
        isChosen ? "border-[#6e6e6e] bg-white" : "border-black/10 bg-black/[0.015]"
      }`}
    >
      <div className="p-4">
        <div className="flex flex-wrap items-baseline gap-2">
          <p className={isChosen ? "font-medium text-foreground" : "text-sm font-medium text-foreground/45"}>
            {option.title}
          </p>
          <span className={isChosen ? "text-foreground/40" : "text-foreground/25"} aria-hidden="true">
            →
          </span>
          <span
            className={`text-xs font-semibold uppercase tracking-widest ${
              isChosen ? "text-foreground" : "text-foreground/35"
            }`}
          >
            {option.verdict}
          </span>
        </div>
      </div>
      <div className={`${PLACEMENT_IMAGE_ASPECT} w-full overflow-hidden bg-white`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${BASE_PATH}${option.imageSrc}`}
          alt={option.imageAlt}
          className={`h-full w-full object-cover ${option.imagePosition}`}
        />
      </div>
    </div>
  );
}

export default function DiscifyPage() {
  useRegisterProjectNav("Discify", SECTIONS);

  return (
    <ViewTransition name="project-discify">
    <div>
      <video
        className="aspect-[40/9] w-full rounded-t-[21px] object-cover"
        src={`${BASE_PATH}/videos/discify-showcase.mp4`}
        poster={`${BASE_PATH}/images/discify-poster.jpg`}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />

      <div className="mx-auto w-full max-w-[1120px] p-6 md:p-10 lg:p-12">
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="btn-pill btn-pill-static px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground">Discify</h1>
        <p className="mt-3 max-w-[960px] leading-relaxed text-foreground/70">
          Spotify extension gamifying album listens
        </p>

        <div className="panel-grey panel-flat mt-8 grid grid-cols-2 gap-6 rounded-[22px] border border-[#6e6e6e] p-6 sm:grid-cols-4">
          {ROLE_DETAILS.map((detail) => (
            <div key={detail.label}>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">{detail.label}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground">{detail.value}</p>
            </div>
          ))}
        </div>

        {/* Overview */}
        <section id="overview" className="mt-16 scroll-mt-8">
          <Eyebrow>Overview</Eyebrow>
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            A Spotify extension that rewards listening to an entire album the way it was meant to be heard.
          </h2>
          <Prose>
            <p>
              Listen to every song in an album to earn a CD “badge” with the album’s art on it. Badges
              live on the album page and on your profile, and progress updates in real time as you listen.
            </p>
          </Prose>
        </section>

        {/* Problem */}
        <section id="problem" className="mt-16 scroll-mt-8">
          <Eyebrow>Problem</Eyebrow>
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            Spotify has no concept to track finishing an album.
          </h2>
          <Prose>
            <p>
              Skip through half a tracklist or listen to an album in full; Spotify logs this all in your
              listening history, but can’t differentiate between background music and intentionally
              listening to an entire record.
            </p>
          </Prose>

          <h2 className="mt-10 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            Most listeners never hear an album the way the artist sequenced it.
          </h2>
          <Prose>
            <p>
              I noticed I only listened to entire albums, start to finish, on long car rides with a
              friend, for example playing new releases from Ariana Grande and Gracie Abrams. On my own, I
              shuffled and skipped songs. That means missing deliberate transitions an artist has added
              between songs, recurring themes, and the craft that goes into ordering a tracklist.
            </p>
          </Prose>

          <div className="mt-6">
            <Callout>
              <span className="font-semibold">Goal:</span> give people a reason to listen to full albums
              to experience them the way the artist intended, not for engagement.
            </Callout>
          </div>
        </section>

        {/* Solution */}
        <section id="solution" className="mt-16 scroll-mt-8">
          <Eyebrow>Solution</Eyebrow>
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            Collectible discs, earned by actually listening.
          </h2>
          <Prose>
            <ul className="list-disc space-y-2 pl-5">
              <li>Every album gets a custom disc that fills with color as you listen</li>
              <li>A disc is completed only when every track is actually played</li>
              <li>Discs are collected in a private section on your profile</li>
              <li>In-progress albums show up once you've made a real start</li>
            </ul>
          </Prose>
          <Figure
            src="/images/discify/discify-profile-shelf.png"
            alt="Discs collected page showing All, Collected, and In progress filter pills above six discs, each with the album's cover art, title, and artist"
            caption="Profile section of earned discs, with collected / in-progress filters"
          />
        </section>

        {/* Design Process */}
        <section id="design-process" className="mt-16 scroll-mt-8">
          <Eyebrow>Design Process</Eyebrow>
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            From paper sketch to working MVP to final product.
          </h2>
          <Prose>
            <p>
              The concept was clear early, but I always like to begin designs on paper to slow down and
              work through several concepts, so I sketched the key screens by hand and then went straight
              to building. I got the core logic working first, then refined the designs on top of it. That
              working version became my prototype. I used it daily and improved it based on friction
              points I noticed as an actual user.
            </p>
          </Prose>

          {PROCESS_STEPS.map((step) => (
            <div key={step.title}>
              <h3 className="mt-10 max-w-[960px] text-xl font-semibold leading-snug text-foreground">
                {step.title}
              </h3>
              {step.title === "2. Functional MVP" ? (
                <>
                  <Prose>
                    <p>
                      Included track completion tracking, the track dropdown, and the rotation animation
                      for discs. However, every disc looked the same, lacked album art, and singles still
                      earned their own disc (which led to Design Decision #2, explained in the next
                      section).
                    </p>
                  </Prose>
                  <MediaPair
                    videoSrc="/videos/discify-mvp-demo.mp4"
                    videoCaption="First edition of tracking and design within albums"
                    imageSrc="/images/discify/discify-mvp-screenshot.png"
                    imageAspect="558 / 438"
                    imageAlt="Early functional build showing collected discs with no visual styling yet"
                    imageCaption="First edition of collected discs design, where singles like &quot;4me 4me&quot; earned their own disc"
                  />
                </>
              ) : step.title === "3. Redesigning the MVP" ? (
                <>
                  <Prose>
                    <p>
                      With the logic proven, I transitioned into Figma to redesign the MVP disc from a
                      placeholder sphere into a flat CD with real album art. I designed the in-progress and
                      completed disc states as shown below, but later decided to make the background of
                      the in-progress disc state greyscale for increased contrast when discs appear small
                      on-screen.
                    </p>
                  </Prose>
                  <div className="well-inset mt-6 p-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${BASE_PATH}/images/discify/discify-disc-redesign.png`}
                      alt="Four stages of the disc design in Figma: a 3D gradient sphere, a blank CD, a first cover-art version, and the refined cover-art disc"
                      className="w-full rounded-lg border border-black/10"
                    />
                    <p className="mt-2 text-xs text-foreground/50">
                      Redesigning the disc in Figma — from a 3D gradient sphere, to a flat CD base, to
                      the final cover-art disc states.
                    </p>
                  </div>
                </>
              ) : step.title === "4. Final Product" ? (
                <>
                  <Prose>
                    <p>
                      The shipped version includes the redesigned disc with real album art, the tracking
                      UI, and the profile section with filters to toggle between in-progress and completed
                      albums.
                    </p>
                  </Prose>
                  <MediaPair
                    videoSrc="/videos/discify-designed-demo.mp4"
                    videoCaption="Final tracking and designs within albums"
                    videoAspect="1676 / 1386"
                    imageSrc="/images/discify/discify-designed-screenshot.png"
                    imageAlt="Discs collected page with album art, showing collected and in-progress filter pills above eight discs"
                    imageCaption="Final collected discs design, where only albums, not singles, earned their own disc"
                  />
                </>
              ) : (
                <>
                  <Prose>
                    <p>
                      Before writing any code, I sketched the core screens by hand to work out badge
                      placement and the disc progress loading feature.
                    </p>
                  </Prose>
                  <div className="well-inset mt-6 p-6">
                    <div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${BASE_PATH}/images/discify/brainstorm3.jpg`}
                        alt="First concept sketch labeled 'Spotify app idea - badge collecting', showing a plain disc and a disc with cover art colored in to show progress"
                        className="w-full rounded-lg border border-black/10"
                      />
                      <p className="mt-2 text-xs text-foreground/50">
                        The original idea: a disc badge whose cover art colors in to show listening
                        progress
                      </p>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`${BASE_PATH}/images/discify/brainstorm1.jpg`}
                          alt="Sketch of a disc next to a track list with checkmarks and X's marking listened and unlistened songs, with a note about filtering between listened and not listened"
                          className="w-full rounded-lg border border-black/10"
                        />
                        <p className="mt-2 text-xs text-foreground/50">
                          Working out the track breakdown and how to mark listened vs. unlistened tracks
                        </p>
                      </div>
                      <div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`${BASE_PATH}/images/discify/brainstorm2.jpg`}
                          alt="Sketch of a profile header with name, playlists, and followers, with notes debating whether to surface recently collected discs or a collected/in-progress count"
                          className="w-full rounded-lg border border-black/10"
                        />
                        <p className="mt-2 text-xs text-foreground/50">
                          Sketching the profile header: recently collected discs vs. a simple disc count
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </section>

        {/* Design Decisions */}
        <section id="design-decisions" className="mt-16 scroll-mt-8">
          <Eyebrow>Design Decisions</Eyebrow>
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            The completion logic: defining a “listen”
          </h2>
          {DECISIONS.map((decision, index) => (
            <DecisionCard
              key={decision.title}
              index={index}
              decision={decision}
              media={
                index === 1 ? (
                  <FigurePair
                    items={[
                      {
                        src: "/images/discify/discs-with-singles.png",
                        alt: "A long, overpopulated list of discs including singles like \"I Barely Know Her,\" \"4Me 4Me,\" and \"SWAG\" earning the same badge as full albums",
                        caption:
                          "Before: overpopulated collected discs section, since singles earned a disc just like full albums",
                      },
                      {
                        src: "/images/discify/discs-no-singles.png",
                        alt: "Discs shelf with singles removed, showing only full albums like \"Midnight Memories\" and \"FOUR\"",
                        caption: "After: only completed albums earn a disc, creating a cleaner collection",
                      },
                    ]}
                  />
                ) : index === 4 ? (
                  <DiscDemo />
                ) : index === 5 ? (
                  <div className="well-inset p-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${BASE_PATH}/images/discify/discify-filter-pills.png`}
                      alt="Discs collected header showing '3 collected · 5 in progress' above All, Collected, and In progress filter pills"
                      className="w-full rounded-lg border border-black/10"
                    />
                    <p className="mt-2 text-xs text-foreground/50">
                      Filter pills for switching between all, collected, and in-progress discs
                    </p>
                  </div>
                ) : index === 6 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {PLACEMENT_OPTIONS.map((option) => (
                      <PlacementCard key={option.title} option={option} />
                    ))}
                  </div>
                ) : undefined
              }
            />
          ))}
        </section>

        {/* Core Flows */}
        <section id="core-flows" className="mt-16 scroll-mt-8">
          <Eyebrow>Core Flows</Eyebrow>
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            Three places Discify shows up in Spotify.
          </h2>

          <h3 className="mt-10 max-w-[960px] text-xl font-semibold leading-snug text-foreground">
            Album page
          </h3>
          <Prose>
            <p>
              A mini disc sits beside the play button. Hover and it spins, and a toast popup shows the
              percent and number of songs listened. Click the disc and a breakdown shows which tracks
              you've listened to and which you haven't.
            </p>
          </Prose>
          <MediaBoxVideo
            src="/videos/discify-core-album-page.mp4"
            caption="Mini disc interaction on album pages"
          />

          <h3 className="mt-10 max-w-[960px] text-xl font-semibold leading-snug text-foreground">Profile</h3>
          <Prose>
            <p>
              A new section on a user’s profile is created underneath the “Public Playlists” section,
              displaying a user’s most recent in progress and completed albums. The “X collected · X in
              progress” provides a preview of a user’s total discs, which can be found when expanding this
              section by clicking “Show all”. The “X collected” tag also appears beside a user’s following
              count, but is private to avoid disingenuity, as explained by design decision #4.
            </p>
          </Prose>
          <MediaBoxVideo
            src="/videos/discify-core-profile.mp4"
            caption="Discs collected section on a user’s profile"
          />

          <h3 className="mt-10 max-w-[960px] text-xl font-semibold leading-snug text-foreground">
            Show all
          </h3>
          <Prose>
            <p>A dedicated view with filter pills to switch between in-progress and complete discs.</p>
          </Prose>
          <MediaBoxVideo
            src="/videos/discify-core-show-all.mp4"
            caption="Toggling between filters"
          />
        </section>

        {/* Final Product */}
        <section id="final-product" className="mt-16 scroll-mt-8">
          <Eyebrow>Final Product</Eyebrow>
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            Shipped and in daily use.
          </h2>
          <Prose>
            <p>
              <span className="font-semibold text-foreground">Shipped:</span> per-track 90% completion
              thresholds, disc visualization, the album page discs with hover and click details, and the
              profile section with disc progress filtering.
            </p>
            <p>
              <span className="font-semibold text-foreground">Next:</span> a Spotify Wrapped-style yearly
              recap of stats like number of completed albums, number of new albums listened to, number of
              albums started, number of times the same album was fully listened to, etc.
            </p>
          </Prose>
          <MediaBoxVideo
            src="/videos/discify-showcase.mp4"
            caption="Final product, Discify in use"
          />
        </section>

        {/* Reflection */}
        <section id="reflection" className="mt-16 scroll-mt-8">
          <Eyebrow>Reflection</Eyebrow>
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            What I learned
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold leading-snug text-foreground">
                Designing within someone else's product means designing to “disappear”.
              </h3>
              <p className="mt-3 leading-relaxed text-foreground/70">
                The best aspect of Discify is that it looks like it belongs in Spotify, because the design
                decisions matched the existing product.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold leading-snug text-foreground">
                Knowing the product's purpose and understanding the platform avoids feature creep.
              </h3>
              <p className="mt-3 leading-relaxed text-foreground/70">
                Adding a social aspect to the discs would have boosted engagement, but contradicted the
                point of the product.
              </p>
            </div>
          </div>
        </section>

        <Link
          href="/"
          className="mt-16 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/55 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          back to projects
        </Link>
      </div>
    </div>
    </ViewTransition>
  );
}
