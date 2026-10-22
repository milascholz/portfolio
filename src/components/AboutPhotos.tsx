"use client";

import { BASE_PATH } from "@/lib/base-path";
import { CursorTag, useCursorTag } from "@/components/CursorTag";

type Photo = {
  src: string;
  alt: string;
  caption: string;
};

const PHOTOS: Photo[] = [
  {
    src: "/images/aboutme/cat-selfie.jpg",
    alt: "A close-up selfie with a tabby and white cat",
    caption: "My cat Pebbles!",
  },
  {
    src: "/images/aboutme/lab-thumbs-up.jpg",
    alt: "Mila giving a thumbs up in a lab, wearing safety glasses, a mask, and gloves",
    caption: "In the lab @ BGC Engineering",
  },
  {
    src: "/images/aboutme/cavendish-farms.jpg",
    alt: "Mila jumping for joy in front of the Cavendish Farms sign on a sunny day",
    caption: "Cavendish Farms last summer!",
  },
  {
    src: "/images/aboutme/japan-lawson.jpg",
    alt: "A group in pink rain ponchos posing outside a Lawson convenience store in Japan",
    caption: "Rainy day in Japan on a fully-fundraised Girl Guides trip",
  },
];

function PhotoTile({ photo }: { photo: Photo }) {
  const cursor = useCursorTag();

  return (
    <div className="relative cursor-none" {...cursor.handlers}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE_PATH}${photo.src}`}
        alt={photo.alt}
        className="w-full rounded-lg border border-black/10"
      />
      <CursorTag visible={cursor.visible} position={cursor.position} label={photo.caption} />
    </div>
  );
}

/** A plain stack of candid photos for the About page's right-hand column.
 * Captions aren't shown by default — hovering a photo reveals its caption
 * in a rounded cursor-following tag, the same CursorTag used on project
 * cards and the Fun page. */
export default function AboutPhotos() {
  return (
    <div className="flex flex-col gap-6">
      {PHOTOS.map((photo) => (
        <PhotoTile key={photo.src} photo={photo} />
      ))}
    </div>
  );
}
