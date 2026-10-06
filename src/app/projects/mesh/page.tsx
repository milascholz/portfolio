"use client";

import { ViewTransition, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BASE_PATH } from "@/lib/base-path";
import { useRegisterProjectNav } from "@/context/ProjectNavContext";

const TAGS = ["Independent Review", "2026"];

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "approach", label: "Approach" },
  { id: "key-findings", label: "Key Findings" },
  { id: "framing-feedback", label: "Framing Feedback" },
  { id: "deliverable", label: "The Deliverable" },
  { id: "outcome", label: "Outcome" },
  { id: "reflection", label: "Reflection" },
];

const ROLE_DETAILS = [
  { label: "Role", value: "Independent Reviewer" },
  { label: "Team", value: "Solo" },
  { label: "Timeline", value: "July 2026" },
  { label: "Skills", value: "Heuristic Review" },
];

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">{children}</p>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return <div className="mt-4 max-w-[960px] space-y-4 leading-relaxed text-foreground/70">{children}</div>;
}

function MediaFigure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <div className="well-inset p-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${BASE_PATH}${src}`} alt={alt} className="w-full rounded-lg border border-black/10" />
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

type Finding = {
  title: string;
  body: ReactNode;
  fix: string;
  visual?: string;
  image?: string;
  imageAlt?: string;
};

const FINDINGS: Finding[] = [
  {
    title: "False affordances",
    body: "The “Submit” button on the home page and the “Export” button on the product page have shadows, hover states, and click animations, but neither does anything. Because of these visual cues, I tried to click both. The other graphics on the page are static, so these two set an expectation the rest of the site doesn't meet.",
    fix: "Remove the interactive states from the demo UI, or make it actually work with an embedded demo of the product.",
  },
  {
    title: "Hidden interactions on mobile",
    body: (
      <>
        I first visited the site on my phone and couldn&apos;t tell the product tables could be scrolled
        sideways. The tables were also cut off at the bottom of their cards. This matters most on the
        home page, where those tables <em>are</em> the product demo, which was something I only realized
        when I visited the homepage again on desktop.
      </>
    ),
    fix: "Add a scrollbar or other visual cue for the mobile version, and adjust card spacing.",
    visual: "Mobile product table cut off, no scroll cue",
    image: "/images/mesh/mesh-hidden-interactions.png",
    imageAlt: "Three annotated mobile screenshots showing tables cut off at the bottom of cards, with no visual cue that they scroll sideways",
  },
  {
    title: "Content that's hard to scan",
    body: "Every “Mesh vs X” blog post uses the same blue gradient banner, so you can't tell the posts apart at a glance. On the unfiltered blog page, the same posts appear twice: once under “All” and again under “How Mesh Compares.” That distinction matters — these are the posts meant to convince someone to choose Mesh over the alternative, so they need to be instantly recognizable, not identical banners with different words.",
    fix: "Give each blog post a unique banner, for example the competitor's actual logo (I mocked one up). Hide the “How Mesh Compares” section on the unfiltered view but keep it on the filtered ones, where it still does its marketing job, to remove the duplicates.",
  },
  {
    title: "Inconsistency and polish",
    body: "The blog's table of contents highlights where you are in the post, but the privacy policy's doesn't. The sticky filter bar on the blog is see-through on desktop. The mobile header jumps on first scroll. And some mobile components wrap unevenly: squished integration cards, stat labels, a two-line “Save & continue” button.",
    fix: "Reuse the blog's table of contents everywhere, make the filter bar opaque, and tighten mobile copy and layout.",
    visual: "Mobile polish issues: transparent filter bar, header jump, squished cards",
    image: "/images/mesh/mesh-mobile-polish.png",
    imageAlt: "Three annotated screenshots showing the see-through filter bar, the mobile header jumping on first scroll, and a squished integration card",
  },
];

function FindingCard({
  index,
  finding,
  media,
}: {
  index: number;
  finding: Finding;
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
        <p className="text-sm font-semibold text-foreground">{finding.title}</p>
      </div>
      <div className="divide-y divide-black/10 px-5">
        <div className="py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">Finding</p>
          <p className="mt-1.5 leading-relaxed text-foreground/70">{finding.body}</p>
        </div>
        <div className="py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">Fix</p>
          <p className="mt-1.5 text-base font-medium leading-relaxed text-foreground">{finding.fix}</p>
        </div>
        {media ? <div className="py-5">{media}</div> : null}
      </div>
    </div>
  );
}

type ApproachStep = { label: string; funFact?: string };

const APPROACH_STEPS: ApproachStep[] = [
  {
    label: "Walked every page (yes, even the privacy policies!) on desktop, then again on an iPhone",
    funFact:
      "My friends are always making fun of me for actually reading the privacy policy or terms and conditions when signing waivers, but it means you know I'll actually be thorough with my review!",
  },
  { label: "Screenshotted and annotated each issue at the moment I hit it" },
  { label: "For each issue, named the problem, why it mattered, and a specific fix" },
  { label: "Called out what was working, so the team knew what to keep" },
];

