"use client";

import type { ReactNode } from "react";
import { usePortalLoader } from "@/components/portal-loader";

type PortalStageProps = {
  children: ReactNode;
};

export function PortalStage({ children }: PortalStageProps) {
  const { ready } = usePortalLoader();
  const stageClass = ready ? "portal-stage is-live" : "portal-stage";

  return <div className={stageClass}>{children}</div>;
}
