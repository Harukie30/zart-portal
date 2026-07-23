"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { techIcons } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";

type TechCarouselProps = {
  className?: string;
};

export function TechCarousel({ className = "" }: TechCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const id = window.setInterval(() => {
      api.scrollNext();
    }, 2200);

    return () => window.clearInterval(id);
  }, [api]);

  return (
    <Carousel
      orientation="vertical"
      opts={{
        align: "start",
        loop: true,
        skipSnaps: false,
        dragFree: false,
      }}
      setApi={setApi}
      className={cn("h-full w-20 sm:w-32 lg:w-40", className)}
      aria-label="Technologies used"
    >
      <CarouselContent className="-mt-4">
        {/* Duplicate once so vertical loop feels continuous */}
        {[...techIcons, ...techIcons].map((icon, index) => (
          <CarouselItem
            key={`${icon.id}-${index}`}
            className="basis-1/3 pt-4"
          >
            <div className="flex h-full items-center justify-center opacity-40">
              <Image
                src={icon.src}
                alt=""
                width={160}
                height={160}
                className="size-16 object-contain sm:size-24 lg:size-28"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
