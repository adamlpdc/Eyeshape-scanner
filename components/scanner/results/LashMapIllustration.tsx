interface LashMapIllustrationProps {
  label: string;
}

export default function LashMapIllustration({ label }: LashMapIllustrationProps) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-[#e8c4cc] bg-gradient-to-br from-[#fff5f8] to-[#fce8ee] p-4"
      aria-label={`${label} illustration placeholder`}
    >
      <svg
        viewBox="0 0 280 120"
        className="mx-auto w-full max-w-[260px]"
        role="img"
        aria-hidden
      >
        <defs>
          <linearGradient id="lashGradResult" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c41b6a" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#c41b6a" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#c41b6a" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        <ellipse
          cx="140"
          cy="68"
          rx="88"
          ry="34"
          fill="none"
          stroke="#2f2435"
          strokeOpacity="0.15"
          strokeWidth="1.5"
        />

        <path
          d="M 58 68 Q 140 42 222 68"
          fill="none"
          stroke="#2f2435"
          strokeOpacity="0.2"
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
              stroke="url(#lashGradResult)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}

        <text
          x="52"
          y="102"
          fill="#5c4a62"
          fillOpacity="0.7"
          fontSize="9"
          fontFamily="system-ui, sans-serif"
        >
          Inner
        </text>
        <text
          x="128"
          y="102"
          fill="#5c4a62"
          fillOpacity="0.7"
          fontSize="9"
          fontFamily="system-ui, sans-serif"
        >
          Centre
        </text>
        <text
          x="210"
          y="102"
          fill="#5c4a62"
          fillOpacity="0.7"
          fontSize="9"
          fontFamily="system-ui, sans-serif"
        >
          Outer
        </text>
      </svg>

      <p className="mt-2 text-center text-[11px] font-medium tracking-wide text-[#5c4a62]/70 uppercase">
        {label}
      </p>
    </div>
  );
}
