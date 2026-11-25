export type Project = {
  id: string;
  title: string;
  subheading: string;
  gradient: string;
  video?: string;
  image?: string;
  poster?: string;
  tag?: string;
  link?: string;
  linkLabel?: string;
  linkExternal?: boolean;
};

export const projects: Project[] = [
  {
    id: "nosh",
    title: "Nosh",
    subheading: "Product + brand design for a snack container",
    gradient: "linear-gradient(135deg, #be123c 0%, #fb7185 55%, #fecdd3 100%)",
    image: "/images/nosh-poster.jpg",
    tag: "1st in Visual & Brand Design @ FIG Makeathon",
    link: "https://nosh-project.notion.site/nosh-4131ef3a2cc3811c9663c45968045eae",
    linkLabel: "View case study",
    linkExternal: true,
  },
  {
    id: "discify",
    title: "Discify",
    subheading: "Spotify extension gamifying album listens",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #c084fc 55%, #f0abfc 100%)",
    video: "/videos/discify-showcase.mp4",
    poster: "/images/discify-poster.jpg",
    link: "/projects/discify",
    linkLabel: "View case study",
  },
  {
    id: "project-three",
    title: "Humanoid Robot Arms",
    subheading: "Arms for a commissioned humanoid AI teaching assistant robot",
    gradient: "linear-gradient(135deg, #059669 0%, #34d399 55%, #a7f3d0 100%)",
    video: "/videos/humanoid-robot-arm-assembly.mp4",
    poster: "/images/humanoid-robot-arm-poster.jpg",
    link: "/projects/humanoid-robot-arm-assembly",
    linkLabel: "View case study",
  },
  {
    id: "project-two",
    title: "Slouchy",
    subheading: "Posture-correcting macOS menu bar app",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #60a5fa 60%, #bfdbfe 100%)",
    video: "/videos/slouchy-showreel.mp4",
    poster: "/images/slouchy-poster.jpg",
    tag: "2nd Place @ Cornell UX Designathon",
    link: "/projects/slouchy",
    linkLabel: "View case study",
  },
];
