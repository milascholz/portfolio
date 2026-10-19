"use client";

import { ViewTransition } from "react";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { BASE_PATH } from "@/lib/base-path";
import { CursorTag, useCursorTag } from "@/components/CursorTag";

export default function ProjectCard({ project }: { project: Project }) {
  const cursor = useCursorTag();
  const hasLink = Boolean(project.link);

  const media = project.video ? (
    <video
      className="h-auto w-full"
      src={`${BASE_PATH}${project.video}`}
      poster={project.poster ? `${BASE_PATH}${project.poster}` : undefined}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
    />
  ) : (
    <div className="aspect-video w-full" style={{ backgroundImage: project.gradient }} />
  );

  const body = (
    <div className="px-4 pb-4 pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold text-foreground">{project.title}</h3>
        {project.tag ? <span className="text-xs text-foreground/45">{project.tag}</span> : null}
      </div>
      <p className="mt-1 text-sm text-foreground/55">{project.subheading}</p>
    </div>
  );

  if (!hasLink) {
    return (
      <div className="mb-6 break-inside-avoid overflow-hidden rounded-[22px] border border-black bg-white">
        {media}
        {body}
      </div>
    );
  }

  const cursorTag = (
    <CursorTag
      visible={cursor.visible}
      position={cursor.position}
      label={project.linkLabel}
      external={project.linkExternal}
    />
  );

  const sharedProps = {
    className:
      "group relative block cursor-none overflow-hidden rounded-[22px] border border-black bg-white",
    ...cursor.handlers,
  };

  if (project.linkExternal) {
    return (
      <div className="mb-6 break-inside-avoid">
        <a href={project.link} target="_blank" rel="noopener noreferrer" {...sharedProps}>
          {media}
          {body}
          {cursorTag}
        </a>
      </div>
    );
  }

  return (
    <div className="mb-6 break-inside-avoid">
      <ViewTransition name={`project-${project.id}`}>
        <Link href={project.link!} {...sharedProps}>
          {media}
          {body}
          {cursorTag}
        </Link>
      </ViewTransition>
    </div>
  );
}
