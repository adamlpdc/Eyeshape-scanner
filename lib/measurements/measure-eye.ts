import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { EYE_LANDMARK_CONFIG } from "@/constants/eye-landmarks";
import type { EyeMeasurements, EyeSide, FaceEyeMeasurements } from "@/types/eye";
import { clamp, distance, toPixel, type Point2D } from "./geometry";

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
  const brow = toPixel(landmarks[config.browCenter], frameWidth, frameHeight);
  const irisPoints = config.irisIndices.map((index) =>
    toPixel(landmarks[index], frameWidth, frameHeight),
  );

  const width = distance(outer, inner);
  const height = distance(upper, lower);
  const upperEyelidOpenness = width > 0 ? height / width : 0;
  const browDistance = width > 0 ? distance(brow, upper) / width : 0;
  const canthalTilt = width > 0 ? (inner.y - outer.y) / width : 0;

  const irisCenter = {
    x: irisPoints.reduce((sum, p) => sum + p.x, 0) / irisPoints.length,
    y: irisPoints.reduce((sum, p) => sum + p.y, 0) / irisPoints.length,
  };
  const irisRadius =
    irisPoints.reduce((sum, p) => sum + distance(p, irisCenter), 0) /
    irisPoints.length;
  const irisVisibility = width > 0 ? (irisRadius * 2) / width : 0;

  return {
    side,
    width,
    height,
    aspectRatio: eyeAspectRatio(
      landmarks,
      config.earIndices,
      frameWidth,
      frameHeight,
    ),
    outerCornerAngleDeg: outerCornerAngleDeg(outer, upper, lower),
    upperEyelidOpenness,
    browDistance,
    irisVisibility,
    canthalTilt,
    confidence: meanVisibility(landmarks, [
      ...config.earIndices,
      ...config.irisIndices,
      config.browCenter,
    ]),
  };
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
