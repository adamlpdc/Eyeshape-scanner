interface EylureLogoProps {
  className?: string;
}

/**
 * Vector logo — no raster background. White mark for pink screens.
 */
export default function EylureLogo({ className = "w-[200px]" }: EylureLogoProps) {
  return (
    <svg
      viewBox="0 0 320 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Eylure London"
    >
      <rect
        x="1"
        y="1"
        width="52"
        height="52"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <path
        fill="white"
        d="M14 46V18h9.2c6.8 0 11 3.6 11 9.2 0 3.6-2 6.4-5.2 7.6L38 46h-7.2l-6.4-8.8H21.2V46H14Zm7.2-14.8h4.8c2.8 0 4.4-1.4 4.4-3.8s-1.6-3.6-4.4-3.6h-4.8v7.4Z"
      />
      <text
        x="72"
        y="38"
        fill="white"
        fontFamily="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        fontSize="28"
        fontWeight="700"
        letterSpacing="0.2em"
      >
        EYLURE
      </text>
      <text
        x="72"
        y="58"
        fill="white"
        fontFamily="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        fontSize="11"
        fontWeight="500"
        letterSpacing="0.42em"
      >
        LONDON
      </text>
    </svg>
  );
}
