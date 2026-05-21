import type { FaceEyeMeasurements } from "../lib/eyeMeasurements";

interface EyeDebugPanelProps {
  measurements: FaceEyeMeasurements | null;
}

function formatEyeBlock(label: string, m: FaceEyeMeasurements["left"]) {
  return [
    label,
    `  width: ${m.width.toFixed(1)} px`,
    `  height: ${m.height.toFixed(1)} px`,
    `  EAR: ${m.aspectRatio.toFixed(3)}`,
    `  outer ∠: ${m.outerCornerAngleDeg.toFixed(1)}°`,
    `  conf: ${(m.confidence * 100).toFixed(0)}%`,
  ].join("\n");
}

export default function EyeDebugPanel({ measurements }: EyeDebugPanelProps) {
  if (!measurements) {
    return null;
  }

  return (
    <pre className="pointer-events-none absolute top-3 left-3 z-10 max-w-[min(100%,20rem)] rounded-lg bg-black/75 p-3 font-mono text-[10px] leading-relaxed text-white/90 backdrop-blur-sm sm:text-xs">
      {formatEyeBlock("Left eye", measurements.left)}
      {"\n\n"}
      {formatEyeBlock("Right eye", measurements.right)}
    </pre>
  );
}
