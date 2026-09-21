export type ProjectSection = {
  id: string;
  label: string;
};

export type Project = {
  slug: string;
  title: string;
  badge: string;
  tags: string[];
  gradient: string;
  sections: ProjectSection[];
};

const defaultSections: ProjectSection[] = [
  { id: "overview", label: "Overview" },
  { id: "contributions", label: "My Contributions" },
  { id: "details", label: "Details" },
];

export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project One",
    badge: "Placeholder Badge",
    tags: ["Tag One", "Tag Two", "Tag Three"],
    gradient: "from-rose-400 via-orange-300 to-amber-200",
    sections: defaultSections,
  },
  {
    slug: "project-two",
    title: "Project Two",
    badge: "Placeholder Badge",
    tags: ["Tag One", "Tag Two"],
    gradient: "from-sky-400 via-blue-300 to-indigo-200",
    sections: defaultSections,
  },
  {
    slug: "project-three",
    title: "Project Three",
    badge: "Placeholder Badge",
    tags: ["Tag One", "Tag Two", "Tag Three"],
    gradient: "from-emerald-400 via-teal-300 to-cyan-200",
    sections: defaultSections,
  },
  {
    slug: "project-four",
    title: "Project Four",
    badge: "Placeholder Badge",
    tags: ["Tag One", "Tag Two"],
    gradient: "from-fuchsia-400 via-pink-300 to-rose-200",
    sections: defaultSections,
  },
];
