import Sidebar from "@/components/Sidebar";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <div className="md:flex">
      <Sidebar />

      <main className="md:ml-[340px] md:flex-1">
        <section id="projects" className="px-6 py-14 md:px-16 md:py-20">
          <h2 className="text-sm font-medium uppercase tracking-widest text-muted">
            Projects
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>

        <section
          id="about"
          className="border-t border-border px-6 py-14 md:px-16 md:py-20"
        >
          <h2 className="text-sm font-medium uppercase tracking-widest text-muted">
            About Me
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-foreground/90">
            [Add a short bio here — your background, interests, and what
            you&apos;re currently working on.]
          </p>
        </section>
      </main>
    </div>
  );
}
