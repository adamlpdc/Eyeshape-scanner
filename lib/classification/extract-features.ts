import type { FaceEyeMeasurements } from "@/types/eye";
import type { EyeShapeFeatures } from "@/types/classification";

function averageEyeMetric(left: number, right: number): number {
  return (left + right) / 2;
}

export function extractFeaturesFromMeasurements(
  measurements: FaceEyeMeasurements,
): EyeShapeFeatures {
  const { left, right } = measurements;

  return {
    aspectRatio: averageEyeMetric(left.aspectRatio, right.aspectRatio),
    outerCornerAngleDeg: averageEyeMetric(
      left.outerCornerAngleDeg,
      right.outerCornerAngleDeg,
    ),
    upperEyelidOpenness: averageEyeMetric(
      left.upperEyelidOpenness,
      right.upperEyelidOpenness,
    ),
    browDistance: averageEyeMetric(left.browDistance, right.browDistance),
    irisVisibility: averageEyeMetric(left.irisVisibility, right.irisVisibility),
    canthalTilt: averageEyeMetric(left.canthalTilt, right.canthalTilt),
  };
}
