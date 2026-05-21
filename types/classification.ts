export const EYE_SHAPES = [
  "hooded",
  "almond",
  "round",
  "monolid",
  "upturned",
  "downturned",
] as const;

export type EyeShape = (typeof EYE_SHAPES)[number];

export type ClassificationFeature =
  | "aspectRatio"
  | "outerCornerAngleDeg"
  | "upperEyelidOpenness"
  | "browDistance"
  | "irisVisibility"
  | "canthalTilt";

export interface FeatureTarget {
  ideal: number;
  tolerance: number;
  weight: number;
}

export type ShapeFeatureTargets = Record<ClassificationFeature, FeatureTarget>;

export interface EyeShapeClassificationConfig {
  featureWeights: Record<ClassificationFeature, number>;
  shapes: Record<EyeShape, ShapeFeatureTargets>;
  result: {
    minPrimaryScore: number;
    minSecondaryGap: number;
  };
}

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
