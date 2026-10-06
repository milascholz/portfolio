import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    // pulled up by the nav's height + gap so this card's top edge lines
    // up with the top of the sidebar nav.
    <div className="panel-grey flex flex-col rounded-[22px] border border-[#6e6e6e] lg:-mt-[54px] lg:h-[calc(100%+54px)] lg:min-h-0">
      <div className="well-inset no-scrollbar flex-1 p-4 lg:min-h-0 lg:overflow-y-auto">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
