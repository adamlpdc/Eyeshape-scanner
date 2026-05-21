import type { ScanReadiness } from "@/types/scan-quality";
import type { ScanPhase } from "@/types/scan";

interface AlignmentGuideOverlayProps {
  phase: ScanPhase;
  readiness: ScanReadiness;
}

function guideTone(readiness: ScanReadiness): string {
  if (!readiness.faceDetected) {
    return "border-white/35";
  }
  if (readiness.canStartCapture) {
    return "border-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.35)]";
  }
  return "border-amber-400/90";
}

export default function AlignmentGuideOverlay({
  phase,
  readiness,
}: AlignmentGuideOverlayProps) {
  if (phase !== "aligning" && phase !== "capturing") {
    return null;
  }

  const tone = guideTone(readiness);
  const readyPulse = readiness.canStartCapture ? "animate-pulse" : "";

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center px-8"
      aria-hidden
    >
      <div
        className={`relative h-[min(58vh,26rem)] w-[min(72vw,18rem)] rounded-[50%] border-2 border-dashed transition-colors duration-200 ${tone} ${readyPulse}`}
      >
        <span className="absolute -top-7 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-inherit bg-black/20" />
        <span className="absolute top-1/2 -left-7 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-inherit bg-black/20" />
        <span className="absolute top-1/2 -right-7 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-inherit bg-black/20" />
        <span className="absolute -bottom-7 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-inherit bg-black/20" />
      </div>
    </div>
  );
}