type PdfPoint = { src: string; alt: string };

const PDF_POINTS: PdfPoint[] = [
  {
    src: "/images/mesh/mesh-pdf-point-01.png",
    alt: "PDF review page 1: praise for the home page hero",
  },
  {
    src: "/images/mesh/mesh-pdf-point-02.png",
    alt: "PDF review page 2: spacing issue around the Ready for Review status pill",
  },
  {
    src: "/images/mesh/mesh-pdf-point-03.png",
    alt: "PDF review page 3: the Submit button looks clickable but isn't",
  },
  {
    src: "/images/mesh/mesh-pdf-point-04.png",
    alt: "PDF review page 4: the Export button has the same false affordance",
  },
  {
    src: "/images/mesh/mesh-pdf-point-05.png",
    alt: "PDF review page 5: the sticky filter bar is see-through on scroll",
  },
  {
    src: "/images/mesh/mesh-pdf-point-06.png",
    alt: "PDF review page 6: Mesh vs X posts share the same generic banner",
  },
  {
    src: "/images/mesh/mesh-pdf-point-07.png",
    alt: "PDF review page 7: Mesh vs X posts appear twice on the unfiltered view",
  },
  {
    src: "/images/mesh/mesh-pdf-point-08.png",
    alt: "PDF review page 8: only the blog table of contents highlights your place",
  },
  {
    src: "/images/mesh/mesh-pdf-point-09.png",
    alt: "PDF review page 9: the mobile header jumps inward on first scroll",
  },
  {
    src: "/images/mesh/mesh-pdf-point-10.png",
    alt: "PDF review page 10: mobile tables are cut off with no scroll cue",
  },
  {
    src: "/images/mesh/mesh-pdf-point-11.png",
    alt: "PDF review page 11: wide buttons squish the NetSuite and Slack cards",
  },
  {
    src: "/images/mesh/mesh-pdf-point-12.png",
    alt: "PDF review page 12: uneven stat formatting and mismatched button heights",
  },
];

type FramingPoint = {
  title: string;
  body: string;
};

const FRAMING_POINTS: FramingPoint[] = [
  {
    title: "Led with what worked.",
    body: "The first point is praise for the hero: the changing blue text, the animated product preview, and the cursor revealing the grid. Specific praise shows you actually used the product. It also tells the team what not to break.",
  },
  {
    title: "Showed every issue.",
    body: "Each comment has an annotated screenshot, and suggested redesigns, like for the blog post banners, included mockups. This makes it efficient for a founder to investigate any claim I made or proposed solution.",
  },
  {
    title: "Understood the intent before critiquing.",
    body: "I didn't just call the duplicate blog section redundant. I recognized that the “How Mesh Compares” blog section is there to market the product even on filtered pages, and adapted my proposed solution to serve that purpose and business strategy.",
  },
];

