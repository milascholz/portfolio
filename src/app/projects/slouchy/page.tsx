"use client";

import { Fragment, ViewTransition, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { BASE_PATH } from "@/lib/base-path";
import { useRegisterProjectNav } from "@/context/ProjectNavContext";
import { getSoftwareIcon } from "@/lib/software-icons";

const TAGS = ["Designathon", "2nd Place @ Cornell UX Designathon 2026"];

const ROLE_DETAILS = [
  { label: "Role", value: "Product Designer" },
  { label: "Team", value: "Solo" },
  { label: "Timeline", value: "April 2026" },
  { label: "Skills", value: "UX Research, Interaction Design, Visual Design, Prototyping (Figma)" },
];

const EXTERNAL_LINKS = [
  {
    label: "Try the Figma prototype",
    href: "https://www.figma.com/proto/hSILlXPvbpAhHCtTZDFxLn/slouchy?node-id=6-727&p=f&t=ItbbGPDawmsRJ5Rd-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=6%3A727",
    iconKey: "figma",
  },
  { label: "View on Devpost", href: "https://devpost.com/software/slouchy", iconKey: "devpost" },
];

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">{children}</p>;
}

function Prose({ children }: { children: ReactNode }) {
  return <div className="mt-4 max-w-[960px] space-y-4 leading-relaxed text-foreground/70">{children}</div>;
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[960px] border-l-2 border-black/25 pl-4">
      <p className="leading-relaxed text-foreground">{children}</p>
    </div>
  );
}

function Figure({
  src,
  alt,
  caption,
  maxWidth,
  objectFit = "cover",
  aspect,
}: {
  src: string;
  alt: string;
  caption: string;
  maxWidth?: number;
  objectFit?: "cover" | "contain";
  aspect?: string;
}) {
  return (
    <div className="well-inset mt-6 p-6" style={maxWidth ? { maxWidth } : undefined}>
      {aspect ? (
        <div
          className="w-full overflow-hidden rounded-lg border border-black/10 bg-white"
          style={{ aspectRatio: aspect }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${BASE_PATH}${src}`} alt={alt} className="h-full w-full object-contain" />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${BASE_PATH}${src}`}
          alt={alt}
          className={`w-full rounded-lg border border-black/10 ${objectFit === "contain" ? "object-contain bg-white" : ""}`}
        />
      )}
      <p className="mt-2 text-xs text-foreground/50">{caption}</p>
    </div>
  );
}

type ImagePairItem = { src: string; alt: string; caption: string };

