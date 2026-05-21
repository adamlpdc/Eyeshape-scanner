import type { EyeShapeClassificationConfig } from "@/types/classification";

/**
 * Edit thresholds, ideals, and weights here to tune classification.
 * All feature values use the averaged left/right eye metrics from a scan.
 */
export const EYE_SHAPE_CLASSIFICATION_CONFIG: EyeShapeClassificationConfig = {
  featureWeights: {
    aspectRatio: 1.2,
    outerCornerAngleDeg: 0.75,
    upperEyelidOpenness: 1.1,
    browDistance: 1.15,
    irisVisibility: 1.0,
    canthalTilt: 1.35,
  },

  shapes: {
    hooded: {
      aspectRatio: { ideal: 0.24, tolerance: 0.07, weight: 1.0 },
      outerCornerAngleDeg: { ideal: 44, tolerance: 14, weight: 0.6 },
      upperEyelidOpenness: { ideal: 0.21, tolerance: 0.05, weight: 1.3 },
      browDistance: { ideal: 0.17, tolerance: 0.05, weight: 1.6 },
      irisVisibility: { ideal: 0.37, tolerance: 0.09, weight: 0.9 },
      canthalTilt: { ideal: 0.005, tolerance: 0.03, weight: 0.5 },
    },
    almond: {
      aspectRatio: { ideal: 0.3, tolerance: 0.06, weight: 1.2 },
      outerCornerAngleDeg: { ideal: 42, tolerance: 12, weight: 0.9 },
      upperEyelidOpenness: { ideal: 0.3, tolerance: 0.06, weight: 1.0 },
      browDistance: { ideal: 0.31, tolerance: 0.07, weight: 1.0 },
      irisVisibility: { ideal: 0.44, tolerance: 0.08, weight: 1.0 },
      canthalTilt: { ideal: 0.015, tolerance: 0.035, weight: 0.6 },
    },
    round: {
      aspectRatio: { ideal: 0.36, tolerance: 0.07, weight: 1.5 },
      outerCornerAngleDeg: { ideal: 54, tolerance: 16, weight: 1.0 },
      upperEyelidOpenness: { ideal: 0.38, tolerance: 0.08, weight: 1.3 },
      browDistance: { ideal: 0.29, tolerance: 0.08, weight: 0.7 },
      irisVisibility: { ideal: 0.48, tolerance: 0.09, weight: 1.1 },
      canthalTilt: { ideal: 0.01, tolerance: 0.035, weight: 0.4 },
    },
    monolid: {
      aspectRatio: { ideal: 0.18, tolerance: 0.05, weight: 1.5 },
      outerCornerAngleDeg: { ideal: 50, tolerance: 16, weight: 0.6 },
      upperEyelidOpenness: { ideal: 0.15, tolerance: 0.04, weight: 1.2 },
      browDistance: { ideal: 0.13, tolerance: 0.04, weight: 1.4 },
      irisVisibility: { ideal: 0.27, tolerance: 0.07, weight: 1.5 },
      canthalTilt: { ideal: 0, tolerance: 0.025, weight: 0.5 },
    },
    upturned: {
      aspectRatio: { ideal: 0.28, tolerance: 0.07, weight: 0.9 },
      outerCornerAngleDeg: { ideal: 38, tolerance: 12, weight: 0.8 },
      upperEyelidOpenness: { ideal: 0.28, tolerance: 0.06, weight: 0.8 },
      browDistance: { ideal: 0.27, tolerance: 0.07, weight: 0.7 },
      irisVisibility: { ideal: 0.42, tolerance: 0.09, weight: 0.8 },
      canthalTilt: { ideal: 0.055, tolerance: 0.03, weight: 2.2 },
    },
    downturned: {
      aspectRatio: { ideal: 0.26, tolerance: 0.07, weight: 0.9 },
      outerCornerAngleDeg: { ideal: 48, tolerance: 14, weight: 0.8 },
      upperEyelidOpenness: { ideal: 0.26, tolerance: 0.06, weight: 0.8 },
      browDistance: { ideal: 0.27, tolerance: 0.07, weight: 0.7 },
      irisVisibility: { ideal: 0.4, tolerance: 0.09, weight: 0.8 },
      canthalTilt: { ideal: -0.05, tolerance: 0.03, weight: 2.2 },
    },
  },

  result: {
    minPrimaryScore: 0.35,
    minSecondaryGap: 0.08,
  },
};
