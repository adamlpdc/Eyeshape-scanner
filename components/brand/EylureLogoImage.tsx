import Image from "next/image";

interface EylureLogoImageProps {
  priority?: boolean;
  className?: string;
}

/** Raster Eylure logo — use mix-blend-lighten on pink until a transparent PNG is available. */
export default function EylureLogoImage({
  priority = false,
  className = "h-auto w-[min(68vw,200px)] max-w-full mix-blend-lighten",
}: EylureLogoImageProps) {
  return (
    <Image
      src="/eylure-logo-white.png"
      alt="Eylure London"
      width={280}
      height={80}
      priority={priority}
      className={className}
    />
  );
}
