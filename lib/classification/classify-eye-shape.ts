import { EYE_SHAPE_CLASSIFICATION_CONFIG } from "@/constants/eye-shape-config";
import {
  EYE_SHAPES,
  type ClassificationFeature,
  type EyeShape,
  type EyeShapeClassification,
  type EyeShapeFeatures,
} from "@/types/classification";
import type { FaceEyeMeasurements } from "@/types/eye";
import { extractFeaturesFromMeasurements } from "./extract-features";

const FEATURE_KEYS: ClassificationFeature[] = [
  "aspectRatio",
  "outerCornerAngleDeg",
  "upperEyelidOpenness",
  "browDistance",
  "irisVisibility",
  "canthalTilt",
];

function scoreFeature(value: number, ideal: number, tolerance: number): number {
  if (tolerance <= 0) {
    return value === ideal ? 1 : 0;
  }
  const distance = Math.abs(value - ideal);
  return Math.max(0, 1 - distance / tolerance);
}

function scoreShape(shape: EyeShape, features: EyeShapeFeatures): number {
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

export function classifyEyeShape(
  measurements: FaceEyeMeasurements,
): EyeShapeClassification {
  const features = extractFeaturesFromMeasurements(measurements);
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
