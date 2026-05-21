import type { EyeMeasurements, FaceEyeMeasurements } from "./eyeMeasurements";
import {
  EYE_SHAPE_CLASSIFICATION_CONFIG,
  EYE_SHAPES,
  type ClassificationFeature,
  type EyeShape,
} from "./eyeShapeConfig";

export interface EyeShapeFeatures {
  aspectRatio: number;
  outerCornerAngleDeg: number;
  upperEyelidOpenness: number;
  browDistance: number;
  irisVisibility: number;
  canthalTilt: number;
}

export interface EyeShapeClassification {
  primary: EyeShape;
  confidence: number;
  secondary: EyeShape | null;
  scores: Record<EyeShape, number>;
  features: EyeShapeFeatures;
}

const FEATURE_KEYS: ClassificationFeature[] = [
  "aspectRatio",
  "outerCornerAngleDeg",
  "upperEyelidOpenness",
  "browDistance",
  "irisVisibility",
  "canthalTilt",
];

function averageEyeMetric(
  left: number,
  right: number,
): number {
  return (left + right) / 2;
}

export function featuresFromMeasurements(
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

function scoreFeature(value: number, ideal: number, tolerance: number): number {
  if (tolerance <= 0) {
    return value === ideal ? 1 : 0;
  }
  const distance = Math.abs(value - ideal);
  return Math.max(0, 1 - distance / tolerance);
}

function scoreShape(
  shape: EyeShape,
  features: EyeShapeFeatures,
): number {
  const { shapes, featureWeights } = EYE_SHAPE_CLASSIFICATION_CONFIG;
  const shapeConfig = shapes[shape];

  let weightedSum = 0;
  let weightTotal = 0;

  for (const key of FEATURE_KEYS) {
    const target = shapeConfig[key];
    const globalWeight = featureWeights[key];
    const combinedWeight = target.weight * globalWeight;
    const match = scoreFeature(
      features[key],
      target.ideal,
      target.tolerance,
    );

    weightedSum += match * combinedWeight;
    weightTotal += combinedWeight;
  }

  return weightTotal > 0 ? weightedSum / weightTotal : 0;
}

function formatShapeLabel(shape: EyeShape): string {
  return shape.charAt(0).toUpperCase() + shape.slice(1);
}

export { formatShapeLabel };

export function classifyEyeShape(
  measurements: FaceEyeMeasurements,
): EyeShapeClassification {
  const features = featuresFromMeasurements(measurements);
  const { result } = EYE_SHAPE_CLASSIFICATION_CONFIG;

  const scores = Object.fromEntries(
    EYE_SHAPES.map((shape) => [shape, scoreShape(shape, features)]),
  ) as Record<EyeShape, number>;

  const ranked = [...EYE_SHAPES].sort((a, b) => scores[b] - scores[a]);
  const primary = ranked[0];
  const secondaryCandidate = ranked[1];

  const primaryScore = scores[primary];
  const secondaryScore = scores[secondaryCandidate];
  const scoreSum = EYE_SHAPES.reduce((sum, shape) => sum + scores[shape], 0);

  const confidence =
    scoreSum > 0
      ? Math.min(1, primaryScore / scoreSum + (primaryScore - secondaryScore) * 0.5)
      : 0;

  const showSecondary =
    secondaryScore > 0 &&
    (secondaryScore >= primaryScore * 0.65 ||
      primaryScore - secondaryScore < result.minSecondaryGap);

  const secondary = showSecondary ? secondaryCandidate : null;

  return {
    primary:
      primaryScore >= result.minPrimaryScore ? primary : ranked[0],
    confidence: Math.max(0, Math.min(1, confidence)),
    secondary,
    scores,
    features,
  };
}
