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
  orientation?: "horizontal" | "vertical";
};

const slides = [...techIcons, ...techIcons];

export function TechCarousel({
  className = "",
  orientation = "vertical",
}: TechCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const isVertical = orientation === "vertical";

  useEffect(() => {
    if (!api) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const updateFocus = () => {
      const root = api.rootNode().getBoundingClientRect();
      const span = isVertical ? root.height : root.width;
      if (span <= 0) return;

      const center = isVertical
        ? root.top + root.height / 2
        : root.left + root.width / 2;

      api.slideNodes().forEach((slide) => {
        const icon = slide.querySelector<HTMLElement>("[data-tech-icon]");
        if (!icon) return;

        const rect = slide.getBoundingClientRect();
        const slideCenter = isVertical
          ? rect.top + rect.height / 2
          : rect.left + rect.width / 2;
        const distance = Math.abs(slideCenter - center) / span;
        const focus = Math.max(0, 1 - distance * 4.6);

        if (reduceMotion) {
          icon.style.transform = focus > 0.82 ? "scale(1)" : "scale(0.55)";
          icon.style.opacity = focus > 0.82 ? "0.9" : "0.08";
          return;
        }

        const scale = 0.42 + focus * 0.66;
        const opacity = 0.04 + focus * 0.9;
        icon.style.transform = `scale(${scale})`;
        icon.style.opacity = String(opacity);
      });
    };

    const onResize = () => {
      api.reInit();
      updateFocus();
    };

    updateFocus();
    api.on("scroll", updateFocus);
    api.on("select", updateFocus);
    api.on("reInit", updateFocus);
    window.addEventListener("resize", onResize);

    let autoplay = 0;
    if (!reduceMotion) {
      autoplay = window.setInterval(() => {
        api.scrollNext();
      }, 2200);
    }

    return () => {
      api.off("scroll", updateFocus);
      api.off("select", updateFocus);
      api.off("reInit", updateFocus);
      window.removeEventListener("resize", onResize);
      window.clearInterval(autoplay);
    };
  }, [api, isVertical]);

  return (
    <div
      className={cn(
        "tech-carousel relative isolate overflow-hidden",
        isVertical ? "tech-carousel--vertical" : "tech-carousel--horizontal",
        className,
      )}
    >
      <Carousel
        orientation={orientation}
        opts={{
          align: "center",
          loop: true,
          skipSnaps: false,
          dragFree: false,
        }}
        setApi={setApi}
        className="tech-carousel__track h-full w-full"
        aria-label="Technologies used"
      >
        <CarouselContent
          className={isVertical ? "-mt-2 sm:-mt-5" : "-ml-3 sm:-ml-4"}
        >
          {slides.map((icon, index) => (
            <CarouselItem
              key={`${icon.id}-${index}`}
              className={
                isVertical
                  ? "basis-1/3 pt-2 sm:basis-1/4 sm:pt-5"
                  : "basis-1/3 pl-3 sm:basis-1/4 sm:pl-4"
              }
            >
              <div
                className={cn(
                  "flex h-full items-center justify-center",
                  !isVertical && "py-1",
                )}
              >
                <div
                  data-tech-icon
                  className="tech-carousel__icon flex items-center justify-center"
                >
                  <Image
                    src={icon.src}
                    alt=""
                    width={256}
                    height={256}
                    className={
                      isVertical
                        ? "size-9 object-contain sm:size-40 lg:size-44"
                        : "size-12 object-contain sm:size-14"
                    }
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {isVertical ? (
        <>
          <div
            className="tech-carousel__edge tech-carousel__edge--top"
            aria-hidden="true"
          />
          <div
            className="tech-carousel__edge tech-carousel__edge--bottom"
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          <div
            className="tech-carousel__edge tech-carousel__edge--start"
            aria-hidden="true"
          />
          <div
            className="tech-carousel__edge tech-carousel__edge--end"
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
}
