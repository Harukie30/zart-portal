import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  /** Lightens grey strokes so the mark reads on dark backgrounds */
  onDark?: boolean;
};

export function BrandLogo({
  className = "size-10 sm:size-11",
  priority = false,
  onDark = false,
}: BrandLogoProps) {
  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      <Image
        src="/logo-main.png"
        alt=""
        width={600}
        height={600}
        priority={priority}
        className={`h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 ${
          onDark ? "brightness-125 contrast-90" : ""
        }`}
      />
    </span>
  );
}
