import { APP_COPY } from "@/constants/copy";
import type { ScanReadiness } from "@/types/scan-quality";
import type { ScanPhase } from "@/types/scan";

interface ScanReadinessPanelProps {
  phase: ScanPhase;
  readiness: ScanReadiness;
  isModelReady: boolean;
}

function metricLabel(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function metricColor(value: number): string {
  if (value >= 0.72) {
    return "bg-emerald-400";
  }
  if (value >= 0.45) {
    return "bg-amber-400";
  }
  return "bg-red-400/80";
}

export default function ScanReadinessPanel({
  phase,
  readiness,
  isModelReady,
}: ScanReadinessPanelProps) {
  if (phase !== "aligning") {
    return null;
  }

  const headline = !isModelReady
    ? APP_COPY.loadingModel
    : readiness.canStartCapture
      ? APP_COPY.holdStill
      : APP_COPY.aligning;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-5 pt-14 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <p className="text-center text-base font-medium text-white sm:text-lg">
        {headline}
      </p>

      <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium tracking-wide text-white/55 uppercase">
            {APP_COPY.scanConfidence}
          </p>
          <p className="font-mono text-sm font-semibold tabular-nums text-white">
            {metricLabel(readiness.overall)}
          </p>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
          <div
            className={`h-full rounded-full transition-all duration-150 ${metricColor(readiness.overall)}`}
            style={{ width: `${readiness.overall * 100}%` }}
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-white/55">
          <span>Align {metricLabel(readiness.alignment)}</span>
          <span>Distance {metricLabel(readiness.distance)}</span>
          <span>Light {metricLabel(readiness.lighting)}</span>
          <span>Still {metricLabel(readiness.stillness)}</span>
        </div>
      </div>

      {isModelReady && readiness.suggestions.length > 0 && (
        <ul className="max-w-xs space-y-1 text-center text-xs leading-relaxed text-white/65">
          {readiness.suggestions.slice(0, 2).map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
