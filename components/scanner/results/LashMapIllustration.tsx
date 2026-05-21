import { EYLURE_BRAND } from "@/constants/brand";
import { LASH_MAP_PROFILES } from "@/constants/lash-map-profiles";
import type { EyeShape } from "@/types/classification";

interface LashMapIllustrationProps {
  eyeShape: EyeShape;
  label: string;
}

const CLUSTER_X = [62, 84, 106, 128, 150, 172, 194, 216, 238] as const;
const LASH_BASE_Y = 72;

function lashStroke(
  x: number,
  height: number,
  tilt: number,
  variant: 0 | 1,
): string {
  const spread = variant === 0 ? -2.5 : 2.5;
  const x0 = x + spread;
  const xEnd = x0 + tilt * 1.6;
  const yEnd = LASH_BASE_Y - height;
  const c1x = x0 + tilt * 0.5;
  const c1y = LASH_BASE_Y - height * 0.45;
  const c2x = xEnd;
  const c2y = LASH_BASE_Y - height * 0.82;
  return `M ${x0} ${LASH_BASE_Y} C ${c1x} ${c1y} ${c2x} ${c2y} ${xEnd} ${yEnd}`;
}

function emphasisZone(emphasis: (typeof LASH_MAP_PROFILES)[EyeShape]["emphasis"]) {
  switch (emphasis) {
    case "inner":
      return { x: 52, width: 88 };
    case "center":
      return { x: 108, width: 84 };
    case "outer":
      return { x: 168, width: 88 };
    default:
      return { x: 88, width: 124 };
  }
}

export default function LashMapIllustration({
  eyeShape,
  label,
}: LashMapIllustrationProps) {
  const profile = LASH_MAP_PROFILES[eyeShape];
  const zone = emphasisZone(profile.emphasis);
  const gradientId = `lashGrad-${eyeShape}`;
  const glowId = `lashGlow-${eyeShape}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8c4cc]/80 bg-gradient-to-b from-[#fff9fb] via-[#fff5f8] to-[#fce8ee] p-5 shadow-inner">
      <svg
        viewBox="0 0 300 148"
        className="mx-auto w-full"
        role="img"
        aria-label={`${label} lash placement guide`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#c41b6a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#c41b6a" stopOpacity="1" />
          </linearGradient>
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Zone guides */}
        <rect
          x="48"
          y="18"
          width="68"
          height="108"
          rx="12"
          fill={EYLURE_BRAND.resultsPink}
          fillOpacity="0.06"
        />
        <rect
          x="116"
          y="18"
          width="68"
          height="108"
          rx="12"
          fill={EYLURE_BRAND.resultsPink}
          fillOpacity="0.06"
        />
        <rect
          x="184"
          y="18"
          width="68"
          height="108"
          rx="12"
          fill={EYLURE_BRAND.resultsPink}
          fillOpacity="0.06"
        />

        <rect
          x={zone.x}
          y="24"
          width={zone.width}
          height="96"
          rx="14"
          fill={EYLURE_BRAND.resultsPink}
          fillOpacity="0.14"
          stroke={EYLURE_BRAND.resultsPink}
          strokeOpacity="0.35"
          strokeWidth="1"
          strokeDasharray="4 3"
        />

        {/* Eye silhouette */}
        <path
          d="M 52 78 Q 150 52 248 78 Q 150 88 52 78 Z"
          fill="#fff0f3"
          stroke="#2f2435"
          strokeOpacity="0.12"
          strokeWidth="1"
        />
        <path
          d="M 58 74 Q 150 48 242 74"
          fill="none"
          stroke="#2f2435"
          strokeOpacity="0.22"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Lash clusters */}
        {profile.lengths.map((height, i) => (
          <g key={i} filter={`url(#${glowId})`}>
            <path
              d={lashStroke(CLUSTER_X[i], height, profile.tilts[i], 0)}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            <path
              d={lashStroke(CLUSTER_X[i], height * 0.92, profile.tilts[i], 1)}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeOpacity="0.75"
            />
          </g>
        ))}

        {/* Zone labels */}
        {[
          { x: 82, text: "Inner" },
          { x: 150, text: "Centre" },
          { x: 218, text: "Outer" },
        ].map(({ x, text }) => (
          <text
            key={text}
            x={x}
            y="132"
            textAnchor="middle"
            fill="#5c4a62"
            fillOpacity="0.65"
            fontSize="10"
            fontWeight="500"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="0.04em"
          >
            {text}
          </text>
        ))}
      </svg>

      <p className="mt-4 text-center text-sm font-semibold text-[#2f2435]">
        {label}
      </p>
      <p className="mt-1.5 text-center text-xs leading-relaxed text-[#5c4a62]/85">
        {profile.tip}
      </p>
    </div>
  );
}
