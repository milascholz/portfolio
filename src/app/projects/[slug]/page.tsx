import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";

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
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        {project.title}
      </h1>

      <div className="mt-16 flex flex-col gap-24 pb-[60vh]">
        {project.sections.map((section) => (
          <section key={section.id} id={section.id} className="min-h-[40vh] scroll-mt-10">
            <h2 className="text-sm font-medium uppercase tracking-widest text-muted">
              {section.label}
            </h2>
          </section>
        ))}
      </div>
    </div>
  );
}
