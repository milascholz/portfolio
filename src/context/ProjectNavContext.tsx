"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ProjectNavSection = {
  id: string;
  label: string;
  subsections?: { id: string; label: string }[];
};

export type HoveredInfo = { title: string; description: string; software?: string[] };

export type ProjectNavData = {
  title: string;
  sections: ProjectNavSection[];
  // Pages with no section list (e.g. Fun) can opt into a hover-driven
  // sidebar instead: it shows this heading (and, optionally, an aggregate
  // row of every software icon used across the page) until something
  // registers hover info, then swaps to that item's title/description.
  hoverPanel?: { defaultHeading: string; defaultSoftware?: string[] };
};

type ProjectNavContextValue = {
  projectNav: ProjectNavData | null;
  setProjectNav: (data: ProjectNavData | null) => void;
  hoveredInfo: HoveredInfo | null;
  setHoveredInfo: (info: HoveredInfo | null) => void;
};

const ProjectNavContext = createContext<ProjectNavContextValue | null>(null);

export function ProjectNavProvider({ children }: { children: ReactNode }) {
  const [projectNav, setProjectNav] = useState<ProjectNavData | null>(null);
  const [hoveredInfo, setHoveredInfo] = useState<HoveredInfo | null>(null);
  const value = useMemo(
    () => ({ projectNav, setProjectNav, hoveredInfo, setHoveredInfo }),
    [projectNav, hoveredInfo]
  );

  return <ProjectNavContext.Provider value={value}>{children}</ProjectNavContext.Provider>;
}

function useProjectNavContext() {
  const ctx = useContext(ProjectNavContext);
  if (!ctx) {
    throw new Error("useProjectNavContext must be used within a ProjectNavProvider");
  }
  return ctx;
}

/** Read the currently registered project nav (used by the sidebar). */
export function useProjectNav() {
  return useProjectNavContext().projectNav;
}

/** Case-study pages call this to put their title/sections into the sidebar. */
export function useRegisterProjectNav(
  title: string,
  sections: ProjectNavSection[],
  hoverPanel?: { defaultHeading: string; defaultSoftware?: string[] }
) {
  const { setProjectNav } = useProjectNavContext();
  const sectionsKey = sections
    .map((s) => `${s.id}:${s.label}:${(s.subsections ?? []).map((sub) => `${sub.id}:${sub.label}`).join(",")}`)
    .join("|");
  const hoverPanelKey = `${hoverPanel?.defaultHeading ?? ""}|${(hoverPanel?.defaultSoftware ?? []).join(",")}`;

  useEffect(() => {
    setProjectNav({ title, sections, hoverPanel });
    return () => setProjectNav(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, sectionsKey, hoverPanelKey, setProjectNav]);
}

/** Read the item currently hovered on a hover-driven nav page (e.g. Fun). */
export function useHoveredInfo() {
  return useProjectNavContext().hoveredInfo;
}

/** Set (or clear, with null) the item hovered on a hover-driven nav page. */
export function useSetHoveredInfo() {
  return useProjectNavContext().setHoveredInfo;
}