export default function MeshPage() {
  useRegisterProjectNav("Mesh UI/UX Website Review", SECTIONS);

  return (
    <ViewTransition name="project-project-four">
    <div>
      <video
        className="aspect-[40/9] w-full rounded-t-[21px] object-cover"
        src={`${BASE_PATH}/videos/mesh.mp4`}
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

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground">
          Mesh UI/UX Website Review
        </h1>
        <p className="mt-3 max-w-[960px] leading-relaxed text-foreground/70">
          A UI/UX review of Mesh&apos;s (YC W25) new website, submitted for an open LinkedIn feedback
          call.
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
            Turning an open call for feedback into a full independent UX audit.
          </h2>
          <Prose>
            <p>
              Mesh (YC W25) automates month-end accruals for finance teams. When co-founder and CEO Erin
              Kim posted on LinkedIn asking for feedback on their new website, I took it as a chance to
              run a proper heuristic review: walk the entire site as a first-time visitor, catalog every
              point of friction, and hand back a 12-point annotated PDF of feedback she could act on
              immediately. This case study walks through how I got there.
            </p>
          </Prose>
          <div className="well-inset mt-6 overflow-hidden px-8 pt-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE_PATH}/images/mesh-linkedin-call.png`}
              alt="Erin Kim's LinkedIn post announcing Mesh's new website and asking for feedback"
              className="mx-auto w-full max-w-[560px] rounded-t-xl border border-b-0 border-black/10 shadow-sm"
            />
          </div>
        </section>

        {/* Problem */}
        <section id="problem" className="mt-16 scroll-mt-8">
          <Eyebrow>Problem</Eyebrow>
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            Unsolicited feedback is easy to ignore.
          </h2>
          <Prose>
            <p>
              Founders get flooded with vague, unprioritized critique. If I wanted mine to actually get
              read, let alone acted on, it had to be specific, visual, and explain the logic behind the
              feedback, not just a list of nitpicks.
            </p>
          </Prose>
        </section>

        {/* Approach */}
        <section id="approach" className="mt-16 scroll-mt-8">
          <Eyebrow>Approach</Eyebrow>
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            I went through the site as a first-time visitor on both desktop and mobile.
          </h2>
          <Prose>
            <p>
              I noted every spot where I hesitated, content was unclear, or had to work out what to do
              next.
            </p>
            <ol className="list-decimal space-y-2 pl-5">
              {APPROACH_STEPS.map((step) => (
                <li key={step.label}>
                  {step.label}
                  {step.funFact ? (
                    <p className="mt-1 italic text-foreground/55">{step.funFact}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          </Prose>
          <div className="well-inset mt-6 w-full p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {PDF_POINTS.map((point) => (
                <div
                  key={point.src}
                  className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-black/10 bg-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${BASE_PATH}${point.src}`} alt={point.alt} className="h-full w-full object-contain" />
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-foreground/50">All 12 points from the full annotated PDF review, in order</p>
          </div>
        </section>

        {/* Key Findings */}
        <section id="key-findings" className="mt-16 scroll-mt-8">
          <Eyebrow>Key Findings</Eyebrow>
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            My 12 recommendations fit into four themes.
          </h2>
          {FINDINGS.map((finding, index) => (
            <FindingCard
              key={finding.title}
              index={index}
              finding={finding}
              media={
                index === 0 ? (
                  <FigurePair
                    aspect="3/2"
                    items={[
                      {
                        src: "/images/mesh/mesh-false-1.png",
                        alt: "Annotated screenshot of Mesh's home page circling the non-functional ‘Submit’ button on the invoice upload card",
                        caption: "The home page's “Submit” button: shadow, hover state, click animation, but non-functional",
                      },
                      {
                        src: "/images/mesh/mesh-false-2.png",
                        alt: "Annotated screenshot of Mesh's product page circling the non-functional ‘Export’ button above the outputs table",
                        caption: "The product page's “Export” button: same interactive styling, same lack of function",
                      },
                    ]}
                  />
                ) : index === 2 ? (
                  <div className="well-inset space-y-6 p-6">
                    <div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${BASE_PATH}/images/mesh/mesh-banner-mockup-grid.png`}
                        alt="Grid of blog posts all sharing the same blue gradient banner"
                        className="w-full rounded-lg border border-black/10"
                      />
                      <p className="mt-2 text-xs text-foreground/50">
                        Every blog post uses the same blue gradient banner, so they all look the same at a glance
                      </p>
                    </div>
                    <div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${BASE_PATH}/images/mesh/mesh-banner-mockup-redesign.png`}
                        alt="Mockup changing one banner to the competitor's actual logo"
                        className="w-full rounded-lg border border-black/10"
                      />
                    </div>
                  </div>
                ) : finding.image ? (
                  <MediaFigure src={finding.image} alt={finding.imageAlt ?? ""} caption={finding.visual ?? ""} />
                ) : undefined
              }
            />
          ))}
        </section>

        {/* Framing Feedback */}
        <section id="framing-feedback" className="mt-16 scroll-mt-8">
          <Eyebrow>The Deliverable</Eyebrow>
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            Framing Feedback
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {FRAMING_POINTS.map((point) => (
              <div key={point.title}>
                <h3 className="text-xl font-semibold leading-snug text-foreground">{point.title}</h3>
                <p className="mt-3 leading-relaxed text-foreground/70">{point.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Deliverable */}
        <section id="deliverable" className="mt-16 scroll-mt-8">
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            Final Deliverable
          </h2>

          <div className="well-inset mt-6 w-full p-6">
            <p className="text-xs text-foreground/50">Full annotated review (PDF)</p>
            <iframe
              src={`${BASE_PATH}/files/mesh-website-feedback.pdf#page=2&toolbar=0&navpanes=0`}
              title="Mesh website feedback — full annotated PDF review"
              className="mt-2 aspect-[4/3] w-full rounded-lg border border-black/10"
            />
          </div>
        </section>

        {/* Outcome */}
        <section id="outcome" className="mt-16 scroll-mt-8">
          <Eyebrow>Outcome</Eyebrow>
          <div className="panel-grey mt-6 w-full rounded-[22px] border border-black px-6 py-10 sm:px-12 sm:py-14">
            <p className="max-w-[820px] text-2xl font-semibold leading-snug text-foreground sm:text-3xl">
              “This is the best feedback I&apos;ve received in a long time.”
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-foreground/50">
              Erin Kim, Co-founder &amp; CEO, Mesh
            </p>
          </div>
          <Prose>
            <p>The feedback was well received, and Erin appreciated the depth of the review.</p>
          </Prose>
        </section>

        {/* Reflection */}
        <section id="reflection" className="mt-16 scroll-mt-8">
          <Eyebrow>Reflection</Eyebrow>
          <h2 className="mt-2 max-w-[960px] text-3xl font-semibold leading-tight text-foreground">
            What I learned.
          </h2>
          <Prose>
            <p>
              If I were to do this again, I&apos;d order the feedback by severity rather than the order I
              walked through the site in. The false affordances and mobile scrolling
              affect whether someone understands the product, while the button heights are just polish. A
              founder reading the feedback top to bottom should encounter the biggest problems first.
            </p>
          </Prose>
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
