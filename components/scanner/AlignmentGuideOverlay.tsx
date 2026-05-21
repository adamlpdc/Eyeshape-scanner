import { EYLURE_BRAND } from "@/constants/brand";
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

  const isScanning = phase === "scanning";
  const hasFace = readiness.faceDetected;

  const ringStyle = isScanning
    ? {
        borderColor: `${EYLURE_BRAND.pink}`,
        boxShadow: `0 0 32px ${EYLURE_BRAND.pink}66, inset 0 0 20px ${EYLURE_BRAND.pink}22`,
      }
    : isReady
      ? {
          borderColor: EYLURE_BRAND.pink,
          boxShadow: `0 0 28px ${EYLURE_BRAND.pink}55`,
        }
      : hasFace
        ? {
            borderColor: "rgba(255,255,255,0.75)",
            boxShadow: "0 0 16px rgba(255,255,255,0.12)",
          }
        : {
            borderColor: "rgba(255,255,255,0.35)",
            boxShadow: "none",
          };

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5]"
      aria-hidden
    >
      {/* Soft vignette — draws focus to the face without harsh UI chrome */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 78% 62% at 50% 44%, transparent 52%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center px-8">
        <div className="relative h-[min(58vh,26rem)] w-[min(72vw,18rem)]">
          <div
            className={`absolute inset-0 rounded-[50%] border transition-all duration-500 ease-out ${
              isReady && !isScanning ? "scan-guide-ready" : ""
            }`}
            style={{
              borderWidth: isScanning ? 2 : 1.5,
              ...ringStyle,
            }}
          />

          {/* Subtle top accent — reads as a beauty frame, not a tech target */}
          {hasFace && (
            <div
              className="absolute inset-x-[18%] top-[8%] h-px transition-opacity duration-500"
              style={{
                background: isReady
                  ? `linear-gradient(90deg, transparent, ${EYLURE_BRAND.pink}, transparent)`
                  : "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                opacity: isScanning ? 0.9 : 0.7,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
