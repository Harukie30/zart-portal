"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { usePortalLoader } from "@/components/portal-loader";
import type { Project } from "@/lib/projects";

type ProjectsSectionProps = {
  projects: Project[];
  heading: ReactNode;
};

export function ProjectsSection({ projects, heading }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { ready } = usePortalLoader();

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
      listRef.current
        ?.querySelectorAll<HTMLElement>("[data-project-item]")
        .forEach((item) => {
          item.style.transform = "none";
          item.style.opacity = "1";
        });
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

      // Idle while hero is in view (progress stuck at 0) or fully settled
      if (progress === lastProgress && (progress === 0 || progress === 1)) {
        return;
      }
      lastProgress = progress;

      const ease = 1 - Math.pow(1 - progress, 2.6);
      const lift = (1 - ease) * (mobile ? 170 : 320);
      const scale = 0.88 + ease * 0.12;
      const growPad = mobile ? 14 + ease * 36 : 28 + ease * 72;

      // Start inset on the sides, expand out to full width while scrolling
      const inset = (1 - ease) * (mobile ? 18 : 72);
      const radius = (1 - ease) * (mobile ? 16 : 28);

      shell.style.marginInline = `${inset}px`;
      shell.style.borderRadius = `${radius}px`;
      shell.style.borderWidth = ease > 0.92 ? "0px" : "1px";

      panel.style.transform = `translate3d(0, ${lift}px, 0) scale(${scale})`;
      panel.style.opacity = String(0.35 + ease * 0.65);
      panel.style.paddingTop = `${growPad}px`;
      panel.style.paddingBottom = `${growPad}px`;

      const items = listRef.current?.querySelectorAll<HTMLElement>(
        "[data-project-item]",
      );
      items?.forEach((item, index) => {
        const staggered = Math.min(
          Math.max((progress - index * (mobile ? 0.08 : 0.1)) / 0.55, 0),
          1,
        );
        const itemEase = 1 - Math.pow(1 - staggered, 2.2);
        const itemLift = (1 - itemEase) * (mobile ? 72 : 120);

        item.style.transform = `translate3d(0, ${itemLift}px, 0)`;
        item.style.opacity = String(itemEase);
      });
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
        style={{ marginInline: "72px", borderRadius: "28px" }}
      >
        <div
          ref={panelRef}
          className="projects-panel mx-auto max-w-5xl origin-top px-4 will-change-transform sm:px-10 lg:px-16"
          style={{
            transform: "translate3d(0, 260px, 0) scale(0.88)",
            opacity: 0.28,
          }}
        >
          <div className="mb-8 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">{heading}</div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-ink-soft/80">
              {String(projects.length).padStart(2, "0")} selected
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="min-h-36 border border-dashed border-line px-4 py-12 sm:min-h-48 sm:px-10 sm:py-16" />
          ) : (
            <ul ref={listRef} className="flex flex-col gap-3 sm:gap-4">
              {projects.map((project, index) => (
                <li
                  key={project.href + project.title}
                  data-project-item
                  className="will-change-transform"
                  style={{ opacity: 0, transform: "translate3d(0, 100px, 0)" }}
                >
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col gap-4 border border-line bg-[rgba(255,255,255,0.55)] px-4 py-5 transition-colors hover:border-brand/25 hover:bg-white sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-6 sm:py-6"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-0 bg-signal transition-[width] duration-300 group-hover:w-1"
                    />
                    <div className="flex min-w-0 items-start gap-4 sm:gap-5">
                      <span className="mt-1 font-display text-sm font-semibold tracking-wide text-brand/55 sm:text-base">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-xl font-semibold tracking-tight text-ink transition-colors group-hover:text-brand sm:text-2xl">
                          {project.title}
                        </h3>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-ink-soft sm:text-base">
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-2 self-start text-sm font-semibold tracking-wide text-signal transition-transform duration-300 group-hover:translate-x-1 sm:self-center">
                      Visit
                      <span aria-hidden="true">→</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
