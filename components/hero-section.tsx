"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { HeroBackground } from "@/components/hero-background";
import { TechCarousel } from "@/components/tech-carousel";

type HeroSectionProps = {
  children: ReactNode;
};

export function HeroSection({ children }: HeroSectionProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    setLayoutReady(true);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    let frame = 0;
    let mobile = window.innerWidth < 640;
    let tablet = window.innerWidth < 1024;
    let settled = false;

    const apply = (progress: number) => {
      const textX = progress * (mobile ? 18 : tablet ? 48 : 72);
      const imageX = progress * (mobile ? 28 : tablet ? 64 : 96);
      const imageY = mobile ? progress * 12 : 0;
      const fade = 1 - progress * (mobile ? 0.28 : 0.5);

      if (textRef.current) {
        textRef.current.style.transform = `translate3d(-${textX}px, 0, 0)`;
        textRef.current.style.opacity = String(
          Math.max(fade, mobile ? 0.55 : 0.22),
        );
      }

      if (imageRef.current) {
        const baseY = mobile ? 0 : -50;
        imageRef.current.style.transform = mobile
          ? `translate3d(${imageX}px, ${imageY}px, 0)`
          : `translate3d(${imageX}px, ${baseY}%, 0)`;
        imageRef.current.style.opacity = String(
          Math.max((mobile ? 0.55 : 0.9) * fade, mobile ? 0.2 : 0.15),
        );
      }
    };

    const update = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1);

      if (progress >= 1) {
        if (settled) return;
        settled = true;
        apply(1);
        return;
      }

      settled = false;
      apply(progress);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    const onResize = () => {
      mobile = window.innerWidth < 640;
      tablet = window.innerWidth < 1024;
      settled = false;
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
  }, []);

  return (
    <section className="portal-hero relative flex min-h-[100svh] flex-col overflow-hidden text-paper contain-paint">
      <HeroBackground />

      {/* Desktop: vertical tech stack beside logo. Mobile: logo only. */}
      <div
        ref={imageRef}
        className="pointer-events-none absolute z-[5] will-change-transform top-[max(5.25rem,calc(4rem+env(safe-area-inset-top)))] right-2 opacity-55 sm:top-1/2 sm:right-4 sm:opacity-95 lg:right-8"
        aria-hidden="true"
      >
        <div className="flex items-center gap-2 animate-rise-delay-2 sm:gap-8 lg:gap-10">
          {layoutReady && !isMobile ? (
            <TechCarousel className="h-[min(88vw,54rem)] w-56 -translate-x-3 lg:h-[min(78vw,58rem)] lg:w-64 lg:-translate-x-5" />
          ) : null}
          <BrandLogo
            priority
            onDark
            className="hero-corner-logo size-16 sm:size-[min(42vw,20rem)] lg:size-[min(36vw,22rem)]"
          />
        </div>
      </div>

      <main className="relative z-10 flex flex-1 flex-col justify-center px-4 pr-20 pb-[max(4rem,calc(3rem+env(safe-area-inset-bottom)))] pt-[max(5.5rem,calc(4.5rem+env(safe-area-inset-top)))] sm:px-10 sm:pr-10 sm:pb-20 sm:pt-28 lg:px-16">
        <div
          ref={textRef}
          className="relative z-10 max-w-[min(100%,20rem)] will-change-transform sm:max-w-[min(100%,34rem)] md:max-w-[min(100%,40rem)] lg:max-w-3xl"
        >
          {children}
          {layoutReady && isMobile ? (
            <div className="animate-rise-delay-3 mt-8">
              <p className="mb-3 text-[0.65rem] font-medium tracking-[0.16em] uppercase text-paper/45">
                Built with
              </p>
              <TechCarousel orientation="horizontal" className="h-16 w-full" />
            </div>
          ) : null}
        </div>
      </main>
    </section>
  );
}
