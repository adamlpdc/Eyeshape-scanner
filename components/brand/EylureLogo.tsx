import { EYLURE_COLORS } from "@/constants/eylure-brand";

interface EylureLogoProps {
  className?: string;
  variant?: "light" | "dark";
}

export default function EylureLogo({
  className = "",
  variant = "light",
}: EylureLogoProps) {
  const fg = variant === "light" ? EYLURE_COLORS.white : EYLURE_COLORS.ink;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center gap-2.5">
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          aria-hidden
        >
          <rect
            x="1"
            y="1"
            width="34"
            height="34"
            stroke={fg}
            strokeWidth="1.5"
          />
          <path
            d="M11 26V10h5.5c4 0 6.5 2.2 6.5 5.5 0 2.2-1.2 4-3.2 4.8L24 26h-4l-3.8-5.2H15v5.2h-4Z"
            fill={fg}
          />
        </svg>
        <div className="text-left leading-none">
          <p
            className="text-[1.35rem] font-bold tracking-[0.2em]"
            style={{ color: fg }}
          >
            EYLURE
          </p>
          <p
            className="mt-0.5 text-[0.55rem] font-medium tracking-[0.35em]"
            style={{ color: fg, opacity: variant === "light" ? 0.95 : 0.7 }}
          >
            LONDON
          </p>
        </div>
      </div>
    </div>
  );
}
