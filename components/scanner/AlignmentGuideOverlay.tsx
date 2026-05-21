import { SCAN_QUALITY_CONFIG } from "@/constants/scan-quality";
import type { ScanReadiness } from "@/types/scan-quality";
import type { ScanPhase } from "@/types/scan";

interface AlignmentGuideOverlayProps {
  phase: ScanPhase;
  readiness: ScanReadiness;
}

export default function AlignmentGuideOverlay({
  phase,
  readiness,
}: AlignmentGuideOverlayProps) {
  if (phase !== "aligning" && phase !== "countdown" && phase !== "scanning") {
    return null;
  }

  const isReady =
    readiness.overall >= SCAN_QUALITY_CONFIG.minHoldStillConfidence &&
    readiness.faceDetected;

  const outerClass =
    phase === "scanning"
      ? "border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.35)]"
      : isReady
        ? "border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.25)]"
        : readiness.faceDetected
          ? "border-white/80"
          : "border-white/35";

  const innerClass =
    phase === "scanning"
      ? "border-emerald-400/70"
      : isReady
        ? "border-emerald-400/60"
        : readiness.faceDetected
          ? "border-amber-400/80"
          : "border-transparent";

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center px-8"
      aria-hidden
    >
      <div className="relative flex h-[min(58vh,26rem)] w-[min(72vw,18rem)] items-center justify-center">
        <div
          className={`absolute inset-0 rounded-[50%] border-2 border-dashed transition-colors duration-200 ${outerClass}`}
        />
        {readiness.faceDetected && (
          <div
            className={`absolute inset-[12%] rounded-[50%] border-2 transition-colors duration-200 ${innerClass}`}
          />
        )}
      </div>
    </div>
  );
}
