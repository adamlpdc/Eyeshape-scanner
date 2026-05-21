import type { ScanReadiness } from "@/types/scan-quality";

const OK_THRESHOLD = 0.62;

interface ScanQualityIndicatorsProps {
  readiness: ScanReadiness;
}

type IndicatorKey = "face" | "align" | "light" | "distance" | "still";

const INDICATORS: Array<{
  key: IndicatorKey;
  label: string;
  isOk: (r: ScanReadiness) => boolean;
}> = [
  { key: "face", label: "Face", isOk: (r) => r.faceDetected },
  { key: "align", label: "Align", isOk: (r) => r.alignment >= OK_THRESHOLD },
  { key: "light", label: "Light", isOk: (r) => r.lighting >= OK_THRESHOLD },
  { key: "distance", label: "Distance", isOk: (r) => r.distance >= OK_THRESHOLD },
  { key: "still", label: "Still", isOk: (r) => r.stillness >= OK_THRESHOLD },
];

function IndicatorIcon({ type }: { type: IndicatorKey }) {
  const className = "h-4 w-4";

  switch (type) {
    case "face":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case "align":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "light":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M13 2 4 14h7l-1 8 10-14h-7l0-6Z" />
        </svg>
      );
    case "distance":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" d="M8 12h8M12 8v8" />
          <rect x="5" y="5" width="14" height="14" rx="2" />
        </svg>
      );
    case "still":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" d="M12 6v6l3 2" />
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

export default function ScanQualityIndicators({
  readiness,
}: ScanQualityIndicatorsProps) {
  return (
    <div className="absolute right-3 top-3 z-20 flex flex-col gap-1.5">
      {INDICATORS.map(({ key, label, isOk }) => {
        const ok = isOk(readiness);
        return (
          <div
            key={key}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 backdrop-blur-md ${
              ok ? "bg-emerald-500/20" : "bg-amber-500/25"
            }`}
            title={label}
            aria-label={`${label}: ${ok ? "good" : "needs improvement"}`}
          >
            <span className={ok ? "text-emerald-300" : "text-amber-200"}>
              <IndicatorIcon type={key} />
            </span>
            <span
              className={`text-[10px] font-medium uppercase tracking-wide ${
                ok ? "text-emerald-100" : "text-amber-100"
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
