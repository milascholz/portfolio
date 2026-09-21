"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Clock from "@/components/Clock";
import { projects } from "@/data/projects";

const LINKEDIN_URL = "https://www.linkedin.com/in/your-handle";
const EMAIL = "mscholz5@uwo.ca";

const navLinks = [
  { label: "Projects", href: "/" },
  { label: "About Me", href: "/about" },
];

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const projectSlug = pathname?.startsWith("/projects/")
    ? pathname.split("/").filter(Boolean)[1]
    : null;
  const activeProject = projectSlug
    ? projects.find((p) => p.slug === projectSlug)
    : null;

  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (!activeProject) {
      setActiveSection(null);
      return;
    }
    const hash = window.location.hash.replace("#", "");
    setActiveSection(hash || activeProject.sections[0]?.id || null);
  }, [activeProject]);

  return (
    <header className="border-b border-border px-6 py-8 md:fixed md:inset-y-0 md:left-0 md:w-[340px] md:border-b-0 md:border-r md:overflow-y-auto md:px-10 md:py-14">
      <div className="flex h-full flex-col justify-between gap-10">
        <div>
          <Link href="/">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Mila Scholz
            </h1>
          </Link>

          <div
            className="grid transition-[grid-template-rows] duration-300 ease-in-out"
            style={{ gridTemplateRows: activeProject ? "0fr" : "1fr" }}
          >
            <div className="overflow-hidden">
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Mechatronics + AI Engineering
              </p>
            </div>
          </div>

          {activeProject ? (
            <div className="mt-8">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
              >
                <span aria-hidden="true">&larr;</span>
                Back home
              </Link>
              <h2 className="mt-4 text-lg font-semibold leading-snug">
                {activeProject.title}
              </h2>
              <nav className="mt-6 flex flex-col border-l border-border pl-4">
                {activeProject.sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className={`py-1.5 text-sm transition-colors ${
                      activeSection === section.id
                        ? "font-medium text-foreground"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {section.label}
                  </a>
                ))}
              </nav>
            </div>
          ) : (
            <nav className="mt-10 flex gap-6 md:mt-14 md:flex-col md:gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-foreground/90 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-6 text-sm">
          <div className="flex flex-col gap-3">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-muted transition-colors hover:text-foreground"
            >
              <LinkedInIcon />
              LinkedIn
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-2 text-muted transition-colors hover:text-foreground"
            >
              <EmailIcon />
              {EMAIL}
            </a>
          </div>
          <Clock />
        </div>
      </div>
    </header>
  );
}
