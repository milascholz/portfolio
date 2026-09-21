import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Mila Scholz",
};

export default function About() {
  return (
    <section className="px-6 py-14 md:px-16 md:py-20">
      <p className="max-w-2xl text-lg leading-relaxed text-foreground/90">
        [Add a short bio here — your background, interests, and what
        you&apos;re currently working on.]
      </p>
    </section>
  );
}