function FigurePair({ items, aspect }: { items: [ImagePairItem, ImagePairItem]; aspect?: string }) {
  return (
    <div className="well-inset p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.src}>
            {aspect ? (
              <div
                className="w-full overflow-hidden rounded-lg border border-black/10 bg-white"
                style={{ aspectRatio: aspect }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${BASE_PATH}${item.src}`} alt={item.alt} className="h-full w-full object-contain" />
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`${BASE_PATH}${item.src}`} alt={item.alt} className="w-full rounded-lg border border-black/10" />
            )}
            <p className="mt-2 text-xs text-foreground/50">{item.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

type TableColumn = { key: string; label: string; width?: string };

function DataTable({
  columns,
  rows,
  highlightKey,
  highlightColor = "grey",
}: {
  columns: TableColumn[];
  rows: Record<string, ReactNode>[];
  highlightKey?: string;
  highlightColor?: "grey" | "green";
}) {
  return (
    <div className="well-inset mt-6 overflow-x-auto p-2">
      <table className="w-full min-w-[720px] table-fixed border-collapse text-sm">
        {columns.some((c) => c.width) ? (
          <colgroup>
            {columns.map((col) => (
              <col key={col.key} style={col.width ? { width: col.width } : undefined} />
            ))}
          </colgroup>
        ) : null}
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="border-b border-black/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-foreground"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isHighlight = highlightKey && row[highlightKey] === true;
            const highlightRowClass =
              highlightColor === "green"
                ? "bg-green-50"
                : "bg-black/[0.03]";
            return (
              <tr
                key={i}
                className={isHighlight ? highlightRowClass : i % 2 === 1 ? "bg-black/[0.012]" : undefined}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`border-b px-4 py-3 align-top leading-relaxed ${
                      isHighlight
                        ? highlightColor === "green"
                          ? "border-green-200 font-medium text-green-900"
                          : "border-black/5 font-medium text-foreground"
                        : "border-black/5 text-foreground/70"
                    }`}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
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
    title: "One yes/no question",
    decision: "Slouchy asks a single question with two buttons.",
    why: "My research showed that just being asked fixed posture instantly. Anything longer than a one-second answer becomes a task people dismiss.",
    rejected: "Automatic webcam posture detection, or a 1-to-5 posture rating.",
  },
  {
    title: "The menu bar, not an app",
    decision: "Slouchy lives in the macOS menu bar, with no account and no system notifications.",
    why: "Students already ignore a wall of notifications. A small icon shows your status at a glance and only opens when it's time to check in, so it's as non-intrusive as possible.",
    rejected: "A standalone app, push notifications.",
  },
  {
    title: "Every 45 minutes, work hours only",
    decision: "Nudges arrive on a fixed interval, only during active hours you set.",
    why: "Long enough to settle into work, short enough to catch posture before it slips for hours. Limiting nudges to work hours keeps Slouchy out of your evenings.",
  },
  {
    title: "A friend, not a doctor",
    decision: "A hand-drawn stick figure, casual language, and Comic Sans.",
    why: "Every wellness app talks to you like a doctor. Students don't need a lecture, like a parent telling you to sit up straight. They need a friend giving them a look from across the desk. I chose Comic Sans because people read it as unserious and playful, and the hand-drawn style reinforces that.",
  },
  {
    title: "Slouchy reacts to context",
    decision: "His expression changes with your streak, the time of day, and how long you've ignored him.",
    why: "The same reaction every time would turn into background noise within a day. A character who notices patterns feels like he's paying attention, so you pay attention back.",
  },
  {
    title: "A shop for the reward loop",
    decision: "Streak milestones unlock accessories for Slouchy: a hat, sunglasses, a coffee cup.",
    why: "Habits stick when there's a reward. Most habit tools get forgotten after a couple of days, and a small sense of progression gives people a reason to come back daily.",
  },
  {
    title: "Deliberately minimal settings",
    decision: "Only three settings: nudge interval, active hours, weekends on or off.",
    why: "Every extra setting is another reason to procrastinate instead of just sitting up straight.",
  },
];

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "research", label: "Research" },
  { id: "solution", label: "Solution" },
  { id: "design-process", label: "Design Process" },
  {
    id: "design-decisions",
    label: "Design Decisions",
    subsections: DECISIONS.map((decision, index) => ({
      id: `design-decision-${index}`,
      label: decision.title,
    })),
  },
  { id: "core-flows", label: "Core Flows" },
  { id: "outcome", label: "Outcome" },
  { id: "reflection", label: "Reflection" },
];

function DecisionCard({
  index,
  decision,
  media,
  mediaPosition = "bottom",
}: {
  index: number;
  decision: Decision;
  media?: ReactNode;
  mediaPosition?: "bottom" | "right";
}) {
  const textBlock = (
    <>
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
    </>
  );

  return (
    <div
      id={`design-decision-${index}`}
      className="panel-grey panel-flat mt-6 w-full scroll-mt-8 overflow-hidden rounded-[22px] border border-[#6e6e6e]"
    >
      <div
        className="btn-pill btn-pill-static finding-header flex items-center gap-3 px-5 py-3"
        style={{ borderRadius: "21px 21px 0 0" }}
      >
        <span className="text-sm font-semibold text-foreground/50">{String(index + 1).padStart(2, "0")}</span>
        <p className="text-sm font-semibold text-foreground">{decision.title}</p>
      </div>
      {media && mediaPosition === "right" ? (
        <div className="flex flex-col gap-5 px-5 py-5 lg:flex-row lg:items-stretch">
          <div className="divide-y divide-black/10 lg:w-[480px] lg:shrink-0">{textBlock}</div>
          <div className="lg:flex-1">{media}</div>
        </div>
      ) : (
        <div className="divide-y divide-black/10 px-5">
          {textBlock}
          {media ? <div className="py-5">{media}</div> : null}
        </div>
      )}
    </div>
  );
}

const DIRECTIONS_COLUMNS: TableColumn[] = [
  { key: "direction", label: "Direction", width: "20%" },
  { key: "asked", label: "What I asked for", width: "29%" },
  { key: "kept", label: "What I kept", width: "29%" },
  { key: "dropped", label: "What I dropped, and why", width: "22%" },
];

const DIRECTIONS_ROWS: Record<string, ReactNode>[] = [
  {
    direction: "1. Flat minimal",
    asked: "Purple and teal accents, a spine glyph, “Are you straight?”, Yes / Remind me in 5",
    kept: "Three tabs: Nudge, Log, Settings. The dot grid.",
    dropped: "“Remind me in 5.” People would hit it like an alarm's snooze. Fixing your posture takes one second, so a snooze only delays it and lets you off the hook.",
  },
  {
    direction: "2. Apple-native",
    asked: "SF Pro, system blue, solid green Yes and solid red No",
    kept: "Yes/No only, sentence case, segmented tabs",
    dropped: "Solid green and red buttons felt like an alarm going off",
  },
  {
    direction: "3. Calm utility",
    asked: "Things 3 and Fantastical as reference, muted indigo, lightly tinted buttons",
    kept: "Tinted buttons (“subtle, not alarming”), custom interval and time steppers",
    dropped: "The tone. Calm and neutral still felt clinical, and Slouchy shouldn't.",
  },
  {
    direction: "4. Dark theme",
    asked: "A dark nudge screen with a progress arc and streak badge, calm light utility screens",
    kept: "Streak badge, today's check-ins under the question",
    dropped: "The seriousness. Dramatic and polished, but not playful.",
  },
  {
    direction: "5. Garden",
    asked: "Flowers as check-ins, Duolingo-style warmth",
    kept: "The push toward playful",
    dropped: "The flowers. A flower can only grow, so it couldn't show when you slouched.",
  },
  {
    direction: "6. Glowing orbs",
    asked: "Direction 4 again, with orbs instead of flowers",
    kept: "Orbs as check-in dots",
    dropped: "Everything else, once I went hand-drawn.",
  },
];

const CORE_FLOWS: { title: string; text: string }[] = [
  {
    title: "Nudge",
    text: "Slouchy pops up, unimpressed, and asks if you're slouching. Say yes and he lets you know (\"aw man not again\"), which is usually enough to make you sit up. Say no and he gives you a thumbs up, and your weekly dot row fills.",
  },
  {
    title: "Log",
    text: "Your day streak, weekly score, and whether you're improving. The dot grid shows every check-in across the week, so you can see which days you nailed it and which afternoons you fell off.",
  },
  {
    title: "Shop",
    text: "Accessories you've unlocked, and the ones you're close to earning.",
  },
  {
    title: "Settings",
    text: "Nudge interval, active hours, and weekends. Nothing else.",
  },
];

const COMPETITIVE_COLUMNS: TableColumn[] = [
  { key: "app", label: "App" },
  { key: "catches", label: "How it catches slouching" },
  { key: "need", label: "What you need" },
  { key: "nudge", label: "The nudge" },
  { key: "tone", label: "Tone" },
  { key: "habit", label: "Habit tracking & rewards" },
];

const COMPETITIVE_ROWS: Record<string, ReactNode>[] = [
  {
    app: "Posture Pal",
    catches: "AirPods motion sensors track head tilt",
    need: "AirPods or Beats with spatial audio",
    nudge: "A cartoon giraffe, monkey or alpaca pops up, plus a sound",
    tone: "Playful",
    habit: "None on Mac, deliberately no graphs",
  },
  {
    app: "Posturr",
    catches: "Webcam pose detection",
    need: "Camera always on",
    nudge: "Screen blurs, and gets worse the more you slouch",
    tone: "Punishing",
    habit: "None",
  },
  {
    app: "MacPosture",
    catches: "Webcam scores your posture",
    need: "Camera always on",
    nudge: "Menu bar icon turns orange, plus notifications",
    tone: "Clinical",
    habit: "A live score, no history",
  },
  {
    app: "Gaze",
    catches: "Timed check-ins",
    need: "Nothing",
    nudge: "Dismissable reminder bundled with eyestrain breaks",
    tone: "Quiet, neutral",
    habit: "None",
  },
  {
    app: "Standro",
    catches: "Timed reminders (standing, not posture)",
    need: "Nothing",
    nudge: "macOS notification",
    tone: "Calm, neutral",
    habit: "CSV export of history",
  },
  {
    app: "Slouchy",
    catches: "Asks you every 45 min",
    need: "Nothing",
    nudge: "A character who reacts to your answer",
    tone: "Friend calling you out",
    habit: "Streaks, weekly dot grid, shop unlocks",
    highlight: true,
  },
];

export default function SlouchyPage() {
  useRegisterProjectNav("Slouchy", SECTIONS);

  return (
    <ViewTransition name="project-project-two">
    <div>
      <video
        className="aspect-[40/9] w-full rounded-t-[21px] object-cover"
        src={`${BASE_PATH}/videos/slouchy-showreel.mp4`}
        poster={`${BASE_PATH}/images/slouchy-poster.jpg`}
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

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground">Slouchy</h1>
        <p className="mt-3 max-w-[960px] leading-relaxed text-foreground/70">
          A grumpy stick figure who lives in your Mac menu bar and asks if you&apos;re slouching.
        </p>

        <div className="mt-4 flex flex-wrap gap-4">
          {EXTERNAL_LINKS.map((link) => {
            const icon = getSoftwareIcon(link.iconKey);
            return (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground/60 underline decoration-foreground/25 underline-offset-4 transition-colors hover:text-foreground"
              >
                {icon ? (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#6e6e6e]/30 bg-white">
                    {icon.kind === "component" ? (
                      <icon.Icon size={13} color={icon.color} />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`${BASE_PATH}${icon.src}`} alt="" className="h-4 w-4 rounded-sm" />
                    )}
                  </span>
                ) : null}
                {link.label}
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
              </a>
            );
          })}
        </div>

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
            A menu bar widget that catches you mid-slouch.
          </h2>
          <Prose>
            <p>
              Every 45 minutes, Slouchy pops up and asks one question: are you slouching? Tap yes or no, and
              that&apos;s it. A log tracks your habits over the week, and a streak-based shop unlocks accessories
              for Slouchy as you improve.
            </p>
            <p>
              The designathon prompt was to reimagine part of daily life. For most students, that&apos;s eight
              hours a day at a desk.
            </p>
          </Prose>
        </section>

        {/* Problem */}
        <section id="problem" className="mt-16 scroll-mt-8">
          <Eyebrow>Problem</Eyebrow>
          <div className="mt-2 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
                Students know their posture is bad. They just don&apos;t notice in the moment.
              </h2>
              <Prose>
                <p>
                  University students spend hours hunched over laptops writing essays, sitting through lectures
                  and grinding through assignments. Studies report that 30 to 80% of university students
                  experience low back pain. It&apos;s a small daily habit that gets ignored until it compounds
                  into a bigger problem.
                </p>
                <p>
                  It started with me. It was exam season and my posture was terrible. I knew it could be better,
                  but I only fixed it when someone pointed it out. Studying alone, nobody does.
                </p>
              </Prose>
              <div className="mt-6">
                <Callout>
                  <span className="font-semibold">Goal:</span> catch people in the moment they&apos;re slouching,
                  without nagging them.
                </Callout>
              </div>
            </div>
            <div className="relative hidden w-24 lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE_PATH}/images/slouchy/character-neutral.png`}
                alt="Slouchy drawn with a blank, neutral expression, arms crossed"
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
          </div>
        </section>

        {/* Research */}
        <section id="research" className="mt-16 scroll-mt-8">
          <Eyebrow>Research</Eyebrow>
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            The problem was never awareness. It was the moment.
          </h2>
          <Prose>
            <p>
              Before designing anything, I walked around my university library and asked ten students the same
              question: how&apos;s your posture right now?
            </p>
            <p>
              Every one of them immediately sat up straighter, so they all knew what good posture was. Thirty
              seconds later, most were hunched over again.
            </p>
          </Prose>
          <Prose>
            <p className="font-medium text-foreground">What I took away:</p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                <span className="font-semibold text-foreground">Awareness isn&apos;t the gap.</span> Nobody
                needed to be taught what good posture is.
              </li>
              <li>
                <span className="font-semibold text-foreground">A prompt works, but only right then.</span> A
                question fixed posture instantly. The fix just didn&apos;t last without another reminder.
              </li>
              <li>
                <span className="font-semibold text-foreground">Tone matters.</span> Being told to sit up
                straight by a parent feels like a lecture. Getting called out by a friend is what actually gets
                people to change.
              </li>
            </ol>
          </Prose>

          <h3 className="mt-10 max-w-[960px] text-xl font-semibold leading-snug text-foreground">
            Competitive analysis
          </h3>
          <Prose>
            <p>Existing posture apps either watch you or stay quiet. None build the habit.</p>
          </Prose>
          <DataTable
            columns={COMPETITIVE_COLUMNS}
            rows={COMPETITIVE_ROWS}
            highlightKey="highlight"
            highlightColor="green"
          />
          <Prose>
            <p className="font-medium text-foreground">What this told me:</p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                <span className="font-semibold text-foreground">Detection apps cost hardware and trust.</span>{" "}
                They need AirPods in or a camera on all day, and still only see your head. Asking costs nothing,
                and answering makes you check your own posture, which is the moment my research said was
                missing.
              </li>
              <li>
                <span className="font-semibold text-foreground">Reminder apps are easy to tune out.</span> Gaze
                and Standro are calm and neutral, which also makes them easy to ignore.
              </li>
              <li>
                <span className="font-semibold text-foreground">Posture Pal proved a character works.</span>{" "}
                Nobody wants to disappoint a cartoon giraffe. But it reacts the same way every time and has no
                habit loop on Mac. Slouchy reacts to your history and rewards your streaks.
              </li>
            </ol>
          </Prose>
        </section>

        {/* Solution */}
        <section id="solution" className="mt-16 scroll-mt-8">
          <Eyebrow>Solution</Eyebrow>
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            One question, two buttons, one second.
          </h2>
          <Prose>
            <ul className="list-disc space-y-2 pl-5">
              <li>Slouchy lives in the Mac menu bar: no app to open, no account, no notifications</li>
              <li>Every 45 minutes during your work hours, he pops up and asks if you&apos;re slouching</li>
              <li>He reacts to your answer, your streak, the time of day, and how long you&apos;ve been ignoring him</li>
              <li>A log shows your streak, weekly score, and every check-in on a dot grid</li>
              <li>Streak milestones unlock accessories for Slouchy in the shop</li>
            </ul>
          </Prose>
          <div className="well-inset mt-6 p-6">
            <video
              className="w-full rounded-lg border border-black/10"
              src={`${BASE_PATH}/videos/slouchy/solution-yes-no-clicks.mp4`}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
            <p className="mt-2 text-xs text-foreground/50">
              The nudge widget, live in the Mac menu bar, clicking between yes and no
            </p>
          </div>
        </section>

        {/* Design Process */}
        <section id="design-process" className="mt-16 scroll-mt-8">
          <Eyebrow>Design Process</Eyebrow>
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            From one core question to a full habit loop.
          </h2>
          <Prose>
            <p>
              The research gave me the core interaction straight away: a single question at the right moment.
              Everything else had to earn its place around that.
            </p>
          </Prose>

          <h3 className="mt-10 max-w-[960px] text-xl font-semibold leading-snug text-foreground">
            1. Exploring directions in Figma Make
          </h3>
          <Prose>
            <p>
              Instead of sketching on paper, I started in Figma Make. I kept the structure fixed (one question, a
              log, minimal settings) and used prompts to push the look in very different directions, fast.
            </p>
          </Prose>
          <DataTable columns={DIRECTIONS_COLUMNS} rows={DIRECTIONS_ROWS} />

          <Prose>
            <p>
              The garden direction (5) was my first push toward playful: every check-in a flower, every day a
              stem whose bloom showed that day&apos;s score. But a flower can only grow. It showed progress,
              never a miss. A row of dots shows every check-in, including the ones where you were slouching, and
              seeing those misses is what pushes you to sit up next time.
            </p>
          </Prose>

          <div className="well-inset mt-6 p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE_PATH}/images/slouchy/direction-log-evolution.png`}
              alt="Four-step progression from the dark theme nudge to the garden's flower check-ins, then the log refined into rounded cards with centered tabs, and finally lowercase labels with a thumbs-up Slouchy"
              className="w-full rounded-lg"
            />
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
              <p className="text-xs text-foreground/50">Direction 4: the dark theme nudge</p>
              <p className="text-xs text-foreground/50">Direction 5, garden: every check-in as a flower</p>
              <p className="text-xs text-foreground/50">Direction 6: rounded cards and centered tabs</p>
              <p className="text-xs text-foreground/50">
                Direction 6: lowercase tabs and a thumbs-up Slouchy
              </p>
            </div>
          </div>
          <Prose>
            <p>
              Direction 4&apos;s dark theme nudge introduced a progress ring and streak badge, which direction
              5 traded for a row of flowers. Direction 6 kept refining the log from there: rounded cards,
              centered tabs, then lowercase labels with a thumbs-up Slouchy. Every pass looked more polished,
              but none of it had a personality yet. A system notification exploration got dropped outright,
              too: notifications are exactly what students tune out, and removing the character made it feel
              even more clinical.
            </p>
          </Prose>
          <div className="well-inset mt-6 p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE_PATH}/images/slouchy/progress.png`}
              alt="Progress across the Figma Make explorations: two dark-themed 'Straighten' directions with a flower icon and a circle icon, evolving into the final hand-drawn 'slouchy' nudge widget with tabs, dot row and shop cart"
              className="w-full rounded-lg"
            />
            <p className="mt-2 text-xs text-foreground/50">
              Progress from the early dark-themed directions to the final hand-drawn nudge widget
            </p>
          </div>

          <Prose>
            <p>
              <span className="font-semibold text-foreground">What six directions taught me:</span> each one
              looked good, and none had a personality. Polished and neutral is what every competitor already
              looks like. My research said people change for friends, not lectures.
            </p>
          </Prose>

          <h3 className="mt-10 max-w-[960px] text-xl font-semibold leading-snug text-foreground">
            Final direction: hand-drawn
          </h3>
          <Prose>
            <p>
              I rebuilt the nudge around the character. I drew Slouchy myself, and he&apos;s now the biggest thing
              on screen, arms crossed, unimpressed. &quot;Are you straight?&quot; became &quot;you slouching?&quot;:
              shorter, lowercase, and how a friend would actually say it. The buttons went from solid green and
              red, to tints, to plain outlines, so neither answer looks like the &quot;right&quot; one to tap. I
              kept today&apos;s dots and added the next-nudge timer and a cart for the shop.
            </p>
          </Prose>
          <Prose>
            <p>
              The log got the same treatment: same structure, new voice. Comic Sans, lowercase, flat dots instead
              of glossy ones, &quot;day streak!&quot;, and Slouchy giving a thumbs up. I cut the week tabs, trend
              chart and insight callout to keep the focus on this week.
            </p>
          </Prose>
          <div className="mt-6">
          <FigurePair
            items={[
              {
                src: "/images/slouchy/final-nudge.png",
                alt: "Final hand-drawn nudge screen live in the macOS menu bar: an unimpressed stick figure asking 'you slouching?' with yes/no outline buttons, a weekly dot row, next-nudge timer, and shop cart",
                caption: "Final nudge screen, live in the menu bar",
              },
              {
                src: "/images/slouchy/final-log.png",
                alt: "Final hand-drawn log screen live in the macOS menu bar, in Comic Sans, showing a day streak, this week and last week stats, a dot grid for Monday through Sunday, and a thumbs-up stick figure",
                caption: "Final log screen, live in the menu bar",
              },
            ]}
          />
          </div>

          <h3 className="mt-10 max-w-[960px] text-xl font-semibold leading-snug text-foreground">
            Branding
          </h3>
          <Prose>
            <p>
              The menu bar icon had a different job than the character: read at 16px beside wifi and battery.
              So no arms or legs, just a single stroke and a head. It stays straight when you&apos;re on track
              and curves into an amber S when you&apos;re overdue, so you can see your status without opening
              anything.
            </p>
            <p>
              I also dropped the name Straighten. It sounded like an instruction, the exact tone my research
              said to avoid. The app is now named after its character, and the app icon is Slouchy himself.
            </p>
          </Prose>

          <h3 className="mt-10 max-w-[960px] text-xl font-semibold leading-snug text-foreground">
            2. Building Slouchy&apos;s character
          </h3>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start">
            <p className="max-w-[320px] shrink-0 leading-relaxed text-foreground/70">
              Once the voice was set, Slouchy needed a small range of expressions to react to your answer:
              neutral by default, unimpressed when you admit to slouching, happy and thumbs-up when you
              don&apos;t.
            </p>
            <div className="well-inset min-w-0 flex-1 p-6">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {[
                  {
                    src: "character-neutral.png",
                    alt: "Slouchy drawn with a blank, neutral expression, arms crossed",
                    caption: "Neutral: the default, waiting for an answer",
                  },
                  {
                    src: "character-unimpressed.png",
                    alt: "Slouchy drawn with furrowed eyebrows, looking unimpressed",
                    caption: "Unimpressed: reacting to an honest “yes”",
                  },
                  {
                    src: "character-happy.png",
                    alt: "Slouchy drawn smiling with a thumbs up",
                    caption: "Happy: the reward for good posture",
                  },
                  {
                    src: "character-concept-alt.png",
                    alt: "An alternate stick-figure pose for Slouchy, waving with one leg raised",
                    caption: "An early concept pose, not used in the app",
                  },
                ].map((item) => (
                  <div key={item.src}>
                    <div className="flex h-32 items-center justify-center rounded-lg border border-black/10 bg-white px-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${BASE_PATH}/images/slouchy/${item.src}`}
                        alt={item.alt}
                        className="max-h-full w-auto max-w-full object-contain"
                      />
                    </div>
                    <p className="mt-2 text-xs text-foreground/50">{item.caption}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h3 className="mt-10 max-w-[960px] text-xl font-semibold leading-snug text-foreground">
            3. Final prototype
          </h3>
          <div className="well-inset mt-6 flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <p className="max-w-[760px] leading-relaxed text-foreground/70">
                The final Figma prototype covers the nudge, both responses, the log, the shop and settings.
              </p>
            </div>
            <a
              href={EXTERNAL_LINKS[0].href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill btn-pill-blue inline-flex shrink-0 items-center gap-1.5 px-4 py-2 text-sm font-semibold"
            >
              Try the Figma prototype
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </a>
          </div>
        </section>

        {/* Design Decisions */}
        <section id="design-decisions" className="mt-16 scroll-mt-8">
          <Eyebrow>Design Decisions</Eyebrow>
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            The decisions behind how Slouchy asks, looks and rewards.
          </h2>
          {DECISIONS.map((decision, index) => (
            <DecisionCard
              key={decision.title}
              index={index}
              decision={decision}
              mediaPosition={index === 0 || index === 2 ? "right" : "bottom"}
              media={
                index === 0 ? (
                  <div className="well-inset flex flex-col p-4 lg:h-full">
                    <div className="flex min-h-[160px] items-center justify-center lg:min-h-0 lg:flex-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${BASE_PATH}/images/slouchy/concept-yesno-sketch.png`}
                        alt="Hand-drawn sketch of Slouchy asking 'you slouching?' in a speech bubble, with plain outline yes and no buttons below"
                        className="max-h-full max-w-full rounded-lg border border-black/10 bg-white object-contain lg:h-full lg:w-full"
                      />
                    </div>
                    <p className="mt-2 text-xs text-foreground/50">
                      Early sketch of the one-question concept: a speech bubble and two buttons
                    </p>
                  </div>
                ) : index === 1 ? (
                  <div className="well-inset flex flex-col gap-5 p-4 sm:flex-row sm:items-center">
                    <div className="mx-auto w-full max-w-[220px] sm:mx-0 sm:w-56 sm:shrink-0">
                      <div className="flex items-center justify-center rounded-lg border border-black/10 bg-[#e8e8e8] p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`${BASE_PATH}/images/slouchy/icon-states-large.png`}
                          alt="Menu bar icon states at large scale: a straight idle pin and an amber overdue pin that curves like a slouch"
                          className="w-full rounded-md object-contain"
                        />
                      </div>
                      <p className="mt-2 text-xs text-foreground/50">
                        Icon states: idle (straight) vs. overdue (curved, amber)
                      </p>
                    </div>
                    <div className="w-full sm:flex-1">
                      <div className="flex items-center justify-center rounded-lg border border-black/10 bg-[#e8e8e8] p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`${BASE_PATH}/images/slouchy/menu.png`}
                          alt="The idle pin icon sitting in the real macOS menu bar, beside battery, search and wifi"
                          className="w-full rounded-md object-contain"
                        />
                      </div>
                      <p className="mt-2 text-xs text-foreground/50">
                        The icon, live in the menu bar beside the battery icon
                      </p>
                    </div>
                  </div>
                ) : index === 2 ? (
                  <Figure
                    src="/images/slouchy/nudge-interval.png"
                    alt="Settings screen snippet showing the nudge interval control: 30m, 60m, 45m (selected), and custom"
                    caption="Choosing the nudge interval in settings"
                  />
                ) : index === 3 ? (
                  <div className="well-inset p-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${BASE_PATH}/images/slouchy/character-all.png`}
                      alt="Slouchy's four expressions side by side (an early concept pose, neutral, unimpressed, and happy), next to hand-drawn sketches of the shop accessories: an apple, a top hat, sunglasses, and a coffee mug"
                      className="w-full rounded-lg"
                    />
                    <p className="mt-2 text-xs text-foreground/50">
                      Slouchy&apos;s expressions, and early sketches of the shop accessories
                    </p>
                  </div>
                ) : index === 4 ? (
                  <div className="well-inset p-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {[
                        {
                          src: "nudge-slouching-desktop.png",
                          alt: "Slouchy reacting 'aw man not again' after a yes answer, with a weekly dot row at 75%, live in the macOS menu bar",
                          caption: "Reacting to an honest “yes”",
                        },
                        {
                          src: "nudge-goodwork-desktop.png",
                          alt: "Slouchy reacting 'good work!' after a no answer, with a weekly dot row at 79%, live in the macOS menu bar",
                          caption: "Reacting to a “no”",
                        },
                      ].map((item) => (
                        <div key={item.src}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`${BASE_PATH}/images/slouchy/${item.src}`}
                            alt={item.alt}
                            className="h-64 w-full rounded-lg border border-black/10 object-cover"
                          />
                          <p className="mt-2 text-xs text-foreground/50">{item.caption}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : index === 5 ? (
                  <div className="well-inset p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${BASE_PATH}/images/slouchy/shop-desktop.png`}
                      alt="Shop screen showing streak points, an equipped new hat, sunglasses, a coffee cup, and an unlocked apple accessory, live in the macOS menu bar"
                      className="w-full rounded-lg border border-black/10"
                    />
                    <p className="mt-2 text-xs text-foreground/50">
                      The shop: accessories unlocked by keeping your streak
                    </p>
                  </div>
                ) : index === 6 ? (
                  <div className="well-inset p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${BASE_PATH}/images/slouchy/settings-desktop.png`}
                      alt="Settings screen with nudge interval (30m, 45m, 60m, custom), active hours, and a weekends toggle, live in the macOS menu bar"
                      className="w-full rounded-lg border border-black/10"
                    />
                    <p className="mt-2 text-xs text-foreground/50">The only three settings Slouchy has</p>
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
            Four screens, one habit.
          </h2>

          <div className="well-inset mt-6 p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              {CORE_FLOWS.map((flow, i) => (
                <Fragment key={flow.title}>
                  <div className="lg:flex-1">
                    <p className="text-sm font-semibold text-foreground">{flow.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/70">{flow.text}</p>
                  </div>
                  {i < CORE_FLOWS.length - 1 ? (
                    <div className="flex shrink-0 items-center justify-center py-1 text-foreground/25 lg:py-0">
                      <ArrowRight className="h-5 w-5 rotate-90 lg:rotate-0" strokeWidth={2} />
                    </div>
                  ) : null}
                </Fragment>
              ))}
            </div>
            <div className="mt-6 overflow-hidden rounded-lg border border-black/10 bg-white">
              <video
                className="w-full"
                src={`${BASE_PATH}/videos/slouchy-showreel.mp4`}
                poster={`${BASE_PATH}/images/slouchy-poster.jpg`}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
            </div>
          </div>
        </section>

        {/* Outcome */}
        <section id="outcome" className="mt-16 scroll-mt-8">
          <Eyebrow>Outcome</Eyebrow>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
            <div className="flex w-full flex-col">
              <p className="text-2xl font-semibold leading-snug text-foreground sm:text-3xl">
                2nd Place, Cornell UX Designathon
              </p>
              <Prose>
                <p>
                  <span className="font-semibold text-foreground">Next:</span> build it as a real macOS menu bar
                  app, and test it with the students from the library for a week to see if the shop keeps
                  answers honest once the novelty wears off.
                </p>
              </Prose>
              <div className="well-inset mt-4 flex-1 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${BASE_PATH}/images/slouchy/devpost-card.png`}
                  alt="Slouchy's Devpost submission card with a gold 'Winner' ribbon and the nudge screen asking 'you slouching?'"
                  className="w-full rounded-lg border border-black/10"
                />
                <p className="mt-2 text-xs text-foreground/50">
                  Slouchy&apos;s Devpost submission, marked a winner for 2nd place
                </p>
              </div>
            </div>
            <div className="well-inset overflow-hidden px-4 pt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE_PATH}/images/slouchy/judge-shoutout-highlighted.png`}
                alt="LinkedIn post from judge Bhroovi Gupta recapping the CU Design-a-thon 2026, with 'Slouchy - Mila Scholz' highlighted among her top picks"
                className="mx-auto w-full max-w-[560px] rounded-t-xl border border-b-0 border-black/10 shadow-sm"
              />
              <p className="mt-2 text-xs text-foreground/50">
                Bhroovi Gupta&apos;s judge recap, with Slouchy highlighted among her top picks
              </p>
            </div>
          </div>
        </section>

        {/* Reflection */}
        <section id="reflection" className="mt-16 scroll-mt-8">
          <Eyebrow>Reflection</Eyebrow>
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            What I learned
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold leading-snug text-foreground">Tone is a design decision.</h3>
              <p className="mt-3 leading-relaxed text-foreground/70">
                Slouchy&apos;s function is simple: a timer and a yes/no question. What makes people answer
                instead of dismissing it is the character. The research pointed straight there: friends get
                people to sit up, lectures don&apos;t.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold leading-snug text-foreground">
                Self-reported data needs to be tested.
              </h3>
              <p className="mt-3 leading-relaxed text-foreground/70">
                Slouchy relies on people answering honestly. With more time, I&apos;d run a week-long test with
                real students to see if they keep answering truthfully once the novelty wears off, and if the
                shop actually changes that.
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
