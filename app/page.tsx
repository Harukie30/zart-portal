import { BrandLogo } from "@/components/brand-logo";
import { HeroSection } from "@/components/hero-section";
import { PortalStage } from "@/components/portal-stage";
import { ProjectsSection } from "@/components/projects-section";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { SocialIcon } from "@/components/social-icon";
import { projects } from "@/lib/projects";
import { socialLinks } from "@/lib/socials";

const PORTFOLIO_URL = "https://amadeus-mozart.netlify.app/";

export default function Home() {
  return (
    <PortalStage>
      <div id="top" className="flex min-w-0 flex-1 flex-col">
        <SiteHeader />

        <HeroSection>
          <h1 className="animate-rise-delay-1 origin-left scale-95 font-display text-[clamp(2.55rem,13vw,8.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-balance text-paper">
            Vision Engine
          </h1>
          <p className="animate-rise-delay-2 mt-5 max-w-xl text-base leading-relaxed text-pretty text-paper/80 sm:mt-8 sm:text-xl">
            Building ideas into interactive experiences.
          </p>
          <div className="animate-rise-delay-3 mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-12 w-full items-center justify-center gap-3 bg-signal px-6 py-3.5 text-sm font-semibold tracking-wide text-paper transition-colors hover:bg-signal-hover sm:w-auto"
            >
              Open portfolio
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href="#projects"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 border border-paper/25 px-6 py-3.5 text-sm font-medium text-paper/85 transition-colors hover:border-paper/50 hover:text-paper sm:w-auto"
            >
              Browse projects
            </a>
          </div>
        </HeroSection>

        <ProjectsSection
          projects={projects}
          heading={
            <>
              <h2 className="font-display text-[2rem] font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
                Projects
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-pretty text-ink-soft sm:mt-4 sm:text-base md:text-lg">
                Selected builds and experiments. Open any project to explore it
                live.
              </p>
            </>
          }
        />

      <footer className="relative overflow-hidden bg-brand-deep pb-[env(safe-area-inset-bottom)] text-paper">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 100% 0%, rgba(196, 92, 38, 0.22), transparent 55%), radial-gradient(ellipse 50% 60% at 0% 100%, rgba(238, 242, 244, 0.08), transparent 50%)",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-10 sm:py-14 lg:px-16">
          <Reveal>
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
              <div className="max-w-md">
                <div className="flex items-center gap-3 sm:gap-4">
                  <BrandLogo onDark className="size-12 sm:size-14" />
                  <p className="font-display text-[1.75rem] font-bold tracking-tight sm:text-3xl md:text-4xl">
                    Vision Engine
                  </p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-pretty text-paper/70 sm:text-base">
                  Building ideas into interactive experiences.
                </p>

                <div className="mt-6">
                  <p className="text-xs font-medium tracking-[0.16em] uppercase text-paper/45">
                    Connect
                  </p>
                  <ul className="mt-3 flex flex-wrap items-center gap-2.5">
                    {socialLinks.map((social) => {
                      const isExternal = social.href.startsWith("http");

                      return (
                        <li key={social.id}>
                          <a
                            href={social.href}
                            {...(isExternal
                              ? {
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                }
                              : {})}
                            aria-label={social.label}
                            className="social-icon"
                          >
                            <SocialIcon id={social.id} className="social-icon__glyph" />
                            <span className="social-icon__label" aria-hidden="true">
                              {social.label}
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <nav aria-label="Footer">
                <p className="text-xs font-medium tracking-[0.16em] uppercase text-paper/45">
                  Explore
                </p>
                <ul className="mt-3 flex flex-col gap-1">
                  <li>
                    <a
                      href="#projects"
                      className="inline-flex min-h-11 items-center text-sm font-medium text-paper/75 transition-colors hover:text-paper"
                    >
                      Projects
                    </a>
                  </li>
                  <li>
                    <a
                      href={PORTFOLIO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-paper/75 transition-colors hover:text-paper"
                    >
                      Portfolio
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#top"
                      className="inline-flex min-h-11 items-center text-sm font-medium text-paper/75 transition-colors hover:text-paper"
                    >
                      Back to top
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </Reveal>

          <Reveal delayMs={100}>
            <div className="mt-10 flex flex-col gap-2 border-t border-paper/15 pt-6 text-xs text-paper/50 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-8 sm:text-sm">
              <p>
                © {new Date().getFullYear()} Vision Engine. All rights reserved.
              </p>
              <p className="tracking-wide">Frontend · Design · Interaction</p>
            </div>
          </Reveal>
        </div>
      </footer>
      </div>
    </PortalStage>
  );
}
