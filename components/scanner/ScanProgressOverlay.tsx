import { APP_COPY, PRIVACY_COPY } from "@/constants/copy";
import type { ScanPhase } from "@/types/scan";

interface ScanProgressOverlayProps {
  phase: ScanPhase;
  progress: number;
  scanSessionConfidence: number;
}

export default function ScanProgressOverlay({
  phase,
  progress,
  scanSessionConfidence,
}: ScanProgressOverlayProps) {
  if (phase !== "capturing") {
    return null;
  }

  const clampedProgress = Math.min(100, Math.max(0, progress));
  const confidencePercent = Math.round(scanSessionConfidence * 100);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-6 pt-16 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      <p className="text-center text-lg font-medium text-white">
        {APP_COPY.holdStill}
      </p>

      <div className="h-2.5 w-full max-w-xs overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-emerald-400 transition-[width] duration-75 ease-linear"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      <p className="font-mono text-sm tabular-nums text-white/60">
        {Math.round(clampedProgress)}%
      </p>

      <div className="w-full max-w-xs rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-center">
        <p className="text-[10px] font-medium tracking-wide text-white/50 uppercase">
          {APP_COPY.scanConfidence}
        </p>
        <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-emerald-300">
          {confidencePercent}%
        </p>
      </div>

      <p className="max-w-xs text-center text-xs text-white/45">
        {PRIVACY_COPY.short}
      </p>
    </div>
  );
}
