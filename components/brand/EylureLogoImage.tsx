import Image from "next/image";

/** Intrinsic size of `public/eylure-logo.png` (Eylure Logo 4). */
const LOGO_WIDTH = 1921;
const LOGO_HEIGHT = 416;

interface EylureLogoImageProps {
  priority?: boolean;
  className?: string;
}

/** Eylure London logo — transparent PNG (`public/eylure-logo.png`). */
export default function EylureLogoImage({
  priority = false,
  className = "h-auto w-[min(72vw,240px)] max-w-full",
}: EylureLogoImageProps) {
  return (
    <Image
      src="/eylure-logo.png"
      alt="Eylure London"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={className}
    />
  );
}
