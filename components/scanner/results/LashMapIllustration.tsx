interface LashMapIllustrationProps {
  label: string;
}

export default function LashMapIllustration({ label }: LashMapIllustrationProps) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-rose-200/20 bg-gradient-to-br from-rose-950/40 via-[#1a1218] to-[#120f14] p-5"
      aria-label={`${label} illustration placeholder`}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-rose-300/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-amber-200/10 blur-3xl"
        aria-hidden
      />

      <svg
        viewBox="0 0 280 120"
        className="mx-auto w-full max-w-[280px]"
        role="img"
        aria-hidden
      >
        <defs>
          <linearGradient id="lashGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#fda4af" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        <ellipse
          cx="140"
          cy="68"
          rx="88"
          ry="34"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
        />

        <path
          d="M 58 68 Q 140 42 222 68"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.25"
        />

        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
          const x = 72 + i * 18;
          const heights = [14, 18, 24, 30, 32, 30, 24, 18, 14];
          const h = heights[i] ?? 20;
          return (
            <line
              key={i}
              x1={x}
              y1={58}
              x2={x}
              y2={58 - h}
              stroke="url(#lashGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity={0.55 + (i === 4 ? 0.35 : i === 3 || i === 5 ? 0.2 : 0)}
            />
          );
        })}

        <text
          x="52"
          y="102"
          fill="rgba(255,255,255,0.35)"
          fontSize="9"
          fontFamily="system-ui, sans-serif"
        >
          Inner
        </text>
        <text
          x="128"
          y="102"
          fill="rgba(255,255,255,0.35)"
          fontSize="9"
          fontFamily="system-ui, sans-serif"
        >
          Center
        </text>
        <text
          x="210"
          y="102"
          fill="rgba(255,255,255,0.35)"
          fontSize="9"
          fontFamily="system-ui, sans-serif"
        >
          Outer
        </text>

        <rect
          x="52"
          y="14"
          width="48"
          height="6"
          rx="3"
          fill="rgba(253,164,175,0.25)"
        />
        <rect
          x="116"
          y="14"
          width="48"
          height="6"
          rx="3"
          fill="rgba(253,164,175,0.45)"
        />
        <rect
          x="180"
          y="14"
          width="48"
          height="6"
          rx="3"
          fill="rgba(253,164,175,0.7)"
        />
      </svg>

      <p className="mt-3 text-center text-[11px] font-medium tracking-wide text-rose-200/50 uppercase">
        {label}
      </p>
    </div>
  );
}
