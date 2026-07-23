"use client";

import { useEffect, useRef } from "react";

export function HeroBackground() {
  const planeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    let frame = 0;
    let mobile = window.innerWidth < 640;
    let settled = false;

    const update = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1);

      // Past the hero: apply the final state once, then stop touching the DOM
      if (progress >= 1) {
        if (settled || !planeRef.current) return;
        settled = true;
        planeRef.current.style.transform = `translate3d(0, ${mobile ? 18 : 30}%, 0) scale(${1 + (mobile ? 0.06 : 0.1)})`;
        planeRef.current.style.opacity = String(1 - (mobile ? 0.35 : 0.5));
        return;
      }

      settled = false;
      const shift = mobile ? 18 : 30;
      const scale = mobile ? 0.06 : 0.1;
      const fade = mobile ? 0.35 : 0.5;

      if (planeRef.current) {
        planeRef.current.style.transform = `translate3d(0, ${progress * shift}%, 0) scale(${1 + progress * scale})`;
        planeRef.current.style.opacity = String(1 - progress * fade);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    const onResize = () => {
      mobile = window.innerWidth < 640;
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
    <>
      <div
        ref={planeRef}
        className="hero-plane absolute inset-[-12%] will-change-transform"
        aria-hidden="true"
      />
      {/* Glow stays CSS-only — no scroll transforms (avoids fighting the drift animation) */}
      <div
        className="pointer-events-none absolute -left-1/3 top-[-10%] h-[55%] w-[90%] sm:-left-1/4 sm:top-[-20%] sm:h-[70%] sm:w-[70%]"
        aria-hidden="true"
      >
        <div className="hero-glow h-full w-full rounded-full" />
      </div>
      <div
        className="hero-grid pointer-events-none absolute inset-0 opacity-[0.14]"
        aria-hidden="true"
      />
    </>
  );
}
