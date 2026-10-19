"use client";

import { ArrowUpRight } from "lucide-react";
import { BASE_PATH } from "@/lib/base-path";
import { useRegisterProjectNav, useSetHoveredInfo } from "@/context/ProjectNavContext";
import { CursorTag, useCursorTag } from "@/components/CursorTag";

type MediaItem = {
  type: "image" | "video";
  src: string;
  poster?: string;
  alt?: string;
};

type FunEntry = {
  title: string;
  meta?: string;
  description: string;
  software?: string[];
  link?: string;
  linkLabel?: string;
  item: MediaItem;
};

// Laid out in explicit rows of 3 (one per column — see COLUMN_COUNT below),
// so the first row (Women in Engineering / Snowman / Spark) and second row
// (ZoomFest Film Contest Intro / Model Train Set / Above All) are guaranteed
// to render as the first two items of each column and stay above the fold.
// The rest spaces out the repeated multi-photo projects (dear miashop,
// @miasdeck, Model Train Set) and the one-off posters so no two posters or
// same-project photos land beside each other.
const COLUMN_COUNT = 3;
const ENTRIES: FunEntry[] = [
  // Row 0 — pairs the tallest item in each column with a short one in row 1
  // below it, so each column's first two items fit above the fold.
  {
    title: "Women in Engineering @ UWO",
    meta: "Website Design",
    description: "A website redesign for Western's Women in Engineering club, where I'm VP of Design.",
    software: ["Framer"],
    link: "https://womeninengineeringuwo.framer.media/",
    linkLabel: "Visit site",
    item: { type: "image", src: "/images/fun/wie-uwo-website.jpg", alt: "Women in Engineering @ UWO website design" },
  },
  {
    title: "Snowman",
    meta: "3D Modelling",
    description: "A 3D model of a snowman drinking tea and slicing a cake.",
    software: ["Maya"],
    item: {
      type: "video",
      src: "/videos/fun/snowman.mp4",
      poster: "/images/fun/snowman-poster.jpg",
      alt: "Low-poly 3D animated snowman short",
    },
  },
  {
    title: "Spark",
    meta: "Figbuild 2026",
    description:
      "A group hackathon submission to Figbuild 2026, an app that nudges you to text the friends you keep meaning to catch up with.",
    software: ["Figma"],
    link: "https://devpost.com/software/spark-sa2f1v",
    linkLabel: "See on Devpost",
    item: { type: "image", src: "/images/fun/spark.jpg", alt: "Spark app screens" },
  },
  {
    title: "ZoomFest Film Contest Intro",
    meta: "Title Animation",
    description:
      "An intro sequence for ZoomFest, a short film competition, where I focused on combining motion design and typography. I learned how to make 3D text and developed my animation skills.",
    software: ["After Effects"],
    item: {
      type: "video",
      src: "/videos/fun/zoomfest.mp4",
      poster: "/images/fun/zoomfest-poster.jpg",
      alt: "Zoom Film Contest Fest intro animation",
    },
  },
  {
    title: "Model Train Set",
    meta: "Diorama",
    description:
      "Building a model train set diorama from scratch. I built the table it sits on, the mountains, the tunnels, even the grass for the mountains. An ongoing project I love working on when I'm home, giving my dad's childhood train set a new life.",
    software: ["Paper mache, and a lot of time, patience, and love"],
    item: { type: "image", src: "/images/fun/train-3515.jpg", alt: "Model train layout river bend beside a painted mountain" },
  },
  {
    title: "Above All",
    meta: "Short Film",
    description: "A short film I made with my friends, for which I did the sound design and designed the poster.",
    software: ["After Effects", "Premiere Pro"],
    link: "https://www.imdb.com/title/tt29579616/?ref_=mv_close",
    linkLabel: "View on IMDb",
    item: { type: "image", src: "/images/fun/above-all-poster.jpg", alt: "Above All film poster" },
  },
  {
    title: "Quick Statics Answers",
    meta: "130,000+ views",
    description:
      "A YouTube channel I developed in my first year of engineering, where I walk through step-by-step solutions to statics problems, now with 130,000+ views across 46 videos.",
    software: ["After Effects", "YouTube"],
    link: "https://www.youtube.com/@QuickStaticsAnswers",
    linkLabel: "Watch on YouTube",
    item: { type: "image", src: "/images/fun/youtube-channel.jpg", alt: "Quick Statics Answers YouTube channel" },
  },
  {
    title: "Africa",
    meta: "Travel Video",
    description: "A collection of my friends' perspectives on travel, overlaid on real footage from my global adventures.",
    software: ["After Effects"],
    item: {
      type: "video",
      src: "/videos/fun/africa.mp4",
      poster: "/images/fun/africa-poster.jpg",
      alt: "Safari travel highlight reel",
    },
  },
  {
    title: "dear miashop",
    meta: "Etsy Shop",
    description:
      "A profitable Etsy shop I ran selling gradient wall calendars. I did all the design, shop upkeep, and advertising on Pinterest, solo.",
    software: ["Photoshop", "Etsy"],
    item: { type: "image", src: "/images/fun/etsy-store.jpg", alt: "dear miashop Etsy storefront logo" },
  },
  {
    title: "Poster Design",
    meta: "Graphic Design",
    description:
      "A poster of my favourite band in 2025, featuring a custom font I designed. Currently hanging in my room.",
    software: ["Canva"],
    item: { type: "image", src: "/images/fun/poster-sessions.jpg", alt: "\"The Sessions\" tour poster" },
  },
  {
    title: "@miasdeck",
    meta: "Digital Collage",
    description:
      "A series of collages made on playing cards, using media from my travels and daily life, as I try to romanticize the ordinary. I started an Instagram account to share my work and grew an awesome community of fellow collage artists.",
    software: ["Canva", "Instagram"],
    link: "https://www.instagram.com/miasdeck/",
    linkLabel: "View on Instagram",
    item: { type: "image", src: "/images/fun/playing-cards/10.jpg", alt: "Playing card collage, Honey Donuts" },
  },
  {
    title: "Model Train Set",
    meta: "Diorama",
    description:
      "Building a model train set diorama from scratch. I built the table it sits on, the mountains, the tunnels, even the grass for the mountains. An ongoing project I love working on when I'm home, giving my dad's childhood train set a new life.",
    software: ["Paper mache, and a lot of time, patience, and love"],
    item: { type: "image", src: "/images/fun/train-3514.jpg", alt: "Model train layout with mountain tunnel and bridge" },
  },
  {
    title: "dear miashop",
    meta: "Etsy Shop",
    description:
      "A profitable Etsy shop I ran selling gradient wall calendars. I did all the design, shop upkeep, and advertising on Pinterest, solo.",
    software: ["Photoshop", "Etsy"],
    item: { type: "image", src: "/images/fun/calendar-2.jpg", alt: "Full twelve-month gradient calendar set" },
  },
  {
    title: "@miasdeck",
    meta: "Digital Collage",
    description:
      "A series of collages made on playing cards, using media from my travels and daily life, as I try to romanticize the ordinary. I started an Instagram account to share my work and grew an awesome community of fellow collage artists.",
    software: ["Canva", "Instagram"],
    link: "https://www.instagram.com/miasdeck/",
    linkLabel: "View on Instagram",
    item: { type: "image", src: "/images/fun/playing-cards/21.jpg", alt: "Playing card collage, Poi Dog Deli" },
  },
  {
    title: "Poster Design",
    meta: "Graphic Design",
    description:
      "A poster for a song about clementines from one of my top artists, Saint Levant, who sings in Arabic, English, and French. I saw him in concert in Toronto! Currently hanging in my room.",
    software: ["Canva"],
    item: { type: "image", src: "/images/fun/poster-kalamantina.jpg", alt: "\"Kalamantina\" Saint Levant single cover poster" },
  },
  {
    title: "dear miashop",
    meta: "Etsy Shop",
    description:
      "A profitable Etsy shop I ran selling gradient wall calendars. I did all the design, shop upkeep, and advertising on Pinterest, solo.",
    software: ["Photoshop", "Etsy"],
    item: { type: "image", src: "/images/fun/calendar-1.jpg", alt: "January gradient calendar page hung on a wall" },
  },
  {
    title: "Model Train Set",
    meta: "Diorama",
    description:
      "Building a model train set diorama from scratch. I built the table it sits on, the mountains, the tunnels, even the grass for the mountains. An ongoing project I love working on when I'm home, giving my dad's childhood train set a new life.",
    software: ["Paper mache, and a lot of time, patience, and love"],
    item: { type: "image", src: "/images/fun/train-3513.jpg", alt: "Close-up of hand-painted rock and grass terrain" },
  },
  {
    title: "@miasdeck",
    meta: "Digital Collage",
    description:
      "A series of collages made on playing cards, using media from my travels and daily life, as I try to romanticize the ordinary. I started an Instagram account to share my work and grew an awesome community of fellow collage artists.",
    software: ["Canva", "Instagram"],
    link: "https://www.instagram.com/miasdeck/",
    linkLabel: "View on Instagram",
    item: { type: "image", src: "/images/fun/playing-cards/8.jpg", alt: "Playing card collage, NYC cronut" },
  },
  {
    title: "Poster Design",
    meta: "Graphic Design",
    description: "I loved NewJeans' tech aesthetic in their 2nd EP, so I designed a poster inspired by it.",
    software: ["Canva"],
    item: { type: "image", src: "/images/fun/poster-newjeans.jpg", alt: "Fan edit poster design" },
  },
  {
    title: "dear miashop",
    meta: "Etsy Shop",
    description:
      "A profitable Etsy shop I ran selling gradient wall calendars. I did all the design, shop upkeep, and advertising on Pinterest, solo.",
    software: ["Photoshop", "Etsy"],
    item: { type: "image", src: "/images/fun/calendar-3.jpg", alt: "Calendar pages laid out together" },
  },
  {
    title: "Poster Design",
    meta: "Graphic Design",
    description: "A poster of my favourite childhood Wii game, Tanks. I'm yet to beat it. Currently hanging in my room.",
    software: ["Canva"],
    item: { type: "image", src: "/images/fun/poster-tanks.jpg", alt: "\"Tanks\" Wii Play tribute poster" },
  },
];

