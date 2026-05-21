import { APP_COPY, DEBUG_COPY } from "@/constants/copy";
import { formatShapeLabel } from "@/lib/classification/format-shape-label";
import { formatEyeBlock } from "@/lib/measurements/format-measurements";
import type { EyeShape, EyeShapeClassification } from "@/types/classification";
import type { FaceEyeMeasurements } from "@/types/eye";
import Button from "@/components/ui/Button";
import DebugToggle from "./DebugToggle";
import PrivacyNotice from "./PrivacyNotice";

interface ScanResultsScreenProps {
  measurements: FaceEyeMeasurements;
  classification: EyeShapeClassification;
  scanSessionConfidence: number;
  frameCount: number;
  showDebug: boolean;
  onDebugChange: (enabled: boolean) => void;
  onScanAgain: () => void;
}

export default function ScanResultsScreen({
  measurements,
  classification,
  scanSessionConfidence,
  frameCount,
  showDebug,
  onDebugChange,
  onScanAgain,
}: ScanResultsScreenProps) {
  const shapeLabel = formatShapeLabel(classification.primary);
  const shapeConfidence = Math.round(classification.confidence * 100);
  const scanConfidence = Math.round(scanSessionConfidence * 100);

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-black">
      <div className="safe-top flex-1 overflow-y-auto px-6 pt-10 pb-6">
        <p className="text-sm font-medium text-white/50 uppercase">
          Your eye shape
        </p>
        <h1 className="mt-2 text-4xl font-semibold capitalize text-white">
          {shapeLabel}
        </h1>

        <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div>
            <p className="text-xs font-medium text-white/50 uppercase">
              {APP_COPY.scanConfidence}
            </p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-white">
              {scanConfidence}%
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-sky-400"
                style={{ width: `${scanConfidence}%` }}
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-white/50 uppercase">
              {APP_COPY.eyeShapeConfidence}
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
              {shapeConfidence}%
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{ width: `${shapeConfidence}%` }}
              />
            </div>
          </div>
          {classification.secondary && (
            <p className="text-sm text-white/60">
              Also possible:{" "}
              <span className="font-medium text-white capitalize">
                {formatShapeLabel(classification.secondary)}
              </span>
            </p>
          )}
        </div>

        <div className="mt-6 space-y-4">
          <PrivacyNotice compact />
          <DebugToggle enabled={showDebug} onChange={onDebugChange} />
        </div>

        {showDebug && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-medium text-white/50 uppercase">
              {DEBUG_COPY.panelTitle} ({frameCount} frames)
            </p>
            <pre className="mt-3 overflow-x-auto font-mono text-xs text-white/75">
              {formatEyeBlock("Left eye", measurements.left)}
              {"\n\n"}
              {formatEyeBlock("Right eye", measurements.right)}
              {"\n\n"}
              {Object.entries(classification.scores)
                .sort(([, a], [, b]) => b - a)
                .map(
                  ([shape, score]) =>
                    `${formatShapeLabel(shape as EyeShape)}: ${(score * 100).toFixed(0)}%`,
                )
                .join("\n")}
            </pre>
          </div>
        )}
      </div>

      <div className="safe-bottom shrink-0 border-t border-white/10 px-6 py-5">
        <Button fullWidth onClick={onScanAgain}>
          {APP_COPY.scanAgain}
        </Button>
      </div>
    </div>
  );
}
