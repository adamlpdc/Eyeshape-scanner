import type { EyeMeasurements, FaceEyeMeasurements } from "./eyeMeasurements";

function averageMetric(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function averageEye(samples: EyeMeasurements[]): EyeMeasurements {
  const side = samples[0].side;

  return {
    side,
    width: averageMetric(samples.map((s) => s.width)),
    height: averageMetric(samples.map((s) => s.height)),
    aspectRatio: averageMetric(samples.map((s) => s.aspectRatio)),
    outerCornerAngleDeg: averageMetric(samples.map((s) => s.outerCornerAngleDeg)),
    upperEyelidOpenness: averageMetric(samples.map((s) => s.upperEyelidOpenness)),
    browDistance: averageMetric(samples.map((s) => s.browDistance)),
    irisVisibility: averageMetric(samples.map((s) => s.irisVisibility)),
    canthalTilt: averageMetric(samples.map((s) => s.canthalTilt)),
    confidence: averageMetric(samples.map((s) => s.confidence)),
  };
}

export function averageFaceEyeMeasurements(
  samples: FaceEyeMeasurements[],
): FaceEyeMeasurements {
  return {
    left: averageEye(samples.map((s) => s.left)),
    right: averageEye(samples.map((s) => s.right)),
  };
}
