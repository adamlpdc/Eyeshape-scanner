interface ConfidenceRingProps {
  value: number;
  label: string;
  sublabel?: string;
  accent?: "rose" | "champagne";
}

export default function ConfidenceRing({
  value,
  label,
  sublabel,
  accent = "rose",
}: ConfidenceRingProps) {
  const percent = Math.round(value * 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value * circumference);

  const strokeClass =
    accent === "champagne"
      ? "stroke-amber-200/90"
      : "stroke-rose-300/90";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[5.5rem] w-[5.5rem]">
        <svg
          className="h-full w-full -rotate-90"
          viewBox="0 0 88 88"
          aria-hidden
        >
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="6"
          />
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            className={`${strokeClass} transition-all duration-700 ease-out`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-medium tabular-nums text-white">
            {percent}%
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-medium tracking-[0.14em] text-white/45 uppercase">
          {label}
        </p>
        {sublabel && (
          <p className="mt-0.5 text-xs text-white/55">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
