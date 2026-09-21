import type { Project } from "@/data/projects";

export default function ProjectCard({ title, description, gradient }: Project) {
  return (
    <article className="group flex flex-col">
      <div
        className={`aspect-[4/3] w-full rounded-xl bg-gradient-to-br ${gradient} transition-transform duration-200 group-hover:scale-[1.01]`}
      />
      <h3 className="mt-4 text-base font-medium">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
    </article>
  );
}
