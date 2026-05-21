import { formatShapeLabel } from "@/lib/classification/format-shape-label";
import { formatEyeBlock } from "@/lib/measurements/format-measurements";
import type { EyeShape, EyeShapeClassification } from "@/types/classification";
import type { FaceEyeMeasurements } from "@/types/eye";

interface ScanResultsScreenProps {
  measurements: FaceEyeMeasurements;
  classification: EyeShapeClassification;
  frameCount: number;
  onScanAgain: () => void;
}

export default function ScanResultsScreen({
  measurements,
  classification,
  frameCount,
  onScanAgain,
}: ScanResultsScreenProps) {
  const confidencePercent = Math.round(classification.confidence * 100);

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-gradient-to-b from-zinc-900 via-black to-black">
      <div className="flex-1 overflow-y-auto px-6 pt-12 pb-6">
        <p className="text-sm font-medium tracking-wide text-emerald-400/90 uppercase">
          Your eye shape
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white capitalize">
          {formatShapeLabel(classification.primary)}
        </h1>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium tracking-wide text-white/50 uppercase">
                Confidence
              </p>
              <p className="mt-1 text-3xl font-semibold text-white">
                {confidencePercent}%
              </p>
            </div>
            {classification.secondary && (
              <div className="text-right">
                <p className="text-xs font-medium tracking-wide text-white/50 uppercase">
                  Also possible
                </p>
                <p className="mt-1 text-lg font-medium text-amber-200/90 capitalize">
                  {formatShapeLabel(classification.secondary)}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>

        <details className="mt-6 rounded-2xl border border-white/10 bg-white/5 open:bg-white/[0.07]">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-white/80">
            Debug measurements ({frameCount} frames)
          </summary>
          <pre className="border-t border-white/10 px-4 py-4 font-mono text-[10px] leading-relaxed text-white/75 sm:text-xs">
            {formatEyeBlock("Left eye", measurements.left)}
            {"\n\n"}
            {formatEyeBlock("Right eye", measurements.right)}
            {"\n\n"}
            {"Averaged features\n"}
            {`  EAR: ${classification.features.aspectRatio.toFixed(3)}\n`}
            {`  outer ∠: ${classification.features.outerCornerAngleDeg.toFixed(1)}°\n`}
            {`  lid open: ${classification.features.upperEyelidOpenness.toFixed(3)}\n`}
            {`  brow dist: ${classification.features.browDistance.toFixed(3)}\n`}
            {`  iris vis: ${classification.features.irisVisibility.toFixed(3)}\n`}
            {`  tilt: ${classification.features.canthalTilt.toFixed(3)}\n\n`}
            {"Shape scores\n"}
            {Object.entries(classification.scores)
              .sort(([, a], [, b]) => b - a)
              .map(
                ([shape, score]) =>
                  `  ${formatShapeLabel(shape as EyeShape)}: ${(score * 100).toFixed(0)}%`,
              )
              .join("\n")}
          </pre>
        </details>
      </div>

      <div className="border-t border-white/10 px-6 py-6">
        <button
          type="button"
          onClick={onScanAgain}
          className="min-h-14 w-full rounded-full bg-white px-8 py-4 text-lg font-semibold text-black shadow-lg active:scale-[0.98]"
        >
          Scan again
        </button>
      </div>
    </div>
  );
}
