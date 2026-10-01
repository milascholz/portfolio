import { Mail } from "lucide-react";
import AboutGallery from "@/components/AboutGallery";
import LinkedInIcon from "@/components/LinkedInIcon";

export default function AboutPage() {
  return (
    <div className="p-6 md:p-10 lg:p-12">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_0.62fr] md:items-start">
        <div className="md:sticky md:top-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">About</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-foreground md:text-4xl">
            Hi, I&apos;m Mila.
          </h1>
          <p className="mt-4 max-w-md leading-relaxed text-foreground/70">
            I&apos;m a designer and engineer who loves building useful things. When I&apos;m not
            creating products, you&apos;ll find me working on my model trainset or reading books
            about floorplans.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="mailto:mscholz5@uwo.ca"
              className="inline-flex items-center gap-2 border border-black bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-black hover:text-white"
            >
              <Mail className="h-4 w-4" strokeWidth={1.75} />
              mscholz5@uwo.ca
            </a>
            <a
              href="https://www.linkedin.com/in/mila-scholz-a4094730b/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex items-center justify-center border border-black bg-white p-2.5 text-foreground transition-colors hover:bg-black hover:text-white"
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
        <AboutGallery />
      </div>
    </div>
  );
}
