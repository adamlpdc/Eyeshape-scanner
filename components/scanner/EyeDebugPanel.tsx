import { formatEyeBlock } from "@/lib/measurements/format-measurements";
import type { FaceEyeMeasurements } from "@/types/eye";

interface EyeDebugPanelProps {
  measurements: FaceEyeMeasurements | null;
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
