import { Copy, Mail, Minus, X } from "lucide-react";
import LinkedInIcon from "@/components/LinkedInIcon";
import LocalClock from "@/components/LocalClock";
import ProjectCard from "@/components/ProjectCard";
import { BASE_PATH } from "@/lib/base-path";
import { projects } from "@/data/projects";

const SOFTWARE = [
  { name: "Figma", src: "/images/software/figma.svg" },
  { name: "Framer", src: "/images/software/framer.svg" },
  { name: "Photoshop", src: "/images/software/photoshop.svg" },
  { name: "After Effects", src: "/images/software/after-effects.svg" },
  { name: "Blender", src: "/images/software/blender.svg" },
  { name: "Claude", src: "/images/software/claude.svg" },
  { name: "AutoCAD", src: "/images/software/autocad.png" },
];

export default function Home() {
  return (
    <div className="h-full overflow-y-auto flex flex-col gap-1.5 lg:h-full lg:overflow-visible lg:grid lg:grid-cols-[400px_1fr] lg:items-stretch">
      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-1.5 lg:h-full lg:min-h-0">
        {/* name / tagline / clock / bio */}
        <div className="relative flex shrink-0 flex-col gap-14 rounded-[22px] border border-black bg-white px-6 pb-6 pt-10">
          {/* decorative window controls */}
          <div className="absolute right-4 top-4 flex items-center gap-1.5">
            <div className="btn-win flex h-6 w-6 items-center justify-center rounded-md text-black">
              <X className="h-3 w-3" strokeWidth={2.5} />
            </div>
            <div className="btn-win flex h-6 w-6 items-center justify-center rounded-md text-black">
              <Minus className="h-3 w-3" strokeWidth={2.5} />
            </div>
            <div className="btn-win flex h-6 w-6 items-center justify-center rounded-md text-black">
              <Copy className="h-3 w-3" strokeWidth={2.5} />
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-semibold leading-tight text-foreground">
                Mila Scholz
              </h1>
              <p className="mt-2 text-sm italic text-foreground/50">Created to create</p>
            </div>
            <LocalClock />
          </div>

          <p className="text-[15px] leading-[23px] text-foreground/75">
            I&apos;m a mechatronics engineering + AI student at Western University, designing and
            building things that live at the intersection of hardware and software — from CAD&apos;d
            robot arms to shipped product UI. Outside of school you&apos;ll find me on my model
            trainset or buried in a book about floorplans.
          </p>
        </div>

        {/* software */}
        <div className="flex shrink-0 flex-nowrap gap-2 rounded-[22px] border border-black bg-white p-4">
          {SOFTWARE.map((tool) => (
            <div
              key={tool.name}
              title={tool.name}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black bg-white p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE_PATH}${tool.src}`}
                alt={tool.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* experience */}
        <div className="flex shrink-0 flex-col gap-1 rounded-[22px] border border-black bg-white p-1.5">
          <div className="rounded-2xl border border-dashed border-black/30 px-4 py-5 text-xs leading-relaxed text-foreground/40">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-foreground/30">
              Experience
            </p>
            Placeholder — send over your roles + dates and I&apos;ll drop them in here.
          </div>
        </div>

        {/* footer */}
        <div className="flex shrink-0 items-center justify-between rounded-[22px] border border-black bg-white p-4">
          <a
            href="mailto:mscholz5@uwo.ca"
            className="btn-win flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-black"
          >
            mscholz5@uwo.ca
            <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
          </a>
          <div className="flex items-center gap-2">
            <a
              href="https://www.linkedin.com/in/mila-scholz-a4094730b/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="btn-win flex h-8 w-8 items-center justify-center rounded-full text-black"
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
            <a
              href="mailto:mscholz5@uwo.ca"
              aria-label="Email"
              className="btn-win flex h-8 w-8 items-center justify-center rounded-full text-black"
            >
              <Mail className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN — pulled up by the nav's height + gap so this card's
          top edge lines up with the top of the sidebar nav, not the cards below it. */}
      <div className="flex flex-col rounded-[22px] border border-black bg-white lg:-mt-[54px] lg:h-[calc(100%+54px)] lg:overflow-y-auto">
        {/* "Selected Work" sits the same distance from the top of this box
            as it does from the left, matching the box's own p-4 inset. */}
        <div className="p-4 pb-0">
          <div className="btn-win w-fit rounded-full px-3.5 py-1.5 text-sm font-medium text-black">
            Selected Work
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
