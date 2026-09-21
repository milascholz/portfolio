import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, type ContentBlock, type ProjectMeta } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project ? `${project.title} — Mila Scholz` : "Mila Scholz" };
}

function renderInline(text: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return tokens.map((token, i) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{token}</span>;
  });
}

function MetaBar({ meta }: { meta: ProjectMeta }) {
  const columns: { label: string; lines: string[] }[] = [
    { label: "Role", lines: meta.role },
    { label: "Team", lines: meta.team },
    { label: "Timeline", lines: [meta.timeline] },
    { label: "Skills", lines: meta.skills },
  ];

  return (
    <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 rounded-2xl border border-border px-6 py-6 sm:grid-cols-4">
      {columns.map((col, i) => (
        <div
          key={col.label}
          className={i > 0 ? "sm:border-l sm:border-border sm:pl-8" : ""}
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            {col.label}
          </p>
          <div className="mt-2 flex flex-col gap-1 text-sm text-foreground/90">
            {col.lines.map((line, j) => (
              <p key={j}>{line}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ImagePlaceholder({ caption }: { caption: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-white/[0.02] px-6 py-20 text-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-8 w-8 text-muted"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <p className="text-xs text-muted">{caption}</p>
    </div>
  );
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p className="text-base leading-relaxed text-foreground/90">
          {renderInline(block.text)}
        </p>
      );
    case "italic":
      return <p className="text-sm italic text-muted">{block.text}</p>;
    case "quote":
      return (
        <blockquote className="border-l-2 border-border pl-5 text-base italic leading-relaxed text-foreground/80">
          {renderInline(block.text)}
        </blockquote>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-3 pl-5">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="list-disc text-base leading-relaxed text-foreground/90 marker:text-muted"
            >
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    case "image":
      return <ImagePlaceholder caption={block.caption} />;
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <div className="px-6 py-14 md:px-16 md:py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {project.title}
        </h1>

        <MetaBar meta={project.meta} />

        <div className="mt-16 flex flex-col gap-24 pb-[60vh]">
          {project.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={`scroll-mt-10 ${section.content ? "" : "min-h-[40vh]"}`}
            >
              <h2 className="text-sm font-medium uppercase tracking-widest text-muted">
                {section.label}
              </h2>
              {section.content && (
                <div className="mt-5 flex flex-col gap-5">
                  {section.content.map((block, i) => (
                    <Block key={i} block={block} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
