export type Project = {
  title: string;
  badge: string;
  tags: string[];
  gradient: string;
};

export const projects: Project[] = [
  {
    title: "Project One",
    badge: "Placeholder Badge",
    tags: ["Tag One", "Tag Two", "Tag Three"],
    gradient: "from-rose-400 via-orange-300 to-amber-200",
  },
  {
    title: "Project Two",
    badge: "Placeholder Badge",
    tags: ["Tag One", "Tag Two"],
    gradient: "from-sky-400 via-blue-300 to-indigo-200",
  },
  {
    title: "Project Three",
    badge: "Placeholder Badge",
    tags: ["Tag One", "Tag Two", "Tag Three"],
    gradient: "from-emerald-400 via-teal-300 to-cyan-200",
  },
  {
    title: "Project Four",
    badge: "Placeholder Badge",
    tags: ["Tag One", "Tag Two"],
    gradient: "from-fuchsia-400 via-pink-300 to-rose-200",
  },
];
