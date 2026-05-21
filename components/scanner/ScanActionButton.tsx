import { APP_COPY } from "@/constants/copy";
import { SCAN_QUALITY_CONFIG } from "@/constants/scan-quality";
import type { ScanReadiness } from "@/types/scan-quality";
import type { ScanPhase } from "@/types/scan";

interface ScanActionButtonProps {
  phase: ScanPhase;
  readiness: ScanReadiness;
  isModelReady: boolean;
}

export default function ScanActionButton({
  phase,
  readiness,
  isModelReady,
}: ScanActionButtonProps) {
  const canHoldStill =
    isModelReady &&
    readiness.overall >= SCAN_QUALITY_CONFIG.minHoldStillConfidence;

  const isCountdown = phase === "countdown";

  const label = isCountdown
    ? APP_COPY.holdStill
    : canHoldStill
      ? APP_COPY.holdStillStarting
      : APP_COPY.alignFace;

  const isActive = isCountdown || canHoldStill;

  return (
    <div className="shrink-0 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
      <p className="mb-3 text-center text-sm text-white/60">
        {APP_COPY.holdHeadInPosition}
      </p>

      <div
        className={`w-full rounded-xl py-4 text-center text-lg font-semibold ${
          isActive
            ? "bg-white text-black"
            : "bg-white/15 text-white/40"
        }`}
        aria-live="polite"
      >
        {label}
      </div>

      {isModelReady && !isActive && readiness.suggestions[0] && (
        <p className="mt-3 text-center text-sm text-white/55">
          {readiness.suggestions[0]}
        </p>
      )}
    </div>
  );
}
