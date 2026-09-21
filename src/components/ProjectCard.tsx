import Link from "next/link";
import type { Project } from "@/data/projects";

export default function ProjectCard({ slug, title, badge, tags, gradient }: Project) {
  return (
    <Link
      href={`/projects/${slug}`}
      className="group overflow-hidden rounded-2xl border border-border bg-[#111113] transition-colors hover:border-foreground/30"
    >
      <div className="relative">
        <div className={`aspect-[16/10] w-full bg-gradient-to-br ${gradient}`} />
        <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {badge}
        </span>
      </div>
      <div className="flex gap-4 px-5 py-5">
        <div className="w-px shrink-0 bg-border" />
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
