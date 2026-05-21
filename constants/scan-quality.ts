import type { ScanReadinessIssue } from "@/types/scan-quality";

/** Edit thresholds to tune when a scan may start. */
export const SCAN_QUALITY_CONFIG = {
  /** Minimum overall score (0–1) to enable the Hold still button. */
  minHoldStillConfidence: 0.85,
  /** Minimum overall score (0–1) required while sampling frames. */
  minOverallConfidence: 0.85,
  /** Minimum average readiness during capture to accept results. */
  minScanSessionConfidence: 0.68,
  /** Consecutive ready frames needed before capture starts (~0.4s at 30fps). */
  stableFramesRequired: 12,
  /** Frames below threshold before capture pauses again. */
  unstableFramesToAbort: 10,
  /** Ideal face width as a fraction of frame width (normalized landmark span). */
  faceWidthRatio: { min: 0.26, max: 0.5 },
  /** Target face center in normalized frame coordinates. */
  faceCenterTarget: { x: 0.5, y: 0.44 },
  maxCenterOffset: { x: 0.14, y: 0.16 },
  luminance: { min: 65, max: 215 },
  minLuminanceStdDev: 22,
  maxNormalizedMovement: 0.012,
  movementHistoryLength: 8,
  featureWeights: {
    alignment: 0.28,
    distance: 0.26,
    lighting: 0.22,
    stillness: 0.24,
  },
} as const;

export const READINESS_SUGGESTIONS: Record<ScanReadinessIssue, string> = {
  no_face: "Position your face inside the oval guide.",
  too_close: "Move your phone slightly farther away.",
  too_far: "Move closer so your face fills the oval.",
  off_center: "Center your face in the oval guide.",
  too_dark: "Move to a brighter area or face a light source.",
  too_bright: "Avoid strong backlight or harsh overhead light.",
  low_contrast: "Improve lighting so your eyes are clearly visible.",
  moving: "Hold still until the scan begins.",
};
