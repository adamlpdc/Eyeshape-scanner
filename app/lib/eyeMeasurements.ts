import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import {
  EYE_LANDMARK_CONFIG,
  type EyeSide,
} from "./eyeLandmarks";

export interface EyeMeasurements {
  side: EyeSide;
  width: number;
  height: number;
  aspectRatio: number;
  outerCornerAngleDeg: number;
  confidence: number;
}

interface Point2D {
  x: number;
  y: number;
}

function toPixel(
  landmark: NormalizedLandmark,
  frameWidth: number,
  frameHeight: number,
): Point2D {
  return {
    x: landmark.x * frameWidth,
    y: landmark.y * frameHeight,
  };
}

function distance(a: Point2D, b: Point2D): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Angle at the corner between upper-lid and lower-lid vectors (degrees). */
function outerCornerAngleDeg(
  corner: Point2D,
  upper: Point2D,
  lower: Point2D,
): number {
  const upperVec = { x: upper.x - corner.x, y: upper.y - corner.y };
  const lowerVec = { x: lower.x - corner.x, y: lower.y - corner.y };
  const dot = upperVec.x * lowerVec.x + upperVec.y * lowerVec.y;
  const magnitude =
    Math.hypot(upperVec.x, upperVec.y) * Math.hypot(lowerVec.x, lowerVec.y);

  if (magnitude === 0) {
    return 0;
  }

  const radians = Math.acos(clamp(dot / magnitude, -1, 1));
  return (radians * 180) / Math.PI;
}

function eyeAspectRatio(
  landmarks: NormalizedLandmark[],
  earIndices: readonly number[],
  frameWidth: number,
  frameHeight: number,
): number {
  const [outer, upper1, upper2, inner, lower2, lower1] = earIndices.map((i) =>
    toPixel(landmarks[i], frameWidth, frameHeight),
  );

  const vertical1 = distance(upper1, lower1);
  const vertical2 = distance(upper2, lower2);
  const horizontal = distance(outer, inner);

  if (horizontal === 0) {
    return 0;
  }

  return (vertical1 + vertical2) / (2 * horizontal);
}

function meanVisibility(
  landmarks: NormalizedLandmark[],
  indices: readonly number[],
): number {
  let total = 0;
  for (const index of indices) {
    total += landmarks[index]?.visibility ?? 0;
  }
  return total / indices.length;
}

export function measureEye(
  landmarks: NormalizedLandmark[],
  side: EyeSide,
  frameWidth: number,
  frameHeight: number,
): EyeMeasurements {
  const config = EYE_LANDMARK_CONFIG[side];

  const outer = toPixel(
    landmarks[config.outerCorner],
    frameWidth,
    frameHeight,
  );
  const inner = toPixel(
    landmarks[config.innerCorner],
    frameWidth,
    frameHeight,
  );
  const upper = toPixel(landmarks[config.upperLid], frameWidth, frameHeight);
  const lower = toPixel(landmarks[config.lowerLid], frameWidth, frameHeight);

  return {
    side,
    width: distance(outer, inner),
    height: distance(upper, lower),
    aspectRatio: eyeAspectRatio(
      landmarks,
      config.earIndices,
      frameWidth,
      frameHeight,
    ),
    outerCornerAngleDeg: outerCornerAngleDeg(outer, upper, lower),
    confidence: meanVisibility(landmarks, config.earIndices),
  };
}

export interface FaceEyeMeasurements {
  left: EyeMeasurements;
  right: EyeMeasurements;
}

export function measureBothEyes(
  landmarks: NormalizedLandmark[],
  frameWidth: number,
  frameHeight: number,
): FaceEyeMeasurements {
  return {
    left: measureEye(landmarks, "left", frameWidth, frameHeight),
    right: measureEye(landmarks, "right", frameWidth, frameHeight),
  };
}
