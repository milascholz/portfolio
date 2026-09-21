import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <section className="px-6 py-14 md:px-16 md:py-20">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted">
        Projects
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} {...project} />
        ))}
      </div>
    </section>
  );
}
