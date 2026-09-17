"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { usePortalLoader } from "@/components/portal-loader";
import { projectInitials, type Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

type ProjectsSectionProps = {
  projects: Project[];
  heading: ReactNode;
};

function ProjectPoster({
  project,
  className = "",
  featured = false,
}: {
  project: Project;
  className?: string;
  featured?: boolean;
}) {
  const accent = project.accent ?? "#0c3b38";
  const initials = projectInitials(project.title);

  return (
    <div
      className={cn("project-poster", featured && "project-poster--featured", className)}
      style={
        {
          "--poster-accent": accent,
        } as CSSProperties
      }
    >
      <span className="project-poster__glow" aria-hidden="true" />
      <span className="project-poster__grid" aria-hidden="true" />
      <span className="project-poster__mark" aria-hidden="true">
        {initials}
      </span>
      {project.tag ? (
        <span className="project-poster__tag">{project.tag}</span>
      ) : null}
    </div>
  );
}

export function ProjectsSection({ projects, heading }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { ready } = usePortalLoader();

  const featured = projects[0] ?? null;
  const railProjects = useMemo(() => projects.slice(1), [projects]);

  useEffect(() => {
    if (!ready) return;

    const section = sectionRef.current;
    const shell = shellRef.current;
    const panel = panelRef.current;
    if (!section || !shell || !panel) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      shell.style.marginInline = "0px";
      shell.style.borderRadius = "0px";
      panel.style.transform = "none";
      panel.style.opacity = "1";
      return;
    }

    let frame = 0;
    let mobile = window.innerWidth < 640;
    let lastProgress = -1;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;

      const start = viewH * 0.92;
      const end = viewH * (mobile ? 0.28 : 0.18);
      const progress = Math.min(
        Math.max((start - rect.top) / (start - end), 0),
        1,
      );

      if (progress === lastProgress && (progress === 0 || progress === 1)) {
        return;
      }
      lastProgress = progress;

      const ease = 1 - Math.pow(1 - progress, 2.6);
      const lift = (1 - ease) * (mobile ? 120 : 220);
      const scale = 0.92 + ease * 0.08;
      const growPad = mobile ? 14 + ease * 28 : 24 + ease * 48;
      const inset = (1 - ease) * (mobile ? 14 : 48);
      const radius = (1 - ease) * (mobile ? 16 : 24);

      shell.style.marginInline = `${inset}px`;
      shell.style.borderRadius = `${radius}px`;
      shell.style.borderWidth = ease > 0.92 ? "0px" : "1px";

      panel.style.transform = `translate3d(0, ${lift}px, 0) scale(${scale})`;
      panel.style.opacity = String(0.4 + ease * 0.6);
      panel.style.paddingTop = `${growPad}px`;
      panel.style.paddingBottom = `${growPad}px`;
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    const onResize = () => {
      mobile = window.innerWidth < 640;
      lastProgress = -1;
      onScroll();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="scroll-mt-20 overflow-hidden border-t border-line bg-[linear-gradient(180deg,#e7ecef_0%,#eef2f4_42%,#eef2f4_100%)] py-8 sm:scroll-mt-24 sm:py-12"
    >
      <div
        ref={shellRef}
        className="projects-shell overflow-hidden border border-line/80 bg-paper shadow-[0_18px_50px_rgba(16,34,42,0.06)] will-change-[margin,border-radius]"
        style={{ marginInline: "48px", borderRadius: "24px" }}
      >
        <div
          ref={panelRef}
          className="projects-panel mx-auto max-w-6xl origin-top px-0 will-change-transform sm:px-6 lg:px-10"
          style={{
            transform: "translate3d(0, 180px, 0) scale(0.92)",
            opacity: 0.35,
          }}
        >
          <div className="mb-6 flex flex-col gap-3 px-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:px-4">
            <div className="max-w-2xl">{heading}</div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-ink-soft/80">
              {String(projects.length).padStart(2, "0")} titles
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="mx-4 min-h-36 border border-dashed border-line px-4 py-12 sm:min-h-48 sm:px-10 sm:py-16" />
          ) : (
            <div className="flex flex-col gap-8 sm:gap-10">
              {featured ? (
                <a
                  href={featured.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-billboard group mx-4 overflow-hidden sm:mx-4"
                >
                  <ProjectPoster project={featured} featured />
                  <div className="project-billboard__content">
                    {featured.tag ? (
                      <p className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-paper/55">
                        Featured · {featured.tag}
                      </p>
                    ) : (
                      <p className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-paper/55">
                        Featured
                      </p>
                    )}
                    <h3 className="mt-2 font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl md:text-5xl">
                      {featured.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-pretty text-paper/75 sm:text-base">
                      {featured.description}
                    </p>
                    <span className="project-billboard__cta mt-5 inline-flex min-h-11 items-center gap-2 bg-signal px-5 text-sm font-semibold text-paper transition-colors group-hover:bg-signal-hover">
                      Open project
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </a>
              ) : null}

              {railProjects.length > 0 ? (
                <div className="project-rail">
                  <div className="mb-3 flex items-end justify-between px-4 sm:px-4">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
                      All projects
                    </h3>
                    <p className="text-xs tracking-wide text-ink-soft">
                      Scroll to browse
                    </p>
                  </div>

                  <Carousel
                    opts={{
                      align: "start",
                      loop: false,
                      dragFree: true,
                    }}
                    className="project-rail__carousel w-full"
                  >
                    <CarouselContent className="-ml-3 px-4 sm:-ml-4 sm:px-4">
                      {railProjects.map((project) => (
                        <CarouselItem
                          key={project.href + project.title}
                          className="basis-[78%] pl-3 sm:basis-[46%] sm:pl-4 md:basis-[34%] lg:basis-[28%]"
                        >
                          <a
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-card group block"
                          >
                            <ProjectPoster project={project} />
                            <div className="project-card__meta">
                              <h4 className="font-display text-base font-semibold tracking-tight text-ink transition-colors group-hover:text-brand sm:text-lg">
                                {project.title}
                              </h4>
                              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                                {project.description}
                              </p>
                            </div>
                          </a>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="project-rail__nav left-2 hidden border-line bg-paper/90 text-ink shadow-sm sm:flex" />
                    <CarouselNext className="project-rail__nav right-2 hidden border-line bg-paper/90 text-ink shadow-sm sm:flex" />
                  </Carousel>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
