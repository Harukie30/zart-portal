"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";

const PORTFOLIO_URL = "https://amadeus-mozart.netlify.app/";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 24);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300 ${
        scrolled
          ? "border-b border-brand/10 bg-paper/85 shadow-[0_8px_30px_rgba(16,34,42,0.06)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:px-10 sm:pb-4 sm:pt-[max(1rem,env(safe-area-inset-top))] lg:px-16">
        <a
          href="#top"
          className="group flex min-w-0 items-center gap-2.5 animate-rise sm:gap-3"
          aria-label="Vision Engine home"
        >
          <BrandLogo
            priority
            onDark={!scrolled}
            className="size-9 sm:size-11"
          />
          <span className="min-w-0">
            <span
              className={`block truncate font-display text-base font-bold tracking-tight transition-colors sm:text-lg ${
                scrolled ? "text-ink" : "text-paper"
              }`}
            >
              Vision Engine
            </span>
            <span
              className={`mt-0.5 hidden text-[0.65rem] tracking-[0.16em] uppercase transition-colors sm:block ${
                scrolled ? "text-ink-soft" : "text-paper/55"
              }`}
            >
              Interactive experiences
            </span>
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="animate-rise flex items-center gap-1 sm:gap-2"
        >
          <a
            href="#projects"
            className={`inline-flex min-h-10 items-center px-3 text-sm font-medium transition-colors ${
              scrolled
                ? "text-ink-soft hover:text-ink"
                : "text-paper/75 hover:text-paper"
            }`}
          >
            Projects
          </a>
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`group inline-flex min-h-10 items-center gap-1.5 px-3 text-sm font-semibold transition-colors sm:min-h-11 sm:px-4 ${
              scrolled
                ? "bg-brand text-paper hover:bg-brand-deep"
                : "bg-paper/12 text-paper ring-1 ring-paper/25 hover:bg-paper/18"
            }`}
          >
            Portfolio
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              ↗
            </span>
          </a>
        </nav>
      </div>
    </header>
  );
}
