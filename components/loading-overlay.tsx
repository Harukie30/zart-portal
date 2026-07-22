"use client";

import { BrandLogo } from "@/components/brand-logo";

type LoadingOverlayProps = {
  mode: "enter" | "leave";
  exiting?: boolean;
};

export function LoadingOverlay({ mode, exiting = false }: LoadingOverlayProps) {
  const label = mode === "enter" ? "Entering portal" : "Leaving portal";
  const detail =
    mode === "enter"
      ? "Vision Engine is preparing your experience"
      : "Taking you to the next destination";

  return (
    <div
      className={`loading-overlay ${exiting ? "is-exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-busy={!exiting}
    >
      <div className="loading-overlay__glow" aria-hidden="true" />

      <div className="loading-overlay__content">
        <div className="loading-overlay__mark">
          <BrandLogo onDark className="size-16 sm:size-20" priority />
        </div>

        <p className="loading-overlay__brand font-display">Vision Engine</p>
        <p className="loading-overlay__label">{label}</p>
        <p className="loading-overlay__detail">{detail}</p>

        <div className="loading-overlay__bar" aria-hidden="true">
          <span className="loading-overlay__bar-fill" />
        </div>
      </div>
    </div>
  );
}
