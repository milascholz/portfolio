"use client";

import { useState, ViewTransition, type MouseEvent } from "react";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { BASE_PATH } from "@/lib/base-path";

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="11"
      height="11"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="shrink-0"
    >
      <path d="M4 12L12 4M12 4H5M12 4V11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProjectCard({ project }: { project: Project }) {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const hasLink = Boolean(project.link);

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setCursorPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  const media = project.video ? (
    <div className="aspect-video w-full overflow-hidden">
      <video
        className="h-full w-full object-cover"
        style={project.videoScale ? { transform: `scale(${project.videoScale})` } : undefined}
        src={`${BASE_PATH}${project.video}`}
        poster={project.poster ? `${BASE_PATH}${project.poster}` : undefined}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    </div>
  ) : (
    <div className="aspect-video" style={{ backgroundImage: project.gradient }} />
  );

  const body = (
    <div className="flex items-start justify-between gap-3 border-t border-black px-4 py-3">
      <div>
        <h3 className="font-semibold text-foreground">{project.title}</h3>
        <p className="text-sm text-foreground/55">{project.subheading}</p>
      </div>
      {project.tag ? (
        <span className="btn-pill btn-pill-static project-tag shrink-0 whitespace-nowrap px-2 py-1 text-xs font-medium text-foreground">
          {project.tag}
        </span>
      ) : null}
    </div>
  );

  if (!hasLink) {
    return (
      <div className="flex flex-col overflow-hidden rounded-[22px] border border-black bg-white">
        {media}
        {body}
      </div>
    );
  }

  const cursorTag =
    isHovering && project.linkLabel ? (
      <div
        className="pointer-events-none absolute z-20 flex items-center gap-1 whitespace-nowrap rounded-full border border-black bg-white px-2 py-1 text-xs font-medium text-foreground shadow-sm"
        style={{ left: cursorPos.x, top: cursorPos.y, transform: "translate(10px, 10px)" }}
      >
        {project.linkLabel}
        {project.linkExternal ? <ArrowUpRight /> : null}
      </div>
    ) : null;

  const sharedProps = {
    className:
      "group relative flex cursor-none flex-col overflow-hidden rounded-[22px] border border-black bg-white",
    onMouseEnter: () => setIsHovering(true),
    onMouseLeave: () => setIsHovering(false),
    onMouseMove: handleMouseMove,
  };

  if (project.linkExternal) {
    return (
      <a href={project.link} target="_blank" rel="noopener noreferrer" {...sharedProps}>
        {media}
        {body}
        {cursorTag}
      </a>
    );
  }

  return (
    <ViewTransition name={`project-${project.id}`}>
      <Link href={project.link!} {...sharedProps}>
        {media}
        {body}
        {cursorTag}
      </Link>
    </ViewTransition>
  );
}
