import { APP_COPY } from "@/constants/copy";
import { SCAN_QUALITY_CONFIG } from "@/constants/scan-quality";
import type { ScanReadiness } from "@/types/scan-quality";

interface ScanActionButtonProps {
  readiness: ScanReadiness;
  isModelReady: boolean;
}

export default function ScanActionButton({
  readiness,
  isModelReady,
}: ScanActionButtonProps) {
  const canHoldStill =
    isModelReady &&
    readiness.overall >= SCAN_QUALITY_CONFIG.minHoldStillConfidence;

  const label = canHoldStill ? APP_COPY.holdStillStarting : APP_COPY.alignFace;

  return (
    <div className="shrink-0 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
      <p className="mb-3 text-center text-sm text-white/60">
        {APP_COPY.holdHeadInPosition}
      </p>

      <div
        className={`w-full rounded-xl py-4 text-center text-lg font-semibold ${
          canHoldStill
            ? "bg-white text-black"
            : "bg-white/15 text-white/40"
        }`}
        aria-live="polite"
      >
        {label}
      </div>

      {isModelReady && !canHoldStill && readiness.suggestions[0] && (
        <p className="mt-3 text-center text-sm text-white/55">
          {readiness.suggestions[0]}
        </p>
      )}
    </div>
  );
}
