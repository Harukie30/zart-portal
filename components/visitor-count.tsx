"use client";

import { useEffect, useState } from "react";

let visitRequest: Promise<number> | null = null;

function recordVisit() {
  if (!visitRequest) {
    visitRequest = fetch("/api/visits", { method: "POST", cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("visit count failed");
        return response.json() as Promise<{ count?: number }>;
      })
      .then((data) => {
        if (typeof data.count !== "number") throw new Error("invalid count");
        return data.count;
      })
      .catch((error) => {
        visitRequest = null;
        throw error;
      });
  }

  return visitRequest;
}

export function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;

    recordVisit()
      .then((next) => {
        if (!ignore) setCount(next);
      })
      .catch(() => {
        if (!ignore) setCount(null);
      });

    return () => {
      ignore = true;
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