function EntryMedia({ item }: { item: MediaItem }) {
  if (item.type === "video") {
    return (
      <video
        className="h-auto w-full rounded-lg border border-black/10"
        src={`${BASE_PATH}${item.src}`}
        poster={item.poster ? `${BASE_PATH}${item.poster}` : undefined}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`${BASE_PATH}${item.src}`} alt={item.alt ?? ""} className="h-auto w-full rounded-lg border border-black/10" />
  );
}

function EntryCaption({ entry }: { entry: FunEntry }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <p className="flex items-center gap-1 text-sm font-semibold text-foreground">
        {entry.title}
        {entry.link ? <ArrowUpRight size={13} className="text-foreground/45" /> : null}
      </p>
      {entry.meta ? <span className="text-xs text-foreground/45">{entry.meta}</span> : null}
    </div>
  );
}

function EntryCard({ entry }: { entry: FunEntry }) {
  const setHoveredInfo = useSetHoveredInfo();
  const cursor = useCursorTag();

  const content = (
    <div
      onMouseEnter={() =>
        setHoveredInfo({ title: entry.title, description: entry.description, software: entry.software })
      }
      onMouseLeave={() => setHoveredInfo(null)}
      onFocus={() =>
        setHoveredInfo({ title: entry.title, description: entry.description, software: entry.software })
      }
      onBlur={() => setHoveredInfo(null)}
    >
      <EntryMedia item={entry.item} />
      <EntryCaption entry={entry} />
    </div>
  );

  const wrapped = entry.link ? (
    <a
      href={entry.link}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block cursor-none transition-opacity hover:opacity-80"
      {...cursor.handlers}
    >
      {content}
      <CursorTag visible={cursor.visible} position={cursor.position} label={entry.linkLabel} external />
    </a>
  ) : (
    content
  );

  return <div className="mb-6">{wrapped}</div>;
}

const ALL_SOFTWARE = Array.from(new Set(ENTRIES.flatMap((entry) => entry.software ?? [])));

export default function FunPage() {
  useRegisterProjectNav("Fun", [], {
    defaultHeading: "A collection of my projects, hobbies, and everything in between.",
    defaultSoftware: ALL_SOFTWARE,
  });

  // Explicit columns (rather than CSS `columns` auto-balancing) so the
  // order entries are authored in above maps directly to which column —
  // and which row — each one lands in. See the ENTRIES comment.
  const columns: FunEntry[][] = Array.from({ length: COLUMN_COUNT }, (_, col) =>
    ENTRIES.filter((_, i) => i % COLUMN_COUNT === col)
  );

  return (
    <div className="mx-auto w-full max-w-[1120px] p-6 md:p-10 lg:p-12">
      <div className="flex flex-col gap-6 sm:flex-row">
        {columns.map((column, i) => (
          <div key={i} className="flex flex-1 flex-col">
            {column.map((entry) => (
              <EntryCard key={`${entry.title}-${entry.item.src}`} entry={entry} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
