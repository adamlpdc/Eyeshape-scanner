import type { EyeMeasurements } from "./eyeMeasurements";

export function formatEyeBlock(label: string, m: EyeMeasurements): string {
  return [
    label,
    `  width: ${m.width.toFixed(1)} px`,
    `  height: ${m.height.toFixed(1)} px`,
    `  EAR: ${m.aspectRatio.toFixed(3)}`,
    `  outer ∠: ${m.outerCornerAngleDeg.toFixed(1)}°`,
    `  lid open: ${m.upperEyelidOpenness.toFixed(3)}`,
    `  brow dist: ${m.browDistance.toFixed(3)}`,
    `  iris vis: ${m.irisVisibility.toFixed(3)}`,
    `  tilt: ${m.canthalTilt.toFixed(3)}`,
    `  conf: ${(m.confidence * 100).toFixed(0)}%`,
  ].join("\n");
}
