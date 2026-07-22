"use client";

import { useEffect, useRef } from "react";

export function HeroBackground() {
  const planeRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    let frame = 0;

    const update = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      const isMobile = window.innerWidth < 640;
      const shift = isMobile ? 18 : 30;
      const scale = isMobile ? 0.06 : 0.1;
      const fade = isMobile ? 0.35 : 0.5;

      if (planeRef.current) {
        planeRef.current.style.transform = `translate3d(0, ${progress * shift}%, 0) scale(${1 + progress * scale})`;
        planeRef.current.style.opacity = String(1 - progress * fade);
      }

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${progress * (isMobile ? -6 : -10)}%, ${progress * (isMobile ? 14 : 22)}%, 0)`;
      }

      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(0, ${progress * (isMobile ? 12 : 20)}%, 0)`;
        gridRef.current.style.opacity = String(0.14 * (1 - progress * 0.85));
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <div
        ref={planeRef}
        className="hero-plane absolute inset-[-12%] will-change-transform"
        aria-hidden="true"
      />
      <div
        ref={glowRef}
        className="pointer-events-none absolute -left-1/3 top-[-10%] h-[55%] w-[90%] will-change-transform sm:-left-1/4 sm:top-[-20%] sm:h-[70%] sm:w-[70%]"
        aria-hidden="true"
      >
        <div className="hero-glow h-full w-full rounded-full bg-[radial-gradient(circle,rgba(238,242,244,0.14),transparent_65%)] blur-2xl" />
      </div>
      <div
        ref={gridRef}
        className="hero-grid pointer-events-none absolute inset-0 opacity-[0.14] will-change-transform"
        aria-hidden="true"
      />
    </>
  );
}
