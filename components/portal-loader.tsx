"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { LoadingOverlay } from "@/components/loading-overlay";

type PortalLoaderContextValue = {
  ready: boolean;
  leaveTo: (href: string, options?: { newTab?: boolean }) => void;
};

const PortalLoaderContext = createContext<PortalLoaderContextValue | null>(
  null,
);

export function usePortalLoader() {
  const context = useContext(PortalLoaderContext);
  if (!context) {
    throw new Error("usePortalLoader must be used within PortalLoader");
  }
  return context;
}

type PortalLoaderProps = {
  children: ReactNode;
};

export function PortalLoader({ children }: PortalLoaderProps) {
  const [visible, setVisible] = useState(true);
  const [mode, setMode] = useState<"enter" | "leave">("enter");
  const [exiting, setExiting] = useState(false);
  const [ready, setReady] = useState(false);
  const leavingRef = useRef(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const minVisibleMs = reduceMotion ? 200 : 1400;
    const fadeMs = reduceMotion ? 120 : 520;
    let hideTimer = 0;
    let safetyTimer = 0;
    let finished = false;

    const finishEnter = () => {
      if (finished) return;
      finished = true;

      window.setTimeout(() => {
        setExiting(true);
        hideTimer = window.setTimeout(() => {
          setVisible(false);
          setExiting(false);
          setReady(true);
          document.documentElement.classList.add("portal-ready");
        }, fadeMs);
      }, minVisibleMs);
    };

    if (document.readyState === "complete") {
      finishEnter();
    } else {
      window.addEventListener("load", finishEnter, { once: true });
      safetyTimer = window.setTimeout(finishEnter, 2200);
    }

    return () => {
      window.removeEventListener("load", finishEnter);
      window.clearTimeout(hideTimer);
      window.clearTimeout(safetyTimer);
      document.documentElement.classList.remove("portal-loading");
      document.documentElement.classList.remove("portal-ready");
    };
  }, []);

  useEffect(() => {
    if (visible) {
      document.documentElement.classList.add("portal-loading");
    } else {
      document.documentElement.classList.remove("portal-loading");
    }
  }, [visible]);

  const leaveTo = useCallback((href: string, options?: { newTab?: boolean }) => {
    if (leavingRef.current) return;
    leavingRef.current = true;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const holdMs = reduceMotion ? 150 : 780;
    const fadeMs = reduceMotion ? 100 : 450;
    const isMailOrTel =
      href.startsWith("mailto:") || href.startsWith("tel:");
    const newTab =
      options?.newTab ?? (href.startsWith("http") && !isMailOrTel);

    setMode("leave");
    setExiting(false);
    setVisible(true);

    window.setTimeout(() => {
      if (newTab) {
        window.open(href, "_blank", "noopener,noreferrer");
        setExiting(true);
        window.setTimeout(() => {
          setVisible(false);
          setExiting(false);
          leavingRef.current = false;
        }, fadeMs);
        return;
      }

      window.location.assign(href);
    }, holdMs);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = (event.target as Element | null)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const isMailOrTel =
        href.startsWith("mailto:") || href.startsWith("tel:");
      const opensBlank = target.getAttribute("target") === "_blank";
      const isExternal =
        href.startsWith("http") || opensBlank || isMailOrTel;

      if (!isExternal) return;

      event.preventDefault();
      leaveTo(href, {
        newTab: opensBlank && !isMailOrTel,
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [leaveTo]);

  return (
    <PortalLoaderContext.Provider value={{ ready, leaveTo }}>
      {children}
      {visible ? <LoadingOverlay mode={mode} exiting={exiting} /> : null}
    </PortalLoaderContext.Provider>
  );
}
