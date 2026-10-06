export type Project = {
  id: string;
  title: string;
  subheading: string;
  gradient: string;
  video?: string;
  videoScale?: number;
  poster?: string;
  tag?: string;
  link?: string;
  linkLabel?: string;
  linkExternal?: boolean;
};

export const projects: Project[] = [
  {
    id: "discify",
    title: "Discify",
    subheading: "Spotify extension gamifying album listens",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #c084fc 55%, #f0abfc 100%)",
    video: "/videos/discify-showcase.mp4",
    poster: "/images/discify-poster.jpg",
    tag: "Personal Project",
    link: "/projects/discify",
    linkLabel: "View case study",
  },
  {
    id: "project-two",
    title: "Slouchy",
    subheading: "Posture-correcting macOS menu bar app",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #60a5fa 60%, #bfdbfe 100%)",
    video: "/videos/slouchy-showreel.mp4",
    tag: "Cornell UX Designathon 2nd Place Winner",
    link: "https://devpost.com/software/slouchy",
    linkLabel: "See on Devpost",
    linkExternal: true,
  },
  {
    id: "project-three",
    title: "Baker Bot: Humanoid Robot Arms",
    subheading: "Arms for a commissioned humanoid AI teaching assistant robot",
    gradient: "linear-gradient(135deg, #059669 0%, #34d399 55%, #a7f3d0 100%)",
    video: "/videos/humanoid-robot-arm-assembly.mp4",
    videoScale: 1.15,
    tag: "Engineering Design & Manufacturing",
    link: "/projects/humanoid-robot-arm-assembly",
    linkLabel: "View case study",
  },
  {
    id: "project-four",
    title: "Mesh (YC W25) Website UI/UX Feedback",
    subheading: "Open call for comments via LinkedIn",
    gradient: "linear-gradient(135deg, #ea580c 0%, #fb923c 55%, #fed7aa 100%)",
    video: "/videos/mesh.mp4",
    tag: "UI/UX Feedback",
    link: "/projects/mesh",
    linkLabel: "View case study",
  },
];
