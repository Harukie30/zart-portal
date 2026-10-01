"use client";

import { useEffect, useState } from "react";

export function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const visitKey = "ve-visit-posted";
    const alreadyPosted = sessionStorage.getItem(visitKey) === "1";

    if (!alreadyPosted) {
      sessionStorage.setItem(visitKey, "1");
    }

    fetch("/api/visits", { method: alreadyPosted ? "GET" : "POST" })
      .then((response) => {
        if (!response.ok) throw new Error("visit count failed");
        return response.json() as Promise<{ count?: number }>;
      })
      .then((data) => {
        if (cancelled || typeof data.count !== "number") return;
        setCount(data.count);
      })
      .catch(() => {
        if (!alreadyPosted) sessionStorage.removeItem(visitKey);
        if (!cancelled) setCount(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const shown = count ?? 0;
  const label = shown === 1 ? "visitor" : "visitors";

  return (
    <p className="inline-flex items-center gap-2.5 border border-paper/25 bg-paper/10 px-3.5 py-2 text-paper">
      <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
      <span className="font-display text-lg font-bold tabular-nums leading-none tracking-tight">
        {shown.toLocaleString()}
      </span>
      <span className="text-sm font-medium tracking-wide text-paper/75">
        {label}
      </span>
    </p>
  );
}
